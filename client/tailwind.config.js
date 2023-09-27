/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
    colors: {
      TextColor: "#ffffff",
      BlackColor: "#000000",
      primary: {
        200: "#2bc8ed",
        500: "#22b6e7",
        700: "#19a4e1",
      },
      green: {
        200: "#63d1c4",
        500: "#4FC1B0",
        700: "#3BB19C",
      },
      red: {
        200: "#F58F63",
        500: "#F2724F",
        700: "#EF553B",
      },
      neutrals: {
        200: "#eceff1",
        400: "#d3d9dc",
        500: "#65737C",
        600: "#74848b",
        700: "#414a4e",
      },
      orange: {
        200: "#E17A4F",
        500: "#F3782C",
        700: "#862B2A",
      },
    },
    fontFamily: {
      inter: ["Inter", "sans"],
      roboto: ["Roboto", "serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
