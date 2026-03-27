/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        // Stitch UI Generated Chlorophyll Carbon Palette
        chlorophyll: {
          surface: '#0f150e',
          'surface-low': '#171d16',
          'surface-high': '#252c24',
          'surface-highest': '#30362f',
          primary: '#afd188',
          'on-primary': '#1d3700',
          'primary-container': '#7a9b57',
          secondary: '#add286',
          'secondary-container': '#314f12',
          tertiary: '#d9c49b',
          'outline-variant': '#44483d',
          'on-surface': '#dee4d9',
          'on-surface-variant': '#c4c8b9',
        },
        // Legacy fallbacks mapped closer to new palette
        gray: {
          50: '#FFFFFF',
          100: '#dee4d9', 
          200: '#c4c8b9', 
          300: '#8e9284', 
          400: '#44483d', 
          500: '#30362f', 
          600: '#252c24', 
          700: '#1b211a', 
          800: '#171d16', 
          900: '#0f150e', 
          950: '#0a1009', 
        },
        white: '#dee4d9',
        black: '#000000', 
        purple: { 500: '#afd188', 600: '#7a9b57' },
        indigo: { 500: '#afd188', 600: '#7a9b57', 900: '#171d16' },
        blue: { 400: '#add286', 500: '#afd188' },
        cyan: { 500: '#add286' },
        green: { 400: '#afd188' },
        pink: { 500: '#d9c49b' },
        rose: { 500: '#d9c49b' },
        emerald: { 500: '#add286' },
        teal: { 500: '#add286' }
      }
    },
  },
  plugins: [],
}
