/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00D084",
          hover: "#00F59E",
        },
        cp: {
          base: "#020617",
          card: "#071126",
          "card-secondary": "#0B1730",
          border: "rgba(255,255,255,0.08)",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
        income: "#22C55E",
        expense: "#EF4444",
        goals: "#06B6D4",
        planning: "#8B5CF6",
        ai: "#A855F7",
        dash: "#10B981",
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        ganhos: "#22C55E",
        gastos: "#EF4444",
        metas: "#06B6D4",
        dashboard: "#10B981",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.2)",
        card: "0 4px 24px -4px rgb(0 0 0 / 0.45)",
        glow: "0 0 40px -8px rgb(16 185 129 / 0.35)",
        "glow-ai": "0 0 40px -8px rgb(168 85 247 / 0.35)",
        "glow-purple": "0 0 32px -8px rgb(139 92 246 / 0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "sidebar-active":
          "linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.08) 100%)",
        "ai-active":
          "linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(139,92,246,0.08) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
