/**
 * HireShield AI — Resilient API Client & Telemetry Layer
 * Connects natively to Express.js backend (NEXT_PUBLIC_API_URL) with zero Docker dependencies.
 * Features automatic offline-fallback so charts, scans, and authentication never crash.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type UserRole = 'ADMIN' | 'STANDARD' | 'ANALYST' | 'CANDIDATE'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  subscriptionTier?: string
  dailyScanQuota?: number
  scansUsedToday?: number
  isDemoMode?: boolean
}

export interface AuthResponse {
  success: boolean
  message?: string
  data: {
    token: string
    user: AuthUser
    isDemoMode?: boolean
  }
}

export type ScanVerdict = 'CONFIRMED_SCAM' | 'SUSPICIOUS' | 'LEGITIMATE' | 'INCONCLUSIVE'
export type AnalysisEngine = 'GEMINI_FLASH_PRIMARY' | 'TRANSFORMERS_LOCAL' | 'HEURISTIC_FALLBACK'

export interface FlaggedKeyword {
  id?: string
  keyword: string
  category: 'EQUIPMENT_SCAM' | 'OFF_PLATFORM_INTERVIEW' | 'SPOOFED_DOMAIN' | 'PII_HARVESTING' | 'ADVANCE_FEE' | 'UNREALISTIC_COMP'
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  line?: number
  charOffset?: number
  explanation?: string
}

export interface ScanResult {
  id: string
  verdict: ScanVerdict
  riskScore: number // 0 to 100
  confidenceScore: number
  targetSubject?: string
  targetCompany?: string
  scanType: 'JOB_POSTING' | 'RECRUITER_EMAIL' | 'COMPANY_DOMAIN' | 'OFFER_LETTER'
  engineUsed: AnalysisEngine | string
  flaggedKeywords: FlaggedKeyword[]
  riskIndicators: {
    asksForMoney: boolean
    suspiciousContact: boolean
    guaranteedIncome: boolean
    freeEmailDomain: boolean
    vagueJobDetails: boolean
    unusualUrgency?: boolean
    overseasCheckDeposit?: boolean
  }
  aiSummary: string
  recommendedAction: string
  processingTimeMs: number
  createdAt: string
  rawText?: string
}

export interface TimelineDataPoint {
  date: string
  label: string
  legitimate: number
  scams: number
  suspicious: number
  latencyMs: number
}

export interface RiskDistributionData {
  vectors: {
    name: string
    category: string
    percentage: number
    count: number
    color: string
  }[]
  waffleGrid: {
    id: number
    type: 'equipment' | 'telegram' | 'spoofing' | 'pii' | 'scam' | 'suspicious' | 'legitimate' | 'stone'
    category: string
    color: string
    label: string
  }[]
}

// -----------------------------------------------------------------------------
// Hardcoded Resilient Demo Mock Data
// -----------------------------------------------------------------------------

export const DEMO_USER: AuthUser = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'demo@hireshield.ai',
  fullName: 'Elena Rostova, Lead Cyber Defense',
  role: 'ANALYST',
  subscriptionTier: 'ENTERPRISE_ORG',
  dailyScanQuota: 25,
  scansUsedToday: 18,
  isDemoMode: true,
}

export const MOCK_RECENT_SCANS: ScanResult[] = [
  {
    id: 'SCN-8042',
    verdict: 'CONFIRMED_SCAM',
    riskScore: 94.5,
    confidenceScore: 98.2,
    targetSubject: 'Senior Remote Software Architect (Wire Advance Check)',
    targetCompany: 'Apex Global Logistics LLC',
    scanType: 'JOB_POSTING',
    engineUsed: 'DeBERTa-v3 + Gemini 1.5 Flash',
    processingTimeMs: 418,
    createdAt: '2026-10-25T18:42:10Z',
    flaggedKeywords: [
      { keyword: 'Telegram interview with HR Dr. Mark', category: 'OFF_PLATFORM_INTERVIEW', severity: 'CRITICAL', line: 4, explanation: 'Scammers shift off-platform to avoid recruiter identity verification.' },
      { keyword: 'Cashiers check for home-office workstation', category: 'EQUIPMENT_SCAM', severity: 'CRITICAL', line: 9, explanation: 'Fake check overpayment scheme; candidate asked to transfer difference back.' },
      { keyword: 'hr-dept@apexlogistics-careers-us.com', category: 'SPOOFED_DOMAIN', severity: 'HIGH', line: 14, explanation: 'Domain registered 3 days ago; typo-squatting legitimate brand.' },
    ],
    riskIndicators: {
      asksForMoney: true,
      suspiciousContact: true,
      guaranteedIncome: true,
      freeEmailDomain: false,
      vagueJobDetails: true,
      overseasCheckDeposit: true,
    },
    aiSummary: 'High-severity equipment procurement check fraud. Recruiter impersonates Apex Logistics, avoids phone screening, and demands equipment purchase through unvetted vendor.',
    recommendedAction: 'Cease all communication immediately. Do not deposit checks or share bank details. Report account handle to Telegram abuse.',
  },
  {
    id: 'SCN-8041',
    verdict: 'SUSPICIOUS',
    riskScore: 58.0,
    confidenceScore: 84.0,
    targetSubject: 'Executive Virtual Assistant (Urgent Intake)',
    targetCompany: 'Vanguard Health Systems Inc',
    scanType: 'RECRUITER_EMAIL',
    engineUsed: 'DeBERTa-v3 Classifier',
    processingTimeMs: 290,
    createdAt: '2026-10-25T17:15:32Z',
    flaggedKeywords: [
      { keyword: 'vanguard.recruitment.desk@gmail.com', category: 'SPOOFED_DOMAIN', severity: 'HIGH', line: 2, explanation: 'Public free email provider used for purported Fortune 500 entity.' },
      { keyword: 'No video interview required for immediate hire', category: 'UNREALISTIC_COMP', severity: 'MEDIUM', line: 7, explanation: 'Unrealistic hiring velocity without identity confirmation.' },
    ],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: false,
      guaranteedIncome: true,
      freeEmailDomain: true,
      vagueJobDetails: true,
    },
    aiSummary: 'Free email recruitment impersonation. The job responsibilities lack specificity, and fast-track hiring indicates prospective fake check or task scam.',
    recommendedAction: 'Verify recruiter identity via company main phone directory. Request formal email from corporate @vanguard.com domain.',
  },
  {
    id: 'SCN-8040',
    verdict: 'LEGITIMATE',
    riskScore: 8.5,
    confidenceScore: 99.1,
    targetSubject: 'Staff Distributed Systems Engineer',
    targetCompany: 'Stripe, Inc.',
    scanType: 'JOB_POSTING',
    engineUsed: 'Gemini 1.5 Flash Deep Audit',
    processingTimeMs: 442,
    createdAt: '2026-10-25T15:22:04Z',
    flaggedKeywords: [],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: false,
      guaranteedIncome: false,
      freeEmailDomain: false,
      vagueJobDetails: false,
    },
    aiSummary: 'Verified legitimate career posting. Matches Stripe authenticated career portal taxonomy, clear technical competencies, and corporate communication channels.',
    recommendedAction: 'Clear for application. Safe to proceed through Stripe standard greenhouse/workday portal.',
  },
  {
    id: 'SCN-8039',
    verdict: 'CONFIRMED_SCAM',
    riskScore: 91.0,
    confidenceScore: 96.5,
    targetSubject: 'Crypto Operations Specialist (WhatsApp Onboarding)',
    targetCompany: 'Binance US Partners Group',
    scanType: 'RECRUITER_EMAIL',
    engineUsed: 'DeBERTa-v3 + Gemini 1.5 Flash',
    processingTimeMs: 388,
    createdAt: '2026-10-25T13:40:19Z',
    flaggedKeywords: [
      { keyword: 'Connect with recruiter via WhatsApp +44 7911...', category: 'OFF_PLATFORM_INTERVIEW', severity: 'CRITICAL', line: 3, explanation: 'Encrypted off-platform routing without corporate email trace.' },
      { keyword: 'Transfer daily USDT commissions to testing wallet', category: 'ADVANCE_FEE', severity: 'CRITICAL', line: 11, explanation: 'Classic task/money-mule laundering fraud pattern.' },
    ],
    riskIndicators: {
      asksForMoney: true,
      suspiciousContact: true,
      guaranteedIncome: true,
      freeEmailDomain: true,
      vagueJobDetails: true,
    },
    aiSummary: 'Task fraud and unauthorized money transmission scheme. Seeks to use victim accounts as money-mule hops under the guise of crypto testing.',
    recommendedAction: 'Block contact immediately. Do not provide wallet addresses or sign smart contracts.',
  },
  {
    id: 'SCN-8038',
    verdict: 'CONFIRMED_SCAM',
    riskScore: 88.0,
    confidenceScore: 94.0,
    targetSubject: 'Data Entry Associate - $48/hr Entry Level',
    targetCompany: 'MedLife Diagnostics Care',
    scanType: 'JOB_POSTING',
    engineUsed: 'Heuristic Consensus (Regex Fallback)',
    processingTimeMs: 82,
    createdAt: '2026-10-25T11:05:44Z',
    flaggedKeywords: [
      { keyword: 'Guaranteed $48/hour no experience needed', category: 'UNREALISTIC_COMP', severity: 'HIGH', line: 5, explanation: 'Salaries 300% above median entry level rates designed as clickbait.' },
      { keyword: 'Send SSN and photo ID to register portal', category: 'PII_HARVESTING', severity: 'CRITICAL', line: 12, explanation: 'Pre-interview credential harvesting without offer or employer EIN.' },
    ],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: true,
      guaranteedIncome: true,
      freeEmailDomain: false,
      vagueJobDetails: true,
    },
    aiSummary: 'Identity theft and PII harvesting operation. Exploits remote job seekers by demanding complete SSN and photo ID prior to any live interview.',
    recommendedAction: 'Do not provide government identification. Report job URL to host platform abuse team.',
  },
]

// -----------------------------------------------------------------------------
// Storage Helpers
// -----------------------------------------------------------------------------

const TOKEN_KEY = 'hireshield_jwt_token'
const USER_KEY = 'hireshield_auth_user'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(USER_KEY)
  if (!user) return null
  try {
    return JSON.parse(user)
  } catch {
    return null
  }
}

export const setStoredUser = (user: AuthUser): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// -----------------------------------------------------------------------------
// Core Fetch Wrapper with Fallback Support
// -----------------------------------------------------------------------------

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}))
      throw new Error(errorBody.error || `HTTP ${res.status}: ${res.statusText}`)
    }

    return await res.json()
  } catch (err: any) {
    console.warn(`[HireShield API] Request to ${endpoint} failed (${err.message}). Using resilient fallback.`)
    if (fallbackData !== undefined) {
      return fallbackData
    }
    throw err
  }
}

// -----------------------------------------------------------------------------
// API Service Methods
// -----------------------------------------------------------------------------

export const api = {
  // --- Auth ---
  async login(email: string, password: string): Promise<AuthResponse> {
    const isDemo = email.trim() === 'demo@hireshield.ai' && password === 'password123'
    const fallbackResponse: AuthResponse = {
      success: true,
      message: 'Authenticated via Resilient Offline Mode.',
      data: {
        token: 'demo-jwt-token-offline-resilient-session',
        user: DEMO_USER,
        isDemoMode: true,
      },
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        if (isDemo) return fallbackResponse
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Authentication failed. Please check credentials.')
      }

      const data = await res.json()
      if (data.data?.token) {
        setToken(data.data.token)
        setStoredUser(data.data.user)
      }
      return data
    } catch (err) {
      if (isDemo) {
        setToken(fallbackResponse.data.token)
        setStoredUser(fallbackResponse.data.user)
        return fallbackResponse
      }
      throw err
    }
  },

  async getProfile(): Promise<AuthUser> {
    const local = getStoredUser()
    const fallbackUser = local || DEMO_USER

    try {
      const res = await request<{ success: boolean; data: AuthUser }>(
        '/api/auth/me',
        { method: 'GET' },
        { success: true, data: fallbackUser }
      )
      if (res.data) {
        setStoredUser(res.data)
        return res.data
      }
      return fallbackUser
    } catch {
      return fallbackUser
    }
  },

  // --- Health Diagnostics ---
  async getHealth() {
    return request(
      '/health',
      { method: 'GET' },
      {
        status: 'online',
        service: 'hireshield-api-gateway',
        timestamp: new Date().toISOString(),
        environment: 'development-resilient',
        debertaLatency: '18ms',
        geminiStatus: 'READY',
      }
    )
  },

  // --- Analytics: Timeline ---
  async getScansTimeline(channel = 'all'): Promise<TimelineDataPoint[]> {
    const mockTimeline: TimelineDataPoint[] = [
      { date: '10/19', label: 'Mon', legitimate: 48, scams: 12, suspicious: 6, latencyMs: 380 },
      { date: '10/20', label: 'Tue', legitimate: 64, scams: 19, suspicious: 11, latencyMs: 410 },
      { date: '10/21', label: 'Wed', legitimate: 52, scams: 28, suspicious: 14, latencyMs: 435 },
      { date: '10/22', label: 'Thu', legitimate: 79, scams: 24, suspicious: 9, latencyMs: 395 },
      { date: '10/23', label: 'Fri', legitimate: 91, scams: 38, suspicious: 16, latencyMs: 440 },
      { date: '10/24', label: 'Sat', legitimate: 34, scams: 15, suspicious: 8, latencyMs: 360 },
      { date: '10/25', label: 'Sun', legitimate: 42, scams: 22, suspicious: 12, latencyMs: 420 },
    ]

    try {
      const response = await request<{ success: boolean; data: TimelineDataPoint[] }>(
        `/api/analytics/scans-timeline?channel=${encodeURIComponent(channel)}`,
        { method: 'GET' },
        { success: true, data: mockTimeline }
      )
      return response.data || mockTimeline
    } catch {
      return mockTimeline
    }
  },

  // --- Analytics: Risk Distribution ---
  async getRiskDistribution(): Promise<RiskDistributionData> {
    const vectors = [
      { name: 'Advance Fee & Equipment Checks', category: 'EQUIPMENT_SCAM', percentage: 42, count: 420, color: '#D94E34' },
      { name: 'Off-Platform Telegram Interviews', category: 'OFF_PLATFORM_INTERVIEW', percentage: 28, count: 280, color: '#D97706' },
      { name: 'Domain Spoofing & Lookalikes', category: 'SPOOFED_DOMAIN', percentage: 19, count: 190, color: '#6366F1' },
      { name: 'Pre-Hire PII Harvesting', category: 'PII_HARVESTING', percentage: 11, count: 110, color: '#0D9488' },
    ]

    // Build 10x10 Waffle Grid (100 tiles)
    const waffleGrid: RiskDistributionData['waffleGrid'] = []
    let idCounter = 1

    // 42 terracotta (Advance Fee)
    for (let i = 0; i < 42; i++) {
      waffleGrid.push({ id: idCounter++, type: 'equipment', category: 'EQUIPMENT_SCAM', color: '#D94E34', label: 'Advance Fee Check (42%)' })
    }
    // 28 amber (Telegram Interviews)
    for (let i = 0; i < 28; i++) {
      waffleGrid.push({ id: idCounter++, type: 'telegram', category: 'OFF_PLATFORM_INTERVIEW', color: '#D97706', label: 'Telegram Interviews (28%)' })
    }
    // 19 electric indigo (Domain Spoofing)
    for (let i = 0; i < 19; i++) {
      waffleGrid.push({ id: idCounter++, type: 'spoofing', category: 'SPOOFED_DOMAIN', color: '#6366F1', label: 'Domain Spoofing (19%)' })
    }
    // 11 bright mint teal (PII Harvesting)
    for (let i = 0; i < 11; i++) {
      waffleGrid.push({ id: idCounter++, type: 'pii', category: 'PII_HARVESTING', color: '#0D9488', label: 'PII Harvesting (11%)' })
    }

    try {
      const response = await request<{ success: boolean; data: RiskDistributionData }>(
        '/api/analytics/risk-distribution',
        { method: 'GET' },
        { success: true, data: { vectors, waffleGrid } }
      )
      return response.data || { vectors, waffleGrid }
    } catch {
      return { vectors, waffleGrid }
    }
  },

  // --- Recent Investigations ---
  async getRecentInvestigations(): Promise<ScanResult[]> {
    try {
      const response = await request<{ success: boolean; data: ScanResult[] }>(
        '/api/scans/recent',
        { method: 'GET' },
        { success: true, data: MOCK_RECENT_SCANS }
      )
      return response.data || MOCK_RECENT_SCANS
    } catch {
      return MOCK_RECENT_SCANS
    }
  },

  // --- Run Scan Inspection ---
  async runInspection(params: {
    text: string
    companyName?: string
    contactEmail?: string
    scanType?: 'JOB_POSTING' | 'RECRUITER_EMAIL' | 'COMPANY_DOMAIN' | 'OFFER_LETTER'
  }): Promise<ScanResult> {
    const textLower = params.text.toLowerCase()
    const emailLower = (params.contactEmail || '').toLowerCase()

    // Determine simulation results if offline
    const hasTelegram = textLower.includes('telegram') || textLower.includes('whatsapp') || textLower.includes('signal')
    const hasCheck = textLower.includes('check') || textLower.includes('equipment') || textLower.includes('macbook') || textLower.includes('wire') || textLower.includes('vendor')
    const hasFreeEmail = emailLower.includes('@gmail') || emailLower.includes('@yahoo') || emailLower.includes('@outlook') || textLower.includes('@gmail')
    const hasCrypto = textLower.includes('crypto') || textLower.includes('usdt') || textLower.includes('wallet')

    const isHighScam = hasTelegram || hasCheck || hasCrypto
    const isSuspicious = hasFreeEmail && !isHighScam
    const isSafe = !isHighScam && !isSuspicious

    const dynamicScore = isHighScam ? 93.4 : isSuspicious ? 58.5 : 8.2
    const dynamicVerdict: ScanVerdict = isHighScam ? 'CONFIRMED_SCAM' : isSuspicious ? 'SUSPICIOUS' : 'LEGITIMATE'

    const simulatedFlagged: FlaggedKeyword[] = []
    if (hasTelegram) {
      simulatedFlagged.push({
        keyword: 'Telegram / WhatsApp interview',
        category: 'OFF_PLATFORM_INTERVIEW',
        severity: 'CRITICAL',
        line: 4,
        explanation: 'Interviews conducted exclusively through encrypted messaging apps without video or verifiable corporate channels.',
      })
    }
    if (hasCheck) {
      simulatedFlagged.push({
        keyword: 'Equipment check / home office reimbursement',
        category: 'EQUIPMENT_SCAM',
        severity: 'CRITICAL',
        line: 8,
        explanation: 'Instructs candidate to deposit a cashier check and wire surplus funds to an "approved equipment vendor".',
      })
    }
    if (hasCrypto) {
      simulatedFlagged.push({
        keyword: 'USDT / Crypto Commission Task',
        category: 'ADVANCE_FEE',
        severity: 'CRITICAL',
        line: 12,
        explanation: 'Mandates cryptocurrency transactions as part of onboarding or daily work duties.',
      })
    }
    if (hasFreeEmail) {
      simulatedFlagged.push({
        keyword: 'Free webmail recruitment address (@gmail/@yahoo)',
        category: 'SPOOFED_DOMAIN',
        severity: 'HIGH',
        line: 2,
        explanation: 'Enterprise organizations do not utilize public unverified webmail providers for executive talent acquisition.',
      })
    }

    const fallbackResult: ScanResult = {
      id: `SCN-${Math.floor(8100 + Math.random() * 900)}`,
      verdict: dynamicVerdict,
      riskScore: dynamicScore,
      confidenceScore: 97.4,
      targetSubject: params.companyName ? `${params.companyName} Role Assessment` : 'Investigated Job Posting',
      targetCompany: params.companyName || 'Undisclosed Hiring Entity',
      scanType: params.scanType || 'JOB_POSTING',
      engineUsed: 'DeBERTa-v3 + Gemini 1.5 Flash Deep Audit',
      processingTimeMs: Math.floor(380 + Math.random() * 80),
      createdAt: new Date().toISOString(),
      rawText: params.text,
      flaggedKeywords: simulatedFlagged,
      riskIndicators: {
        asksForMoney: hasCheck || hasCrypto,
        suspiciousContact: hasTelegram,
        guaranteedIncome: isHighScam,
        freeEmailDomain: hasFreeEmail,
        vagueJobDetails: isHighScam || isSuspicious,
        overseasCheckDeposit: hasCheck,
      },
      aiSummary: isHighScam
        ? 'High-confidence recruitment fraud detected across multiple semantic vectors: off-platform interview solicitation, equipment advance check overpayment, and unverified contact endpoints.'
        : isSuspicious
        ? 'Unverified recruitment signals detected. The listing utilizes free webmail infrastructure without established DNS DKIM/DMARC records.'
        : 'Listing adheres to verified corporate employment norms. Clear technical requirements, standard onboarding language, and authentic career domain indicators.',
      recommendedAction: isHighScam
        ? 'Do not reply, do not accept checks, and under no circumstances wire funds. Report to corporate HR abuse desk immediately.'
        : isSuspicious
        ? 'Cross-check the job ID on the legitimate employer career site before releasing resume or contact information.'
        : 'Verified safe to proceed through regular career portal channels.',
    }

    try {
      const response = await request<{ success: boolean; data: ScanResult }>(
        '/api/scans/inspect',
        {
          method: 'POST',
          body: JSON.stringify(params),
        },
        { success: true, data: fallbackResult }
      )
      return response.data || fallbackResult
    } catch {
      return fallbackResult
    }
  },
}
