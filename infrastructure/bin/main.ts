#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CertificateStack, OperationsStack } from '../lib';

const app = new cdk.App();

/**
 * Description: the certificate stack is responsible for creating the main Ocoda domain certificate
 */
new CertificateStack(app, 'WebsiteCertificateStack');

/**
 * Description: the operations stack is responsible for managing the deployment of Ocoda infrastructure.
 */
new OperationsStack(app, 'WebsiteOperationsStack');
