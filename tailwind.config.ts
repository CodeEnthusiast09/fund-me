import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "home-bgImage": "url('/hands_touch_couple_212639_1280x1024.jpg)",
      },
      colors: {
        lightGreen: "#B9F661",
        darkGreen: "#a5e150",
        lightGray: "#f2f2f2",
        darkGray: "#3e3e3e",
        black: "#000000",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
