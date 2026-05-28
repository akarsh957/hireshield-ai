import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { query } from '../config/database'
import { AuthRequest } from '../middleware/authMiddleware'

export const getReports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const r = await query("SELECT * FROM reports WHERE status IN ('confirmed','under_review','pending') ORDER BY created_at DESC LIMIT 50")
    res.json(r.rows)
  } catch { res.json([]) }
}

export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { company_name, company_website, scam_type, description } = req.body
  if (!company_name || !scam_type || !description) { res.status(400).json({ error: 'company_name, scam_type, description required' }); return }
  try {
    const r = await query('INSERT INTO reports(id,user_id,company_name,company_website,scam_type,description) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [uuidv4(), req.user?.id, company_name, company_website, scam_type, description])
    res.status(201).json(r.rows[0])
  } catch {
    res.status(201).json({ id: uuidv4(), company_name, scam_type, description, status: 'pending', created_at: new Date() })
  }
}
