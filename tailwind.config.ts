import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 暖近黑，比纯黑更有质感（墨韵）
        ink: {
          900: "#0c0d10",
          800: "#121319",
          700: "#1a1d27",
          600: "#242836",
        },
        // 香槟金 / 古铜金（克制高级，非黄铜金）
        gold: {
          100: "#f5edd9",
          200: "#ecdcb4",
          300: "#ddc78c",
          400: "#c9a96a",
          500: "#b8924f",
          600: "#987237",
        },
        jade: {
          300: "#9fe6d0",
          400: "#5fc9aa",
          500: "#34a98c",
        },
      },
      fontFamily: {
        // 优雅高对比衬线，替代过曝的 Playfair
        serif: ["Cormorant Garamond", "Noto Serif SC", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 36px -12px rgba(201,169,106,0.40)",
        "glow-lg": "0 0 70px -18px rgba(201,169,106,0.45)",
      },
      backgroundImage: {
        "gold-grad": "linear-gradient(135deg,#f5edd9 0%,#c9a96a 50%,#987237 100%)",
        "radial-lux": "radial-gradient(1200px 600px at 50% -10%, rgba(201,169,106,0.14), transparent 60%)",
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
