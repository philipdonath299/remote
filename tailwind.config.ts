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
        background: "#000000",
        card: "#0a0a0a",
        border: "#1f1f1f",
        foreground: "#ffffff",
        secondary: "#d4d4d4",
        muted: "#8f8f8f",
        hover: "#1a1a1a",
      },
      borderRadius: {
        '2xl': '20px',
      }
    },
  },
  plugins: [],
};
export default config;
