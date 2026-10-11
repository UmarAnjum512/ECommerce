/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fk: {
          gold: '#C5A880',
          darkgold: '#9A7B4F',
          black: '#111111',
          charcoal: '#222222',
          lightgray: '#F8F8F8',
          border: '#E8E8E8',
          accent: '#A82B32',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
    },
  },
  plugins: [],
};
