
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Game specific colors
        game: {
          bg: "#1A1F2C",
          platform: "#403E43",
          secondary: "#3E4C59",
          tertiary: "#5A6B7B",
          energy: "#0EA5E9",
          accent: "#D946EF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        blink: {
          "0%": { opacity: "0" },
          "10%": { opacity: "0" },
          "15%": { opacity: "100" },
          "20%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
        collect: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.2)", opacity: "0" },
        },
        armSwing: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(8deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(-8deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        legWalk: {
          "0%": { transform: "translateY(0px)" },
          "25%": { transform: "translateY(-1px)" },
          "50%": { transform: "translateY(0px)" },
          "75%": { transform: "translateY(1px)" },
          "100%": { transform: "translateY(0px)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        blink: "blink 6s infinite",
        collect: "collect 0.3s forwards",
        armSwing: "armSwing 0.6s infinite",
        legWalk: "legWalk 0.6s infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
