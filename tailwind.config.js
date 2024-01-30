/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black90: '#08081B',
      },
      width: {
        26: '6.5rem',
        30: '7.5rem',
        170: '26.313rem',
        180: '42.75rem',
      },
    },
  },
  plugins: [],
};
