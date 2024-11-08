#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CertificateStack, OperationsStack, StorageStack } from '../lib';

const app = new cdk.App();

/**
 * Description: the certificate stack is responsible for creating the Ocoda website domain certificate
 */
new CertificateStack(app, 'WebsiteCertificateStack');

/**
 * Description: the operations stack is responsible for managing the deployment of the website infrastructure.
 */
new OperationsStack(app, 'WebsiteOperationsStack');

/**
 * Description: storage stack is responsible for managing the S3 storage for the website.
 */
const { buckets } = new StorageStack(app, 'WebsiteStorageStack');
