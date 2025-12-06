module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'blockquote p:first-of-type::before': {
              content: '""'
            },
            'blockquote p:last-of-type::after': {
              content: '""'
            },
            '.ql-align-center': {
              textAlign: 'center',
            },
            '.ql-align-right': {
              textAlign: 'right',
            },
            '.ql-align-justify': {
              textAlign: 'justify',
            },
            img: {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            'ol > li::before': {
              color: theme('colors.indigo.800'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.indigo.800'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}