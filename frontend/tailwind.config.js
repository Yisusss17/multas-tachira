/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tachira: {
          yellow: '#FFB800',
          yellowDark: '#E5A600',
          yellowLight: '#FFF3D0',
          black: '#1A1A1A',
          blackSoft: '#2D2D2D',
          white: '#FFFFFF',
          whiteWarm: '#FAFAF5',
          gray: '#9E9E9E',
        }
      }
    },
  },
  plugins: [],
}
