/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        karar: {
          navy: {
            DEFAULT: "#0B2345",
            dark: "#07172F",
            light: "#133566",
            soft: "#E8EEF6",
          },
          green: {
            DEFAULT: "#159653",
            dark: "#0F723E",
            light: "#EAF7EF",
            hover: "#117E45",
            accent: "#22C55E",
          },
          bg: "#F8FAFC",
          text: "#152C4E",
          muted: "#667085",
          border: "#E2E8F0",
          warning: "#F59E0B",
          risk: "#EF4444",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(11, 35, 69, 0.05), 0 2px 6px -1px rgba(11, 35, 69, 0.03)",
        "card-hover": "0 12px 30px -4px rgba(11, 35, 69, 0.1), 0 4px 12px -2px rgba(11, 35, 69, 0.05)",
        premium: "0 20px 40px -15px rgba(21, 150, 83, 0.15)",
        glow: "0 0 25px rgba(21, 150, 83, 0.25)",
      },
    },
  },
  plugins: [],
};
