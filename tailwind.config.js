/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // Bootstrap already ships its own reset (Reboot), so Tailwind's is switched off
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#c9971c", dark: "#8a6508", light: "#f1d27a", soft: "#faf3e3" },
        ink: "#0b0b0c",
      },
    },
  },
  plugins: [],
};
