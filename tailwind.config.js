/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#FF6B00', dark: '#E55F00', soft: '#FFF1E6' },
        ink: '#0B0F14',
        navy: '#0F1B33',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
