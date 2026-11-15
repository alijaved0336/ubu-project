import plugin from "tailwindcss/plugin";
import tailwindScrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        vogue: ["Classy Vogue", "sans-serif"],
      },

      dropShadow: {
        custom: "0px 4.5px 36px rgba(247, 158, 27, 0.29)",
        green: "0px 4.5px 36px rgba(3, 152, 55, 0.29)",
      },
      backdropBlur: {
        18: "18px",
      },
      colors: {
        black: {
          light: "#4B5563",
          60: "rgba(0, 0, 0, 0.60)",
          DEFAULT: "#000",
          heading: "#111827",
          muted: "rgba(0, 0, 0, 0.6)",
          label: "#353535",
        },
        orange: {
          DEFAULT: "#F79E1B",
          shadow: "rgba(247, 158, 27, 0.30)",
        },
        gray: {
          lighter: "#F3F4F6",
          light: "#e5e7eb",
          medium: "#6B7280",
          dark: "#666",
          slategray: "#4B5563",
          navy: "#273b4a",
          menu: "#8F8F8F",
          bg: "#f9f9fd",
          button: {
            outlined: "#858D9D",
          },
        },
        green: {
          DEFAULT: "#039837",
          published: "rgba(104, 245, 110, 0.50)",
          shadow: "rgba(3, 152, 55, 0.29)",
        },
      },
      boxShadow: {
        btn: "0px 1px 2px 0px rgba(3, 7, 18, 0.02)",
        card: "0px 1px 3px -1px rgba(15, 23, 42, 0.16)",
        avatar: "0 2px 8px rgba(0, 0, 0, 0.1);",
      },
      animation: {
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-bottom": "slideInBottom 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "pop-up": "popUp 0.5s ease-out",
        "bulge-rotate-Y": "bulgeRotateY 3s infinite ease-in-out",
        "bell-rattle": "bellRattle 0.5s ease-in-out infinite",
        glow: "glow 2.5s infinite",
        pulse: "pulse 2.5s infinite;",
        "typing-dot": "typingDot 1s infinite ease-in-out",
      },
      keyframes: {
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInBottom: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        typingDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.3" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
        },
        glow: {
          "0%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
          "100%": {
            opacity: "1",
          },
        },

        pulse: {
          "0%": {
            opacity: "0",
          },
          "50%": {
            opacity: "0.2",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
      screens: {
        xs: "426px",
        xxs: "320px",
      },
    },
  },
  prefix: "tw-",
  plugins: [
    tailwindScrollbar,
    function ({ addComponents }) {
      addComponents({
        ".ticket-edge": {
          position: "relative",
          "&::before": {
            content: "''",
            position: "absolute",
            top: "50%",
            left: "0",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            borderRight: "1px solid #D8D8D8",
            backgroundColor: "#FFFFFF",
            width: "1.25rem",
            height: "1.25rem",
          },

          "&::after": {
            content: "''",
            position: "absolute",
            top: "50%",
            right: "0",
            transform: "translate(50%, -50%)",
            borderRadius: "50%",
            borderLeft: "1px solid #D8D8D8",
            backgroundColor: "#FFFFFF",
            width: "1.25rem",
            height: "1.25rem",
          },
        },
        ".center-element": {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
      });
    },
    function ({ addUtilities }) {
      addUtilities({
        ".custom-scrollbar": {
          "&::-webkit-scrollbar": {
            width: "6px", // Correctly set the width here
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#e5e7eb", // Thumb color (gray-500)
            borderRadius: "9999px", // Rounded corners
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F3F4F6", // Track color (gray-300)
          },
        },
      });
    },
  ],
};
