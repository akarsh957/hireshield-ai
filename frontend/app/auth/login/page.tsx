'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('demo@hireshield.ai')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('hs_token', data.token)
        localStorage.setItem('hs_user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else { 
        setErrorMsg(data.error || 'Invalid credentials. Please try again.') 
      }
    } catch { 
      setErrorMsg('Cannot connect to security gateway. Verify backend status on port 4000.') 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative',
      overflow: 'hidden',
      padding: 24 
    }}>
      {/* Background glowing mesh */}
      <div className="mesh-glow" />

      {/* Floating Home Button */}
      <button 
        onClick={() => router.push('/')}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'var(--text2)',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.color = 'var(--text2)'
        }}
      >
        <ArrowLeft size={14} /> Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="cyber-card"
        style={{ 
          padding: '44px 40px', 
          width: '100%', 
          maxWidth: 420,
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ 
              width: 34, 
              height: 34, 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' 
            }}>
              <ShieldCheck size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-syne)', fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
              HireShield AI
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>
            Access Gateway
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
            Verify identity to launch AI security scan engine
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: 8, 
              padding: '12px 14px', 
              fontSize: 12, 
              color: '#f87171', 
              marginBottom: 20,
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              fontSize: 12, 
              color: 'var(--text2)', 
              marginBottom: 6, 
              fontWeight: 500 
            }}>
              <Mail size={13} /> Email address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="glass-input"
              style={{ width: '100%' }}
              required 
            />
          </div>

          {/* Password input */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              fontSize: 12, 
              color: 'var(--text2)', 
              marginBottom: 6, 
              fontWeight: 500 
            }}>
              <Lock size={13} /> Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="glass-input"
              style={{ width: '100%' }}
              required 
            />
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              border: 'none', 
              color: '#fff', 
              padding: '12px', 
              borderRadius: 8, 
              fontSize: 13, 
              fontWeight: 600, 
              cursor: loading ? 'not-allowed' : 'pointer', 
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
            onMouseOver={e => {
              if(!loading) {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseOut={e => {
              if(!loading) {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.25)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {loading ? (
              <>
                <span style={{ 
                  width: 14, 
                  height: 14, 
                  border: '2px solid rgba(255,255,255,.3)', 
                  borderTopColor: '#fff', 
                  borderRadius: '50%', 
                  display: 'inline-block', 
                  animation: 'spin .8s linear infinite' 
                }} />
                Verifying Credentials...
              </>
            ) : (
              'Establish Secure Session'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 20 }}>
          No account? <a href="/auth/register" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Create one free</a>
        </p>

        {/* Demo Credentials Box */}
        <div style={{ 
          marginTop: 24, 
          padding: '12px 14px', 
          background: 'rgba(3, 5, 16, 0.4)', 
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 8, 
          fontSize: 11, 
          color: 'var(--text3)', 
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.5
        }}>
          <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: 2 }}>DEMO ACCESS CREDENTIALS:</div>
          <div>Login: <span style={{ color: 'var(--text2)' }}>demo@hireshield.ai</span></div>
          <div>Pass: <span style={{ color: 'var(--text2)' }}>password123</span></div>
        </div>
      </motion.div>
    </div>
  )
}
