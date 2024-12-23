/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        background: 'var(--background)',
      },
      colors: {
        primary: {
          navy: '#0F1C2E',
          gold: '#957F5A',
        },
        background: 'var(--background)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      borderRadius: theme => ({
        DEFAULT: '5px',
        'none': '0',
        'sm': '5px',
        'md': '5px',
        'lg': '5px',
        'xl': '5px',
        '2xl': '5px',
        'full': '9999px',
      }),
    },
  },
  plugins: [],
};