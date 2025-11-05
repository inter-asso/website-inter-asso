/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
          light_orange: {
            DEFAULT: '#f9dbbd',
            100: '#502c07',
            200: '#a1580f',
            300: '#ea841d',
            400: '#f1af6d',
            500: '#f9dbbd',
            600: '#fae2cb',
            700: '#fbead8',
            800: '#fdf1e5',
            900: '#fef8f2'
          },
          salmon_pink: {
            DEFAULT: '#ffa5ab',
            100: '#540006',
            200: '#a7000b',
            300: '#fb0011',
            400: '#ff505b',
            500: '#ffa5ab',
            600: '#ffb6ba',
            700: '#ffc8cc',
            800: '#ffdadd',
            900: '#ffedee'
          },
          blush: {
            DEFAULT: '#da627d',
            100: '#330c15',
            200: '#661829',
            300: '#9a243e',
            400: '#cd3052',
            500: '#da627d',
            600: '#e28196',
            700: '#e9a1b0',
            800: '#f0c0cb',
            900: '#f8e0e5'
          },
          raspberry_rose: {
            DEFAULT: '#a53860',
            100: '#210b13',
            200: '#411626',
            300: '#622239',
            400: '#832d4c',
            500: '#a53860',
            600: '#c4527c',
            700: '#d37d9c',
            800: '#e1a8bd',
            900: '#f0d4de'
          },
          chocolate_cosmos: {
            DEFAULT: '#450920',
            100: '#0e0206',
            200: '#1b040d',
            300: '#290513',
            400: '#360719',
            500: '#450920',
            600: '#901343',
            700: '#dd1d67',
            800: '#eb6699',
            900: '#f5b2cc'
        },
        dark: "#0F0F0F",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
