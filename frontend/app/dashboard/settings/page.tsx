'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Settings, 
  User, 
  Key, 
  Bell, 
  Zap, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Database,
  Lock
} from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  
  const save = () => { 
    setSaved(true)
    setTimeout(() => setSaved(false), 2500) 
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const apiKeys = [
    { label: 'Claude API Key', value: 'sk-ant-api03-claudethreatanalysiskey7781', key: 'claude' },
    { label: 'HuggingFace Token', value: 'hf_classifiernlpmodelweights84210', key: 'hf' },
    { label: 'Database URL', value: 'postgresql://hireshield:pass123@localhost:5432/radar', key: 'db' },
    { label: 'Redis URL', value: 'redis://default:redissecureradar@127.0.0.1:6379', key: 'redis' }
  ]

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    scans: true,
    weekly: true,
    community: false,
    patterns: true
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
      {/* Left Settings Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Account Info */}
        <div className="cyber-card" style={{ padding: 24 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 14, 
            fontWeight: 800, 
            marginBottom: 20,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <User size={16} style={{ color: '#3b82f6' }} />
            <span>Profile Credentials</span>
          </div>

          <AnimatePresence>
            {saved && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ 
                  background: 'rgba(16, 185, 129, 0.08)', 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  borderRadius: 8, 
                  padding: '10px 14px', 
                  fontSize: 12, 
                  color: '#10b981', 
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <CheckCircle size={15} />
                <span>Security configurations successfully synced to backend database ledger.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[['Full Name', 'text', 'Alex Johnson'], ['Email Address', 'email', 'demo@hireshield.ai']].map(([l, t, p]) => (
              <div key={l}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>
                  {l}
                </label>
                <input 
                  type={t} 
                  defaultValue={p} 
                  className="glass-input"
                  style={{ width: '100%' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[['Current Password', 'password', '••••••••'], ['New Password', 'password', 'Min 8 characters']].map(([l, t, p]) => (
              <div key={l}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>
                  {l}
                </label>
                <input 
                  type={t} 
                  placeholder={p}
                  className="glass-input"
                  style={{ width: '100%' }}
                />
              </div>
            ))}
          </div>

          <button 
            onClick={save} 
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              border: 'none', 
              color: '#fff', 
              padding: '10px 20px', 
              borderRadius: 8, 
              fontSize: 12, 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(59,130,246,0.2)'
            }}
          >
            Save Profile changes
          </button>
        </div>

        {/* API keys */}
        <div className="cyber-card" style={{ padding: 24 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 14, 
            fontWeight: 800, 
            marginBottom: 20,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Key size={16} style={{ color: '#8b5cf6' }} />
            <span>AI LLM & Database Gateway Integration</span>
          </div>

          {apiKeys.map(key => {
            const visible = showKeys[key.key]
            return (
              <div key={key.label} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>
                  {key.label}
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type={visible ? 'text' : 'password'} 
                    defaultValue={key.value} 
                    className="glass-input"
                    style={{ 
                      flex: 1, 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: 12,
                      color: visible ? 'var(--text)' : 'var(--text3)'
                    }} 
                    disabled 
                  />
                  <button 
                    onClick={() => toggleKeyVisibility(key.key)}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      color: 'var(--text2)', 
                      width: 40,
                      borderRadius: 8, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {visible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )
          })}
          
          <button 
            onClick={save} 
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              border: 'none', 
              color: '#fff', 
              padding: '10px 20px', 
              borderRadius: 8, 
              fontSize: 12, 
              fontWeight: 600, 
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(59,130,246,0.2)'
            }}
          >
            Update Node Tokens
          </button>
        </div>
      </div>

      {/* Right Sidebar Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Toggle list notifications */}
        <div className="cyber-card" style={{ padding: 20 }}>
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
            <Bell size={14} style={{ color: '#f59e0b' }} />
            <span>Alert Routing Controls</span>
          </div>

          {[
            { label: 'Email alerts for high-risk scans', key: 'scans' },
            { label: 'Weekly fraud report digest', key: 'weekly' },
            { label: 'Community report notifications', key: 'community' },
            { label: 'New scam pattern alerts', key: 'patterns' }
          ].map(item => {
            const on = toggles[item.key]
            return (
              <div 
                key={item.label} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  fontSize: 12, 
                  marginBottom: 16 
                }}
              >
                <span style={{ color: 'var(--text2)', fontWeight: 500, maxWidth: '75%', lineHeight: 1.4 }}>{item.label}</span>
                <div 
                  onClick={() => setToggles(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  style={{ 
                    width: 38, 
                    height: 20, 
                    background: on ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(3, 5, 16, 0.8)', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 12, 
                    position: 'relative', 
                    cursor: 'pointer',
                    transition: 'background 0.25s ease',
                    boxShadow: on ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  <motion.div 
                    animate={{ left: on ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ 
                      position: 'absolute', 
                      top: 1, 
                      width: 16, 
                      height: 16, 
                      background: '#fff', 
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }} 
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Pro Upgrading card */}
        <div className="cyber-card" style={{ padding: 20 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 13, 
            fontWeight: 800, 
            marginBottom: 10,
            color: 'var(--text)'
          }}>
            Radar Audit Allocation
          </div>
          
          <span style={{ 
            background: 'rgba(59, 130, 246, 0.08)', 
            color: '#3b82f6', 
            border: '1px solid rgba(59, 130, 246, 0.2)', 
            padding: '3px 10px', 
            borderRadius: 20, 
            fontSize: 10, 
            fontFamily: 'var(--font-mono)', 
            fontWeight: 600,
            display: 'inline-block', 
            marginBottom: 16 
          }}>
            STANDARD SECTOR TIER
          </span>

          {[
            { label: 'Scans Initiated', used: 34, total: 50 },
            { label: 'NLP Engine Calls', used: 156, total: 200 },
            { label: 'Claude Assistant Prompts', used: 28, total: 50 }
          ].map(item => {
            const percent = (item.used / item.total) * 100
            const warning = (item.used / item.total) > 0.8
            return (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ 
                    color: warning ? '#f59e0b' : 'var(--text)', 
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)' 
                  }}>
                    {item.used} / {item.total}
                  </span>
                </div>
                <div style={{ background: 'rgba(3, 5, 16, 0.8)', borderRadius: 4, height: 4, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${percent}%`, 
                    background: warning ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
                    borderRadius: 4 
                  }} />
                </div>
              </div>
            )
          })}
          
          <button 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', 
              border: 'none', 
              color: '#fff', 
              padding: '11px', 
              borderRadius: 8, 
              fontSize: 12, 
              fontWeight: 700, 
              cursor: 'pointer', 
              marginTop: 10,
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 6px 18px rgba(59, 130, 246, 0.45)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'}
          >
            <Zap size={13} fill="#fff" /> Upgrade to Sentinel Pro
          </button>
        </div>
      </div>
    </div>
  )
}
