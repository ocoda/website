import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { createCookie } from '@remix-run/node';
import { RemixI18Next } from 'remix-i18next/server';
import { i18nConfig } from '~/modules/i18n/config';
import { resources } from '~/modules/i18n/resources';

export const localeCookie = createCookie('lng', {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
});

export const i18n = new RemixI18Next({
  detection: {
    supportedLanguages: i18nConfig.supportedLngs,
    fallbackLanguage: i18nConfig.fallbackLng,
    cookie: localeCookie,
    async findLocale(request) {
      const url = new URL(request.url);
      const locale = url.pathname.split('/').at(1);
      return Promise.resolve(locale || i18nConfig.fallbackLng);
    },
  },
  i18next: {
    ...i18nConfig,
    backend: { loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json') },
    resources,
  },
  plugins: [Backend],
});
