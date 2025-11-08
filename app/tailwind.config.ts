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
          DEFAULT: '#2C3338',
          light: '#4A5259',
          dark: '#1A1F23',
        },
        accent: {
          DEFAULT: '#9B8578',
          light: '#B9A199',
          dark: '#7D6B5F',
        },
        background: {
          DEFAULT: '#F8F6F4',
          secondary: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E1DD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

