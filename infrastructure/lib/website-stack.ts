import { Duration, RemovalPolicy, Tags } from 'aws-cdk-lib';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
	AllowedMethods,
	CachePolicy,
	Distribution,
	HttpVersion,
	IDistribution,
	LambdaEdgeEventType,
	OriginAccessIdentity,
	OriginRequestPolicy,
	SecurityPolicyProtocol,
	ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { ARecord, AaaaRecord, HostedZone, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { join } from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { getApexDomain } from './utils';
import { Stack, StackProps, Stage } from './constructs';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

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

		// const redirectFunction = this.createRedirectFunction();
		// const redirectDistribution = this.createRedirectDistribution(certificate, redirectFunction);

		const serverFunction = this.createRemixServerFunction();
		const serverDistribution = this.createServerDistribution(bucket, certificate, serverFunction);
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

	private createServerDistribution(bucket: IBucket, certificate: ICertificate, serverFunction: NodejsFunction) {
		const originAccessIdentity = new OriginAccessIdentity(this, 'OcodaWebsiteAssetsBucketOriginAccessIdentity');
		bucket.grantRead(originAccessIdentity);

		const origin = new S3Origin(bucket, { originAccessIdentity });

		return new Distribution(this, 'OcodaWebsiteDistribution', {
			comment: 'Ocoda website distribution',
			domainNames: [`www.${this.apexDomain}`],
			certificate,
			defaultBehavior: {
				origin,
				originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
				allowedMethods: AllowedMethods.ALLOW_ALL,
				cachePolicy: CachePolicy.CACHING_DISABLED,
				compress: true,
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				edgeLambdas: [
					{
						eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
						functionVersion: serverFunction.currentVersion,
						includeBody: true,
					},
				],
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

	private createRemixServerFunction(): NodejsFunction {
		return new LambdaFunction(this, 'OcodaWebsiteServerFunction', {
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
}
