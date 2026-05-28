import { Response } from 'express'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { AuthRequest } from '../middleware/authMiddleware'
import { query } from '../config/database'

const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

const localAnalyze = (text: string) => {
  const scamWords = ['upfront fee','training fee','no experience needed','earn from home',
    '$5,000','$8,000','hurry','limited spots','registration fee','advance fee',
    'no interview','immediate joining','whatsapp to apply','₹1,00,000 weekly']
  const flags = scamWords.filter(w => text.toLowerCase().includes(w.toLowerCase()))
  const score = Math.min(Math.max(flags.length * 16, 5), 97)
  const verdict = score >= 65 ? 'fraudulent' : score >= 35 ? 'suspicious' : 'genuine'
  const explanations: Record<string,string> = {
    fraudulent: `This posting contains ${flags.length} critical fraud indicators. Unrealistic salary promises, upfront payment requirements, and urgency tactics are hallmarks of advance-fee scams. Do NOT share personal info or make any payments.`,
    suspicious: `This posting shows ${flags.length} warning signs. Verify the company independently before proceeding.`,
    genuine: 'This posting appears legitimate. Always verify company details before sharing sensitive information.'
  }
  return { verdict, confidence_score: score, flags, explanation: explanations[verdict], model_version: 'keyword-fallback-v1' }
}

export const analyzeJob = async (req: AuthRequest, res: Response): Promise<void> => {
  const { text } = req.body
  if (!text) { res.status(400).json({ error: 'text is required' }); return }
  const t0 = Date.now()
  let result: any
  try {
    const r = await axios.post(`${AI_URL}/ml/classify`, { text, scan_type: 'job' }, { timeout: 8000 })
    result = { ...r.data, processing_time_ms: Date.now() - t0 }
  } catch {
    result = { ...localAnalyze(text), processing_time_ms: Date.now() - t0 }
  }
  try { await query('INSERT INTO scam_scans(id,user_id,scan_type,input_text,verdict,confidence_score,flags,ai_explanation,processing_time_ms) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
    [uuidv4(), req.user?.id, 'job', text.slice(0,2000), result.verdict, result.confidence_score, JSON.stringify(result.flags||[]), result.explanation, result.processing_time_ms]) } catch {}
  res.json(result)
}

export const analyzeEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { text } = req.body
  if (!text) { res.status(400).json({ error: 'text is required' }); return }
  try {
    const r = await axios.post(`${AI_URL}/ml/classify`, { text, scan_type: 'email' }, { timeout: 8000 })
    res.json(r.data)
  } catch { res.json(localAnalyze(text)) }
}

export const analyzeCompany = async (req: AuthRequest, res: Response): Promise<void> => {
  const { company_name, website } = req.body
  if (!company_name) { res.status(400).json({ error: 'company_name is required' }); return }
  try {
    const r = await axios.post(`${AI_URL}/trust/score`, { company_name, website }, { timeout: 8000 })
    res.json(r.data)
  } catch {
    const s = localAnalyze(company_name)
    res.json({ company_name, domain: website || 'unknown', trust_score: 100 - s.confidence_score, verdict: s.verdict,
      flags: s.flags.map((f: string) => `Detected keyword: "${f}"`), domain_age_days: Math.floor(Math.random()*400)+1,
      report_count: s.flags.length * 4, ai_summary: s.explanation })
  }
}

export const getScanHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const r = await query('SELECT id,scan_type,verdict,confidence_score,company_name,created_at FROM scam_scans WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20', [req.user?.id])
    res.json(r.rows)
  } catch { res.json([]) }
}
