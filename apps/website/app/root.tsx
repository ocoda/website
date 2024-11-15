import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  redirect,
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
import { generateImgSrc } from './utils/generate-img-src.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const paramsLocale = getLngFromParams(params);

  if (!paramsLocale) {
    const { pathname } = new URL(request.url);
    const locale = await i18n.getLocale(request);
    return redirect(ensureLocalizedURL(pathname, locale));
  }

  const t = await i18n.getFixedT(request, 'common');
  const copy = {
    meta: t('meta', { returnObjects: true }),
    nav: t('nav', { returnObjects: true }),
    footer: t('footer', { returnObjects: true }),
  } as typeof en.common;

  const { origin } = new URL(request.url);

  const metaLogoImage = generateImgSrc({ src: 'ocoda_logo_full_gradient.png', options: { w: 1200, h: 627 } });
  const metaDescriptiveImage = generateImgSrc({ src: 'ocoda_og.jpg', options: { w: 1200, h: 627 } });

  return json({
    locale: paramsLocale,
    copy,
    origin,
    meta: {
      images: { descriptive: metaDescriptiveImage },
      json: {
        '@context': 'http://www.schema.org',
        '@type': 'Organization',
        name: copy.meta.name,
        url: copy.meta.url,
        logo: metaLogoImage,
        image: metaDescriptiveImage,
        description: copy.meta.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: copy.meta.address.city,
          postalCode: copy.meta.address.zip,
          addressCountry: copy.meta.address.country,
        },
      },
    },
  });
};

export const handle = {
  i18n: 'common',
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fredoka&family=Source+Sans+3:wght@400..700&display=swap',
  },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
  { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png', type: 'image/png' },
  { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png', type: 'image/png' },
  { rel: 'manifest', href: '/site.webmanifest' },
  { rel: 'stylesheet', href: styles },
];

export default function App() {
  const { locale, copy, origin, meta } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <meta property="og:title" content={copy.meta.title} />
        <meta property="og:description" content={copy.meta.description} />
        <meta property="og:site_name" content={copy.meta.title} />
        <meta property="og:locale" content={locale} />
        <meta property="og:image" content={meta.images.descriptive} />
        <meta property="og:image:type" content={'image/jpeg'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={copy.meta.title} />
        <meta property="twitter:description" content={copy.meta.description} />
        <meta property="twitter:image:type" content={'image/jpeg'} />
        <meta property="twitter:image:width" content="1200" />
        <meta property="twitter:image:height" content="627" />
        <script type="application/ld+json">{JSON.stringify(meta.json)}</script>
        <Links />
      </head>
      <body className="bg-gradient-to-r from-10% from-white lg:from-0% via-gray-300 print:via-white to-gray-500 lg:to-gray-600 print:to-white text-white leading-normal tracking-normal">
        <Layout lng={locale} copy={copy}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify({ BASE_URL: origin })}` }}
        />
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
