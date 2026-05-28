import jwt from 'jsonwebtoken'
const SECRET = process.env.JWT_SECRET || 'hireshield-secret-change-in-production'
export const signToken = (payload: object) => jwt.sign(payload, SECRET, { expiresIn: '7d' })
export const verifyToken = (token: string) => jwt.verify(token, SECRET)
