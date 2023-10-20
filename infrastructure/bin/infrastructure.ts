#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebsiteStack } from '../lib/website-stack';

const { CDK_DEFAULT_ACCOUNT: account, CDK_DEFAULT_REGION: region } = process.env;

const app = new cdk.App();

new WebsiteStack(app, 'OcodaWebsiteStack', { env: { account, region } });
