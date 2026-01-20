/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: "#E8DCC8",
          dark: "#D4C5A0",
        },
        burgundy: {
          DEFAULT: "#A63333",
          dark: "#6B2C2C",
          light: "#A63333",
        },
        "text-dark": "#2C1810",
      },
    },
  },
  plugins: [],
};
