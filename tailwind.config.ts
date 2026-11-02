import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "380px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        "screen-dynamic": "100dvh",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
       keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      fontFamily: {
        yekan: ["Yekan Bakh", "sans-serif"],
        gramaphone: ["Gramophone", "sans-serif"],
      }
    },
  },
  plugins: [require("tailwindcss-rtl"), require("tailwindcss-animate")],
  safelist: [
    {
      pattern:
        /from-(red|orange|yellow|green|blue|purple|cyan|indigo|violet|pink|emerald|lime|amber|slate|gray|neutral|zinc|rose)-[1-9]00$/,
    },
    {
      pattern:
        /from-(red|orange|yellow|green|blue|purple|cyan|indigo|violet|pink|emerald|lime|amber|slate|gray|neutral|zinc|rose)-50$/,
    },
    {
      pattern:
        /from-(red|orange|yellow|green|blue|purple|cyan|indigo|violet|pink|emerald|lime|amber|slate|gray|neutral|zinc|rose)-950$/,
    },
    {
      pattern:
        /to-(red|orange|yellow|green|blue|purple|cyan|indigo|violet|pink|emerald|lime|amber|slate|gray|neutral|zinc|rose)-[1-9]00$/,
    },
    {
      pattern:
        /to-(red|orange|yellow|green|blue|purple|cyan|indigo|violet|pink|emerald|lime|amber|slate|gray|neutral|zinc|rose)-50$/,
    },
    {
      pattern:
        /to-(red|orange|yellow|green|blue|purple|cyan|indigo|violet|pink|emerald|lime|amber|slate|gray|neutral|zinc|rose)-950$/,
    },
    {
      pattern: /bg-(rose|red|blue|green|yellow|pink|purple|gray|slate)-[1-9]00$/,
    },
    
  ],
};
export default config;
