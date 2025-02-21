import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // font 확장
      fontFamily: {
        roboto: "var(--roboto-text)",
        sigmar: "var(--sigmar-boy)",
        metalica: "var(--metalica-text)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
