/* eslint-env node */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.825rem",
        "2xl": "1.125rem",
        "3xl": "1.75rem",
      },
      fontFamily: {
        "montserrat-uniquifier": ["Montserrat", "sans-serif"],
      },
    },
  },
  variants: {},
  plugins: [],
};
