/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        pour: {
          '0%': { transform: 'rotate(0deg)' },
          '30%': { transform: 'rotate(-25deg)' },
          '60%': { transform: 'rotate(-25deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        pour: 'pour 1.2s ease-in-out',
      },
    },
  },
};
