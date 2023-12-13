const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: ['./index.html', './frontend/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    listStyleType: {
      disc: 'disc',
      decimal: 'decimal',
      circle: 'circle'
    },
    extend: {
      colors: {
        'blue/1': '#1488D8',
        'blue/2': '#030391',
        'gray/1': '#F5F5F5',
        'gray/3': '#ACB5BD',
        'gray/4': '#495057',
        'cover': '#121212',
        'border-dark': '#7D7D7D'
      }
    }
  },
  plugins: []
});

