import { join } from 'node:path';
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  HttpVersion,
  type IDistribution,
  OriginRequestPolicy,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { FunctionUrlOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import {
  Architecture,
  Code,
  type FunctionUrl,
  FunctionUrlAuthType,
  Function as LambdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { ARecord, AaaaRecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BucketPolicy, type IBucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import type { Construct } from 'constructs';
import type { Domains } from './certificate-stack';
import { type Domain, Stack, type StackProps } from './constructs';
import type { Buckets } from './storage-stack';

interface ApplicationStackProps extends StackProps {
  buckets: Buckets;
  domains: Domains;
}

export class ApplicationStack extends Stack {
  readonly sourcePath: string;

  constructor(scope: Construct, id: string, props: ApplicationStackProps) {
    const { domains, buckets, ...rest } = props;
    super(scope, id, { crossRegionReferences: true, ...rest });

    this.sourcePath = join(__dirname, '../../apps/website/build');

    const serverFunctionUrl = this.createRemixServerFunction();

    const serverDistribution = this.createServerDistribution(buckets.website, domains.website, serverFunctionUrl);
    this.createRecords(domains.website, serverDistribution);

    this.createRemixBucketDeployment(buckets.website, serverDistribution);
  }

  private createRemixServerFunction(): FunctionUrl {
    const fn = new LambdaFunction(this, 'OcodaWebsiteServerFunction', {
      description: 'Ocoda website remix server function',
      runtime: Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: Code.fromAsset(join(this.sourcePath, 'server')),
      architecture: Architecture.ARM_64,
      logRetention: RetentionDays.THREE_DAYS,
      environment: {
        NODE_ENV: 'production',
        CDN_URL: 'https://ocodacdn.com',
      },
    });

    return fn.addFunctionUrl({ authType: FunctionUrlAuthType.NONE });
  }

  private createServerDistribution(bucket: IBucket, domain: Domain, serverFnUrl: FunctionUrl) {
    bucket.policy = new BucketPolicy(this, 'OriginWebsiteBucketPolicy', { bucket });

    const bucketOrigin = S3BucketOrigin.withOriginAccessControl(bucket);

    return new Distribution(this, 'OcodaWebsiteDistribution', {
      comment: 'Ocoda website distribution',
      domainNames: [domain.url],
      certificate: domain.getCertificate('us-east-1'),
      defaultBehavior: {
        origin: new FunctionUrlOrigin(serverFnUrl),
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      httpVersion: HttpVersion.HTTP2_AND_3,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      additionalBehaviors: {
        'android-chrome-192x192.png': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        'android-chrome-512x512.png': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        'apple-touch-icon.png': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        'favicon-16x16.png': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        'favicon-32x32.png': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        'favicon.ico': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        '/assets/*': {
          origin: bucketOrigin,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });
  }

  private createRecords(domain: Domain, distribution: IDistribution) {
    new ARecord(this, 'OcodaWebsiteARecord', {
      zone: domain.hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      recordName: domain.url,
    });
    new AaaaRecord(this, 'OcodaWebsiteAAAARecord', {
      recordName: domain.url,
      zone: domain.hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }

  private createRemixBucketDeployment(destinationBucket: IBucket, distribution: IDistribution) {
    return new BucketDeployment(this, 'OcodaWebsiteAssetsDeployment', {
      destinationBucket,
      distribution,
      prune: true,
      sources: [Source.asset(join(this.sourcePath, 'client'))],
      // cacheControl: [CacheControl.maxAge(Duration.days(365)), CacheControl.sMaxAge(Duration.days(365))],
    });
  }
}
