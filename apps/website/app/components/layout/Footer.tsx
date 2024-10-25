import type { FC } from 'react';
import { Link } from '@remix-run/react';
import { ensureLocalizedURL } from '~/modules/i18n/resources';
import { useTranslation } from 'react-i18next';

export const Footer: FC = () => {
  const { t, i18n } = useTranslation('common', { keyPrefix: 'footer' });

  return (
    <footer className="bg-white border-t text-gray-400 text-sm">
      <div className="items-center grid grid-cols-2 mx-auto px-8 py-4 container">
        <div className="flex flex-col gap-2">
          <span>Ocoda BV</span>
          <span>hello@ocoda.be</span>
          <span>VAT: BE 0123.456.7890</span>
        </div>
        <div className="flex flex-col items-end gap-2 col-start-3">
          <Link to={ensureLocalizedURL('/terms-and-conditions', i18n.language)}>{t('terms')}</Link>
          <Link to={ensureLocalizedURL('/privacy-policy', i18n.language)}>{t('privacy')}</Link>
          <span>
            Illustrations from{' '}
            <Link to={'https://www.reshot.com'} target="_blank">
              Reshot
            </Link>
          </span>
          <span>© {new Date().getFullYear()} Ocoda BV</span>
        </div>
      </div>
    </footer>
  );
};
