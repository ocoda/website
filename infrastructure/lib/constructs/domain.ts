import { type ICertificate, getCertificateRegion } from 'aws-cdk-lib/aws-certificatemanager';
import { CertificateNotFoundException } from './exceptions';
import { Stack } from './stack';

export class Domain {
  constructor(
    public readonly apexDomain: string,
    public readonly certificates: ICertificate[],
    public readonly subdomain?: string,
  ) {}

  get apex(): string {
    return this.apexDomain;
  }

  get url(): string {
    return this.subdomain ? `${this.subdomain}.${this.apexDomain}` : this.apexDomain;
  }

  getCertificate(region: string = Stack.of(this.certificates[0]).region): ICertificate {
    if (!['us-east-1', 'eu-central-1'].includes(region)) {
      throw new Error(`${region} is not a valid region`);
    }

    const certificate = this.certificates.find((cert) => getCertificateRegion(cert) === region);

    if (!certificate) {
      throw new CertificateNotFoundException();
    }

    return certificate;
  }
}
