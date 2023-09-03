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
      TextColor: "#ffffff",
      BlackColor: "#000000",
      SButton: "02750D",
      main: "#08353B",
      green: "#38b000",
      warning: "#da2c38",
      "nav-text": "#ffffff",
      "hover-text": "rgba(255, 255, 255, 0.5)",
      "trans-background": "rgb(8, 53, 59, 0.8)",
    },
    fontFamily: {
      italiana: ["Italiana", "serif"],
      roboto: ["Roboto", "serif"],
      helvetica: ["Helvetica Neue", "serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
