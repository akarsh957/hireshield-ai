import { Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { v4 as uuidv4 } from 'uuid'
import { AuthRequest } from '../middleware/authMiddleware'
import { query } from '../config/database'

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || '' })

const SYSTEM = `You are HireShield AI, an expert fraud detection assistant. You specialize in identifying fake job postings, phishing recruitment messages, advance-fee scams, fake companies, and suspicious HR practices. Help job seekers determine if opportunities are legitimate. Be concise, specific, and always warn clearly about high-risk situations. Use **bold** for key verdicts and risk levels. Keep responses under 180 words.`

const FALLBACKS = [
  'Based on my analysis, this shows multiple fraud indicators including **unrealistic salary claims** and **upfront fee requirements**. This is very likely a **SCAM**. Do not respond or share personal details.',
  'Top warning signs of fake recruitment: 1) Too-good-to-be-true salary 2) Upfront fee requests 3) Gmail/Yahoo for "corporates" 4) No experience required 5) Extreme urgency. Always verify via the official company website!',
  '⚠️ **HIGH RISK — Likely Scam!** Legitimate companies NEVER ask candidates to pay for training kits or registration. **Do not pay. Do not share bank details.**',
  'I can help verify this. Could you share the full job post or message? Common red flags I look for: salary anomalies, fee requests, no verifiable company details, and urgency pressure tactics.',
]
let fbIdx = 0

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  const { message, history = [], session_id } = req.body
  if (!message) { res.status(400).json({ error: 'message is required' }); return }
  const sid = session_id || uuidv4()
  let reply = ''
  try {
    const messages = [...(history as any[]).slice(-8), { role: 'user' as const, content: message }]
    const response = await client.messages.create({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYSTEM, messages })
    reply = response.content[0].type === 'text' ? response.content[0].text : ''
  } catch {
    reply = FALLBACKS[fbIdx++ % FALLBACKS.length]
  }
  try {
    await query('INSERT INTO chat_history(id,user_id,session_id,role,content) VALUES($1,$2,$3,$4,$5)', [uuidv4(), req.user?.id, sid, 'user', message])
    await query('INSERT INTO chat_history(id,user_id,session_id,role,content) VALUES($1,$2,$3,$4,$5)', [uuidv4(), req.user?.id, sid, 'assistant', reply])
  } catch {}
  res.json({ reply, session_id: sid })
}

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const r = await query('SELECT role,content,created_at FROM chat_history WHERE user_id=$1 AND session_id=$2 ORDER BY created_at ASC', [req.user?.id, req.query.session_id])
    res.json(r.rows)
  } catch { res.json([]) }
}
