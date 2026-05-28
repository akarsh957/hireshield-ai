'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react'

const stats = [
  { label: 'TOTAL SCANS', value: '1,284', color: '#3b82f6', change: '↑ 18.3%', icon: Eye, positive: true },
  { label: 'FRAUDULENT DETECTED', value: '347', color: '#ef4444', change: '↑ 24.7%', icon: ShieldAlert, positive: true },
  { label: 'SUSPICIOUS FLAGS', value: '218', color: '#f59e0b', change: '↓ 5.1%', icon: AlertTriangle, positive: false },
  { label: 'ACCURACY RATE', value: '99.2%', color: '#10b981', change: '↑ 0.4%', icon: CheckCircle, positive: true },
]

const recentAlerts = [
  { company: 'TechGlobal Inc', type: 'Software Dev role', verdict: 'Fraudulent', risk: '96%', time: '2m ago' },
  { company: 'EasyMoney Corp', type: 'WFH opportunity', verdict: 'Fraudulent', risk: '94%', time: '18m ago' },
  { company: 'CryptoHR Ltd', type: 'Blockchain job', verdict: 'Suspicious', risk: '72%', time: '1h ago' },
  { company: 'FastHire Solutions', type: 'Sales Manager', verdict: 'Suspicious', risk: '65%', time: '3h ago' },
  { company: 'Infosys Limited', type: 'Data Analyst', verdict: 'Genuine', risk: '8%', time: '4h ago' },
]

export default function DashboardPage() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const donutRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart1: any, chart2: any
    const load = async () => {
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)
      if (chartRef.current) {
        const existing = Chart.getChart(chartRef.current)
        if (existing) existing.destroy()
        chart1 = new Chart(chartRef.current, {
          type: 'line',
          data: {
            labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [
              { 
                label: 'Fraudulent Scans', 
                data: [42,58,71,65,88,102,94,118,135,142,156,168], 
                borderColor: '#ef4444', 
                backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                borderWidth: 2,
                tension: 0.35, 
                fill: true, 
                pointRadius: 2,
                pointHoverRadius: 5
              },
              { 
                label: 'Genuine Scans', 
                data: [180,220,265,240,310,345,330,398,420,445,480,512], 
                borderColor: '#10b981', 
                backgroundColor: 'rgba(16, 185, 129, 0.03)', 
                borderWidth: 2,
                tension: 0.35, 
                fill: true, 
                pointRadius: 2,
                pointHoverRadius: 5
              },
            ]
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
              legend: { 
                position: 'top',
                align: 'end',
                labels: { 
                  color: '#9ca3af', 
                  font: { size: 11, family: 'var(--font-inter)', weight: 'normal' }, 
                  boxWidth: 8,
                  boxHeight: 8,
                  usePointStyle: true,
                  pointStyle: 'circle'
                } 
              } 
            }, 
            scales: { 
              x: { 
                ticks: { color: '#6b7280', font: { size: 10, family: 'var(--font-mono)' } }, 
                grid: { color: 'rgba(255, 255, 255, 0.02)' } 
              }, 
              y: { 
                ticks: { color: '#6b7280', font: { size: 10, family: 'var(--font-mono)' } }, 
                grid: { color: 'rgba(255, 255, 255, 0.02)' } 
              } 
            } 
          }
        })
      }
      if (donutRef.current) {
        const existing = Chart.getChart(donutRef.current)
        if (existing) existing.destroy()
        chart2 = new Chart(donutRef.current, {
          type: 'doughnut',
          data: { 
            labels: ['Genuine', 'Suspicious', 'Fraudulent'], 
            datasets: [{ 
              data: [56.3, 17.7, 26], 
              backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'], 
              borderColor: '#0b0f19', 
              borderWidth: 2,
              hoverOffset: 4
            }] 
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '76%', 
            plugins: { 
              legend: { display: false } 
            } 
          }
        })
      }
    }
    load()
    return () => { chart1?.destroy(); chart2?.destroy() }
  }, [])

  const verdictColor = (v: string) => v === 'Fraudulent' ? '#ef4444' : v === 'Suspicious' ? '#f59e0b' : '#10b981'

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 24 }}>
        {stats.map((s, idx) => {
          const StatIcon = s.icon
          return (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="cyber-card"
              style={{ position: 'relative', overflow: 'hidden', padding: '24px 20px' }}
            >
              {/* Highlight bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 4,
                background: s.color,
                boxShadow: `0 2px 10px ${s.color}60`
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ 
                  fontSize: 10, 
                  color: 'var(--text3)', 
                  fontFamily: 'var(--font-mono)', 
                  letterSpacing: '1px',
                  fontWeight: 600
                }}>
                  {s.label}
                </div>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 8, 
                  background: `${s.color}12`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: s.color
                }}>
                  <StatIcon size={16} />
                </div>
              </div>

              <div style={{ 
                fontFamily: 'var(--font-syne)', 
                fontSize: 32, 
                fontWeight: 800, 
                letterSpacing: -1, 
                color: 'var(--text)',
                marginBottom: 6
              }}>
                {s.value}
              </div>

              <div style={{ 
                fontSize: 11, 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: s.positive ? '#10b981' : '#ef4444' 
              }}>
                {s.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{s.change}</span>
                <span style={{ color: 'var(--text3)', fontWeight: 400 }}>vs last month</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 20, marginBottom: 24 }}>
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
            <Activity size={16} style={{ color: '#3b82f6' }} />
            <span>Fraud Scanning Matrix Timeline</span>
            <span style={{ 
              marginLeft: 'auto', 
              background: 'rgba(16, 185, 129, 0.08)', 
              color: '#10b981', 
              border: '1px solid rgba(16, 185, 129, 0.2)', 
              fontSize: 10, 
              padding: '3px 8px', 
              borderRadius: 20, 
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'cyber-pulse 1.5s infinite alternate' }} />
              LIVE RADAR
            </span>
          </div>
          <div style={{ height: 240 }}>
            <canvas ref={chartRef} />
          </div>
        </div>

        <div className="cyber-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 15, 
            fontWeight: 800, 
            marginBottom: 20,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Layers size={16} style={{ color: '#8b5cf6' }} />
            <span>Threat Ratio</span>
          </div>
          <div style={{ height: 140, position: 'relative', margin: '10px 0 20px' }}>
            <canvas ref={donutRef} />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>FRAUD</div>
              <div style={{ fontSize: 20, fontFamily: 'var(--font-syne)', fontWeight: 800, color: '#ef4444' }}>26%</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
            {[
              { c: '#10b981', l: 'Genuine Scans', p: '56.3%', bg: 'rgba(16, 185, 129, 0.08)' },
              { c: '#f59e0b', l: 'Suspicious Activities', p: '17.7%', bg: 'rgba(245, 158, 11, 0.08)' },
              { c: '#ef4444', l: 'Confirmed Scams', p: '26.0%', bg: 'rgba(239, 68, 68, 0.08)' }
            ].map(item => (
              <div 
                key={item.l} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  fontSize: 12,
                  padding: '8px 12px',
                  background: item.bg,
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.c }} />
                  <span style={{ color: 'var(--text2)', fontWeight: 500 }}>{item.l}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{item.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="cyber-card" style={{ padding: 24 }}>
        <div style={{ 
          fontFamily: 'var(--font-syne)', 
          fontSize: 15, 
          fontWeight: 800, 
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--text)'
        }}>
          <Calendar size={16} style={{ color: '#ef4444' }} />
          <span>Real-time Intercepted Threats</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['COMPANY/POST', 'THREAT VECTOR', 'VERDICT', 'CONFIDENCE', 'TIMESTAMP', 'SHIELD SCAN'].map(h => (
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
              {recentAlerts.map((r, idx) => {
                const color = verdictColor(r.verdict)
                return (
                  <tr 
                    key={r.company}
                    style={{ 
                      borderBottom: idx === recentAlerts.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                      transition: 'background 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{r.company}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{r.type}</div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text2)', fontWeight: 500 }}>
                      Recruitment Phishing Check
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        background: `${color}15`, 
                        color: color, 
                        border: `1px solid ${color}25`, 
                        padding: '4px 10px', 
                        borderRadius: 20, 
                        fontSize: 10, 
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        letterSpacing: 0.5
                      }}>
                        {r.verdict.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {r.risk}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text3)', fontSize: 12 }}>
                      {r.time}
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
                        Inspect <ArrowUpRight size={12} />
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
