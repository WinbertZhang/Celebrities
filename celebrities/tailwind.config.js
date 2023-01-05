/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    colors: {
      'light-purple': '#ab52c5',
      'dark-purple': '#8F37A9',
      'text-purple': '#f6c6fa',
    },
    extend: {
      fontFamily: {
        'title': 'League Spartan',
      },
    },
  },
  plugins: [],
}
