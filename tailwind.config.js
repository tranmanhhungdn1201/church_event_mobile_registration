module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2E5AAC',
        secondary: '#6AA6FF',
        success: '#0F9D58',
        warning: '#E67E22',
        error: '#D93025',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        '4': '16px',
        '6': '24px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}