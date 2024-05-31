/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#dff6f2",
        background: "#030c0a",
        primary: "#36b59b",
        secondary: "#432376",
        accent: "#792989",
      },
    },
  },
  plugins: [],
};