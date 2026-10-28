import { Redis } from '@upstash/redis'
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import dotenv from 'dotenv'

dotenv.config()

const isUpstashConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)

let redisClient: Redis | null = null

if (isUpstashConfigured) {
  try {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    })
    console.log('🛡️  [Security] Upstash Redis Serverless connection initialized.')
  } catch (err) {
    console.warn('⚠️  [Security] Upstash Redis initialization error. Falling back to in-memory store:', err)
    redisClient = null
  }
} else {
  console.log('ℹ️  [Security] Upstash Redis credentials omitted. Operating with native in-memory rate limiter.')
}

/**
 * Creates an Express rate limiter instance.
 * Backed by Upstash Redis if configured; otherwise gracefully defaults to memory store.
 */
export const createRateLimiter = (options: {
  windowMs?: number
  max?: number
  message?: string
  prefix?: string
}): RateLimitRequestHandler => {
  const windowMs = options.windowMs || 15 * 60 * 1000 // 15 minutes
  const max = options.max || 100                      // 100 requests per window
  const message = options.message || 'Too many requests from this IP. Please try again after 15 minutes.'
  const prefix = options.prefix || 'rl:standard:'

  // When Upstash Redis is active, route rate limiting through RedisStore with fallback
  if (redisClient) {
    try {
      const store = new RedisStore({
        // Send command through Upstash REST request body
        sendCommand: async (...args: string[]) => {
          const res = await (redisClient as any).client.request({ body: args })
          return res.result
        },
        prefix
      })

      return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
          success: false,
          error: message,
          retryAfterMinutes: Math.ceil(windowMs / 60000)
        },
        store
      })
    } catch (err: any) {
      console.warn(`⚠️  [Security] Failed to initialize RedisStore for ${prefix}. Using memory fallback:`, err.message)
    }
  }

  // Native In-Memory fallback for local dev / zero-external dependencies
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: message,
      retryAfterMinutes: Math.ceil(windowMs / 60000)
    }
  })
}

// Global General Rate Limiter: 100 requests per 15 minutes per IP
export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  prefix: 'rl:global:'
})

// Strict Auth Route Limiter: 10 attempts per 15 minutes per IP (Anti-Brute-Force)
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  prefix: 'rl:auth:',
  message: 'Too many authentication attempts. Account access is temporarily throttled.'
})
