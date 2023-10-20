import { Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
	Distribution,
	HttpVersion,
	OriginRequestPolicy,
	SecurityPolicyProtocol,
	ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class WebsiteStack extends Stack {
	readonly stage: 'staging' | 'production';

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		this.stage = this.setStage();

		const domainName = `ocoda.${this.stage === 'production' ? 'be' : 'dev'}`;

		const certificate = this.createCertificate(domainName);
		// const bucket = this.createAssetBucket();
		// this.createDistribution(bucket);
	}

	private setStage() {
		const stage = this.node.tryGetContext('stage');

		if (!['staging', 'production'].includes(stage)) {
			throw new Error('You must specify a stage (staging or production)');
		}

		return stage;
	}

	private createCertificate(domainName: string): ICertificate {
		const hostedZone = HostedZone.fromLookup(this, 'OcodaHostedZone', { domainName });
		return new Certificate(this, 'OcodaWebsiteCertificate', {
			domainName,
			validation: CertificateValidation.fromDns(hostedZone),
		});
	}

	private createAssetBucket() {
		return new Bucket(this, 'AssetsBucket', { blockPublicAccess: BlockPublicAccess.BLOCK_ALL });
	}

	private createDistribution(bucket: Bucket) {
		return new Distribution(this, 'AssetsBucketDistribution', {
			defaultBehavior: {
				origin: new S3Origin(bucket),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
			},
			httpVersion: HttpVersion.HTTP2_AND_3,
			minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
		});
	}
}
