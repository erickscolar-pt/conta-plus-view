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
          DEFAULT: "#E8799A",
          hover: "#F095AF",
        },
        cp: {
          base: "#1A1216",
          card: "#261820",
          "card-secondary": "#322028",
          border: "rgba(255, 220, 230, 0.1)",
          muted: "#C9B4BC",
          subtle: "#8F7A82",
        },
        income: "#22C55E",
        expense: "#EF4444",
        goals: "#F0AB98",
        planning: "#C084A8",
        ai: "#B87DA8",
        dash: "#E8799A",
        brand: {
          50: "#FFF5F7",
          100: "#FFE8ED",
          200: "#FFD1DC",
          300: "#FFB3C4",
          400: "#F890A6",
          500: "#E8799A",
          600: "#D65D7A",
          700: "#B84362",
          800: "#933651",
          900: "#6B283C",
        },
        ganhos: "#22C55E",
        gastos: "#EF4444",
        metas: "#F0AB98",
        dashboard: "#E8799A",
        /** Tom claro da logo (fundo do porquinho) */
        logo: {
          peach: "#F5D0C8",
          blush: "#F8DCD5",
          snout: "#E88896",
        },
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(0 0 0 / 0.2)",
        card: "0 4px 24px -4px rgb(0 0 0 / 0.45)",
        glow: "0 0 40px -8px rgb(232 121 154 / 0.4)",
        "glow-ai": "0 0 40px -8px rgb(184 125 168 / 0.35)",
        "glow-purple": "0 0 32px -8px rgb(192 132 168 / 0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "sidebar-active":
          "linear-gradient(135deg, rgba(232,121,154,0.2) 0%, rgba(240,171,152,0.08) 100%)",
        "ai-active":
          "linear-gradient(135deg, rgba(184,125,168,0.22) 0%, rgba(232,121,154,0.08) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
