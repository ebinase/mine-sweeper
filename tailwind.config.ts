import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdxnpm i @vercel/analytics}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      //FreeBSD-licensed CSS animation by Animista
      animation: {
        'slide-in-blurred-top':
          'slide-in-blurred-top 0.6s cubic-bezier(0.230, 1.000, 0.320, 1.000)   both',
      },
      keyframes: {
        'slide-in-blurred-top': {
          '0%': {
            transform: 'translateY(-1000px) scaleY(2.5) scaleX(.2)',
            'transform-origin': '50% 0%',
            filter: 'blur(40px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0) scaleY(1) scaleX(1)',
            'transform-origin': '50% 50%',
            filter: 'blur(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
