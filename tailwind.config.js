/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0D17",
        card: "#13162A",
        "card-hover": "#1A1F38",
        text: "#E6E9F5",
        muted: "#8B90B0",
        line: "#2A3050",
        accent: "#00E5FF",
        "accent-2": "#A259FF",
        "accent-hover": "#00BFD6",
        error: "#FF6B6B",
        success: "#4ADE80",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      transitionDuration: { 250: "250ms" },
    },
  },
  plugins: [],
};
