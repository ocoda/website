import { join } from 'node:path';
import {
  AllowedMethods,
  CachePolicy,
  Function as CloudfrontFunction,
  Distribution,
  FunctionCode,
  FunctionEventType,
  FunctionRuntime,
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

    const redirectFunction = new CloudfrontFunction(this, 'RedirectApexFunction', {
      comment: 'Redirect apex domain to www subdomain',
      code: FunctionCode.fromFile({ filePath: join(__dirname, '../code/redirect-apex.js') }),
      runtime: FunctionRuntime.JS_2_0,
    });

    return new Distribution(this, 'OcodaWebsiteDistribution', {
      comment: 'Ocoda website distribution',
      domainNames: [domain.apex, domain.url],
      certificate: domain.getCertificate('us-east-1'),
      defaultBehavior: {
        origin: new FunctionUrlOrigin(serverFnUrl),
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [{ eventType: FunctionEventType.VIEWER_REQUEST, function: redirectFunction }],
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
    const config = {
      zone: domain.hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    };

    // Apex
    new ARecord(this, 'OcodaWebsiteApexARecord', { ...config, recordName: domain.apex });
    new AaaaRecord(this, 'OcodaWebsiteApexAAAARecord', { ...config, recordName: domain.apex });

    // www
    new ARecord(this, 'OcodaWebsiteARecord', { ...config, recordName: domain.url });
    new AaaaRecord(this, 'OcodaWebsiteAAAARecord', { ...config, recordName: domain.url });
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
