import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-family)', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)'
        }
      },
      borderRadius: {
        app: 'var(--radius-card)'
      },
      boxShadow: {
        app: 'var(--shadow-card)'
      }
    }
  },
  plugins: []
} satisfies Config;
