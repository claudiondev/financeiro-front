/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Azul-marinho da logo — usado em títulos, navegação ativa e botões primários
        primary: {
          50: '#EEF3FA',
          100: '#DCE7F5',
          200: '#B3C9E8',
          300: '#7FA3D6',
          400: '#4A78B8',
          500: '#2C5490',
          600: '#1E3F72',
          700: '#16305A',
          800: '#102544',
          900: '#0B1B32',
          DEFAULT: '#1E3F72',
        },
        // Verde da logo — usado como cor de destaque/sucesso
        accent: {
          50: '#ECFDF3',
          100: '#D1FAE0',
          200: '#A3F3C2',
          300: '#6EE7A0',
          400: '#3ED17E',
          500: '#1FAE5A',
          600: '#16A34A',
          700: '#0F7C38',
          800: '#0B5C2A',
          DEFAULT: '#16A34A',
        },
        background: '#F5F7FA',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        positive: '#16A34A',
        negative: '#DC2626',
        warning: '#F59E0B',
        'badge-blue': '#3B82F6',
        'badge-orange': '#F97316',
        'badge-purple': '#A855F7',
        'badge-pink': '#EC4899',
        'badge-green': '#16A34A',
        'badge-cyan': '#06B6D4',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        // Reservada para dinheiro: valores, datas e percentuais — nunca para texto corrido.
        // Mono alinha dígito com dígito, como uma coluna de extrato bancário.
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
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
