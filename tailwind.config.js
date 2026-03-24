/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#000000',      // Fundo total
        'brand-card': '#1A1A1A',      // Fundo dos cards/formulários
        'brand-blue': '#3B82F6',      // O azul do logo e botão
        'brand-text-main': '#FFFFFF', // Texto branco
        'brand-text-sub': '#9CA3AF',  // Texto cinza
      },
    },
  },
  plugins: [],
}

