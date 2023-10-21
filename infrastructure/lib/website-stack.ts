import { Duration } from 'aws-cdk-lib';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
	AllowedMethods,
	CachePolicy,
	Distribution,
	HttpVersion,
	IDistribution,
	LambdaEdgeEventType,
	OriginRequestPolicy,
	SecurityPolicyProtocol,
	ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { join } from 'path';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { getDomainName } from './utils';
import { Stack, StackProps } from './constructs';

export class WebsiteStack extends Stack {
	readonly domainName: string;
	readonly buildPath: string;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		this.buildPath = join(__dirname, '../../apps/web/build');
		this.domainName = getDomainName(this.stage);

		const certificate = this.createCertificate();
		const bucket = this.createAssetBucket();

		const serverFunction = this.createRemixServerFunction();
		const distribution = this.createDistribution(bucket, certificate, serverFunction);

		this.createRemixBucketDeployment(bucket, distribution);
	}

	private createCertificate(): ICertificate {
		const hostedZone = HostedZone.fromLookup(this, 'OcodaHostedZone', { domainName: this.domainName });
		return new Certificate(this, 'OcodaWebsiteCertificate', {
			domainName: this.domainName,
			validation: CertificateValidation.fromDns(hostedZone),
		});
	}

	private createAssetBucket() {
		return new Bucket(this, 'OcodaWebsiteAssetsBucket', { blockPublicAccess: BlockPublicAccess.BLOCK_ALL });
	}

	private createDistribution(bucket: IBucket, certificate: ICertificate, serverFunction: NodejsFunction) {
		const origin = new S3Origin(bucket);

		return new Distribution(this, 'OcodaWebsiteDistribution', {
			comment: 'Ocoda website distribution',
			domainNames: [this.domainName],
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
				'assets/*': {
					allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
					cachePolicy: CachePolicy.CACHING_OPTIMIZED,
					compress: true,
					origin,
					viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
				},
			},
		});
	}

	private createRemixServerFunction() {
		return new LambdaFunction(this, 'OcodaWebsiteServerFunction', {
			description: 'Ocoda website remix server function',
			runtime: Runtime.NODEJS_18_X,
			handler: 'index.handler',
			code: Code.fromAsset(join(this.buildPath, 'lambda-server')),
			memorySize: 256,
			logRetention: RetentionDays.THREE_DAYS,
		});
	}

	private createRemixBucketDeployment(bucket: IBucket, distribution: IDistribution) {
		return new BucketDeployment(this, 'OcodaWebsiteAssetsDeployment', {
			destinationBucket: bucket,
			distribution,
			prune: true,
			sources: [Source.asset(join(this.buildPath, 'public'))],
			cacheControl: [CacheControl.maxAge(Duration.days(365)), CacheControl.sMaxAge(Duration.days(365))],
		});
	}
}
