/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
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
      "nav-text": "#ffffff",
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
