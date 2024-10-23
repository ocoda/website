import { Link, useLocation } from '@remix-run/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { ensureLocalizedURL } from '~/modules/i18n/resources';
import { supportedLanguages } from '~/modules/i18n/resources';

export const LanguageSelector: FC = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const selectedLng = i18n.language;

  return (
    <div className="bg-transparent p-2 cursor-pointer" aria-label="Language selector">
      {supportedLanguages.map((lng) => (
        <Link
          key={lng}
          to={ensureLocalizedURL(pathname, lng)}
          className={`p-2 ${selectedLng === lng ? 'bg-red-500' : ''}`}
          onClick={() => useChangeLanguage(lng)}
        >
          {lng}
        </Link>
      ))}
    </div>
  );
};
