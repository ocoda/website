import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import type { Construct } from 'constructs';
import { Domain, Stack, type StackProps } from './constructs';

export interface Domains {
  website: Domain;
}

export class CertificateStack extends Stack {
  public readonly domains: Domains;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, { ...props, env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' } });

    const domainName = 'ocoda.be';

    const websiteDomainCertificate = new Certificate(this, 'OcodaWebsiteCertificate', {
      domainName: `www.${domainName}`,
      validation: CertificateValidation.fromDns(),
    });

    this.domains = {
      website: new Domain(domainName, [websiteDomainCertificate], 'www'),
    };
  }
}
