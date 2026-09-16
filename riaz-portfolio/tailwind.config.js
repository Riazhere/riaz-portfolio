
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0a0a0a',
        surface: 'rgba(25, 25, 25, 0.6)',
        primary: '#00f0ff',
        secondary: '#7000ff',
      }
    },
  },
  plugins: [],
}