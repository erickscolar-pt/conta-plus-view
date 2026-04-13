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
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          muted: "#f1f5f9",
        },
        creme: "#F0F1E8",
        primary: "#059669",
        ganhos: "#10b981",
        "ganhos-hover": "#34d399",
        gastos: "#ef4444",
        "gastos-hover": "#f87171",
        metas: "#3b82f6",
        "metas-hover": "#60a5fa",
        dashboard: "#6366f1",
        "dashboard-hover": "#818cf8",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        card: "0 4px 24px -4px rgb(15 23 42 / 0.08)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
