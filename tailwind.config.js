/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monaco: {
          forest: '#102E18',
          deep: '#0A2112',
          dark: '#173D20',
          cream: '#FFF1D9',
          ivory: '#FFF8EA',
          gold: '#D9B65D',
          goldSoft: '#E9CC82',
          goldLight: '#F5E4B5',
          terracotta: '#C96F43',
          darkText: '#1C291D',
          mutedText: '#6A756D',
          cardBg: '#FAF6ED'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(217, 182, 93, 0.3)',
        'luxury': '0 20px 40px -15px rgba(10, 33, 18, 0.12)',
        'luxury-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
