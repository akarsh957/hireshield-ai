'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-7 w-[164px] bg-surface rounded-full border border-border animate-pulse" />
    )
  }

  const currentTheme = resolvedTheme || theme || 'light'
  const isDark = currentTheme === 'dark'

  return (
    <div
      role="radiogroup"
      aria-label="Theme Switcher"
      className="relative flex items-center p-0.5 rounded-full bg-elevated border border-border text-ink font-mono text-[11px] shadow-sm select-none"
    >
      {/* Light Option: DAYLIGHT */}
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => setTheme('light')}
        className={`relative z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors duration-150 ${
          !isDark ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
        }`}
      >
        {!isDark && (
          <motion.div
            layoutId="theme-pill"
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            className="absolute inset-0 bg-surface rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.06)] z-[-1]"
          />
        )}
        <motion.div
          animate={{ rotate: !isDark ? 0 : -30, scale: !isDark ? 1 : 0.85 }}
          transition={{ duration: 0.2 }}
        >
          <Sun className={`w-3 h-3 ${!isDark ? 'text-[#D97706]' : 'text-ink-muted'}`} />
        </motion.div>
        <span>DAYLIGHT</span>
      </button>

      {/* Dark Option: OBSIDIAN */}
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => setTheme('dark')}
        className={`relative z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-colors duration-150 ${
          isDark ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
        }`}
      >
        {isDark && (
          <motion.div
            layoutId="theme-pill"
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            className="absolute inset-0 bg-[#262622] rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.4)] z-[-1]"
          />
        )}
        <motion.div
          animate={{ rotate: isDark ? 0 : 30, scale: isDark ? 1 : 0.85 }}
          transition={{ duration: 0.2 }}
        >
          <Moon className={`w-3 h-3 ${isDark ? 'text-[#34D399]' : 'text-ink-muted'}`} />
        </motion.div>
        <span>OBSIDIAN</span>
      </button>
    </div>
  )
}

export default ThemeToggle
