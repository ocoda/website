import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', ...fontFamily.sans],
        display: ['Fredoka', ...fontFamily.sans],
      },
      colors: {
        black: {
          '50': '#f5f5f6',
          '100': '#e6e6e7',
          '200': '#cfcfd2',
          '300': '#aeafb2',
          '400': '#85868b',
          '500': '#6a6b70',
          '600': '#5b5b5f',
          '700': '#4d4d51',
          '800': '#444546',
          '900': '#3b3b3e',
          '950': '#161617',
        },
        red: {
          '50': '#faf5f8',
          '100': '#f6edf1',
          '200': '#efdbe5',
          '300': '#e3bed0',
          '400': '#d195b0',
          '500': '#c07496',
          '600': '#a85575',
          '700': '#914561',
          '800': '#793b50',
          '900': '#663546',
          '950': '#3c1b26',
        },
        purple: {
          '50': '#f8f4fe',
          '100': '#f1ebfc',
          '200': '#e5d9fb',
          '300': '#d0bbf7',
          '400': '#b594f1',
          '500': '#9669e9',
          '600': '#7e49de',
          '700': '#6b37ca',
          '800': '#592ea9',
          '900': '#4a278b',
          '950': '#3a1c71',
        },
        orange: {
          '50': '#fef4ee',
          '100': '#fee6d6',
          '200': '#fbcaad',
          '300': '#f9a57a',
          '400': '#f57442',
          '500': '#f24f1d',
          '600': '#e33613',
          '700': '#bd2511',
          '800': '#962016',
          '900': '#791e15',
          '950': '#410b09',
        },
        sand: {
          '50': '#fdf5f3',
          '100': '#fce9e4',
          '200': '#fad7ce',
          '300': '#f5bbac',
          '400': '#ec9079',
          '500': '#e06f53',
          '600': '#cc5436',
          '700': '#ac4329',
          '800': '#8e3b26',
          '900': '#773525',
          '950': '#40190f',
        },
      },
      keyframes: {
        'float-vertical': {
          '0%, 100%': { transform: 'translate(0, 0);' },
          '50%': { transform: 'translate(0, -0.25rem);' },
        },
        'float-depth': {
          '0%, 100%': { transform: 'translate(0, 0);' },
          '50%': { transform: 'translate(-0.10rem, -0.05rem);' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '33%': { transform: 'translateY(-15%)' },
          '66%': { transform: 'translateY(15%)' },
        },
      },
      animation: {
        'float-vertical': 'float-vertical 3s ease-in-out infinite;',
        'float-depth': 'float-depth 2.4s ease-in-out infinite;',
        bounce: 'bounce 0.3s ease-in-out normal;',
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      const colors = theme('colors') || {};
      const colorVariables = Object.keys(colors).reduce<Record<string, string>>((acc, color) => {
        if (typeof colors[color] === 'object') {
          const shades = colors[color];
          for (const shade in shades) {
            acc[`--color-${color}-${shade}`] = shades[shade];
          }
        }
        return acc;
      }, {});

      addBase({ ':root': colorVariables });
    }),
  ],
} satisfies Config;
