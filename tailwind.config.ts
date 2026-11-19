import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#141414",
          card: "#1a1a1a",
          border: "#262626",
        },
        accent: {
          yellow: "#f1f505",
          glow: "rgba(241, 245, 5, 0.35)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Poppins", "sans-serif"],
        cursive: ["var(--font-cursive)", "Caveat", "cursive"],
        inter: ["'Inter'", "sans-serif"],
        bevietnam: ["'Be Vietnam Pro'", "sans-serif"],
        jakarta: ["'Plus Jakarta Sans'", "sans-serif"],
        roboto: ["'Roboto'", "sans-serif"],
        merriweather: ["'Merriweather'", "Georgia", "serif"],
        jetbrains: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
