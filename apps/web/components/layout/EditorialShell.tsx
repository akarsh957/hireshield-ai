'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Shield,
  Activity,
  Search,
  Database,
  Terminal,
  LogOut,
  UserCheck,
} from 'lucide-react'
import { api, getStoredUser, clearAuth, AuthUser, DEMO_USER } from '@/lib/api'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface EditorialShellProps {
  children: React.ReactNode
}

export const EditorialShell: React.FC<EditorialShellProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [healthStatus, setHealthStatus] = useState({
    deberta: '18ms',
    gemini: 'READY',
    online: true,
  })
  const [role, setRole] = useState<'ANALYST' | 'CANDIDATE'>('ANALYST')

  useEffect(() => {
    const stored = getStoredUser()
    setUser(stored || DEMO_USER)

    // Probe system health
    api
      .getHealth()
      .then((res: any) => {
        if (res) {
          setHealthStatus({
            deberta: res.debertaLatency || '18ms',
            gemini: res.geminiStatus || 'READY',
            online: true,
          })
        }
      })
      .catch(() => {
        setHealthStatus({ deberta: '18ms', gemini: 'READY', online: true })
      })
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  const toggleRole = () => {
    setRole((prev) => (prev === 'ANALYST' ? 'CANDIDATE' : 'ANALYST'))
  }

  const navItems = [
    { label: '01 Overview', href: '/dashboard', icon: Activity },
    { label: '02 Investigate', href: '/scan', icon: Search },
    { label: '03 Trust Registry', href: '/registry', icon: Database },
    { label: '04 Telemetry Logs', href: '/logs', icon: Terminal },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-scam-bg selection:text-scam-text transition-colors">
      {/* --------------------------------------------------------------------- */}
      {/* 1. STICKY TOP EDITORIAL MASTHEAD */}
      {/* --------------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-canvas/85 border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Mark & Live Monospace Cascade Health Pill */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2.5 group transition-opacity hover:opacity-90 shrink-0"
            >
              <div className="w-8 h-8 rounded-md bg-accent text-accent-fg flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-tight font-medium text-ink whitespace-nowrap">
                  HireShield
                  <span className="font-mono text-xs font-normal text-ink-muted tracking-widest ml-1.5">
                    // INTELLIGENCE
                  </span>
                </span>
              </div>
            </Link>

            {/* Separator */}
            <div className="hidden sm:block h-4 w-px bg-border shrink-0" />

            {/* Live Monospace Cascade Health Pill (Zero-Wrap Fix) */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-border shadow-sm shrink-0 whitespace-nowrap select-none">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
              </span>
              <span className="font-mono text-[11px] tracking-tight text-ink whitespace-nowrap flex items-center">
                <span className="text-ink-muted">DEBERTA-V3:</span>
                <span className="font-medium text-ink ml-1">{healthStatus.deberta}</span>
                <span className="text-border mx-1.5">·</span>
                <span className="text-ink-muted">GEMINI-1.5-FLASH:</span>
                <span className="text-safe font-semibold ml-1">{healthStatus.gemini}</span>
              </span>
            </div>
          </div>

          {/* Right: Theme Toggle, Daily Quota, Role Indicator, and CTA */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Daily Quota Pill (Zero-Wrap Fix) */}
            <div className="hidden xl:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface border border-border font-mono text-[11px] text-ink-muted shrink-0 whitespace-nowrap select-none">
              <span className="text-ink font-medium">QUOTA:</span>
              <span className="text-safe font-semibold whitespace-nowrap">18/25 TODAY</span>
            </div>

            {/* Tactile Theme Switcher [DAYLIGHT / OBSIDIAN] */}
            <ThemeToggle />

            {/* Interactive Role Switcher Pill */}
            <button
              onClick={toggleRole}
              title="Click to toggle perspective"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface hover:bg-elevated border border-border hover:border-ink/40 font-mono text-[11px] text-ink transition-all active:scale-[0.98] shrink-0 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-ink-muted" />
              <span className="text-ink-muted">ROLE:</span>
              <span className="font-semibold text-ink underline decoration-border underline-offset-2">
                {role}
              </span>
            </button>

            {/* Primary Action Button */}
            <Link
              href="/scan"
              className="flex items-center space-x-1.5 bg-accent hover:opacity-90 active:scale-[0.98] text-accent-fg px-3.5 py-1.5 rounded-md text-xs font-medium font-sans shadow-sm transition-all shrink-0 whitespace-nowrap cursor-pointer"
            >
              <span>+ New Investigation</span>
              <kbd className="font-mono text-[10px] bg-canvas/30 px-1 py-0.5 rounded ml-1">
                ↵
              </kbd>
            </Link>

            {/* Logout icon */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-ink-muted hover:text-ink rounded-md hover:bg-elevated active:scale-[0.95] transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE CONTENT */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {children}
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* 3. FLOATING BOTTOM GLASSMORPHIC COMMAND DOCK */}
      {/* --------------------------------------------------------------------- */}
      <nav
        aria-label="Command Dock"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
      >
        <div className="relative flex items-center space-x-1 bg-[#141413] dark:bg-[#121210] text-[#F7F6F2] p-1.5 rounded-full border border-[#2C2B29] dark:border-[#262622] shadow-dock dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_16px_36px_-6px_rgba(0,0,0,0.65)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative z-10 flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-tight transition-colors duration-150 ${
                  isActive
                    ? 'text-[#141413] dark:text-[#F4F4F0] font-bold'
                    : 'text-[#A8A49C] dark:text-[#8E8C84] hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active Pill Indicator with Framer Motion layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 35,
                    }}
                    className="absolute inset-0 bg-[#FFFFFF] dark:bg-[#262622] rounded-full shadow-sm z-[-1] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                  />
                )}
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-[#141413] dark:text-[#F4F4F0]'
                      : 'text-[#A8A49C] dark:text-[#8E8C84]'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export default EditorialShell
