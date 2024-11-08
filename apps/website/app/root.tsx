import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';

import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { NotFoundMessage } from '~/components/404/NotFoundMessage';
import Layout from '~/components/layout/Layout';
import { i18n } from '~/modules/i18n/i18n.server';
import { ensureLocalizedURL, getLngFromParams } from '~/modules/i18n/resources';
import type { en } from '~/resources/locales/en';
import styles from '~/styles/app.css?url';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const locale = getLngFromParams(params) ?? (await i18n.getLocale(request));
  const t = await i18n.getFixedT(request, 'common');
  const copy = {
    nav: t('nav', { returnObjects: true }),
    footer: t('footer', { returnObjects: true }),
  } as typeof en.common;

  return json({ locale, copy });
};

export const handle = {
  i18n: 'common',
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:400,700&family=Fredoka&display=swap',
  },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
  { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png', type: 'image/png' },
  { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png', type: 'image/png' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'stylesheet', href: styles },
];

export default function App() {
  const { locale, copy } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-r from-10% from-white lg:from-0% via-gray-300 print:via-white to-gray-500 lg:to-gray-600 print:to-white text-white leading-normal tracking-normal">
        <Layout lng={locale} copy={copy}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { i18n } = useTranslation('common');

  if (isRouteErrorResponse(error)) {
    return (
      <html lang={i18n.language}>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <NotFoundMessage error={error} to={ensureLocalizedURL('/', i18n.language)} />
          <Scripts />
        </body>
      </html>
    );
  }
  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }
  return <h1>Unknown Error</h1>;
}
