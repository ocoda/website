import { Duration } from 'aws-cdk-lib';
import { Effect, PolicyStatement, Role, WebIdentityPrincipal } from 'aws-cdk-lib/aws-iam';
import type { Construct } from 'constructs';
import { Stack, type StackProps } from './constructs';

export class OperationsStack extends Stack {
  private readonly githubTokenDomain = 'token.actions.githubusercontent.com';
  private readonly repositoryName = 'ocoda/website';

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createDeploymentRole();
  }

  private createDeploymentRole() {
    const role = new Role(this, 'OcodaWebsiteInfrastructureDeployRole', {
      roleName: 'OcodaWebsiteInfrastructureDeployRole',
      maxSessionDuration: Duration.hours(1),
      assumedBy: new WebIdentityPrincipal(`arn:aws:iam::${this.account}:oidc-provider/${this.githubTokenDomain}`, {
        StringLike: {
          [`${this.githubTokenDomain}:sub`]: `repo:${this.repositoryName}:*`,
        },
        StringEquals: {
          [`${this.githubTokenDomain}:aud`]: 'sts.amazonaws.com',
        },
      }),
    });

    role.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:aws:iam::${this.account}:role/cdk-*-${this.account}-us-east-1`, // For the certificate-stack
          `arn:aws:iam::${this.account}:role/cdk-*-${this.account}-${this.region}`,
        ],
      }),
    );
  }
}
