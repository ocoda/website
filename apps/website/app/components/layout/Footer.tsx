import { Link } from '@remix-run/react';
import type { FC } from 'react';
import { type Language, ensureLocalizedURL } from '~/modules/i18n/resources';
import type { en } from '~/resources/locales/en';

type Props = {
  lng: Language;
  copy: (typeof en)['common']['footer'];
};

export const Footer: FC<Props> = ({ copy, lng }) => {
  return (
    <footer className="bg-white text-gray-500 text-xs md:text-sm">
      <div className="items-center gap-1 md:gap-2 grid grid-cols-2 mx-auto px-8 py-8 container">
        <div className="flex flex-col gap-2">
          <span>Ocoda BV</span>
          <span>
            <Link to="mailto:hello@ocoda.be">hello@ocoda.be</Link>
          </span>
          <span>
            VAT: <span className="text-nowrap">BE 0123.456.7890</span>
          </span>
        </div>
        <div className="flex flex-col items-end gap-2 text-end">
          <Link to={ensureLocalizedURL('/terms-and-conditions', lng)}>{copy.terms}</Link>
          <Link to={ensureLocalizedURL('/privacy-policy', lng)}>{copy.privacy}</Link>
          <span>
            Illustrations from{' '}
            <Link to={'https://www.reshot.com'} target="_blank">
              Reshot
            </Link>{' '}
            &{' '}
            <Link to={'https://www.getillustrations.com'} target="_blank">
              GetIllustrations
            </Link>
          </span>
          <span>© {new Date().getFullYear()} Ocoda BV</span>
        </div>
      </div>
    </footer>
  );
};
