/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // EXACT USER MAPPING:
        // #1B211A: Replaced the deep backgrounds and dark gradients.
        // #628141: Replaced the vibrant accent colors (purples, blues, emeralds) for glowing orbs, icons, and highlights.
        // #8BAE66: Replaced the secondary text and structural borders.
        // #EBD5AB: Replaced the bright white text for a softer, perfectly matched primary contrast.
        gray: {
          50: '#FFFFFF',
          100: '#EBD5AB', 
          200: '#EBD5AB', 
          300: '#8BAE66', // Secondary Text/Borders
          400: '#8BAE66', // Secondary Text/Borders
          500: '#8BAE66', 
          600: '#8BAE66', 
          700: '#8BAE66', 
          800: '#8BAE66', // Structural borders
          900: '#1B211A', // Deep Background / Dark Gradient Map
          950: '#1B211A', // Deep Background / Dark Gradient Map
        },
        white: '#EBD5AB', // Primary contrast text
        black: '#000000', 

        // Map accents
        purple: {
          300: '#628141', 
          400: '#628141',
          500: '#628141', // Glowing Orbs, Icons
          600: '#628141',
        },
        indigo: {
          300: '#628141',
          400: '#628141', 
          500: '#628141', 
          600: '#628141',
          900: '#1B211A', // Gradient Background component map
        },
        blue: {
          300: '#628141',
          400: '#628141',
          500: '#628141',
          600: '#628141',
        },
        cyan: {
          400: '#628141',
          500: '#628141',
        },
        green: {
          400: '#628141',
        },
        pink: {
          400: '#628141',
          500: '#628141',
        },
        rose: {
          500: '#628141',
        },
        emerald: {
          500: '#628141',
        },
        teal: {
          500: '#628141',
        }
      }
    },
  },
  plugins: [],
}
