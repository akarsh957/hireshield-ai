'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Server, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Cpu,
  Trash2
} from 'lucide-react'

const INITIAL_USERS = [
  { name: 'Alex Johnson', email: 'demo@hireshield.ai', role: 'Premium Seeker', scans: 34 },
  { name: 'Sarah Patel', email: 'sarah.patel@gmail.com', role: 'Standard Seeker', scans: 12 },
  { name: 'Rohan Sharma', email: 'rohan.sharma@yahoo.co.in', role: 'Standard Seeker', scans: 8 },
  { name: 'Jessica Vance', email: 'jess.vance@techcorp.com', role: 'Enterprise Administrator', scans: 142 },
]

export default function AdminPage() {
  const [users, setUsers] = useState(INITIAL_USERS)

  const revoke = (email: string) => {
    setUsers(prev => prev.filter(u => u.email !== email))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top HUD metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {[
          { label: 'REGISTERED SEEKERS', value: '4,847', change: '+12% this week', color: '#3b82f6', icon: Users },
          { label: 'ISOLATION AUDITS', value: '18,241', change: '+24% this week', color: '#8b5cf6', icon: Layers },
          { label: 'CONFIRMED REPORTS', value: '942', change: '+4.2% this week', color: '#ef4444', icon: AlertTriangle },
          { label: 'SYSTEM SECURITY LOAD', value: '14.8%', change: 'All nodes healthy', color: '#10b981', icon: Cpu }
        ].map((s, idx) => {
          const Icon = s.icon
          return (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="cyber-card"
              style={{ padding: '20px 18px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 3,
                background: s.color
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: 1, fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: s.color }}><Icon size={14} /></span>
              </div>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: -0.5, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 500 }}>
                {s.change}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Panel Content split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* User control ledger */}
        <div className="cyber-card" style={{ padding: 24 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 14, 
            fontWeight: 800, 
            marginBottom: 16,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Users size={16} style={{ color: '#3b82f6' }} />
            <span>Seeker User Directories</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['USER PROFILE', 'ACCESS LEVEL', 'AUDITS ISSUED', 'REVOKE ACTIONS'].map(h => (
                    <th 
                      key={h} 
                      style={{ 
                        textAlign: 'left', 
                        padding: '12px 14px', 
                        fontSize: 9, 
                        color: 'var(--text3)', 
                        fontFamily: 'var(--font-mono)', 
                        letterSpacing: 1, 
                        fontWeight: 600 
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr 
                    key={u.email}
                    style={{ 
                      borderBottom: idx === users.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ 
                        background: u.role.includes('Premium') ? 'rgba(59, 130, 246, 0.08)' : u.role.includes('Enterprise') ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.02)', 
                        color: u.role.includes('Premium') ? '#60a5fa' : u.role.includes('Enterprise') ? '#a78bfa' : 'var(--text2)', 
                        border: '1px solid rgba(255,255,255,0.03)',
                        padding: '4px 10px', 
                        borderRadius: 20, 
                        fontSize: 10, 
                        fontWeight: 600 
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text2)' }}>
                      {u.scans} scans
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button 
                        onClick={() => revoke(u.email)}
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.03)', 
                          border: '1px solid rgba(239, 68, 68, 0.1)', 
                          color: '#ef4444', 
                          padding: '6px 12px', 
                          borderRadius: 8, 
                          fontSize: 11, 
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.03)'
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)'
                        }}
                      >
                        <Trash2 size={11} /> Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Health status node check */}
        <div className="cyber-card" style={{ padding: 20 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 13, 
            fontWeight: 800, 
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text)'
          }}>
            <Server size={14} style={{ color: '#10b981' }} />
            <span>Node Core Services Status</span>
          </div>

          {[
            { name: 'Frontend Next Server', endpoint: 'Port 3000', status: 'ACTIVE', color: '#10b981' },
            { name: 'Backend Gateway API', endpoint: 'Port 4000', status: 'ACTIVE', color: '#10b981' },
            { name: 'FastAPI NLP Engine', endpoint: 'Port 8000', status: 'ACTIVE', color: '#10b981' },
            { name: 'PostgreSQL Database Connection', endpoint: 'Port 5432', status: 'ACTIVE', color: '#10b981' }
          ].map(node => (
            <div 
              key={node.name} 
              style={{ 
                background: 'rgba(3, 5, 16, 0.4)', 
                border: '1px solid rgba(255, 255, 255, 0.03)',
                borderRadius: 10, 
                padding: '12px 14px', 
                marginBottom: 10 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>{node.name}</span>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.08)', 
                  color: node.color, 
                  border: '1px solid rgba(16, 185, 129, 0.2)', 
                  padding: '2px 8px', 
                  borderRadius: 20, 
                  fontSize: 9, 
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: node.color, display: 'inline-block', animation: 'cyber-pulse 1s infinite alternate' }} />
                  {node.status}
                </span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                GATEWAY CLUSTER ROUTE · {node.endpoint}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
