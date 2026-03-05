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
        // Wine Crimson · Light Petal Pink · Off-White · Linen Beige · Soft Sage Green
        primary: "#7B1E3A",        // Wine Crimson
        "primary-dark": "#5A162C", // Darker Wine Crimson
        "primary-light": "#9A284A",// Lighter Wine Crimson
        secondary: "#F4D4D8",      // Light Petal Pink
        "secondary-light": "#F8E4E8",// Lighter Petal Pink
        "secondary-dark": "#EAC4C8", // Darker Petal Pink
        cream: "#F9F7F2",          // Off-White
        ivory: "#FFFEF9",          // Ivory Off-White
        beige: "#E3D5C6",          // Linen Beige
        "beige-light": "#EDE0D4",  // Lighter Linen
        "beige-dark": "#C9B8A8",   // Darker Linen
        sage: "#A8B5A0",           // Soft Sage Green
        "sage-light": "#BCC9B4",   // Lighter Sage
        "sage-dark": "#8FA085",    // Darker Sage
        accent: "#A8B5A0",         // Soft Sage Green as accent
        "accent-light": "#BCC9B4", // Lighter Sage
        "accent-dark": "#8FA085",  // Darker Sage
        "background-light": "#F9F7F2", // Off-White for backgrounds
        "background-dark": "#2D1A20",  // Dark Wine Crimson for dark mode
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
        soft: "0 4px 20px -2px rgba(114, 47, 55, 0.1)",
      },
    },
  },
  plugins: [],
}
