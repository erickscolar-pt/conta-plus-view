/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderSpacing: {
        '2': '0.5rem',
      },
      colors: {
        primary: '#599E52',
        ganhos: '#5ABB8C',
        'ganhos-hover': '#82cca8',
        gastos: '#BF5252',
        'gastos-hover': '#e47b7b',
        metas: '#138DB4',
        'metas-hover': '#5cb0cc',
        dashboard: '#A663B1',
        'dashboard-hover': '#d39adb',
      },
    },
  },
  plugins: [],
}