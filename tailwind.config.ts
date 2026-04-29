import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          DEFAULT: "#A20603",
          dark: "#7A0402",
          light: "#C73B38"
        },
        cream: {
          DEFAULT: "#FFFAF3",
          dark: "#F4ECDD"
        }
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        serif: ["var(--font-judson)", "serif"],
        script: ["var(--font-montecarlo)", "cursive"]
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "fade-in-up": "fadeInUp 1.2s ease-out forwards",
        "fade-in": "fadeIn 1.4s ease-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        shimmer: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        }
      },
      backgroundImage: {
        "cream-gradient":
          "radial-gradient(circle at top left, #FFFAF3 0%, #F8EFE0 100%)"
      }
    }
  },
  plugins: []
};

export default config;
