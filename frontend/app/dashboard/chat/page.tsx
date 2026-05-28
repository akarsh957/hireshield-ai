'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  User, 
  Cpu, 
  HelpCircle,
  AlertOctagon,
  Sparkles 
} from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string; time: string }

const QUICK_PROMPTS = [
  'Is this job genuine? They offer ₹80,000/week for data entry from home with no experience needed.',
  'What are the top warning signs of a fake recruitment email?',
  'Analyze this: We found your resume and want to hire you immediately. Send ₹2000 for training kit.',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `Hello! I'm **HireShield AI**, your personal job fraud detection assistant.\n\nI can help you determine if a job offer, company, or recruitment message is legitimate. Ask me things like:\n\n• "Is this job offer genuine?" (paste the offer)\n• "Analyze this internship email"\n• "Is [company name] a real company?"\n• "What are signs of a fake job?"`,
    time: 'Just now'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages])

  const send = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: msg, time: 'Just now' }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const token = localStorage.getItem('hs_token')
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg, history })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || data.error || 'Sorry, I could not process that message. Try again shortly.', 
        time: 'Just now' 
      }])
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am currently running in offline isolation mode. The local backend server is not reachable on port 4000. Start it using `npm run dev` in the backend folder to restore real-time Claude LLM analysis.', 
        time: 'Just now' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const renderContent = (text: string) => text.split('\n').map((line, i) => (
    <span key={i}>
      {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j} style={{ color: '#60a5fa', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
          : part
      )}
      <br />
    </span>
  ))

  return (
    <div 
      className="cyber-card" 
      style={{ 
        padding: 24, 
        height: 'calc(100vh - 150px)', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Header bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: 20, 
        paddingBottom: 16, 
        borderBottom: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <div style={{ 
          fontFamily: 'var(--font-syne)', 
          fontSize: 14, 
          fontWeight: 800, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
          color: 'var(--text)'
        }}>
          <span style={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: '#10b981', 
            boxShadow: '0 0 6px #10b981', 
            display: 'inline-block',
            animation: 'cyber-pulse 1.5s infinite alternate'
          }} />
          HireShield Sentinel AI Chat
        </div>
        <span style={{ 
          background: 'rgba(139, 92, 246, 0.08)', 
          color: '#a78bfa', 
          border: '1px solid rgba(139, 92, 246, 0.2)', 
          padding: '4px 12px', 
          borderRadius: 20, 
          fontSize: 10, 
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <Cpu size={12} /> CLAUDE 3.5 RADAR
        </span>
      </div>

      {/* Message Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 20, 
        paddingRight: 6,
        marginBottom: 16
      }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ 
                display: 'flex', 
                gap: 12, 
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                maxWidth: '85%', 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' 
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' 
                }}>
                  <ShieldCheck size={16} color="#fff" />
                </div>
              )}
              
              <div>
                <div style={{ 
                  padding: '12px 18px', 
                  borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px', 
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1d4ed8, #3b82f6)' : 'rgba(17, 28, 54, 0.65)', 
                  border: msg.role === 'assistant' ? '1px solid rgba(139, 92, 246, 0.15)' : 'none', 
                  fontSize: 13, 
                  lineHeight: 1.6, 
                  color: '#fff',
                  boxShadow: msg.role === 'user' ? '0 4px 15px rgba(59,130,246,0.15)' : 'none'
                }}>
                  {renderContent(msg.content)}
                </div>
                <div style={{ 
                  fontSize: 10, 
                  color: 'var(--text3)', 
                  marginTop: 4, 
                  padding: '0 4px',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {msg.role === 'user' ? 'SEEKER AUDIT' : 'HIRESHIELD SENTINEL'} · {msg.time}
                </div>
              </div>

              {msg.role === 'user' && (
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0, 
                  color: 'var(--text2)'
                }}>
                  <User size={16} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShieldCheck size={16} color="#fff" />
            </div>
            <div style={{ 
              padding: '12px 18px', 
              background: 'rgba(17, 28, 54, 0.65)', 
              border: '1px solid rgba(139, 92, 246, 0.15)', 
              borderRadius: '16px 16px 16px 2px', 
              display: 'flex', 
              gap: 4, 
              alignItems: 'center' 
            }}>
              {[0, 0.15, 0.3].map((delay, i) => (
                <span 
                  key={i} 
                  style={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    background: '#a78bfa', 
                    display: 'inline-block', 
                    animation: `typing 0.8s ${delay}s infinite alternate` 
                  }} 
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts Container */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        flexWrap: 'wrap', 
        marginBottom: 12,
        padding: '0 4px'
      }}>
        {QUICK_PROMPTS.map((p, i) => (
          <button 
            key={i} 
            onClick={() => send(p)} 
            style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              color: 'var(--text2)', 
              padding: '6px 14px', 
              borderRadius: 20, 
              fontSize: 11, 
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.06)'
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)'
              e.currentTarget.style.color = '#a78bfa'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'var(--text2)'
            }}
          >
            {i === 0 ? <HelpCircle size={12} /> : i === 1 ? <AlertOctagon size={12} /> : <Sparkles size={12} />}
            {['Check offer legitimacy', 'Common scam flags', 'Inspect fee request'][i]}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        padding: '8px 12px 8px 16px', 
        background: 'rgba(3, 5, 16, 0.6)', 
        border: '1px solid rgba(255,255,255,0.05)', 
        borderRadius: 12,
        alignItems: 'center',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
      }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type or paste suspicious job criteria..."
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text)', 
            fontSize: 13, 
            outline: 'none', 
            fontFamily: 'var(--font-inter)',
            height: 38
          }} 
        />
        <button 
          onClick={() => send()} 
          disabled={loading || !input.trim()}
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            border: 'none', 
            color: '#fff', 
            width: 36,
            height: 36,
            borderRadius: 8, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', 
            opacity: (loading || !input.trim()) ? 0.4 : 1,
            transition: 'all 0.2s',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
          }}
          onMouseOver={e => {
            if(!loading && input.trim()) {
              e.currentTarget.style.boxShadow = '0 6px 14px rgba(59, 130, 246, 0.35)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseOut={e => {
            if(!loading && input.trim()) {
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          <Send size={14} fill="#fff" />
        </button>
      </div>
    </div>
  )
}
