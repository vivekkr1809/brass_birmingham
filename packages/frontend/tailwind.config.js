/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brass: {
          coal: '#2c2c2c',
          iron: '#d35400',
          beer: '#8b4513',
          canal: '#4a90e2',
          rail: '#34495e',
        },
        player: {
          red: '#e74c3c',
          blue: '#3498db',
          green: '#2ecc71',
          purple: '#9b59b6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};
