import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthUser } from '../types/express'

const JWT_SECRET = process.env.JWT_SECRET || 'hireshield-development-jwt-secret-min-32-chars'

/**
 * Middleware: Authenticate Bearer JWT
 * Verifies Authorization header and binds the decoded user to req.user.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Missing or malformed Bearer token.'
    })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      role: decoded.role
    }
    next()
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.'
      })
      return
    }

    res.status(401).json({
      success: false,
      error: 'Invalid authorization token.'
    })
  }
}
