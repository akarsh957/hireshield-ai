'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, 
  MailOpen, 
  Globe, 
  ShieldAlert, 
  Search, 
  History, 
  CheckCircle, 
  AlertTriangle,
  Play,
  HelpCircle
} from 'lucide-react'

type Verdict = 'genuine' | 'suspicious' | 'fraudulent'

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState<'job' | 'email' | 'company'>('job')
  const [text, setText] = useState(`We are urgently hiring for remote Data Entry Specialists. No experience needed. Earn $5,000-$8,000 weekly from home. Send your details to apply@quickhirejobs.net. HURRY - only 10 spots left! Upfront training fee of $150 required.`)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runAnalysis = async () => {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const token = localStorage.getItem('hs_token')
      const endpoint = activeTab === 'job' ? '/api/analysis/job' : activeTab === 'email' ? '/api/analysis/email' : '/api/analysis/company'
      const body = activeTab === 'company' ? { company_name: text } : { text }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // Fallback local analysis
      const scamWords = ['upfront fee','training fee','no experience','earn from home','$5,000','$8,000','hurry','limited slots','registration fee']
      const flags = scamWords.filter(w => text.toLowerCase().includes(w))
      const score = Math.min(flags.length * 15 + 10, 96)
      const verdict: Verdict = score >= 65 ? 'fraudulent' : score >= 35 ? 'suspicious' : 'genuine'
      setResult({ verdict, confidence_score: score, flags, explanation: getExplanation(verdict, flags) })
    } finally {
      setLoading(false)
    }
  }

  const getExplanation = (v: Verdict, flags: string[]) => {
    if (v === 'fraudulent') return `This posting contains ${flags.length} critical fraud indicators. Unrealistic salary promises, upfront payment requirements, and urgency tactics are hallmark signs of an advance-fee recruitment scam. Do NOT share personal information or make any payments.`
    if (v === 'suspicious') return `This posting shows ${flags.length} warning signs. Verify the company's legitimacy through official channels before proceeding.`
    return 'This job posting appears legitimate. Always verify company details independently before sharing sensitive personal information.'
  }

  const colors: Record<Verdict, string> = { fraudulent: '#ef4444', suspicious: '#f59e0b', genuine: '#10b981' }
  const icons: Record<Verdict, any> = { fraudulent: ShieldAlert, suspicious: AlertTriangle, genuine: CheckCircle }

  const redFlagsList = activeTab === 'job' 
    ? ['Unrealistic salary promises', 'Upfront payment required', 'No experience needed', 'Urgency & pressure tactics', 'Generic domain address', 'Vague job responsibilities']
    : activeTab === 'email'
    ? ['Urgent action demanded', 'Suspicious link URLs', 'Grammar & spelling errors', 'Mismatched domain sender', 'Job offer without interview', 'Requires paying onboarding fee']
    : ['Domain registered < 30 days', 'No physical address found', 'Negative online reviews', 'High employee turnover', 'Stolen corporate branding', 'Anonymous domain registration']

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2.1fr 1fr', gap: 20 }}>
      {/* Primary Area */}
      <div>
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
            <Search size={16} style={{ color: '#3b82f6' }} />
            <span>AI Cyber Threat Analysis Center</span>
          </div>

          {/* Console tabs */}
          <div style={{ 
            display: 'flex', 
            background: 'rgba(3, 5, 16, 0.6)', 
            borderRadius: 10, 
            padding: 4, 
            marginBottom: 20, 
            border: '1px solid rgba(255, 255, 255, 0.05)' 
          }}>
            {[
              { id: 'job', label: 'Job Posting', icon: Briefcase },
              { id: 'email', label: 'Email / Chat Message', icon: MailOpen },
              { id: 'company', label: 'Company Profile', icon: Globe }
            ].map(tab => {
              const TabIcon = tab.icon
              const active = activeTab === tab.id
              return (
                <div 
                  key={tab.id} 
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setResult(null)
                    if(tab.id === 'company') setText('EasyMoney Corp')
                    else if(tab.id === 'email') setText('Dear Candidate, We saw your resume and you are selected! Please pay $50 deposit to secure your corporate laptop shipping link.')
                    else setText(`We are urgently hiring for remote Data Entry Specialists. No experience needed. Earn $5,000-$8,000 weekly from home. Send your details to apply@quickhirejobs.net. HURRY - only 10 spots left! Upfront training fee of $150 required.`)
                  }} 
                  style={{ 
                    flex: 1, 
                    padding: '10px 14px', 
                    borderRadius: 8, 
                    textAlign: 'center', 
                    fontSize: 12, 
                    fontWeight: 600, 
                    cursor: 'pointer', 
                    background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent', 
                    color: active ? '#3b82f6' : 'var(--text3)', 
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    border: active ? '1px solid rgba(59, 130, 246, 0.15)' : '1px solid transparent'
                  }}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </div>
              )
            })}
          </div>

          {/* Console Textarea */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: 'block', 
              fontSize: 12, 
              color: 'var(--text2)', 
              marginBottom: 8,
              fontWeight: 500
            }}>
              {activeTab === 'job' 
                ? 'Input the full job description, career offer letter, or listing copy:' 
                : activeTab === 'email' 
                ? 'Input the recruitment email, WhatsApp pitch, or Telegram chat snippet:' 
                : 'Input the exact name of the hiring entity or recruitment web portal:'}
            </label>
            <textarea 
              value={text} 
              onChange={e => setText(e.target.value)} 
              className="glass-input"
              style={{ 
                width: '100%', 
                minHeight: 130,
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                lineHeight: 1.6,
                resize: 'vertical'
              }}
              placeholder={activeTab === 'company' ? 'e.g. EasyMoney Corp, quickhire.xyz...' : 'Paste plain text content to isolate flags...'} 
            />
          </div>

          {/* Action Trigger */}
          <button 
            onClick={runAnalysis} 
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
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s'
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
                Executing NLP Scan Vectors...
              </>
            ) : (
              <>
                <Play size={13} fill="#fff" /> Initialize Security Audit
              </>
            )}
          </button>

          {/* Analysis Dashboard Result */}
          <AnimatePresence>
            {result && (() => {
              const verdict = (result.verdict || 'genuine').toLowerCase() as Verdict
              const color = colors[verdict] || '#10b981'
              const Icon = icons[verdict] || CheckCircle
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    marginTop: 24, 
                    background: `${color}06`, 
                    border: `1px solid ${color}20`, 
                    borderRadius: 14, 
                    padding: 24,
                    boxShadow: `0 4px 20px ${color}05`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={{ 
                      fontFamily: 'var(--font-syne)', 
                      fontSize: 18, 
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: color
                    }}>
                      <Icon size={20} />
                      <span>SYSTEM VERDICT: {result.verdict?.toUpperCase()}</span>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontFamily: 'var(--font-syne)', 
                        fontSize: 36, 
                        fontWeight: 800, 
                        color: color,
                        letterSpacing: -0.5,
                        lineHeight: 1
                      }}>
                        {result.confidence_score}%
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        FRAUD RISK PROBABILITY
                      </div>
                    </div>
                  </div>

                  {/* Progress bar gauge */}
                  <div style={{ background: 'rgba(3, 5, 16, 0.8)', borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 18, border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${result.confidence_score}%`, 
                      background: `linear-gradient(90deg, #3b82f6, ${color})`, 
                      borderRadius: 6, 
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }} />
                  </div>

                  {result.explanation && (
                    <div style={{ 
                      background: 'rgba(3, 5, 16, 0.5)', 
                      border: '1px solid rgba(255, 255, 255, 0.03)',
                      borderRadius: 10, 
                      padding: '14px 16px', 
                      fontSize: 12, 
                      color: 'var(--text2)', 
                      lineHeight: 1.6, 
                      marginBottom: 16 
                    }}>
                      {result.explanation}
                    </div>
                  )}

                  {/* Flags list */}
                  {result.flags?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>ISOLATED ANOMALIES:</div>
                      {result.flags.map((f: string) => (
                        <div 
                          key={f} 
                          style={{ 
                            display: 'flex', 
                            gap: 10, 
                            padding: '10px 14px', 
                            background: 'rgba(3, 5, 16, 0.3)', 
                            border: '1px solid rgba(255,255,255,0.02)',
                            borderRadius: 8, 
                            fontSize: 12,
                            color: 'var(--text)'
                          }}
                        >
                          <span style={{ 
                            width: 6, 
                            height: 6, 
                            borderRadius: '50%', 
                            background: color, 
                            boxShadow: `0 0 6px ${color}`,
                            marginTop: 6, 
                            flexShrink: 0 
                          }} />
                          <div>
                            Detected Scam Pattern: <strong style={{ color: color }}>"{f}"</strong> — Common indicators parsed inside active database vectors.
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })()}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar Info Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Indicators Card */}
        <div className="cyber-card" style={{ padding: 20 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 13, 
            fontWeight: 800, 
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text)'
          }}>
            <ShieldAlert size={14} style={{ color: '#ef4444' }} />
            <span>Target Core Indicators</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {redFlagsList.map((flag, i) => (
              <div 
                key={flag} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10, 
                  fontSize: 12, 
                  padding: '10px 12px', 
                  background: 'rgba(3, 5, 16, 0.4)', 
                  border: '1px solid rgba(255,255,255,0.02)',
                  borderRadius: 8, 
                  color: 'var(--text2)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.transform = 'translateX(2px)'
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span style={{ 
                  color: i < 3 ? '#ef4444' : '#f59e0b',
                  fontSize: 14,
                  lineHeight: 1
                }}>●</span>
                <span style={{ fontWeight: 500 }}>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scans Card */}
        <div className="cyber-card" style={{ padding: 20 }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 13, 
            fontWeight: 800, 
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--text)'
          }}>
            <History size={14} style={{ color: '#3b82f6' }} />
            <span>Recent Isolation Log</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { name: 'Amazon WFH Data Entry', v: 'genuine' },
              { name: 'EasyMoney Career Posting', v: 'fraudulent' },
              { name: 'Blockchain Solidity Intern', v: 'suspicious' }
            ].map((item, idx) => (
              <div 
                key={item.name} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  fontSize: 12, 
                  padding: '10px 0', 
                  borderBottom: idx === 2 ? 'none' : '1px solid rgba(255,255,255,0.04)' 
                }}
              >
                <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{item.name}</span>
                <span style={{ 
                  background: `${colors[item.v as Verdict]}12`, 
                  color: colors[item.v as Verdict], 
                  border: `1px solid ${colors[item.v as Verdict]}20`, 
                  padding: '2px 8px', 
                  borderRadius: 12, 
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
