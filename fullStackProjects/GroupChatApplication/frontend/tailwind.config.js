/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff4ff",
          100: "#dbe6fe",
          200: "#bfd3fe",
          300: "#93b4fd",
          400: "#6090fa",
          500: "#3b6ef6",
          600: "#1d4ed8", // ← Said Hi primary
          700: "#1a44b8",
          800: "#1b3a94",
          900: "#1c3475",
        },
        surface: {
          DEFAULT: "#ffffff", // light main bg
          muted: "#f8fafc", // light secondary bg
          dark: "#0f172a", // dark main bg
          "dark-muted": "#1e293b",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#334155",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel:
          "0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)",
      },
      transitionTimingFunction: {
        "out-quick": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
