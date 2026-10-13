/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Scoped Midnight Navy Hero palette; existing application tokens stay intact.
        neura: {
          "bg-base": "#0B1220",
          accent: "#6554B5",
          "accent-text": "#8B7CD9",
          "bg-elevated": "#161616",
          foreground: "#F5F5F7",
          muted: "#86868B",
          border: "rgba(255, 255, 255, 0.08)",
        },
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
        accent: {
          DEFAULT: "#FF5A5F",
          ink: "#D63A40",
        },
        ink: "#222222",
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.6)",
          strong: "rgba(255, 255, 255, 0.78)",
        },
        success: "#30D158",
        error: "#FF453A",

        // Legacy aliases (для старых компонентов)
        bg: "#FAF8F5",
        text: "#F5F5F7",
        muted: "#6A6A6A",
        line: "rgba(255, 255, 255, 0.08)",
        "accent-2": "#7C83FD",
        "accent-hover": "#7C83FD",
      },
      fontFamily: {
        sans: ["Inter Variable", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
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
        "sphere-rotate": "sphere-rotate 60s linear infinite",
        "sphere-pulse": "sphere-pulse 4s ease-in-out infinite",
        "scroll-indicator": "scroll-indicator 2.4s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
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
