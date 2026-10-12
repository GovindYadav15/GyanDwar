import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0e2148',
          'navy-dark': '#08142c',
          'navy-light': '#17346f',
          indigo: '#483aa0',
          'indigo-dark': '#382b82',
          'indigo-light': '#5d4ec2',
          purple: '#7965c1',
          'purple-light': '#9887d7',
          'purple-dark': '#5e4b9f',
          gold: '#e3d095',
          'gold-light': '#ede1b6',
          'gold-dark': '#c8b16e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(72, 58, 160, 0.4)',
        'glow-gold': '0 0 20px -3px rgba(227, 208, 149, 0.4)',
        'card-elevated': '0 10px 30px -10px rgba(14, 33, 72, 0.15)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #0e2148 0%, #1a1744 40%, #291f63 70%, #483aa0 100%)',
        'card-gradient':
          'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
        'gold-sheen': 'linear-gradient(135deg, #e3d095 0%, #ede1b6 50%, #c8b16e 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
