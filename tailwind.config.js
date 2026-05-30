/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#111827',
        surface: '#1F2937',
        'border-dark': '#374151',
        accent: '#10B981',
        'text-primary': '#F9FAFB',
        'text-secondary': '#6B7280',
        positive: '#10B981',
        negative: '#EF4444',
        'badge-blue': '#3B82F6',
        'badge-orange': '#F97316',
        'badge-purple': '#A855F7',
        'badge-pink': '#EC4899',
        'badge-green': '#10B981',
        'badge-cyan': '#06B6D4',
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


