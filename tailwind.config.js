/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal 500
          600: '#0d9488', // Teal 600
        },
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
      }
    },
  },
  plugins: [],
}
