import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) { res.status(401).json({ error: 'Authentication required' }); return }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'hireshield-secret') as any
    next()
  } catch { res.status(401).json({ error: 'Invalid or expired token' }) }
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') { res.status(403).json({ error: 'Admin access required' }); return }
  next()
}
