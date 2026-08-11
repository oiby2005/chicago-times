import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-sans)", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        wsj: {
          black: "#111111",
          dark: "#222222",
          gray: "#666666",
          lightGray: "#f4f4f4",
          border: "#e2e2e2",
          accent: "#0080c6",
          red: "#c00000",
        },
      },
    },
  },
  plugins: [],
};

export default config;
