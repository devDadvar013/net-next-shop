import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':  '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'glow':  '0 0 0 1px rgb(99 102 241 / 0.15), 0 8px 24px -8px rgb(99 102 241 / 0.4)',
      },
      keyframes: {
        'fade-in':   { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up':  { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'slide-in-r':{ from: { transform: 'translateX(16px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        'shimmer':   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-in-r':'slide-in-r 0.3s ease-out',
        'shimmer':  'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
