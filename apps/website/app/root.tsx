import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError } from '@remix-run/react';

// @ts-ignore
import styles from './styles/app.css?url';
import { NavBar } from './components/layout/navigation/Navigation';
import { Footer } from './components/layout/Footer';
import { NotFoundMessage } from './components/404/NotFoundMessage';
import { i18n } from '~/modules/i18n/i18n.server';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import { getLngFromParams } from './modules/i18n/resources';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const locale = getLngFromParams(params) ?? (await i18n.getLocale(request));
  return json({ locale });
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
  const { locale } = useLoaderData<typeof loader>();
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
      <body className="bg-gradient-to-r from-10% from-white lg:from-0% via-gray-300 to-gray-500 lg:to-gray-600 text-white leading-normal tracking-normal">
        <NavBar />
        <Outlet />
        <ScrollRestoration />
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { locale } = useLoaderData<typeof loader>();
  return (
    <html lang={locale}>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <NotFoundMessage error={error} />
        <Scripts />
      </body>
    </html>
  );
}
