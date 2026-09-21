/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background Canvas: Pure Obsidian Black
        canvas: {
          DEFAULT: '#0b0e14',
          obsidian: '#0b0e14',
          pure: '#08090c',
          subtle: '#121924',
          surface: '#141b26',
          elevated: '#182232',
          border: '#222d3d',
        },
        // Deep Midnight Navy surfaces
        midnight: {
          950: '#08090c',
          900: '#0b0e14',
          850: '#121924',
          800: '#141b26',
          750: '#182232',
          700: '#222d3d',
          600: '#2d3b4e',
        },
        navy: {
          950: '#08090c',
          900: '#0b0e14',
          850: '#121924',
          800: '#141b26',
          750: '#182232',
          700: '#222d3d',
          600: '#2d3b4e',
        },
        // Primary Accent: Warm Golden Amber / Marigold
        gold: {
          DEFAULT: '#f3b740',
          light: '#f7d56e',
          dark: '#e5a83b',
          contrast: '#0e131f',
          50: '#fffdf5',
          100: '#fef9ee',
          200: '#fae1ab',
          300: '#f7d56e',
          400: '#f5bf47',
          500: '#f3b740', // Warm Golden Amber
          600: '#e5a83b',
          700: '#c28424',
          800: '#9a6620',
          900: '#7e531e',
        },
        // Brand mapped to Warm Golden Amber
        brand: {
          50: '#fffdf5',
          100: '#fef9ee',
          200: '#fae1ab',
          300: '#f7d56e',
          400: '#f5bf47',
          500: '#f3b740',
          600: '#e5a83b',
          700: '#c28424',
          800: '#9a6620',
          900: '#7e531e',
        },
        // Price & Currency Badges: Forest Emerald / Jade Green
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#062c20', // Dark green background for badge chips
        },
        // Accent Teal / Cyan
        teal: {
          50: '#062c20',
          100: '#064e3b',
          200: '#047857',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#34d399',
          800: '#10b981',
          900: '#059669',
        },
        // Typography & Neutral Scales
        charcoal: {
          950: '#08090c',
          900: '#f1f5f9', // Clean off-white for headings
          800: '#e2e8f0', // Primary body text
          700: '#cbd5e1', // Secondary body
          600: '#94a3b8', // Muted silver descriptions
          500: '#64748b', // Subdued labels
          400: '#475569',
          300: '#334155',
          200: '#222d3d', // Card & container borders
          100: '#182232', // Elevated surface
          50: '#141b26',  // Container surface
        },
        // Safety: Restrained Emergency Red
        safety: {
          50: '#200c10',
          100: '#331218',
          200: '#5c1d24',
          300: '#8b2630',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#fca5a5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 4px 16px -2px rgba(0, 0, 0, 0.5)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4)',
        'elevated-hover': '0 20px 40px -6px rgba(0, 0, 0, 0.8), 0 8px 16px -4px rgba(0, 0, 0, 0.5)',
        'button': '0 2px 10px -1px rgba(243, 183, 64, 0.35)',
        'teal-glow': '0 0 24px -4px rgba(16, 185, 129, 0.3)',
        'blue-glow': '0 0 24px -4px rgba(243, 183, 64, 0.3)',
        'gold-glow': '0 0 20px -2px rgba(243, 183, 64, 0.35)',
        'gold-glow-lg': '0 0 35px -4px rgba(243, 183, 64, 0.45)',
        'navy-card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 6px 20px -2px rgba(0, 0, 0, 0.6)',
      },
      transitionTimingFunction: {
        'spring-overshoot': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-bounce': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        'cinematic': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-radar': 'pulseRadar 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'marker-pop': 'markerPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'route-draw': 'routeDraw 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'telemetry-slide': 'telemetrySlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'halo-glow': 'haloGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRadar: {
          '0%': { transform: 'scale(0.95)', opacity: '0.85' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        markerPop: {
          '0%': { transform: 'scale(0) translateY(12px)', opacity: '0' },
          '70%': { transform: 'scale(1.18) translateY(-2px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        routeDraw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        telemetrySlide: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        haloGlow: {
          '0%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
      }
    },
  },
  plugins: [],
}
