/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ff-orange': '#FF6B35',
        'ff-dark-blue': '#1E3A8A',
        'ff-success': '#10B981',
      },
      backgroundImage: {
        'ff-gradient': 'linear-gradient(135deg, #FF6B35, #F7931E)',
      },
      boxShadow: {
        'ff-neon': '0 0 10px rgba(255, 107, 53, 0.7), 0 0 20px rgba(255, 107, 53, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
