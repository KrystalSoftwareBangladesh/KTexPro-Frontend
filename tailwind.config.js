/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ktex: "#7AA959",
        ktexDark: "#4E6C39",
      },
    },
  },
  plugins: [],
};
