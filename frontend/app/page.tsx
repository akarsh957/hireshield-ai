'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Search, 
  Mail, 
  ShieldAlert, 
  Camera, 
  MessageSquare, 
  FileLock2, 
  ArrowRight,
  TrendingUp,
  AlertOctagon,
  Award,
  Zap,
  Globe
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  const stats = [
    { val: '847K+', label: 'Scans completed', color: '#10b981', icon: TrendingUp },
    { val: '124K', label: 'Frauds caught', color: '#ef4444', icon: AlertOctagon },
    { val: '99.2%', label: 'Accuracy', color: '#f59e0b', icon: Award },
    { val: '56ms', label: 'Response time', color: '#3b82f6', icon: Zap }
  ]

  const features = [
    { 
      icon: Search, 
      title: 'AI Job Scanner', 
      desc: 'Paste any job description and get instant fraud probability scores with detailed red flag analysis.', 
      bg: 'rgba(59, 130, 246, 0.1)', 
      color: '#3b82f6' 
    },
    { 
      icon: Mail, 
      title: 'Email & Message Detector', 
      desc: 'Detect phishing patterns in emails, Telegram and WhatsApp recruitment messages with NLP analysis.', 
      bg: 'rgba(239, 68, 68, 0.1)', 
      color: '#ef4444' 
    },
    { 
      icon: Globe, 
      title: 'Company Trust Score', 
      desc: 'AI-generated trust scores based on salary anomalies, unrealistic promises, and domain registration ages.', 
      bg: 'rgba(139, 92, 246, 0.1)', 
      color: '#8b5cf6' 
    },
    { 
      icon: Camera, 
      title: 'OCR Screenshot Scanner', 
      desc: 'Upload screenshots of suspicious job posts. OCR extracts text and runs full AI-powered analysis.', 
      bg: 'rgba(6, 182, 212, 0.1)', 
      color: '#06b6d4' 
    },
    { 
      icon: MessageSquare, 
      title: 'AI Safety Chatbot', 
      desc: 'Ask "Is this job safe?" — powered by advanced Claude AI for conversational scam awareness guidance.', 
      bg: 'rgba(16, 185, 129, 0.1)', 
      color: '#10b981' 
    },
    { 
      icon: FileLock2, 
      title: 'Resume Privacy Scanner', 
      desc: 'Detect sensitive info in your resume before sharing. Get safer, privacy-first formatting recommendations.', 
      bg: 'rgba(245, 158, 11, 0.1)', 
      color: '#f59e0b' 
    }
  ]

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background glowing mesh */}
      <div className="mesh-glow" />

      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '20px 48px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(3, 5, 16, 0.5)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 38, 
            height: 38, 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            borderRadius: 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' 
          }}>
            <ShieldCheck size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 16, letterSpacing: -0.5 }}>HireShield AI</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: 1.5, fontWeight: 500 }}>CYBERSECURITY PLATFORM</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button 
            onClick={() => router.push('/auth/login')} 
            style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              color: 'var(--text)', 
              padding: '10px 20px', 
              borderRadius: 10, 
              cursor: 'pointer', 
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            Sign In
          </button>
          
          <button 
            onClick={() => router.push('/auth/register')} 
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              border: 'none', 
              color: '#fff', 
              padding: '10px 22px', 
              borderRadius: 10, 
              cursor: 'pointer', 
              fontSize: 13, 
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.35)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: '100px 48px 60px', maxWidth: 1150, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8, 
            background: 'rgba(59, 130, 246, 0.08)', 
            border: '1px solid rgba(59, 130, 246, 0.2)', 
            borderRadius: 30, 
            padding: '6px 16px', 
            fontSize: 11, 
            color: '#60a5fa', 
            fontFamily: 'var(--font-mono)', 
            marginBottom: 28,
            fontWeight: 600,
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.05)'
          }}>
            <span style={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              background: '#10b981', 
              boxShadow: '0 0 8px #10b981', 
              display: 'inline-block' 
            }} />
            AI-POWERED · REAL-TIME CYBER THREAT RADAR
          </div>

          {/* Main Title */}
          <h1 style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 64, 
            fontWeight: 800, 
            lineHeight: 1.05, 
            letterSpacing: -2, 
            marginBottom: 24,
            maxWidth: 800
          }}>
            Detect{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #22d3ee)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              fontWeight: 800
            }} className="glow-text-blue">
              Fake Jobs
            </span>
            <br />Before They Scam You.
          </h1>

          {/* Subtitle */}
          <p style={{ 
            fontSize: 18, 
            color: 'var(--text2)', 
            lineHeight: 1.7, 
            maxWidth: 580, 
            marginBottom: 40,
            fontWeight: 400
          }}>
            HireShield AI uses state-of-the-art NLP models, deep screenshot OCR, and company anomaly tracking to protect job seekers from sophisticated phishing and recruitment scams.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14 }}>
            <button 
              onClick={() => router.push('/auth/register')} 
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                border: 'none', 
                color: '#fff', 
                padding: '16px 32px', 
                borderRadius: 12, 
                cursor: 'pointer', 
                fontSize: 15, 
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.5)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.35)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <ShieldCheck size={18} /> Start Scanning Free
            </button>

            <button 
              onClick={() => router.push('/dashboard')} 
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                color: 'var(--text)', 
                padding: '16px 32px', 
                borderRadius: 12, 
                cursor: 'pointer', 
                fontSize: 15,
                fontWeight: 500,
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              View Live Demo <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 20, 
          marginTop: 64, 
          paddingTop: 40, 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)' 
        }}>
          {stats.map((s, idx) => {
            const Icon = s.icon
            return (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  padding: '20px 24px',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${s.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.color
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ 
                    fontFamily: 'var(--font-syne)', 
                    fontSize: 26, 
                    fontWeight: 800, 
                    color: s.color,
                    letterSpacing: -0.5
                  }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>{s.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Feature Grid Section */}
      <div style={{ 
        padding: '20px 48px 100px', 
        maxWidth: 1150, 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>
            Enterprise-Grade Protection for Job Seekers
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', marginTop: 8 }}>
            Multiple analytical shields run automatically to ensure your job hunting remains highly secure.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 20 
        }}>
          {features.map((feat, idx) => {
            const IconComp = feat.icon
            return (
              <motion.div 
                key={feat.title} 
                whileHover={{ y: -4 }} 
                onClick={() => router.push('/dashboard')}
                className="cyber-card"
                style={{ 
                  padding: 28, 
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 3,
                  background: `linear-gradient(90deg, ${feat.color}, transparent)`
                }} />

                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 12, 
                  background: feat.bg, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: feat.color,
                  marginBottom: 20 
                }}>
                  <IconComp size={22} />
                </div>
                
                <h3 style={{ 
                  fontFamily: 'var(--font-syne)', 
                  fontSize: 16, 
                  fontWeight: 700, 
                  marginBottom: 10,
                  color: 'var(--text)'
                }}>
                  {feat.title}
                </h3>
                
                <p style={{ 
                  fontSize: 13, 
                  color: 'var(--text2)', 
                  lineHeight: 1.6,
                  fontWeight: 400
                }}>
                  {feat.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
