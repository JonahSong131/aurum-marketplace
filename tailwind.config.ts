import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#05060a",
          800: "#0a0c14",
          700: "#10131f",
          600: "#171b2b",
        },
        gold: {
          100: "#f7ecc9",
          200: "#efdc9a",
          300: "#e6c977",
          400: "#d4af37",
          500: "#c79a2b",
          600: "#a67c1f",
        },
        jade: {
          300: "#7ff0d4",
          400: "#3fd9b6",
          500: "#1fb89a",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(212,175,55,0.45)",
        "glow-lg": "0 0 80px -20px rgba(212,175,55,0.55)",
      },
      backgroundImage: {
        "gold-grad": "linear-gradient(135deg,#f7ecc9 0%,#d4af37 45%,#a67c1f 100%)",
        "radial-lux": "radial-gradient(1200px 600px at 50% -10%, rgba(212,175,55,0.18), transparent 60%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
