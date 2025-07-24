/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#a78bfa", // violet-400
        accent: "#f472b6", // pink-400
        background: "#f3f4f6", // gray-100
        neon: "#e0f2fe", // light cyan pop
        glow: "#fef3c7",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        aurora: "0 4px 24px rgba(244, 114, 182, 0.3)", // pink accent
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "ascii-scroll": "asciiScroll 6s linear infinite",
      },
      keyframes: {
        asciiScroll: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
