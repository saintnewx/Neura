/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "#0D0D0C",
        "bg-elevated": "#161616",
        card: "rgba(255, 255, 255, 0.04)",
        "card-hover": "rgba(255, 255, 255, 0.06)",
        border: "rgba(255, 255, 255, 0.08)",
        "border-hover": "rgba(255, 255, 255, 0.14)",
        "border-glow": "rgba(124, 131, 253, 0.40)",
        "text-primary": "#F5F5F7",
        "text-secondary": "#86868B",
        "text-tertiary": "#5A5A5F",
        accent: "#7C83FD",
        success: "#30D158",
        error: "#FF453A",

        // Legacy aliases (для старых компонентов)
        bg: "#0D0D0C",
        text: "#F5F5F7",
        muted: "#86868B",
        line: "rgba(255, 255, 255, 0.08)",
        "accent-2": "#7C83FD",
        "accent-hover": "#7C83FD",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      transitionDuration: {
        250: "250ms",
      },
      animation: {
        "sphere-rotate": "sphere-rotate 60s linear infinite",
        "sphere-pulse": "sphere-pulse 4s ease-in-out infinite",
        "scroll-indicator": "scroll-indicator 2.4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        "sphere-rotate": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "sphere-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "scroll-indicator": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.45" },
          "50%": { transform: "translateY(5px)", opacity: "0.85" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};