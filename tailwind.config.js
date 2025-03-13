/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: true,
      padding: {
        default: '1rem',
        sm: '2rem',
        md: '3rem',
        lg: '4rem',
        xl: '5rem',
        "2xl": "6rem"
      },
      fontFamily: {
        primary: ['Raleway', 'sans-serif'],
        secondary: ['Open Sans', 'sans-serif'],
      },
      colors: {
        primary: '#ffffff', 
        secondary: '#000000',
        third: '#1E90FF', 
      },
    },
  },
  plugins: [],
}
