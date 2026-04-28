import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0f0c29', 800: '#1a1a2e', 700: '#302b63' },
        rate: {
          purple: '#7c72ff',
          pink: '#ff6584',
          teal: '#43c6a0',
          amber: '#f7971e',
          violet: '#a78bfa',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(15, 12, 41, 0.14)',
      },
      backgroundImage: {
        'rate-gradient': 'linear-gradient(135deg, #6c63ff, #ff6584)',
        'hero-gradient':
          'radial-gradient(circle at top left, rgba(108, 99, 255, 0.16), transparent 26%), radial-gradient(circle at 80% 20%, rgba(255, 101, 132, 0.2), transparent 24%), linear-gradient(140deg, #0f0c29, #1a1a2e 45%, #302b63)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        prosewide: '72ch',
      },
    },
  },
  plugins: [typography],
}

export default config
