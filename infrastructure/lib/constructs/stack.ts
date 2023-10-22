import { Stack as BaseStack, StackProps as BaseStackProps, region_info } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { InvalidStageException } from './exceptions';
import { RegionInfo } from 'aws-cdk-lib/region-info';

export enum Stage {
	STAGING = 'staging',
	PRODUCTION = 'production',
}

const { CDK_DEFAULT_ACCOUNT: account, CDK_DEFAULT_REGION: region } = process.env;

export type StackProps = BaseStackProps;

export class Stack extends BaseStack {
	readonly stage: Stage;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, {
			...props,
			env: { account: props?.env?.account || account, region: props?.env?.region || region },
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
	}
}
