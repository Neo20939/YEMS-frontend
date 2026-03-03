/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./examples/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E11D48",
        secondary: "#FBFAF9",
        "rose-soft": "#FFF1F2",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        sans: ["var(--font-raleway)"],
        display: ["var(--font-raleway)"],
      },
      borderRadius: {
        DEFAULT: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(225, 29, 72, 0.05)",
      },
    },
  },
  plugins: [],
}
