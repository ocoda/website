import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, type IHostedZone } from 'aws-cdk-lib/aws-route53';
import type { Construct } from 'constructs';
import { Domain, Stack, type StackProps } from './constructs';

export interface Domains {
  website: Domain;
}

export class CertificateStack extends Stack {
  public readonly hostedZone: IHostedZone;
  public readonly domains: Domains;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { ...props, env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' } });

    const domainName = 'ocoda.be';

    this.hostedZone = HostedZone.fromLookup(this, 'OcodaWebsiteHostedZone', { domainName });

    const websiteDomainCertificate = new Certificate(this, 'OcodaWebsiteCertificate', {
      domainName: domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    this.domains = {
      website: new Domain(this.hostedZone, [websiteDomainCertificate], 'www'),
    };
  }
}
