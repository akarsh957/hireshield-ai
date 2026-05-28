'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle,
  EyeOff,
  UserCheck,
  Lock
} from 'lucide-react'

const ISSUES = [
  { level: 'critical', text: 'Aadhaar Number detected — Remove or mask before sharing (Line 4)' },
  { level: 'critical', text: 'Personal mobile number exposed — Use a secondary contact number' },
  { level: 'critical', text: 'Full home address included — Use city and state only' },
  { level: 'warning', text: 'Date of birth visible — Consider removing for privacy' },
  { level: 'warning', text: 'GitHub profile with private repos — Verify public visibility settings' },
  { level: 'warning', text: 'Personal email on public resume — Use a professional alias' },
]

export default function ResumePage() {
  const [scanned, setScanned] = useState(false)
  const [loading, setLoading] = useState(false)

  const scan = () => {
    setLoading(true)
    setScanned(false)
    setTimeout(() => { 
      setLoading(false)
      setScanned(true) 
    }, 1500)
  }

  const critical = ISSUES.filter(i => i.level === 'critical')
  const warnings = ISSUES.filter(i => i.level === 'warning')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Upload area */}
      <div className="cyber-card" style={{ padding: 24 }}>
        <div style={{ 
          fontFamily: 'var(--font-syne)', 
          fontSize: 15, 
          fontWeight: 800, 
          marginBottom: 20, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          color: 'var(--text)'
        }}>
          <FileText size={16} style={{ color: '#3b82f6' }} />
          <span>Resume Privacy Scanner</span>
        </div>

        {/* Drop zone */}
        <div 
          onClick={scan} 
          style={{ 
            border: '2px dashed rgba(59, 130, 246, 0.25)', 
            borderRadius: 14, 
            padding: '48px 20px', 
            textAlign: 'center', 
            cursor: 'pointer', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'rgba(3, 5, 16, 0.4)',
            boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.3)',
            position: 'relative'
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#10b981'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.1), inset 0 4px 15px rgba(0,0,0,0.3)'
            e.currentTarget.style.transform = 'scale(1.002)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)'
            e.currentTarget.style.boxShadow = 'inset 0 4px 15px rgba(0,0,0,0.3)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <div style={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.08)', 
            color: '#10b981', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 16 
          }}>
            <Upload size={22} />
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Upload resume for privacy audit
          </div>
          
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            PDF, DOCX, TXT · STRICT PRIVACY ISOLATION
          </div>

          <button 
            style={{ 
              marginTop: 20, 
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.06)', 
              color: 'var(--text2)', 
              padding: '8px 18px', 
              borderRadius: 8, 
              fontSize: 12, 
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
            }}
          >
            Select Document
          </button>
        </div>

        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0 }}
              style={{ 
                marginTop: 16, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                fontSize: 12, 
                color: 'var(--text2)',
                fontWeight: 500 
              }}
            >
              <span style={{ 
                width: 14, 
                height: 14, 
                border: '2px solid rgba(16, 185, 129, 0.3)', 
                borderTopColor: '#10b981', 
                borderRadius: '50%', 
                display: 'inline-block', 
                animation: 'spin .8s linear infinite' 
              }} />
              Parsing document structure for sensitive data...
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: 20, background: 'rgba(3, 5, 16, 0.4)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            PRIVACY AUDITING ALGORITHMS MATCH:
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, fontWeight: 400 }}>
            National Identifiers (Aadhaar/SSN) · Contact Coordinates · Account Numbers · Exact Geolocation Address · Personal Dates
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="cyber-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
        {!scanned ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text3)', margin: 'auto' }}>
            <div style={{ 
              width: 50, 
              height: 50, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.02)', 
              color: 'var(--text3)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: 16 
            }}>
              <Lock size={20} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              Awaiting resume upload sequence to present privacy log...
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div style={{ 
              fontFamily: 'var(--font-syne)', 
              fontSize: 13, 
              fontWeight: 800, 
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--text)'
            }}>
              <EyeOff size={14} style={{ color: '#ef4444' }} />
              <span>Isolated Privacy Violations</span>
            </div>

            {/* Metrics count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.04)', 
                border: '1px solid rgba(239, 68, 68, 0.15)', 
                borderRadius: 10, 
                padding: '12px 8px', 
                textAlign: 'center' 
              }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: 24, fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>
                  {critical.length}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: 4 }}>
                  CRITICAL ISSUES
                </div>
              </div>
              <div style={{ 
                background: 'rgba(245, 158, 11, 0.04)', 
                border: '1px solid rgba(245, 158, 11, 0.15)', 
                borderRadius: 10, 
                padding: '12px 8px', 
                textAlign: 'center' 
              }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontSize: 24, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>
                  {warnings.length}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: 4 }}>
                  PRIVACY WARNINGS
                </div>
              </div>
            </div>

            {/* Findings list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1, maxHeight: 220 }}>
              {ISSUES.map((issue, i) => {
                const color = issue.level === 'critical' ? '#ef4444' : '#f59e0b'
                const Icon = issue.level === 'critical' ? ShieldAlert : AlertTriangle
                return (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      gap: 12, 
                      padding: '12px 14px', 
                      background: 'rgba(3, 5, 16, 0.35)', 
                      border: '1px solid rgba(255,255,255,0.02)',
                      borderRadius: 10, 
                      fontSize: 12, 
                      lineHeight: 1.5,
                      color: 'var(--text2)',
                      alignItems: 'center'
                    }}
                  >
                    <Icon size={14} style={{ color: color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 500 }}>{issue.text}</span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
