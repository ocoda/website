import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Fredoka'],
			},
			animation: {
				wave: 'wave 3s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite',
			},
			keyframes: {
				wave: {
					'0%': { marginLeft: '0%' },
					'100%': { marginLeft: '100%' },
				},
				// swell: {
				// 	'0%': { transform: 'translate3d(0,-25%,0)' },
				// 	'50%': { transform: 'translate3d(0,25%,0)' },
				// 	'100%': { transform: 'translate3d(0,25%,0)' },
				// },
			},
		},
	},
	plugins: [],
} satisfies Config;
