/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF8F5",
        ink: "#222222",
        muted: "#6A6A6A",
        accent: { DEFAULT: "#FF5A5F", ink: "#D63A40" },
        glass: { DEFAULT: "rgba(255,255,255,0.6)", strong: "rgba(255,255,255,0.78)" },
        // Compatibility names still used by shared controls, all in the warm palette.
        "bg-base": "#FAF8F5",
        "bg-elevated": "#FFFFFF",
        card: "rgba(255,255,255,0.85)",
        "card-hover": "#FFFFFF",
        border: "rgba(34,34,34,0.08)",
        "border-hover": "rgba(34,34,34,0.2)",
        "text-primary": "#222222",
        "text-secondary": "#6A6A6A",
        "text-tertiary": "#6A6A6A",
        text: "#222222",
        line: "rgba(34,34,34,0.08)",
        success: "#16803A",
        error: "#C53030",
      },
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      maxWidth: { copy: "36rem" },
      fontWeight: {
        body: "510",
        display: "590",
      },
      fontSize: {
        display: ["clamp(48px, 6vw, 88px)", { lineHeight: "1.05" }],
        heading: ["32px", { lineHeight: "1.15" }],
        body: ["17px", { lineHeight: "1.6" }],
      },
      letterSpacing: {
        display: "-0.02em",
        heading: "-0.01em",
      },
      borderRadius: {
        card: "20px",
        "card-lg": "28px",
        pill: "9999px",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(34,34,34,0.06), 0 8px 32px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
        hero: "0 0 0 1px rgba(34,34,34,0.06), 0 24px 64px rgba(34,34,34,0.08), 0 2px 8px rgba(34,34,34,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      transitionDuration: {
        250: "250ms",
      },
      animation: {
        "preview-rise": "preview-rise 800ms ease-out 300ms both",
        "caret-blink": "caret-blink 1s steps(1, end) infinite",
        "fade-up": "fade-up 600ms ease-out both",
      },
      keyframes: {
        "preview-rise": {
          from: { transform: "translateY(40px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "caret-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-up": {
          from: { transform: "translateY(24px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
