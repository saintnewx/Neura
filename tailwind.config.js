/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
   colors: {
  bg: "#08090A",
  card: "#0F1011",
  "card-hover": "#161719",
  text: "#F5F5F7",
  muted: "#86868B",
  line: "#1A1B1C",
  accent: "#5E6AD2",
  "accent-2": "#00D9FF",
  "accent-hover": "#7B85D9",
  error: "#FF453A",
  success: "#30D158",
},
      fontFamily: { sans: ["Inter", "sans-serif"] },
      transitionDuration: { 250: "250ms", 600: "600ms" },
    },
  },
  plugins: [],
};
