import { type ICertificate, getCertificateRegion } from 'aws-cdk-lib/aws-certificatemanager';
import type { IHostedZone } from 'aws-cdk-lib/aws-route53';

import { CertificateNotFoundException } from './exceptions';
import { Stack } from './stack';

export class Domain {
  constructor(
    public readonly hostedZone: IHostedZone,
    public readonly certificates: ICertificate[],
    public readonly subdomain?: string,
  ) {}

  get apex(): string {
    return this.hostedZone.zoneName;
  }

  get url(): string {
    return this.subdomain ? `${this.subdomain}.${this.hostedZone.zoneName}` : this.hostedZone.zoneName;
  }

  getCertificate(region: string = Stack.of(this.hostedZone).region): ICertificate {
    if (!['us-east-1', 'eu-central-1'].includes(region)) {
      throw new Error(`${region} is not a valid region`);
    }

    const certificate = this.certificates.find((certificate) => getCertificateRegion(certificate) === region);

    if (!certificate) {
      throw new CertificateNotFoundException();
    }

    return certificate;
  }
}
