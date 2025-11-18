import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F1419',
          light: '#5B6168',
          dark: '#050709',
        },
        accent: {
          DEFAULT: '#111827',
          light: '#374151',
          dark: '#030712',
        },
        highlight: {
          DEFAULT: '#C5FF40',
        },
        background: {
          DEFAULT: '#F5F5F4',
          secondary: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E4E4E7',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
