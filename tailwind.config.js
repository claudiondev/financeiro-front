/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0D0D0D',
        surface: '#161616',
        'border-dark': '#262626',
        accent: '#C084FC',
        'text-primary': '#F5F5F5',
        'text-secondary': '#737373',
        positive: '#C084FC',
        negative: '#F87171',
        'badge-bg': '#1C1C1C',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      fontSize: {
        label: ['11px', { letterSpacing: '0.05em' }],
        value: ['28px', { fontWeight: 'bold' }],
      },
    },
  },
  plugins: [],
}

