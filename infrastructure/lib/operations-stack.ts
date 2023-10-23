import { Construct } from 'constructs';
import { Stack, StackProps } from './constructs';
import {
	Effect,
	OpenIdConnectProvider,
	PolicyDocument,
	PolicyStatement,
	Role,
	WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';

export class OperationsStack extends Stack {
	private readonly githubTokenDomain = 'token.actions.githubusercontent.com';
	private readonly repositoryName = 'ocoda/website';

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);

		// Register GitHub as an OIDC provider in the account
		const githubOIDCProvider = this.createOIDCProvider();
		this.createDeploymentRole(githubOIDCProvider);
	}

	private createOIDCProvider() {
		return new OpenIdConnectProvider(this, 'OcodaWebsiteGitHubOIDCProvider', {
			url: `https://${this.githubTokenDomain}`,
			clientIds: ['sts.amazonaws.com'],
		});
	}

	private createDeploymentRole(oidcProvider: OpenIdConnectProvider) {
		const deploymentPolicy = new PolicyDocument({
			statements: [
				new PolicyStatement({
					effect: Effect.ALLOW,
					actions: ['sts:AssumeRole'],
					resources: [`arn:aws:iam::${this.account}:role/OcodaWebsiteDeployer`],
				}),
			],
		});

		return new Role(this, 'InfrastructureDeployRole', {
			roleName: 'OcodaWebsiteDeployer',
			maxSessionDuration: Duration.hours(1),
			assumedBy: new WebIdentityPrincipal(oidcProvider.openIdConnectProviderArn, {
				StringLike: { [`${this.githubTokenDomain}:sub`]: `repo:${this.repositoryName}:*` },
				StringEquals: { [`${this.githubTokenDomain}:aud`]: 'sts.amazonaws.com' },
			}),
			inlinePolicies: {
				OcodaWebsiteDeploymentPolicy: deploymentPolicy,
			},
		});
	}
}
