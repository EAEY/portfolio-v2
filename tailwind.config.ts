import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // macOS specific colors
        macos: {
          blue: "hsl(var(--macos-blue))",
          red: "hsl(var(--macos-red))",
          yellow: "hsl(var(--macos-yellow))",
          green: "hsl(var(--macos-green))",
          "accent-blue": "hsl(var(--macos-accent-blue))",
          "accent-purple": "hsl(var(--macos-accent-purple))",
          "accent-pink": "hsl(var(--macos-accent-pink))",
          "accent-orange": "hsl(var(--macos-accent-orange))",
          "accent-yellow": "hsl(var(--macos-accent-yellow))",
          "accent-green": "hsl(var(--macos-accent-green))",
          "accent-cyan": "hsl(var(--macos-accent-cyan))",
          "traffic-red": "hsl(var(--macos-traffic-red))",
          "traffic-yellow": "hsl(var(--macos-traffic-yellow))",
          "traffic-green": "hsl(var(--macos-traffic-green))",
        },
        desktop: {
          DEFAULT: "hsl(var(--desktop-bg))",
        },
        glass: {
          bg: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
        },
        dock: {
          bg: "hsl(var(--dock-bg))",
          border: "hsl(var(--dock-border))",
        },
        menubar: {
          bg: "hsl(var(--menubar-bg))",
        },
      },
      boxShadow: {
        "window": "0 25px 50px -12px hsl(0 0% 0% / 0.5)",
        "window-active": "0 30px 60px -15px hsl(0 0% 0% / 0.6)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Boot screen animations
        "logo-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        "logo-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 20px hsl(0 0% 100% / 0.3))" },
          "50%": { filter: "drop-shadow(0 0 40px hsl(0 0% 100% / 0.5))" },
        },
        "progress-indeterminate": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        // Dock bounce
        "dock-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        // Window animations
        "window-open": {
          from: { opacity: "0", transform: "scale(0.9) translateY(20px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "window-close": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.9)" },
        },
        // Parallax subtle movement
        "parallax-float": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(5px, 5px)" },
          "50%": { transform: "translate(0, 10px)" },
          "75%": { transform: "translate(-5px, 5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "logo-pulse": "logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "logo-glow": "logo-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "progress-indeterminate": "progress-indeterminate 1.5s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-out": "fade-out 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.2, 0.9, 0.2, 1) forwards",
        "scale-out": "scale-out 0.2s ease-out forwards",
        "dock-bounce": "dock-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "window-open": "window-open 0.35s cubic-bezier(0.2, 0.9, 0.2, 1) forwards",
        "window-close": "window-close 0.2s ease-out forwards",
        "parallax-float": "parallax-float 20s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "macos-smooth": "cubic-bezier(0.2, 0.9, 0.2, 1)",
        "macos-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
