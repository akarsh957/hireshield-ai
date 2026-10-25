export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: 'ADMIN' | 'STANDARD'
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}
