/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7EF',
        sand: '#F1E6CC',
        gold: { DEFAULT: '#C9A15B', dark: '#A8803C', light: '#E8D3A0' },
        cocoa: { DEFAULT: '#4A3320', dark: '#2F1F12' },
        mist: '#A9B4D4',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}
