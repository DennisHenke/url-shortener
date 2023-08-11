import { reduceEachLeadingCommentRange } from 'typescript'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/client/index.html",
    "./src/client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red': {
          'default': '#90323D',
          'darker': '#5E0B15'
        },
        'beige': '#D9CAB3',
        'gold': '#BC8034',
        'silver': '#8C7A6B',
      }
    },
  },
  plugins: [],
}

