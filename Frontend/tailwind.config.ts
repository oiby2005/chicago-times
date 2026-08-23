import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        encorpada: ["Encorpada Classic Compressed Bold", "Encorpada Classic Compressed", "Encorpada Classic", "var(--font-playfair)", "Playfair Display", "serif"],
        kepler: ["Kepler Bold Condensed Subhead", "Kepler Std Bold Condensed Subhead", "KeplerStd-BoldCnSubh", "Kepler Std", "Kepler", "var(--font-playfair)", "Playfair Display", "serif"],
        escrow: ["Escrow Condensed", "Escrow Display Condensed", "var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        serif: ["Encorpada Classic Compressed Bold", "Escrow Display Condensed Bold", "var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        retina: ["Retina", "Retina Bold", "Retina-Bold", "var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        whitney: ["Whitney", "Whitney Book", "Whitney-Book", "Whitney Medium", "Whitney SemiBold", "var(--font-sans)", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        publica: ["Publica Sans Light", "Publica Sans", "PublicaSans-Light", "PublicaSansLight", "Whitney", "Whitney Book", "var(--font-sans)", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        publicaRound: ["'Publica Sans Round Light'", "'Publica Sans Round'", "'Publica Sans'", "sans-serif"],
        arialUnicode: ["'Arial Unicode MS'", "'Arial'", "sans-serif"],
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
