import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '@hireshield/database'
import { AuthUser } from '../types/express'

const JWT_SECRET = process.env.JWT_SECRET || 'hireshield-development-jwt-secret-min-32-chars'
const JWT_EXPIRES_IN = '7d'

// Hardcoded Resilient Demo Identity for Offline / DB Outage Testing
const DEMO_CREDENTIALS = {
  email: 'demo@hireshield.ai',
  password: 'password123',
  user: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'demo@hireshield.ai',
    fullName: 'HireShield Demo Administrator',
    role: 'ADMIN' as const
  }
}

const registerSchema = z.object({
  email: z.string().email('Invalid email address format').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').trim()
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required')
})

const generateToken = (payload: AuthUser): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Controller: Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors
      })
      return
    }

    const { email, password, fullName } = parseResult.data

    // Check for existing user
    let existingUser = null
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      })
    } catch (dbErr: any) {
      console.warn('⚠️  [Database] Database connection failed during registration check:', dbErr.message)
      res.status(503).json({
        success: false,
        error: 'Database service is temporarily unreachable. Please use the Demo Mode login or check Neon credentials.'
      })
      return
    }

    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      })
      return
    }

    // Hash password with salt cost factor 12
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: 'STANDARD'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true
      }
    })

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role as 'ADMIN' | 'STANDARD'
    })

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      data: {
        token,
        user: newUser
      }
    })
  } catch (err: any) {
    console.error('❌ [Auth Register Error]:', err)
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred while creating the account.'
    })
  }
}

/**
 * Controller: User Login & Demo Mode Fallback
 * POST /api/auth/login
 *
 * Implements offline resiliency: If Neon PostgreSQL is offline or times out,
 * verifies whether credentials match demo@hireshield.ai / password123 and
 * issues a valid signed JWT without throwing an unhandled exception.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body)
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors
      })
      return
    }

    const { email, password } = parseResult.data

    let user = null
    let databaseUnavailable = false

    // Attempt Neon PostgreSQL User Lookup with Resilience Wrapper
    try {
      user = await prisma.user.findUnique({
        where: { email }
      })
    } catch (dbErr: any) {
      console.warn('⚠️  [Database Offline] Neon connection error during login:', dbErr.message)
      databaseUnavailable = true
    }

    // --- DEMO MODE RESILIENCE BYPASS ---
    // If the database is unreachable OR user was not found in DB, check for Demo Account Bypass
    const isDemoEmail = email === DEMO_CREDENTIALS.email
    const isDemoPassword = password === DEMO_CREDENTIALS.password

    if ((databaseUnavailable || !user) && isDemoEmail && isDemoPassword) {
      console.log('🛡️  [Auth Resilience] DEMO MODE ACTIVATED. Issuing signed bypass JWT for offline testing.')
      const demoToken = generateToken(DEMO_CREDENTIALS.user)

      res.status(200).json({
        success: true,
        message: 'Authenticated via HireShield Resilient Demo Mode (Database Bypass Active).',
        data: {
          token: demoToken,
          user: DEMO_CREDENTIALS.user,
          isDemoMode: true
        }
      })
      return
    }

    // If database was down and credentials did not match the demo bypass
    if (databaseUnavailable) {
      res.status(503).json({
        success: false,
        error: 'Authentication database is currently unavailable.',
        hint: 'You can test the platform offline using email: demo@hireshield.ai and password: password123'
      })
      return
    }

    // Standard credential validation when database is available
    if (!user || !user.passwordHash) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email and password.'
      })
      return
    }

    if (user.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        error: `Account is ${user.status.toLowerCase()}. Please contact support.`
      })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials. Please verify your email and password.'
      })
      return
    }

    // Update last login timestamp asynchronously
    prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    }).catch((e: any) => console.warn('Failed to update lastLoginAt:', e.message))

    const authPayload: AuthUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as 'ADMIN' | 'STANDARD'
    }

    const token = generateToken(authPayload)

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          dailyScanQuota: user.dailyScanQuota,
          scansUsedToday: user.scansUsedToday
        },
        isDemoMode: false
      }
    })
  } catch (err: any) {
    console.error('❌ [Auth Login Error]:', err)
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred during authentication.'
    })
  }
}

/**
 * Controller: Get authenticated user profile
 * GET /api/auth/me
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized' })
    return
  }

  // Handle demo mode user profile
  if (req.user.email === DEMO_CREDENTIALS.email) {
    res.status(200).json({
      success: true,
      data: {
        ...DEMO_CREDENTIALS.user,
        subscriptionTier: 'ENTERPRISE_ORG',
        dailyScanQuota: 999,
        scansUsedToday: 0,
        isDemoMode: true
      }
    })
    return
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        subscriptionTier: true,
        dailyScanQuota: true,
        scansUsedToday: true,
        createdAt: true
      }
    })

    if (!user) {
      res.status(404).json({ success: false, error: 'User profile not found.' })
      return
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (err: any) {
    // If DB fails during profile fetch, return the decoded token claims
    res.status(200).json({
      success: true,
      data: {
        ...req.user,
        dailyScanQuota: 30,
        scansUsedToday: 0
      }
    })
  }
}
