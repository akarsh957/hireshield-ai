'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  Search, 
  Calendar, 
  AlertOctagon, 
  ShieldCheck, 
  Sliders, 
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react'

export default function CompanyPage() {
  const [query, setQuery] = useState('EasyMoney Corp')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>({
    company_name: 'EasyMoney Corp', 
    domain: 'easymoney.co', 
    trust_score: 8, 
    domain_age_days: 23,
    salary_anomaly: true, 
    report_count: 32, 
    verdict: 'fraudulent',
    flags: [
      'Unrealistic Salary: Claims $8,000-$12,000/week for data entry — 40x industry average', 
      'No Physical Address: No verifiable office location or registration number', 
      'Suspicious Domain: Domain registered 23 days ago on shared hosting'
    ],
    ai_summary: 'This company exhibits multiple indicators of an advance-fee recruitment scam. The salary promises are statistically impossible. We strongly advise against sharing personal details or making any payments.'
  })

  const search = async () => {
    if(!query.trim()) return
    setLoading(true)
    try {
      const token = localStorage.getItem('hs_token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analysis/company`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company_name: query })
      })
      const data = await res.json()
      setResult(data)
    } catch { 
      // Keep static mock as fallback
    } finally {
      setLoading(false)
    }
  }

  const c = result?.verdict === 'fraudulent' ? '#ef4444' : result?.verdict === 'suspicious' ? '#f59e0b' : '#10b981'

  return (
    <div>
      {/* Search Input Widget */}
      <div 
        className="cyber-card" 
        style={{ 
          marginBottom: 20, 
          padding: 20, 
          display: 'flex', 
          gap: 12, 
          alignItems: 'flex-end',
          position: 'relative'
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            fontSize: 12, 
            color: 'var(--text2)', 
            marginBottom: 8,
            fontWeight: 500
          }}>
            <Building2 size={13} /> Audit Entity / Corporate Search
          </label>
          <div style={{ position: 'relative' }}>
            <input 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && search()} 
              placeholder="e.g. Amazon, EasyMoney Corp, quickhire.xyz..." 
              className="glass-input"
              style={{ width: '100%', paddingLeft: 40 }}
            />
            <Search 
              size={15} 
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: 14, 
                transform: 'translateY(-50%)', 
                color: 'var(--text3)' 
              }} 
            />
          </div>
        </div>
        <button 
          onClick={search} 
          disabled={loading} 
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            border: 'none', 
            color: '#fff', 
            padding: '12px 24px', 
            borderRadius: 8, 
            fontSize: 13, 
            fontWeight: 600, 
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          onMouseOver={e => {
            if(!loading) e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.35)'
          }}
          onMouseOut={e => {
            if(!loading) e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)'
          }}
        >
          {loading ? 'Analyzing...' : 'Audit Database'}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}
          >
            {/* Left Result Details */}
            <div 
              className="cyber-card"
              style={{ 
                background: `${c}03`, 
                border: `1px solid ${c}15`, 
                padding: 24,
                boxShadow: `0 4px 30px ${c}03`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ 
                    fontFamily: 'var(--font-syne)', 
                    fontSize: 24, 
                    fontWeight: 800,
                    color: 'var(--text)',
                    letterSpacing: -0.5
                  }}>
                    {result.company_name}
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: 'var(--text3)', 
                    marginTop: 4,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500
                  }}>
                    DOMAIN: <span style={{ color: 'var(--text2)' }}>{result.domain}</span> · AGE: <span style={{ color: 'var(--text2)' }}>{result.domain_age_days} days</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontFamily: 'var(--font-syne)', 
                    fontSize: 48, 
                    fontWeight: 800, 
                    color: c,
                    letterSpacing: -1,
                    lineHeight: 1
                  }}>
                    {result.trust_score}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 600, marginTop: 4 }}>
                    TRUST RATING / 100
                  </div>
                </div>
              </div>

              {/* Grid Compartments */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'SALARY VECTOR', value: result.salary_anomaly ? 'ANOMALY DETECTED' : 'NORMAL RANGE', color: result.salary_anomaly ? '#ef4444' : '#10b981' },
                  { label: 'DOMAIN METRIC', value: `${result.domain_age_days} days registered`, color: result.domain_age_days < 30 ? '#ef4444' : '#f59e0b' },
                  { label: 'SCAM FREQUENCY', value: `${result.report_count} active reports`, color: result.report_count > 20 ? '#ef4444' : '#f59e0b' },
                  { label: 'THREAT VERDICT', value: result.verdict?.toUpperCase(), color: c }
                ].map(item => (
                  <div 
                    key={item.label} 
                    style={{ 
                      background: 'rgba(3, 5, 16, 0.4)', 
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      borderRadius: 10, 
                      padding: 14
                    }}
                  >
                    <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 4, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Flags parsed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>VERIFIED FLAGS LOGGED:</div>
                {result.flags?.map((flag: string, i: number) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      gap: 10, 
                      padding: '12px 14px', 
                      background: 'rgba(3, 5, 16, 0.25)', 
                      border: '1px solid rgba(255, 255, 255, 0.02)',
                      borderRadius: 10, 
                      fontSize: 12, 
                      lineHeight: 1.5,
                      color: 'var(--text2)'
                    }}
                  >
                    <span style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      background: i === 0 ? '#ef4444' : i === 1 ? '#ef4444' : '#f59e0b', 
                      boxShadow: `0 0 6px ${i === 0 ? '#ef4444' : i === 1 ? '#ef4444' : '#f59e0b'}`,
                      marginTop: 6, 
                      flexShrink: 0 
                    }} />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Breakdown metrics */}
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
                  <Sliders size={14} style={{ color: '#3b82f6' }} />
                  <span>Trust Score Breakdown</span>
                </div>

                {[
                  { label: 'Domain Validity', score: 4, total: 10 },
                  { label: 'Salary Realism', score: 2, total: 10 },
                  { label: 'Verification Info', score: 3, total: 10 },
                  { label: 'Review Integrity', score: 1, total: 10 },
                  { label: 'LLM Sentiment', score: 2, total: 10 },
                  { label: 'Job Clarity Log', score: 3, total: 10 }
                ].map(item => {
                  const percent = (item.score / item.total) * 100
                  const color = item.score < 4 ? '#ef4444' : '#f59e0b'
                  return (
                    <div key={item.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{item.label}</span>
                        <span style={{ color: color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{item.score}/{item.total}</span>
                      </div>
                      <div style={{ background: 'rgba(3, 5, 16, 0.8)', borderRadius: 4, height: 5 }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${percent}%`, 
                          background: color, 
                          borderRadius: 4 
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* AI Summary Card */}
              <div className="cyber-card" style={{ padding: 20 }}>
                <div style={{ 
                  fontFamily: 'var(--font-syne)', 
                  fontSize: 13, 
                  fontWeight: 800, 
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--text)'
                }}>
                  <FileText size={14} style={{ color: '#8b5cf6' }} />
                  <span>Sentinel Security Summary</span>
                </div>
                
                <span style={{ 
                  background: `${c}12`, 
                  color: c, 
                  border: `1px solid ${c}25`, 
                  padding: '3px 10px', 
                  borderRadius: 20, 
                  fontSize: 10, 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 600,
                  display: 'inline-flex', 
                  alignItems: 'center',
                  gap: 4,
                  marginBottom: 12 
                }}>
                  <AlertOctagon size={11} /> {result.verdict?.toUpperCase()} — {result.trust_score < 30 ? 'CRITICAL RISK' : 'EVALUATION REQ'}
                </span>
                
                <p style={{ 
                  fontSize: 12, 
                  color: 'var(--text2)', 
                  lineHeight: 1.6,
                  fontWeight: 400
                }}>
                  {result.ai_summary}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
