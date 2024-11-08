import { RemovalPolicy } from 'aws-cdk-lib';
import { Effect, PolicyStatement, StarPrincipal } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket, BucketEncryption, type IBucket } from 'aws-cdk-lib/aws-s3';
import type { Construct } from 'constructs';
import { Stack, type StackProps } from './constructs';

export interface Buckets {
  website: IBucket;
}

export class StorageStack extends Stack {
  public readonly buckets: Buckets;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.buckets = {
      website: this.createWebsiteBucket(),
    };
    this.denyUnencryptedUploads(this.buckets.website);
  }

  private createWebsiteBucket(): IBucket {
    return new Bucket(this, 'WebsiteBucket', {
      bucketName: 'ocoda-storage-production-website',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN,
      encryption: BucketEncryption.S3_MANAGED,
      versioned: true,
    });
  }

  private denyUnencryptedUploads(bucket: IBucket) {
    bucket.addToResourcePolicy(
      new PolicyStatement({
        sid: 'DenyIncorrectEncryptionHeader',
        effect: Effect.DENY,
        principals: [new StarPrincipal()],
        actions: ['s3:PutObject'],
        resources: [`${bucket.bucketArn}/*`],
        conditions: {
          StringNotEquals: {
            's3:x-amz-server-side-encryption': 'AES256',
          },
        },
      }),
    );

    bucket.addToResourcePolicy(
      new PolicyStatement({
        sid: 'DenyUnEncryptedObjectUploads',
        effect: Effect.DENY,
        principals: [new StarPrincipal()],
        actions: ['s3:PutObject'],
        resources: [`${bucket.bucketArn}/*`],
        conditions: {
          Null: {
            's3:x-amz-server-side-encryption': true,
          },
        },
      }),
    );
  }
}
