/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors used in this project
      colors: {
        primary: "#40E0D0",
        secondary: "#FF7F50",
      },
      backgroundImage: {
        'login-bg-img': "url('./src/assets/images/bg-image.png')",
        'signup-bg-img': "url('./src/assets/images/signup-bg-img.png')",
      }
    },
  },
  plugins: [],
}

