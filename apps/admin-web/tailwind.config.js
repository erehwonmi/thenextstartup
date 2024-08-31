const { join } = require('path');
const TailwindConfig = require('../../libs/ts/uikit-utils/src/tailwind.config');

/** @type {import('tailwindcss').Config} */

module.exports = {
  ...TailwindConfig,
  darkMode: 'class',
  content: [
    ...TailwindConfig.content,
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
  ],
  theme: {
    extend: {
      ...TailwindConfig.theme.extend,
      fontFamily: {
        bungeeShade: ['var(--font-bungeeShade)'],
        josefinSans: ['var(--font-josefinSans)'],
      },
      colors: {
        ...TailwindConfig.theme.extend.colors,
      },
      animation: {
        ...TailwindConfig.theme.extend.animation,
        border: 'border 4s ease infinite',
      },
      keyframes: {
        ...TailwindConfig.theme.extend.keyframes,
        border: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
};
