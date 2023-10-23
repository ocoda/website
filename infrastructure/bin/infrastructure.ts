#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WebsiteStack } from '../lib/website-stack';

const project = 'ocoda-website';

const app = new cdk.App();

new WebsiteStack(app, 'OcodaWebsiteStack', { env: { region: 'us-east-1' }, project });
