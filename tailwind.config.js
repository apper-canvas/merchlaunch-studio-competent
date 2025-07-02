/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#1E293B',
        accent: '#F59E0B',
        surface: '#F8FAFC',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-success': 'pulse 0.5s ease-out',
        'scale-hover': 'scale 0.2s ease-out',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}