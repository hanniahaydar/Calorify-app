/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // CORRECCIÓN: Se añade la estrategia 'class' para el modo oscuro.
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}