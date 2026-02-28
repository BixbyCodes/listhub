/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0d0d0d",
          1: "#111111",
          2: "#161616",
          3: "#1c1c1c",
          4: "#242424",
        },
        brd: {
          DEFAULT: "#222222",
          bright: "#333333",
        },
        accent: {
          DEFAULT: "#818cf8",
          dark: "#4f46e5",
        },
        ink: {
          1: "#ffffff",
          2: "#a1a1aa",
          3: "#71717a",
          4: "#3f3f46",
        },
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "pulse-slow": "pulseSlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
