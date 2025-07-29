/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dashboard: ["'Poppins'", "sans-serif"], // Or any custom font
      },
      colors: {
        primaryText: "#1A1A1A",  // For headings
        secondaryText: "#555",   // For subtext
      },
    },
  },
  plugins: [],
}

