import { join } from 'path';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
	AllowedMethods,
	CacheHeaderBehavior,
	CachePolicy,
	CacheQueryStringBehavior,
	Distribution,
	EdgeLambda,
	HttpVersion,
	IDistribution,
	LambdaEdgeEventType,
	OriginAccessIdentity,
	OriginRequestPolicy,
	SecurityPolicyProtocol,
	ViewerProtocolPolicy,
	experimental,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Architecture, Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ARecord, AaaaRecord, HostedZone, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { Stack, StackProps, Stage } from './constructs';
import { getApexDomain } from './utils';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { ArnPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface WebsiteFunctions {
	authentication?: experimental.EdgeFunction;
	server: experimental.EdgeFunction;
}

export class WebsiteStack extends Stack {
	readonly apexDomain: string;
	readonly sourcePath: string;

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);

		this.sourcePath = join(__dirname, '../../apps/web');
		this.apexDomain = getApexDomain(this.stage);

		const hostedZone = HostedZone.fromLookup(this, 'OcodaHostedZone', { domainName: this.apexDomain });
		const certificate = this.createCertificate(hostedZone);
		const bucket = this.createAssetBucket();

		const functions: WebsiteFunctions = {
			authentication: this.createAuthenticationFunction(),
			server: this.createRemixServerFunction(),
		};

		// const redirectFunction = this.createRedirectFunction();
		// const redirectDistribution = this.createRedirectDistribution(certificate, redirectFunction);

		const serverDistribution = this.createServerDistribution(bucket, certificate, functions);
		this.createRecords(hostedZone, serverDistribution);

		this.createRemixBucketDeployment(bucket, serverDistribution);
	}

	private createCertificate(hostedZone: IHostedZone): ICertificate {
		return new Certificate(this, 'OcodaWebsiteCertificate', {
			domainName: `*.${this.apexDomain}`,
			validation: CertificateValidation.fromDns(hostedZone),
		});
	}

	private createAssetBucket() {
		return new Bucket(this, 'OcodaWebsiteAssetsBucket', { blockPublicAccess: BlockPublicAccess.BLOCK_ALL });
	}

	// private createRedirectFunction() {
	// 	return new experimental.EdgeFunction(this, 'OcodaWebsiteRedirectFunction', {
	// 		runtime: Runtime.NODEJS_18_X,
	// 		handler: 'index.handler',
	// 		code: Code.fromInline(`
	// 			exports.handler = async (event) => {
	// 				const request = event.Records[0].cf.request;
	// 				const host = request.headers.host[0].value;
	// 				const redirectUrl = \`https://www.\${host}\`;
	// 				const response = {
	// 					status: '301',
	// 					statusDescription: 'Moved Permanently',
	// 					headers: {
	// 						location: [{ key: 'Location', value: redirectUrl }],
	// 					},
	// 				};
	// 				return response;
	// 			};
	// 		`),
	// 	});
	// }

	// private createRedirectDistribution(certificate: ICertificate, serverFunction: NodejsFunction) {
	// 	return new Distribution(this, 'OcodaWebsiteDistribution', {
	// 		comment: 'Ocoda website redirect distribution',
	// 		domainNames: [this.apexDomain],
	// 		certificate,
	// 		defaultBehavior: {
	// 			origin:,
	// 			originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
	// 			allowedMethods: AllowedMethods.ALLOW_ALL,
	// 			cachePolicy: CachePolicy.CACHING_DISABLED,
	// 			compress: true,
	// 			viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
	// 			edgeLambdas: [
	// 				{
	// 					eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
	// 					functionVersion: serverFunction.currentVersion,
	// 					includeBody: true,
	// 				},
	// 			],
	// 		},
	// 		httpVersion: HttpVersion.HTTP2_AND_3,
	// 		minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
	// 		additionalBehaviors: {
	// 			'public/*': {
	// 				allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
	// 				cachePolicy: CachePolicy.CACHING_OPTIMIZED,
	// 				compress: true,
	// 				origin,
	// 				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
	// 				originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
	// 			},
	// 		},
	// 	});
	// }

	private createServerDistribution(bucket: IBucket, certificate: ICertificate, functions: WebsiteFunctions) {
		const originAccessIdentity = new OriginAccessIdentity(this, 'OcodaWebsiteAssetsBucketOriginAccessIdentity');
		bucket.grantRead(originAccessIdentity);

		const origin = new S3Origin(bucket, { originAccessIdentity });

		const edgeLambdas: EdgeLambda[] = [
			...(functions.authentication
				? [{ eventType: LambdaEdgeEventType.VIEWER_REQUEST, functionVersion: functions.authentication.currentVersion }]
				: []),
			{
				eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
				functionVersion: functions.server.currentVersion,
				includeBody: true,
			},
		];

		return new Distribution(this, 'OcodaWebsiteDistribution', {
			comment: 'Ocoda website distribution',
			domainNames: [`www.${this.apexDomain}`],
			certificate,
			defaultBehavior: {
				origin,
				originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
				allowedMethods: AllowedMethods.ALLOW_ALL,
				cachePolicy: CachePolicy.CACHING_DISABLED,
				compress: true,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				edgeLambdas,
			},
			httpVersion: HttpVersion.HTTP2_AND_3,
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
			additionalBehaviors: {
				'public/*': {
					origin,
					allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
					cachePolicy: CachePolicy.CACHING_OPTIMIZED,
					compress: true,
					viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
				},
			},
		});
	}

	private createRecords(hostedZone: IHostedZone, distribution: IDistribution) {
		new ARecord(this, 'OcodaWebsiteARecord', {
			zone: hostedZone,
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
			recordName: `*.${this.apexDomain}`,
		});
		new AaaaRecord(this, 'OcodaWebsiteAAAARecord', {
			recordName: `*.${this.apexDomain}`,
			zone: hostedZone,
			target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
		});
	}

	private createRemixServerFunction(): experimental.EdgeFunction {
		return new experimental.EdgeFunction(this, 'OcodaWebsiteServerFunction', {
			description: 'Ocoda website remix server function',
			runtime: Runtime.NODEJS_18_X,
			handler: 'index.handler',
			code: Code.fromAsset(join(this.sourcePath, '/build/lambda')),
			memorySize: 256,
			logRetention: RetentionDays.THREE_DAYS,
			currentVersionOptions: {
				removalPolicy: this.stage === Stage.PRODUCTION ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
			},
		});
	}

	private createRemixBucketDeployment(destinationBucket: IBucket, distribution: IDistribution) {
		return new BucketDeployment(this, 'OcodaWebsiteAssetsDeployment', {
			destinationBucket,
			distribution,
			prune: true,
			destinationKeyPrefix: 'public',
			sources: [Source.asset(join(this.sourcePath, '/build/public')), Source.asset(join(this.sourcePath, '/public'))],
			cacheControl: [CacheControl.maxAge(Duration.days(365)), CacheControl.sMaxAge(Duration.days(365))],
		});
	}

	private createAuthenticationFunction(): experimental.EdgeFunction | undefined {
		if (this.stage === Stage.PRODUCTION) return;

		const authCredentials = new Secret(this, 'OcodaWebsiteAuthenticationCredentials', {
			secretName: 'ocoda-website-authentication',
			description: 'Ocoda website authentication credentials to block search engines from indexing.',
			generateSecretString: {
				secretStringTemplate: JSON.stringify({ username: 'admin' }),
				generateStringKey: 'password',
			},
		});

		const authenticationFunction = new experimental.EdgeFunction(this, 'OcodaWebsiteAuthenticationFunction', {
			description: 'Ocoda website authentication function',
			runtime: Runtime.NODEJS_18_X,
			handler: 'index.handler',
			code: Code.fromInline(`
				'use strict';

				const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
				
				const secretsManager = new SecretsManagerClient({ region: '${this.region}' });
				
				const fetchSecret = async (secretName) => {
					const command = new GetSecretValueCommand({ SecretId: secretName });
					const result = await secretsManager.send(command);
					return JSON.parse(result.SecretString);
				}
				
				exports.handler = async (event, context, callback) => {
					try {
						const request = event.Records[0].cf.request;
						const headers = request.headers;
				
						const { username, password } = await fetchSecret('${authCredentials.secretName}');
						const authString = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
				
						if (typeof headers.authorization === 'undefined' || headers.authorization[0].value !== authString) {
							const response = {
								status: '401',
								statusDescription: 'Unauthorized',
								body: 'Unauthorized',
								headers: {
									'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }]
								}
							}
				
							callback(null, response);
						}

						callback(null, request)
					} catch (error) {
						console.error(error);
					}
				};
			`),
			logRetention: RetentionDays.THREE_DAYS,
		});

		if (authenticationFunction.lambda.role) {
			authCredentials.addToResourcePolicy(
				new PolicyStatement({
					principals: [new ArnPrincipal(authenticationFunction.lambda.role.roleArn)],
					actions: ['secretsmanager:GetSecretValue'],
					resources: [authCredentials.secretArn],
				}),
			);
		}

		return authenticationFunction;
	}
}
