import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import styles from './styles/app.css';

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
	{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fredoka&display=swap' },
	{ rel: 'apple-touch-icon', sizes: '180x180', href: '/public/apple-touch-icon.png' },
	{ rel: 'icon', href: '/public/favicon.ico', type: 'image/x-icon' },
	{ rel: 'icon', sizes: '32x32', href: '/public/favicon-32x32.png', type: 'image/png' },
	{ rel: 'icon', sizes: '16x16', href: '/public/favicon-16x16.png', type: 'image/png' },
	{ rel: 'manifest', href: '/public/site.webmanifest' },
	{ rel: 'stylesheet', href: styles },
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-screen w-screen flex flex-col items-stretch bg-black">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
