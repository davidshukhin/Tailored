/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#dff6f2",
        background: "7B73D3",
        primary: "#7B73D3",
        secondary: "#432376",
        accent: "#792989",
      },
      fontFamily: {
        main: ['"M PLUS Rounded 1c"', 'ui-sans-serif', 'system-ui'],
        serif: ['YourFontNameSerif', 'ui-serif', 'Georgia'],
        mono: ['YourFontNameMono', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
};