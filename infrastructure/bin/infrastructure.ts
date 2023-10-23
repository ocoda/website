#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { WebsiteStack, OperationsStack } from '../lib';

const project = 'ocoda-website';
const region = 'us-east-1';

const app = new cdk.App();

/* Operations */
new OperationsStack(app, 'OcodaWebsiteOperationsStack', { env: { region }, project });

/* Application */
new WebsiteStack(app, 'OcodaWebsiteStack', { env: { region }, project });
