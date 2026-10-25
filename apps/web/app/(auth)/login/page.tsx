'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Lock, ArrowRight, Zap, CheckCircle2, AlertTriangle, Key } from 'lucide-react'
import { api, DEMO_USER } from '@/lib/api'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [demoNotice, setDemoNotice] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDemoNotice(null)

    try {
      const res = await api.login(email, password)
      if (res.data?.isDemoMode) {
        setDemoNotice('Authenticated via HireShield Resilient Offline Session.')
      }
      setTimeout(() => {
        router.push('/dashboard')
      }, 400)
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoBypass = async () => {
    setEmail('demo@hireshield.ai')
    setPassword('password123')
    setLoading(true)
    setError(null)

    try {
      const res = await api.login('demo@hireshield.ai', 'password123')
      setDemoNotice(
        res.data?.isDemoMode
          ? 'Resilient Offline Bypass Active: Demo credentials verified locally.'
          : 'Live Backend Verified: Connected to HireShield Gateway.'
      )
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch {
      // Direct offline fallback ensures demo never halts
      api.login('demo@hireshield.ai', 'password123')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas bg-dot-grid flex flex-col justify-center items-center p-4 selection:bg-scam-bg selection:text-scam-text transition-colors relative">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Decorative Dossier Header Tag */}
      <div className="mb-4 flex items-center space-x-2 font-mono text-xs tracking-wider text-ink-muted uppercase">
        <span className="w-2 h-2 rounded-full bg-accent"></span>
        <span>SECURITY CLEARANCE VERIFICATION // AGY-V2</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-surface border border-border specular-card rounded-xl shadow-dossier p-8 sm:p-10 relative overflow-hidden"
      >
        {/* Top Accent Stamp Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-ink-muted to-scam" />

        {/* Brand & Editorial Title */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent text-accent-fg flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
              HireShield <span className="font-sans text-xs tracking-widest text-ink-muted font-mono">// AI</span>
            </h2>
            <p className="font-mono text-xs text-ink-muted">Editorial Threat Command Center</p>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="font-serif text-3xl text-ink tracking-tight leading-snug">
            Sign in to intelligence console
          </h1>
          <p className="text-xs text-ink-muted mt-1.5 leading-relaxed font-sans">
            Access multi-tier job scam investigations, DeBERTa-v3 telemetry, and verified scam databases.
          </p>
        </div>

        {/* Feedback / Error Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg bg-scam-bg border border-scam text-scam-text text-xs flex items-start space-x-2 font-mono"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-scam" />
              <span>{error}</span>
            </motion.div>
          )}

          {demoNotice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-lg bg-safe-bg border border-safe text-safe-text text-xs flex items-start space-x-2 font-mono"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-safe" />
              <span>{demoNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
              Authorized Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@hireshield.ai"
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-md text-sm text-ink font-sans placeholder:text-ink-muted focus:outline-none focus:border-ink focus:bg-surface transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                Passcode
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-canvas border border-border rounded-md text-sm text-ink font-sans placeholder:text-ink-muted focus:outline-none focus:border-ink focus:bg-surface transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 text-accent-fg py-2.5 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In With Credentials'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Editorial Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-2.5 font-mono text-ink-muted">
              Zero-Dependency Testing
            </span>
          </div>
        </div>

        {/* ONE-CLICK DEMO BYPASS BUTTON */}
        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDemoBypass}
          disabled={loading}
          className="w-full relative group bg-canvas hover:bg-elevated border-2 border-dashed border-border hover:border-ink p-3.5 rounded-lg text-left transition-all flex items-center justify-between"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-accent text-accent-fg rounded-md group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 text-warn" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-ink font-sans">
                  One-Click Demo Bypass
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-safe-bg text-safe border border-safe">
                  Zero-Config
                </span>
              </div>
              <p className="font-mono text-[11px] text-ink-muted mt-0.5">
                demo@hireshield.ai · password123
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-ink font-medium group-hover:translate-x-0.5 transition-transform inline-block">
              ↵ Instant Entry
            </span>
          </div>
        </motion.button>

        {/* Footer Monospace Meta */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
          <span>CASCADE ENGINE v2.4</span>
          <span>NEON + REDIS RESILIENT</span>
        </div>
      </motion.div>
    </div>
  )
}
