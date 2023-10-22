import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				black: '#17141f',
				white: '#fffbff',
				orange: '#ffaf7b',
				purple: '#3c2568',
			},
			fontFamily: {
				sans: ['Fredoka'],
			},
			animation: {
				wave: 'wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite',
				'wave-and-swell':
					'wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite, swell 7s ease -1.25s infinite',
			},
			keyframes: {
				wave: {
					'0%': { marginLeft: '-1600px' },
					'100%': { marginLeft: '0' },
				},
				swell: {
					'0%,100%': { transform: 'translate3d(0, -25px, 0)' },
					'50%': { transform: 'translate3d(0, 5px, 0)' },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
