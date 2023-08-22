/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      ButtonColor: "#E8D73D",
      DropDownColor: "#0A777E",
      RatingColor: "#EEF217",
      BackgroundGray: "#8F8787",
      TextColor: "#ffce00",
      main: "#08353B",
      green: "#38b000",
      warning: "#da2c38",
    },
    fontFamily: {
      italiana: ["Italiana", "serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
