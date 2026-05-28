'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  Plus, 
  CheckCircle, 
  Eye,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react'

const INITIAL_REPORTS = [
  { company: 'QuickHire Solutions', website: 'quickhire.xyz', type: 'Advance Fee Fraud', count: 47, status: 'Confirmed', date: 'May 14' },
  { company: 'EasyMoney Corp', website: 'easymoney.co', type: 'WFH Scam', count: 32, status: 'Confirmed', date: 'May 12' },
  { company: 'TechGlobal Inc', website: 'techglobal-hire.net', type: 'Fake IT Company', count: 18, status: 'Under Review', date: 'May 10' },
  { company: 'CryptoJobs Hub', website: 'cryptojobshub.io', type: 'Phishing', count: 12, status: 'Under Review', date: 'May 8' },
  { company: 'GlobalIT Staffing', website: 'globalit-staffing.com', type: 'Identity Theft', count: 6, status: 'Pending', date: 'May 6' },
]

export default function ReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ company_name: '', scam_type: 'Fake Job Posting', description: '' })

  const statusColor = (s: string) => {
    if (s === 'Confirmed') return '#ef4444'
    if (s === 'Under Review') return '#f59e0b'
    return '#3b82f6'
  }

  const submitReport = async () => {
    try {
      const token = localStorage.getItem('hs_token')
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      })
    } catch { 
      // Fallback offline behavior
    }
    setReports(prev => [{ 
      company: form.company_name, 
      website: 'user-report.com', 
      type: form.scam_type, 
      count: 1, 
      status: 'Pending', 
      date: 'Today' 
    }, ...prev])
    setShowForm(false)
    setForm({ company_name: '', scam_type: 'Fake Job Posting', description: '' })
  }

  return (
    <div>
      {/* Top action header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
          Global threat ledger containing community-reported job scams and malicious hiring entities
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            border: 'none', 
            color: '#fff', 
            padding: '10px 18px', 
            borderRadius: 8, 
            fontSize: 12, 
            fontWeight: 600, 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.35)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Plus size={14} /> File Threat Report
        </button>
      </div>

      {/* Expanded submission form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -15, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -15, height: 0 }}
            className="cyber-card"
            style={{ marginBottom: 20, padding: 24, overflow: 'hidden' }}
          >
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
              <ShieldAlert size={16} style={{ color: '#ef4444' }} />
              <span>Report Suspicious Corporate Scam Activity</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>
                  Target Company Name
                </label>
                <input 
                  value={form.company_name} 
                  onChange={e => setForm({ ...form, company_name: e.target.value })} 
                  placeholder="e.g. QuickHire Solutions" 
                  className="glass-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>
                  Observed Threat Vector
                </label>
                <select 
                  value={form.scam_type} 
                  onChange={e => setForm({ ...form, scam_type: e.target.value })} 
                  className="glass-input"
                  style={{ 
                    width: '100%', 
                    cursor: 'pointer',
                    background: 'rgba(3, 5, 16, 0.85) url("data:image/svg+xml;utf8,<svg fill=\'%238899bb\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 12px center'
                  }}
                >
                  {['Fake Job Posting', 'Advance Onboarding Fee', 'Phishing Interview Link', 'Identity Theft Attempt'].map(t => (
                    <option key={t} style={{ background: '#0a1124', color: '#fff' }}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>
                Incident Chronology / Red Flags Observed
              </label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                placeholder="Details of the scam, including emails, links, and financial requests..." 
                className="glass-input"
                style={{ width: '100%', minHeight: 80, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={submitReport} 
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
                Log Incident
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.06)', 
                  color: 'var(--text2)', 
                  padding: '10px 20px', 
                  borderRadius: 8, 
                  fontSize: 12, 
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Dismiss Form
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community threat list datatable */}
      <div className="cyber-card" style={{ padding: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['COMPANY/URL', 'THREAT VECTOR', 'LOGGED FREQ', 'AUDIT STATUS', 'DATE REPORTED', 'INCIDENT DATA'].map(h => (
                  <th 
                    key={h} 
                    style={{ 
                      textAlign: 'left', 
                      padding: '12px 16px', 
                      fontSize: 10, 
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
              {reports.map((r, idx) => {
                const color = statusColor(r.status)
                return (
                  <tr 
                    key={r.company}
                    style={{ 
                      borderBottom: idx === reports.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{r.company}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{r.website}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text2)', fontWeight: 500 }}>
                      {r.type}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        background: 'rgba(239, 68, 68, 0.04)', 
                        color: '#ef4444', 
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        padding: '4px 10px', 
                        borderRadius: 20, 
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600
                      }}>
                        {r.count} reports
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        background: `${color}12`, 
                        color: color, 
                        border: `1px solid ${color}20`, 
                        padding: '4px 10px', 
                        borderRadius: 20, 
                        fontSize: 10, 
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: 0.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text3)', fontSize: 12 }}>
                      {r.date}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.03)', 
                          border: '1px solid rgba(255, 255, 255, 0.05)', 
                          color: 'var(--text2)', 
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
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'
                          e.currentTarget.style.color = '#3b82f6'
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                          e.currentTarget.style.color = 'var(--text2)'
                        }}
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
