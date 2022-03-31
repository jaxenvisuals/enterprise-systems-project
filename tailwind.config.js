module.exports = {
  mode: 'jit',
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },

    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
      mont: ['Montserrat', 'ui-sans-serif', 'system-ui'],
    },

    extend: {
      colors: {
        'sep-yellow': '#FCDD07', // sep yellow
        'sep-red': '#da1219', // sep red
        'sep-gray': '#303030', // gray 3
        'app-gray-100': '#EFEFEF', // gray-5
        'app-gray-150': '#dddddd', // ed-gray-5-compliment
        'app-gray-250': '#00000029', // gray 1 #00000029
        'app-gray-550': '#00000091', // gray-2 #00000091
        'app-gray-700': '#292929', // gray 4
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
