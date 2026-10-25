import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        elevated: 'var(--bg-elevated)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          sunken: 'var(--bg-canvas)',
        },
        border: {
          DEFAULT: 'var(--border-subtle)',
          warm: 'var(--border-subtle)',
          subtle: 'var(--border-subtle)',
          muted: 'var(--border-subtle)',
          dark: 'var(--text-primary)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          primary: 'var(--text-primary)',
          hover: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent-primary)',
          fg: 'var(--accent-fg)',
        },
        scam: {
          DEFAULT: 'var(--scam-accent)',
          bg: 'var(--scam-bg)',
          text: 'var(--scam-text)',
        },
        warn: {
          DEFAULT: 'var(--warn-accent)',
          bg: 'var(--warn-bg)',
          text: 'var(--warn-text)',
        },
        safe: {
          DEFAULT: 'var(--safe-accent)',
          bg: 'var(--safe-bg)',
          text: 'var(--safe-text)',
        },
        verdict: {
          scam: {
            DEFAULT: 'var(--scam-accent)',
            bg: 'var(--scam-bg)',
            text: 'var(--scam-text)',
            border: 'var(--scam-accent)',
          },
          suspicious: {
            DEFAULT: 'var(--warn-accent)',
            bg: 'var(--warn-bg)',
            text: 'var(--warn-text)',
            border: 'var(--warn-accent)',
          },
          legitimate: {
            DEFAULT: 'var(--safe-accent)',
            bg: 'var(--safe-bg)',
            text: 'var(--safe-text)',
            border: 'var(--safe-accent)',
          },
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'editorial': '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px -4px rgba(0, 0, 0, 0.06)',
        'dock': '0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3)',
        'dossier': '0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 16px 32px -8px rgba(0, 0, 0, 0.12)',
        'specular': 'inset 0 1px 0 0 var(--specular-highlight)',
      },
      animation: {
        'scan-bar': 'scanBar 2.4s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scanBar: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.4' },
          '50%': { transform: 'translateY(980%)', opacity: '0.9' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}

export default config
