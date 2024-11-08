import { Stack as BaseStack, type StackProps as BaseStackProps, Tags } from 'aws-cdk-lib';
import type { Construct } from 'constructs';

// When using the --profile flag, the account and region of that profile
// get loaded into the environment automatically
const { CDK_DEFAULT_ACCOUNT: account, CDK_DEFAULT_REGION: region } = process.env;

export interface StackProps extends BaseStackProps {}

export class Stack extends BaseStack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { env: { account, region }, ...props });

    Tags.of(this).add('stack', this.stackName);
  }
}
