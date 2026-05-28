'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('hs_token', data.token)
        localStorage.setItem('hs_user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else { 
        setErrorMsg(data.error || 'Registration failed. Please check your details.') 
      }
    } catch { 
      setErrorMsg('Cannot reach gateway. Ensure database and API microservices are online.') 
    } finally { 
      setLoading(false) 
    }
  }

  const fields = [
    { label: 'Full name', type: 'text', name: 'name', ph: 'Alex Johnson', icon: User },
    { label: 'Email address', type: 'email', name: 'email', ph: 'you@example.com', icon: Mail },
    { label: 'Password', type: 'password', name: 'password', ph: 'Min. 8 characters', icon: Lock }
  ] as const

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
          padding: '40px', 
          width: '100%', 
          maxWidth: 420,
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ 
            width: 34, 
            height: 34, 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            borderRadius: 8, 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' 
          }}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5 }}>
            Create Account
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>
            Join thousands of job seekers protected by AI
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
              marginBottom: 18,
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start'
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleRegister}>
          {fields.map(({ label, type, name: field, ph, icon: Icon }) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6, 
                fontSize: 12, 
                color: 'var(--text2)', 
                marginBottom: 6,
                fontWeight: 500 
              }}>
                <Icon size={13} /> {label}
              </label>
              <input 
                type={type} 
                placeholder={ph} 
                required 
                value={(form as any)[field]} 
                onChange={e => setForm({ ...form, [field]: e.target.value })} 
                className="glass-input"
                style={{ width: '100%' }}
              />
            </div>
          ))}

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
              gap: 8,
              marginTop: 8
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
                Deploying Shield Protection...
              </>
            ) : (
              'Create Free Account'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 20 }}>
          Already have an account? <a href="/auth/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Sign in</a>
        </p>
      </motion.div>
    </div>
  )
}
