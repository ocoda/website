import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

// @ts-ignore
import styles from './styles/app.css?url';
import { NavBar } from './components/layout/navigation/Navigation';
import { Footer } from './components/layout/Footer';

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
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="leading-normal tracking-normal text-white bg-gradient-to-r from-white from-10% lg:from-0% via-gray-300 to-gray-500 lg:to-gray-600">
        <NavBar />
        <Outlet />
        <ScrollRestoration />
        <Footer />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
