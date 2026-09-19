/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0b',
          900: '#0e0e10',
          800: '#141417',
          700: '#1c1c20',
          600: '#26262b',
          500: '#3a3a40',
          400: '#5a5a62',
          300: '#8a8a92',
          200: '#b4b4bc',
          100: '#d8d8de',
          50: '#f0efea',
        },
        cream: '#e8e4dc',
        warm: '#cfc9bd',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'editorial': '0.35em',
        'wide-sm': '0.18em',
      },
    },
  },
  plugins: [],
};
