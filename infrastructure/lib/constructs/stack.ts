import { Stack as BaseStack, StackProps as BaseStackProps, Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { InvalidStageException } from './exceptions';

export enum Stage {
	STAGING = 'staging',
	PRODUCTION = 'production',
}

const { CDK_DEFAULT_ACCOUNT: account, CDK_DEFAULT_REGION: region } = process.env;

export interface StackProps extends BaseStackProps {
	project: string;
}

export class Stack extends BaseStack {
	readonly stage: Stage;

	constructor(scope: Construct, id: string, props: StackProps) {
		const { project, ...baseProps } = props;
		super(scope, id, {
			...baseProps,
			env: { account: baseProps?.env?.account || account, region: baseProps?.env?.region || region },
		});

		const stage = this.node.tryGetContext('stage') as Stage;

		switch (stage) {
			case Stage.STAGING:
				this.stage = Stage.STAGING;
				break;
			case Stage.PRODUCTION:
				this.stage = Stage.PRODUCTION;
				break;
			default:
				throw new InvalidStageException();
		}

		Tags.of(this).add('project', project);
		Tags.of(this).add('stack', this.stackName);
		Tags.of(this).add('environment', stage);
	}
}
