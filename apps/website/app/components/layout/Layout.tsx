import type { PropsWithChildren } from 'react';
import type { Language } from '~/modules/i18n/resources';
import { WavesIllustration } from '~/resources/illustrations';
import type { en } from '~/resources/locales/en';
import { Footer } from './Footer';
import { NavBar } from './navigation/Navigation';

export default function Layout({
  children,
  copy,
  lng,
}: PropsWithChildren<{ lng: Language; copy: (typeof en)['common'] }>) {
  return (
    <div>
      <NavBar lng={lng} copy={copy.nav} />
      <main>{children}</main>
      <WavesIllustration className="-mt-px mb-16 lg:mb-8 w-full md:h-16 lg:h-32 mirror-y" />
      <WavesIllustration className="-mb-px w-full md:h-16 lg:h-32 mirror-x" />
      <Footer lng={lng} copy={copy.footer} />
    </div>
  );
}
