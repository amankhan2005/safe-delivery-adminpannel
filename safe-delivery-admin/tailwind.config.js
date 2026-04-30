/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1B4FD8',
          'blue-dark': '#1440B8',
          'blue-light': '#EEF3FF',
          red: '#E8272A',
          'red-dark': '#C41E21',
          'red-light': '#FFF0F0',
        },
        surface: {
          DEFAULT: '#F8F9FC',
          card: '#FFFFFF',
          border: '#E8ECF4',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(27,79,216,0.08), 0 1px 2px -1px rgba(27,79,216,0.06)',
        'card-hover': '0 4px 16px 0 rgba(27,79,216,0.12)',
        glow: '0 0 20px rgba(27,79,216,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.35s ease forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.5, transform: 'scale(1.4)' } },
      },
    },
  },
  plugins: [],
}
