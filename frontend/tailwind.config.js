/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          primary: '#ee4d2d',
          hover: '#f05d40',
          bg: '#f5f5f5',
          dark: '#d0011b',
        }
      }
    },
  },
  plugins: [],
}