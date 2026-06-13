import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Three voices: Geist for UI, Geist Mono for data,
        // Fraunces for the editorial "agency" register.
        display: ["var(--font-sans)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
      },
      colors: {
        // Layered dark neutrals — a near-black with the faintest cool depth.
        base: "#08080b",
        // Text color for light surfaces. Named `ink` (NOT `base`) because
        // `text-base` collides with Tailwind's font-size utility and silently
        // renders inherited (white) text — the white-on-white button bug.
        ink: "#08080b",
        raised: "#101013",
        overlay: "#161619",
        hairline: "rgba(255,255,255,0.08)",
        "hairline-strong": "rgba(255,255,255,0.14)",
        // Primary accent — a cool aqua used for status, focus & live state.
        accent: "#6ee7d2",
        "accent-dim": "rgba(110,231,210,0.14)",
        // A restrained spatial-blue, reserved for depth gradients & glow.
        // Never a fill — only ambient light and edge tints.
        spatial: "#7aa2ff",
        "spatial-dim": "rgba(122,162,255,0.12)",
      },
      boxShadow: {
        // Realistic glass: top edge-light + ambient drop, no colored glow.
        glass:
          "inset 0 1px 0 0 rgba(255,255,255,0.07), 0 1px 2px 0 rgba(0,0,0,0.4), 0 16px 48px -16px rgba(0,0,0,0.65)",
        "glass-lg":
          "inset 0 1px 0 0 rgba(255,255,255,0.1), 0 2px 4px 0 rgba(0,0,0,0.4), 0 40px 100px -28px rgba(0,0,0,0.8)",
        // Floating focal panel — reads as suspended above the stage.
        "glass-float":
          "inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 0 0 1px rgba(255,255,255,0.02), 0 2px 8px -2px rgba(0,0,0,0.5), 0 48px 120px -32px rgba(0,0,0,0.85)",
        btn: "inset 0 1px 0 0 rgba(255,255,255,0.45), 0 1px 2px 0 rgba(0,0,0,0.5)",
        "focus-ring": "0 0 0 3px rgba(110,231,210,0.25)",
        // Soft accent halo for live/active elements — used sparingly.
        "glow-accent": "0 0 0 1px rgba(110,231,210,0.2), 0 0 24px -4px rgba(110,231,210,0.35)",
        "glow-spatial": "0 0 0 1px rgba(122,162,255,0.18), 0 0 28px -4px rgba(122,162,255,0.3)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        sweep: {
          "0%": { transform: "translateX(-150%) skewX(-18deg)" },
          "100%": { transform: "translateX(350%) skewX(-18deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        // Slow drift of ambient stage light — the "spatial" atmosphere.
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.6" },
          "50%": { transform: "translate3d(3%,-2%,0) scale(1.08)", opacity: "0.9" },
        },
        // Soft pulsing halo for live status dots.
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(110,231,210,0.45)", opacity: "1" },
          "70%": { boxShadow: "0 0 0 5px rgba(110,231,210,0)", opacity: "0.85" },
        },
        // Skeleton / loading shimmer.
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        scan: "scan 1.8s ease-in-out infinite",
        sweep: "sweep 2.6s cubic-bezier(0.4,0,0.2,1) infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "float-slower": "float-slower 11s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        "aurora-drift": "aurora-drift 18s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
