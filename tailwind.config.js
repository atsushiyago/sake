/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sake: {
          primary: "#1e2832", // Deep Indigo (Kachi-iro)
          "primary-light": "#2c3a4a",
          accent: "#c5a059", // Gold (Leaf)
          "accent-light": "#e0c080",
          paper: "#fcfaf5", // Washi white
          text: "#2c2c2c",
          "text-light": "#666666",
        },
      },
      fontFamily: {
        serif: ["var(--font-noto-serif)", "Hiragino Mincho ProN", "serif"],
      },
      backgroundImage: {
        'washi-pattern': "radial-gradient(#e0c080 0.5px, transparent 0.5px), radial-gradient(#e0c080 0.5px, #fcfaf5 0.5px)",
      }
    },
  },
  plugins: [],
};
