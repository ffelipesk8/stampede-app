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
        // KARTAZO brand palette
        bg:     "#07070F",
        card1:  "#141425",
        card2:  "#1C1C32",
        card3:  "#12122A",
        border: "#252540",
        red:    "#E8003D",
        orange: "#FF5E00",
        gold:   "#FFB800",
        green:  "#00D97E",
        blue:   "#4A6FFF",
        purple: "#9B59B6",
        t1:     "#F2F2FF",
        t2:     "#9090B8",
        t3:     "#5A5A80",
      },
      fontFamily: {
        condensed: ["var(--font-barlow)", "sans-serif"],
        display:   ["var(--font-space-grotesk)", "sans-serif"],
        body:      ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "fire-gradient": "linear-gradient(135deg, #E8003D 0%, #FF5E00 50%, #FFB800 100%)",
        "fire-h":        "linear-gradient(90deg, #E8003D 0%, #FF5E00 50%, #FFB800 100%)",
      },
      animation: {
        "pulse-slow":  "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow-red":    "glowRed 2s ease-in-out infinite alternate",
        "float":       "float 3s ease-in-out infinite",
        "shake":       "shake 0.5s ease-in-out",
        "flip-in":     "flipIn 0.4s ease-out forwards",
        "particle":    "particle 0.8s ease-out forwards",
        "xp-pop":      "xpPop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
      },
      keyframes: {
        glowRed:  { "0%": { boxShadow: "0 0 10px #E8003D40" }, "100%": { boxShadow: "0 0 30px #E8003D80" } },
        float:    { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shake:    { "0%,100%": { transform: "translateX(0)" }, "25%": { transform: "translateX(-6px)" }, "75%": { transform: "translateX(6px)" } },
        flipIn:   { "0%": { transform: "rotateY(90deg)", opacity: "0" }, "100%": { transform: "rotateY(0deg)", opacity: "1" } },
        particle: { "0%": { transform: "translate(0,0) scale(1)", opacity: "1" }, "100%": { transform: "translate(var(--tx),var(--ty)) scale(0)", opacity: "0" } },
        xpPop:    { "0%": { transform: "translateY(0) scale(1)", opacity: "1" }, "50%": { transform: "translateY(-20px) scale(1.2)", opacity: "1" }, "100%": { transform: "translateY(-40px) scale(0.8)", opacity: "0" } },
      },
    },
  },
  plugins: [],
};

export default config;
