/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "#08090A",
        "bg-elevated": "#0F1011",
        card: "rgba(255,255,255,0.025)",
        "card-hover": "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        "border-hover": "rgba(94,106,210,0.35)",
        "text-primary": "#F5F5F7",
        "text-secondary": "#86868B",
        "text-tertiary": "#5A5A5F",
        accent: "#5E6AD2",
        "accent-soft": "#00D9FF",
        success: "#30D158",
        error: "#FF453A",
        // Existing component names remain aliases of the shared palette.
        bg: "#08090A",
        text: "#F5F5F7",
        muted: "#86868B",
        line: "rgba(255,255,255,0.08)",
        "accent-2": "#00D9FF",
        "accent-hover": "#5E6AD2",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      transitionDuration: { 250: "250ms" },
    },
  },
  plugins: [],
};
