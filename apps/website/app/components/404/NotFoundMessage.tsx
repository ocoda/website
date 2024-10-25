import { NavLink } from '@remix-run/react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import notFoundImage from '~/assets/images/404.gif';

interface Props {
  error: unknown;
  to: string;
}

export const NotFoundMessage: FC<Props> = ({ error, to }) => {
  const { t } = useTranslation('404', { keyPrefix: 'not-found' });

  console.error(error);
  return (
    <div className="justify-center items-center grid mx-auto w-full h-dvh container">
      <div className="flex flex-col items-center gap-8">
        <img
          src={notFoundImage}
          alt="Moss from the IT crowd looking at the fire in his office"
          className="rounded-md"
        />
        <div className="font-display">{t('message')}</div>
        <NavLink
          to={to}
          className="bg-white hover:bg-gray-50 shadow-sm px-3.5 py-2.5 rounded-md ring-1 ring-gray-300 ring-inset font-semibold text-gray-900 text-sm"
        >
          {t('cta')}
        </NavLink>
      </div>
    </div>
  );
};
