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
        // Primary: Deep Navy / Midnight Blue
        midnight: {
          950: '#060B18',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#152248',
          750: '#1C2E5C',
          700: '#23376E',
          600: '#334E96',
        },
        // Secondary: Cool Blue
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Primary Brand Blue
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Accent: Teal / Cyan
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488', // Refined Teal
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Text: Dark Charcoal
        charcoal: {
          950: '#090D16',
          900: '#0F172A', // Main headline text
          800: '#1E293B', // Primary body
          700: '#334155', // Secondary body
          600: '#475569', // Muted text
          500: '#64748B', // Subdued labels
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0', // Card borders
          100: '#F1F5F9', // Elevated surface
          50: '#F8FAFC',  // Canvas background
        },
        // Canvas / Surfaces
        canvas: {
          DEFAULT: '#F8FAFC',
          warm: '#FAFAFB',
          pure: '#FFFFFF',
          subtle: '#F1F5F9',
        },
        // Safety: Restrained Emergency Red
        safety: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        // Compatibility Aliases for smoothly supporting components
        navy: {
          950: '#060B18',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#152248',
          750: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
        gold: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#38BDF8',
          500: '#2563EB', // Remapped to Cool Brand Blue
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 4px 16px -2px rgba(15, 23, 42, 0.06)',
        'elevated': '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'elevated-hover': '0 20px 40px -6px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'button': '0 2px 8px -1px rgba(37, 99, 235, 0.35)',
        'teal-glow': '0 0 24px -4px rgba(13, 148, 136, 0.3)',
        'blue-glow': '0 0 24px -4px rgba(37, 99, 235, 0.3)',
        'gold-glow': '0 0 20px -4px rgba(37, 99, 235, 0.25)',
        'gold-glow-lg': '0 0 35px -5px rgba(37, 99, 235, 0.35)',
        'navy-card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 6px 20px -2px rgba(15, 23, 42, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
        }
      }
    },
  },
  plugins: [],
}
