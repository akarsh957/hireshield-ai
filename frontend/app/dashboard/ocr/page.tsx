'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  UploadCloud, 
  Terminal, 
  ShieldAlert, 
  AlertTriangle, 
  Cpu, 
  CheckCircle,
  FileImage
} from 'lucide-react'

export default function OCRPage() {
  const [stage, setStage] = useState<'idle' | 'loading' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')
  const [extracted, setExtracted] = useState('')
  const [verdict, setVerdict] = useState('')

  const simulate = () => {
    setStage('loading')
    setExtracted('')
    setVerdict('')
    const steps = [
      [10, 'Establishing secure channel...'], 
      [25, 'Uploading high-resolution image...'], 
      [45, 'Preprocessing matrix filter with OpenCV...'],
      [65, 'Running Tesseract OCR text extraction...'], 
      [85, 'Running NLP fraud vector comparison...'], 
      [100, 'Analysis complete!']
    ] as [number, string][]
    
    let i = 0
    const tick = setInterval(() => {
      if (i < steps.length) { 
        setProgress(steps[i][0])
        setStatusMsg(steps[i][1])
        i++ 
      } else {
        clearInterval(tick)
        setExtracted(`URGENT JOB OPPORTUNITY!!!\n\nWe are hiring Data Entry Executives\nSalary: ₹75,000 - ₹1,20,000 per week\nWork from home | No experience needed\n\nApply now: jobs@fastcareer-apply.net\nFee: ₹1,500 registration required\n\nHURRY! Only 5 spots left!`)
        setVerdict('FRAUDULENT — 94% fraud probability · 6 red flags found · Advance registration fee + unrealistic salary detected')
        setStage('done')
      }
    }, 600)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {/* Upload Zone Panel */}
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
          <Camera size={16} style={{ color: '#3b82f6' }} />
          <span>OCR Screenshot Scan Radar</span>
        </div>

        {/* Drop zone box */}
        <div 
          onClick={simulate} 
          style={{ 
            border: '2px dashed rgba(59, 130, 246, 0.25)', 
            borderRadius: 14, 
            padding: '54px 20px', 
            textAlign: 'center', 
            cursor: 'pointer', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'rgba(3, 5, 16, 0.4)',
            boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#3b82f6'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.1), inset 0 4px 15px rgba(0,0,0,0.3)'
            e.currentTarget.style.transform = 'scale(1.005)'
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)'
            e.currentTarget.style.boxShadow = 'inset 0 4px 15px rgba(0,0,0,0.3)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <div style={{ 
            width: 54, 
            height: 54, 
            borderRadius: '50%', 
            background: 'rgba(59, 130, 246, 0.08)', 
            color: '#3b82f6', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 16 
          }}>
            <UploadCloud size={24} />
          </div>
          
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Drop suspicious screenshot here
          </div>
          
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            PNG, JPG, WEBP · UP TO 10MB LIMIT
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
            Select Image
          </button>
        </div>

        {/* Progress simulation bar */}
        <AnimatePresence>
          {stage === 'loading' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 20, overflow: 'hidden' }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                fontSize: 12, 
                color: 'var(--text2)', 
                marginBottom: 8,
                fontWeight: 500
              }}>
                <span style={{ 
                  width: 14, 
                  height: 14, 
                  border: '2px solid rgba(59,130,246,.3)', 
                  borderTopColor: '#3b82f6', 
                  borderRadius: '50%', 
                  display: 'inline-block', 
                  animation: 'spin .8s linear infinite' 
                }} />
                <span>{statusMsg}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)' }}>{progress}%</span>
              </div>
              
              <div style={{ background: 'rgba(3, 5, 16, 0.8)', borderRadius: 4, height: 6, border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${progress}%`, 
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
                  borderRadius: 4, 
                  transition: 'width .3s ease' 
                }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal View panel */}
      <div className="cyber-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
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
          <Terminal size={14} style={{ color: '#8b5cf6' }} />
          <span>Extracted Console Output</span>
        </div>

        {/* Monospace view */}
        <div style={{ 
          background: 'rgba(3, 5, 16, 0.65)', 
          borderRadius: 10, 
          padding: 16, 
          fontFamily: 'var(--font-mono)', 
          fontSize: 11, 
          lineHeight: 1.7, 
          color: extracted ? 'var(--text)' : 'var(--text3)', 
          flex: 1, 
          border: '1px solid rgba(255,255,255,0.04)', 
          whiteSpace: 'pre-wrap',
          boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.3)',
          minHeight: 180
        }}>
          {extracted || '// Console isolated awaiting screenshot payload upload...'}
        </div>

        {/* Threat Alert Panel */}
        <AnimatePresence>
          {verdict && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16 }}
            >
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.08)', 
                color: '#ef4444', 
                border: '1px solid rgba(239, 68, 68, 0.25)', 
                padding: '6px 14px', 
                borderRadius: 20, 
                fontSize: 10, 
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                display: 'inline-flex', 
                alignItems: 'center',
                gap: 6,
                marginBottom: 10 
              }}>
                <ShieldAlert size={12} /> OCR ALERT: CRITICAL RISK DETECTED
              </div>
              
              <div style={{ 
                fontSize: 12, 
                color: 'var(--text2)', 
                lineHeight: 1.5,
                background: 'rgba(3, 5, 16, 0.3)',
                padding: 12,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.02)'
              }}>
                {verdict}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
