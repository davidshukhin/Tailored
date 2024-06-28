/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#dff6f2",
        background: "#F7F5FA",
        primary: "#7B73D3",
        secondary: "#DED9FB",
        accent: "#792989",
      },
      fontFamily: {
        mregular: ["Mplus-Regular", "sans-serif"],
        mbold: ["Mplus-Bold", "sans-serif"],
        ps: ["PoorStory", "sans-serif"],
      },
    },
  },
  plugins: [],
};