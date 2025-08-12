/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        brand: '#0b84ff'
      }
    },
  },
  plugins: [],
}
