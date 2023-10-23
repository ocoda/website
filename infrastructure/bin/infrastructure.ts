#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { WebsiteStack } from '../lib/website-stack';

const project = 'ocoda-website';

const app = new cdk.App();

new WebsiteStack(app, 'OcodaWebsiteStack', { env: { region: 'us-east-1' }, project });
