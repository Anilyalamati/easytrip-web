/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#05070d',
          900: '#0b0e19',
          850: '#0f1321',
          800: '#161c2f',
          750: '#1c2339',
          700: '#252e49',
          600: '#344065',
        },
        gold: {
          50: '#fdfbf6',
          100: '#f9f4e8',
          200: '#f3e8cb',
          300: '#f2db9e',
          400: '#e1ba61',
          500: '#d3aa54', // EasyTrip Primary Gold
          600: '#b98e3a',
          700: '#966e27',
          800: '#74521e',
          900: '#523812',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(211, 170, 84, 0.35)',
        'gold-glow-lg': '0 0 40px -5px rgba(211, 170, 84, 0.45)',
        'navy-card': '0 10px 30px -10px rgba(5, 7, 13, 0.8)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
