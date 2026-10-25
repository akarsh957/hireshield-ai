import { Request, Response, NextFunction } from 'express'

type Role = 'ADMIN' | 'STANDARD'

/**
 * Role-Based Access Control (RBAC) Middleware Factory
 * Restricts access to routes based on user role.
 *
 * @example
 * router.get('/admin/logs', authenticate, requireRole('ADMIN'), getLogsHandler)
 * router.get('/dashboard', authenticate, requireRole('ADMIN', 'STANDARD'), getDashboardHandler)
 */
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized. Authentication must precede role verification.'
      })
      return
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden. Role '${user.role}' lacks sufficient privileges. Required: [${allowedRoles.join(', ')}].`
      })
      return
    }

    next()
  }
}
