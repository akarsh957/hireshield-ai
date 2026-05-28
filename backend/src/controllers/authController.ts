import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { query } from '../config/database'
import { signToken } from '../utils/jwt'
import { AuthRequest } from '../middleware/authMiddleware'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body
  if (!name || !email || !password) { res.status(400).json({ error: 'All fields required' }); return }
  try {
    const exists = await query('SELECT id FROM users WHERE email=$1', [email])
    if (exists.rows.length) { res.status(409).json({ error: 'Email already registered' }); return }
    const hash = await bcrypt.hash(password, 12)
    const result = await query(
      'INSERT INTO users(id,name,email,password_hash) VALUES($1,$2,$3,$4) RETURNING id,name,email,role',
      [uuidv4(), name, email, hash]
    )
    const user = result.rows[0]
    res.status(201).json({ token: signToken({ id: user.id, email: user.email, role: user.role }), user })
  } catch (err: any) {
    // Demo mode – DB not connected
    const user = { id: uuidv4(), name, email, role: 'user' }
    res.status(201).json({ token: signToken(user), user })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  if (!email || !password) { res.status(400).json({ error: 'Email and password required' }); return }
  try {
    const result = await query('SELECT * FROM users WHERE email=$1', [email])
    const user = result.rows[0]
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid credentials' }); return
    }
    const { password_hash, ...safe } = user
    res.json({ token: signToken({ id: user.id, email: user.email, role: user.role }), user: safe })
  } catch {
    // Demo fallback
    if (email === 'demo@hireshield.ai' && password === 'password123') {
      const user = { id: uuidv4(), name: 'Alex Johnson', email, role: 'user' }
      res.json({ token: signToken(user), user })
    } else {
      res.status(401).json({ error: 'Invalid credentials. Try demo@hireshield.ai / password123' })
    }
  }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query('SELECT id,name,email,role,plan,scan_count FROM users WHERE id=$1', [req.user?.id])
    if (!result.rows.length) { res.status(404).json({ error: 'User not found' }); return }
    res.json(result.rows[0])
  } catch { res.json(req.user) }
}
