/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      lightGreen: "#d8f3dc",
      mintGreen: "#b7e4c7",
      brightGreen: "#80ed99",
      midGreen: "#57cc99",
      midGreenDark: "#49ac81ff",
      tealGreen: "#38a3a5",
      darkGreen: "#1a543cff",
      naviBlue: "#22577a"
    },
    keyframes: {
      pour: {
        '0%': { transform: 'rotate(0deg)' },
        '30%': { transform: 'rotate(-25deg)' },
        '60%': { transform: 'rotate(-25deg)' },
        '100%': { transform: 'rotate(0deg)' },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-8px)' },
      },
    },
    animation: {
      pour: 'pour 1.2s ease-in-out',
      float: 'float 2s ease-in-out infinite',
    },
  },
};
export const plugins = [];
