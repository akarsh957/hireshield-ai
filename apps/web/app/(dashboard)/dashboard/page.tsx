'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  Search,
  Shield,
  ArrowRight,
  X,
  FileText,
  Mail,
  FileCheck,
  Globe,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  TimelineDataPoint,
  ScanResult,
} from '@/lib/api'

// -----------------------------------------------------------------------------
// Realistic Static Datasets for Dynamic Filtering (Channel & Timeframe)
// -----------------------------------------------------------------------------

type ChannelType = 'all' | 'postings' | 'emails' | 'offers'
type TimeRangeType = '7D' | '30D' | '90D'

interface AggregatedMetricData {
  totalScans: number
  totalScansTrend: string
  confirmedScams: number
  confirmedScamsPct: string
  suspiciousScans: number
  suspiciousScansPct: string
  meanLatencyMs: number
  aiPrimaryPct: string
}

const METRICS_BY_FILTER: Record<
  TimeRangeType,
  Record<ChannelType, AggregatedMetricData>
> = {
  '7D': {
    all: {
      totalScans: 312,
      totalScansTrend: '+12.4% vs prev 7d',
      confirmedScams: 21,
      confirmedScamsPct: '6.7% threat rate',
      suspiciousScans: 35,
      suspiciousScansPct: '11.2% deep audited',
      meanLatencyMs: 412,
      aiPrimaryPct: '98.7% AI Primary',
    },
    postings: {
      totalScans: 148,
      totalScansTrend: '+15.1% vs prev 7d',
      confirmedScams: 9,
      confirmedScamsPct: '6.1% threat rate',
      suspiciousScans: 16,
      suspiciousScansPct: '10.8% deep audited',
      meanLatencyMs: 395,
      aiPrimaryPct: '99.1% AI Primary',
    },
    emails: {
      totalScans: 96,
      totalScansTrend: '+8.3% vs prev 7d',
      confirmedScams: 8,
      confirmedScamsPct: '8.3% threat rate',
      suspiciousScans: 12,
      suspiciousScansPct: '12.5% deep audited',
      meanLatencyMs: 420,
      aiPrimaryPct: '98.2% AI Primary',
    },
    offers: {
      totalScans: 68,
      totalScansTrend: '+14.0% vs prev 7d',
      confirmedScams: 4,
      confirmedScamsPct: '5.9% threat rate',
      suspiciousScans: 7,
      suspiciousScansPct: '10.3% deep audited',
      meanLatencyMs: 440,
      aiPrimaryPct: '97.5% AI Primary',
    },
  },
  '30D': {
    all: {
      totalScans: 1284,
      totalScansTrend: '+18.4% vs last month',
      confirmedScams: 86,
      confirmedScamsPct: '6.7% of total volume',
      suspiciousScans: 142,
      suspiciousScansPct: '11.0% required Gemini deep audit',
      meanLatencyMs: 420,
      aiPrimaryPct: '98.4% AI Primary • 1.6% Fallback',
    },
    postings: {
      totalScans: 624,
      totalScansTrend: '+21.2% vs last month',
      confirmedScams: 38,
      confirmedScamsPct: '6.1% of total volume',
      suspiciousScans: 68,
      suspiciousScansPct: '10.9% required Gemini deep audit',
      meanLatencyMs: 405,
      aiPrimaryPct: '98.9% AI Primary • 1.1% Fallback',
    },
    emails: {
      totalScans: 412,
      totalScansTrend: '+16.5% vs last month',
      confirmedScams: 32,
      confirmedScamsPct: '7.8% of total volume',
      suspiciousScans: 48,
      suspiciousScansPct: '11.7% required Gemini deep audit',
      meanLatencyMs: 428,
      aiPrimaryPct: '98.1% AI Primary • 1.9% Fallback',
    },
    offers: {
      totalScans: 248,
      totalScansTrend: '+13.8% vs last month',
      confirmedScams: 16,
      confirmedScamsPct: '6.5% of total volume',
      suspiciousScans: 26,
      suspiciousScansPct: '10.5% required Gemini deep audit',
      meanLatencyMs: 445,
      aiPrimaryPct: '97.6% AI Primary • 2.4% Fallback',
    },
  },
  '90D': {
    all: {
      totalScans: 3840,
      totalScansTrend: '+24.6% vs prev quarter',
      confirmedScams: 254,
      confirmedScamsPct: '6.6% threat rate',
      suspiciousScans: 418,
      suspiciousScansPct: '10.9% deep audited',
      meanLatencyMs: 426,
      aiPrimaryPct: '98.1% AI Primary',
    },
    postings: {
      totalScans: 1890,
      totalScansTrend: '+28.0% vs prev quarter',
      confirmedScams: 114,
      confirmedScamsPct: '6.0% threat rate',
      suspiciousScans: 202,
      suspiciousScansPct: '10.7% deep audited',
      meanLatencyMs: 410,
      aiPrimaryPct: '98.7% AI Primary',
    },
    emails: {
      totalScans: 1240,
      totalScansTrend: '+22.4% vs prev quarter',
      confirmedScams: 94,
      confirmedScamsPct: '7.6% threat rate',
      suspiciousScans: 144,
      suspiciousScansPct: '11.6% deep audited',
      meanLatencyMs: 432,
      aiPrimaryPct: '97.9% AI Primary',
    },
    offers: {
      totalScans: 710,
      totalScansTrend: '+19.1% vs prev quarter',
      confirmedScams: 46,
      confirmedScamsPct: '6.5% threat rate',
      suspiciousScans: 72,
      suspiciousScansPct: '10.1% deep audited',
      meanLatencyMs: 450,
      aiPrimaryPct: '97.2% AI Primary',
    },
  },
}

// Sparkline Mock Arrays
const SPARKLINE_DATA: Record<number, number[]> = {
  1: [28, 44, 38, 52, 64], // Total volume upward
  2: [12, 18, 14, 22, 16], // Scam blocks
  3: [19, 24, 21, 29, 26], // Suspicious escalations
  4: [424, 418, 422, 416, 420], // Mean latency stability
}

// -----------------------------------------------------------------------------
// Timeline Data Points for 7D / 30D / 90D
// -----------------------------------------------------------------------------

const TIMELINE_SERIES: Record<TimeRangeType, TimelineDataPoint[]> = {
  '7D': [
    { date: '10/20', label: 'Mon', legitimate: 42, scams: 3, suspicious: 5, latencyMs: 405 },
    { date: '10/21', label: 'Tue', legitimate: 56, scams: 4, suspicious: 6, latencyMs: 415 },
    { date: '10/22', label: 'Wed', legitimate: 48, scams: 3, suspicious: 5, latencyMs: 410 },
    { date: '10/23', label: 'Thu', legitimate: 62, scams: 5, suspicious: 7, latencyMs: 425 },
    { date: '10/24', label: 'Fri', legitimate: 71, scams: 4, suspicious: 8, latencyMs: 430 },
    { date: '10/25', label: 'Sat', legitimate: 32, scams: 1, suspicious: 3, latencyMs: 395 },
    { date: '10/26', label: 'Sun', legitimate: 38, scams: 2, suspicious: 4, latencyMs: 412 },
  ],
  '30D': [
    { date: 'Oct 01', label: 'Oct 1', legitimate: 94, scams: 6, suspicious: 11, latencyMs: 410 },
    { date: 'Oct 04', label: 'Oct 4', legitimate: 112, scams: 8, suspicious: 14, latencyMs: 418 },
    { date: 'Oct 07', label: 'Oct 7', legitimate: 105, scams: 7, suspicious: 12, latencyMs: 415 },
    { date: 'Oct 10', label: 'Oct 10', legitimate: 128, scams: 9, suspicious: 15, latencyMs: 422 },
    { date: 'Oct 13', label: 'Oct 13', legitimate: 119, scams: 8, suspicious: 13, latencyMs: 419 },
    { date: 'Oct 16', label: 'Oct 16', legitimate: 142, scams: 11, suspicious: 17, latencyMs: 426 },
    { date: 'Oct 19', label: 'Oct 19', legitimate: 134, scams: 9, suspicious: 16, latencyMs: 420 },
    { date: 'Oct 22', label: 'Oct 22', legitimate: 151, scams: 12, suspicious: 18, latencyMs: 428 },
    { date: 'Oct 25', label: 'Oct 25', legitimate: 168, scams: 13, suspicious: 20, latencyMs: 424 },
    { date: 'Oct 26', label: 'Oct 26', legitimate: 131, scams: 9, suspicious: 15, latencyMs: 418 },
  ],
  '90D': [
    { date: 'Aug W1', label: 'Aug W1', legitimate: 240, scams: 16, suspicious: 28, latencyMs: 420 },
    { date: 'Aug W3', label: 'Aug W3', legitimate: 275, scams: 19, suspicious: 31, latencyMs: 425 },
    { date: 'Sep W1', label: 'Sep W1', legitimate: 310, scams: 21, suspicious: 35, latencyMs: 422 },
    { date: 'Sep W3', label: 'Sep W3', legitimate: 335, scams: 23, suspicious: 38, latencyMs: 430 },
    { date: 'Oct W1', label: 'Oct W1', legitimate: 380, scams: 26, suspicious: 42, latencyMs: 426 },
    { date: 'Oct W3', label: 'Oct W3', legitimate: 420, scams: 29, suspicious: 46, latencyMs: 428 },
  ],
}

// -----------------------------------------------------------------------------
// Vector Categories & Descriptions
// -----------------------------------------------------------------------------

interface VectorCategory {
  id: string
  name: string
  percentage: number
  scanCount: number
  lightColor: string
  darkColor: string
  shortLabel: string
  description: string
}

const FRAUD_VECTORS: VectorCategory[] = [
  {
    id: 'equipment',
    name: 'Advance Fee & Equipment Checks',
    percentage: 42,
    scanCount: 96,
    lightColor: '#E11D48', // Crimson Terracotta
    darkColor: '#F87171',
    shortLabel: '42% • 96 scans',
    description: 'Fake check overpayment scam demanding reimbursement for home-office MacBooks via Zelle or wire.',
  },
  {
    id: 'off_platform',
    name: 'Off-Platform Messaging (Telegram/WhatsApp)',
    percentage: 28,
    scanCount: 64,
    lightColor: '#D97706', // Warm Ochre
    darkColor: '#FBBF24',
    shortLabel: '28% • 64 scans',
    description: 'Recruiters redirecting candidates to unverified encrypted chats to bypass platform security checks.',
  },
  {
    id: 'spoofing',
    name: 'Lookalike Domain Spoofing',
    percentage: 19,
    scanCount: 43,
    lightColor: '#475569', // Slate Stone
    darkColor: '#94A3B8',
    shortLabel: '19% • 43 scans',
    description: 'Outreach from unauthenticated lookalikes (e.g. @stripe-careers-verify.com or public @gmail.com).',
  },
  {
    id: 'pii',
    name: 'Pre-Interview PII / Bank Harvesting',
    percentage: 11,
    scanCount: 25,
    lightColor: '#0D9488', // Forest Emerald
    darkColor: '#34D399',
    shortLabel: '11% • 25 scans',
    description: 'Prematurely requesting Social Security Numbers, ID photos, or direct deposit forms before any interview.',
  },
]

// -----------------------------------------------------------------------------
// Rich Recent Investigations Dataset
// -----------------------------------------------------------------------------

const INITIAL_INVESTIGATIONS: ScanResult[] = [
  {
    id: 'SCN-8042',
    verdict: 'CONFIRMED_SCAM',
    riskScore: 94.5,
    confidenceScore: 98.2,
    targetSubject: 'Senior Remote Software Architect (Advance Equipment Check)',
    targetCompany: 'Apex Global Logistics LLC — Spoofed Entity',
    scanType: 'JOB_POSTING',
    engineUsed: 'DeBERTa + Gemini 1.5',
    processingTimeMs: 418,
    createdAt: '14m ago',
    flaggedKeywords: [
      {
        keyword: 'Telegram interview with HR Dr. Mark',
        category: 'OFF_PLATFORM_INTERVIEW',
        severity: 'CRITICAL',
        line: 4,
        explanation: 'Mandates shifting off-platform to avoid verified career channel telemetry.',
      },
      {
        keyword: 'Cashiers check for home-office workstation ($4,850)',
        category: 'EQUIPMENT_SCAM',
        severity: 'CRITICAL',
        line: 9,
        explanation: 'Classic overpayment check fraud: candidate instructed to wire surplus funds back.',
      },
      {
        keyword: 'hr-dept@apexlogistics-careers-us.com',
        category: 'SPOOFED_DOMAIN',
        severity: 'HIGH',
        line: 14,
        explanation: 'Lookalike domain registered 3 days ago; unverified MX & SPF records.',
      },
    ],
    riskIndicators: {
      asksForMoney: true,
      suspiciousContact: true,
      guaranteedIncome: true,
      freeEmailDomain: false,
      vagueJobDetails: true,
      overseasCheckDeposit: true,
    },
    aiSummary:
      'High-confidence equipment procurement fraud. Impersonates Apex Global Logistics with a freshly minted lookalike domain, bypasses video screening, and directs the applicant to deposit a cashier check and wire money to an unvetted vendor.',
    recommendedAction:
      'Cease all communications immediately. Do not deposit check or provide banking credentials. Flag domain to registrar abuse team.',
  },
  {
    id: 'SCN-8041',
    verdict: 'SUSPICIOUS',
    riskScore: 58.0,
    confidenceScore: 84.0,
    targetSubject: 'Executive Virtual Assistant (Fast-Track Onboarding)',
    targetCompany: 'Vanguard Health Systems Inc — Free Mail Intake',
    scanType: 'RECRUITER_EMAIL',
    engineUsed: 'DeBERTa Fast-Pass',
    processingTimeMs: 290,
    createdAt: '42m ago',
    flaggedKeywords: [
      {
        keyword: 'vanguard.recruitment.desk@gmail.com',
        category: 'SPOOFED_DOMAIN',
        severity: 'HIGH',
        line: 2,
        explanation: 'Public free webmail utilized for purported Fortune 500 healthcare provider.',
      },
      {
        keyword: 'Immediate hire without formal video interview',
        category: 'UNREALISTIC_COMP',
        severity: 'MEDIUM',
        line: 7,
        explanation: 'Abnormal hiring velocity without corporate credential verification.',
      },
    ],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: false,
      guaranteedIncome: true,
      freeEmailDomain: true,
      vagueJobDetails: true,
    },
    aiSummary:
      'Unverified recruiter identity. While no upfront payment was demanded, the communication relies exclusively on a generic Gmail handle and offers immediate hiring without a formal interview process.',
    recommendedAction:
      'Verify the recruiter identity on LinkedIn or through Vanguard Health corporate switchboard before releasing personal background history.',
  },
  {
    id: 'SCN-8040',
    verdict: 'LEGITIMATE',
    riskScore: 8.5,
    confidenceScore: 99.1,
    targetSubject: 'Senior Distributed Systems Engineer (Core Infrastructure)',
    targetCompany: 'Stripe, Inc. — Verified Career Portal',
    scanType: 'JOB_POSTING',
    engineUsed: 'DeBERTa + Gemini 1.5',
    processingTimeMs: 442,
    createdAt: '1h 22m ago',
    flaggedKeywords: [],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: false,
      guaranteedIncome: false,
      freeEmailDomain: false,
      vagueJobDetails: false,
    },
    aiSummary:
      'Authenticated enterprise job posting. Rigorous technical requirements, explicit compensation bands, standard Greenhouse intake portal, and verified DNS origin matching stripe.com.',
    recommendedAction:
      'Verified safe for application. Proceed normally through Stripe official career portal.',
  },
  {
    id: 'SCN-8039',
    verdict: 'CONFIRMED_SCAM',
    riskScore: 91.0,
    confidenceScore: 96.5,
    targetSubject: 'Crypto Operations Specialist (WhatsApp Onboarding Directive)',
    targetCompany: 'Binance US Partners Group — Impersonation',
    scanType: 'RECRUITER_EMAIL',
    engineUsed: 'DeBERTa + Gemini 1.5',
    processingTimeMs: 388,
    createdAt: '3h ago',
    flaggedKeywords: [
      {
        keyword: 'Connect via WhatsApp +44 7911...',
        category: 'OFF_PLATFORM_INTERVIEW',
        severity: 'CRITICAL',
        line: 3,
        explanation: 'Off-platform redirect to unmonitored encrypted personal messaging.',
      },
      {
        keyword: 'Transfer daily USDT commissions to testing wallet',
        category: 'ADVANCE_FEE',
        severity: 'CRITICAL',
        line: 11,
        explanation: 'Money-mule laundering fraud asking applicant to route cryptocurrency.',
      },
    ],
    riskIndicators: {
      asksForMoney: true,
      suspiciousContact: true,
      guaranteedIncome: true,
      freeEmailDomain: true,
      vagueJobDetails: true,
    },
    aiSummary:
      'Classic task scam and unauthorized financial transmission. The attacker seeks to turn the victim into a money mule by processing pseudo-crypto commissions through personal wallets.',
    recommendedAction:
      'Terminate engagement immediately. Under no circumstances should crypto addresses or personal bank info be provided.',
  },
  {
    id: 'SCN-8038',
    verdict: 'CONFIRMED_SCAM',
    riskScore: 88.0,
    confidenceScore: 94.0,
    targetSubject: 'Data Entry Associate - $48/hr Entry Level (Immediate Hire)',
    targetCompany: 'MedLife Diagnostics Care — Fraud Ring',
    scanType: 'OFFER_LETTER',
    engineUsed: 'Regex Fallback',
    processingTimeMs: 82,
    createdAt: '5h ago',
    flaggedKeywords: [
      {
        keyword: 'Guaranteed $48/hour no experience needed',
        category: 'UNREALISTIC_COMP',
        severity: 'HIGH',
        line: 5,
        explanation: 'Compensation is 350% above industry median, intended as phishing bait.',
      },
      {
        keyword: 'Send SSN and photo ID to register portal',
        category: 'PII_HARVESTING',
        severity: 'CRITICAL',
        line: 12,
        explanation: 'Pre-interview credential harvesting without employer identification number.',
      },
    ],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: true,
      guaranteedIncome: true,
      freeEmailDomain: false,
      vagueJobDetails: true,
    },
    aiSummary:
      'Identity theft harvesting scam. Exploits entry-level applicants by promising inflated hourly pay in exchange for immediate government ID and Social Security documentation.',
    recommendedAction:
      'Do not submit identity documents. Report posting to host platform abuse team.',
  },
  {
    id: 'SCN-8037',
    verdict: 'LEGITIMATE',
    riskScore: 12.0,
    confidenceScore: 97.8,
    targetSubject: 'Product Marketing Lead (Enterprise Growth)',
    targetCompany: 'Linear Orbit Inc. — Verified Listing',
    scanType: 'JOB_POSTING',
    engineUsed: 'DeBERTa + Gemini 1.5',
    processingTimeMs: 405,
    createdAt: '7h ago',
    flaggedKeywords: [],
    riskIndicators: {
      asksForMoney: false,
      suspiciousContact: false,
      guaranteedIncome: false,
      freeEmailDomain: false,
      vagueJobDetails: false,
    },
    aiSummary:
      'Authentic career opportunity. Clear role expectations, explicit equity compensation details, and corporate domain verification through Ashby career endpoint.',
    recommendedAction: 'Safe to proceed with formal candidate application.',
  },
]

// -----------------------------------------------------------------------------
// Smooth Animated Count-Up Hook (Prevents Digit Jitter)
// -----------------------------------------------------------------------------

function CountUpValue({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const [display, setDisplay] = useState(value)
  const prevVal = useRef(value)

  useEffect(() => {
    const startVal = prevVal.current
    const endVal = value
    prevVal.current = value

    if (startVal === endVal) return

    let startTimestamp: number | null = null
    const duration = 650 // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      const current = startVal + (endVal - startVal) * ease
      setDisplay(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplay(endVal)
      }
    }

    requestAnimationFrame(step)
  }, [value])

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

// -----------------------------------------------------------------------------
// Mini 5-Bar Inline Sparkline
// -----------------------------------------------------------------------------

function MiniSparkline({
  data,
  color = '#0D9488',
}: {
  data: number[]
  color?: string
}) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-[3px] h-4">
      {data.map((val, idx) => {
        const heightPct = Math.max(25, Math.round(((val - min) / range) * 100))
        return (
          <div
            key={idx}
            className="w-1 rounded-[1px] transition-all duration-300"
            style={{
              height: `${heightPct}%`,
              backgroundColor: color,
              opacity: idx === data.length - 1 ? 1 : 0.45 + idx * 0.12,
            }}
          />
        )
      })}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Recharts Custom Tooltip (Theme-Aware Card, JetBrains Mono, Zero Lag)
// -----------------------------------------------------------------------------

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const safeItem = payload.find((p: any) => p.dataKey === 'safe')
    const suspiciousItem = payload.find((p: any) => p.dataKey === 'suspicious')
    const scamItem = payload.find((p: any) => p.dataKey === 'scams')

    const safeVal = safeItem ? Number(safeItem.value) : 0
    const suspiciousVal = suspiciousItem ? Number(suspiciousItem.value) : 0
    const scamVal = scamItem ? Number(scamItem.value) : 0
    const total = safeVal + suspiciousVal + scamVal
    const scamRate = total > 0 ? ((scamVal / total) * 100).toFixed(1) : '0.0'

    return (
      <div className="bg-surface border border-border shadow-xl rounded-lg p-3 font-sans text-xs min-w-[210px] space-y-2 pointer-events-none">
        <div className="flex items-center justify-between border-b border-border pb-1.5 font-mono text-[11px] text-ink-muted">
          <span>{label}</span>
          <span className="font-semibold text-ink">{total} Total Scans</span>
        </div>

        <div className="space-y-1 font-mono text-[11px]">
          {safeItem && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <span className="w-2 h-2 rounded-[2px] bg-safe" />
                Verified Safe:
              </span>
              <span className="font-medium text-ink tabular-nums">{safeVal}</span>
            </div>
          )}

          {suspiciousItem && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <span className="w-2 h-2 rounded-[2px] bg-warn" />
                Suspicious:
              </span>
              <span className="font-medium text-ink tabular-nums">{suspiciousVal}</span>
            </div>
          )}

          {scamItem && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-scam">
                <span className="w-2 h-2 rounded-[2px] bg-scam" />
                Confirmed Scams:
              </span>
              <span className="font-semibold text-scam tabular-nums">{scamVal}</span>
            </div>
          )}
        </div>

        <div className="pt-1.5 border-t border-border flex items-center justify-between font-mono text-[10px] text-ink-muted">
          <span>FRAUD CONVERSION RATE:</span>
          <span className="text-scam font-bold tabular-nums">{scamRate}%</span>
        </div>
      </div>
    )
  }
  return null
}

// -----------------------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// -----------------------------------------------------------------------------

export default function DashboardPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // State Filters
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('all')
  const [timeRange, setTimeRange] = useState<TimeRangeType>('30D')

  // Series Toggles for Recharts
  const [showSafeSeries, setShowSafeSeries] = useState(true)
  const [showSuspiciousSeries, setShowSuspiciousSeries] = useState(false)
  const [showScamSeries, setShowScamSeries] = useState(true)

  // Interactive Hover for Fraud Vectors
  const [hoveredVectorId, setHoveredVectorId] = useState<string | null>(null)

  // Recent Investigations Search & Status Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED_SCAM' | 'SUSPICIOUS' | 'LEGITIMATE'>('ALL')

  // Slide-Over Quick Inspector
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null)

  // Engine Status Popover
  const [showEngineStatus, setShowEngineStatus] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowEngineStatus(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close slide-over on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedScan(null)
        setShowEngineStatus(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Active Metrics Calculation based on selected filters
  const currentMetrics = useMemo(() => {
    return METRICS_BY_FILTER[timeRange][selectedChannel]
  }, [timeRange, selectedChannel])

  // Chart Data based on timeRange
  const chartData = useMemo(() => {
    const rawData = TIMELINE_SERIES[timeRange]
    return rawData.map((d) => ({
      ...d,
      safe: d.legitimate,
      scams: d.scams,
      suspicious: d.suspicious,
    }))
  }, [timeRange])

  // Filtered Investigations
  const filteredInvestigations = useMemo(() => {
    return INITIAL_INVESTIGATIONS.filter((scan) => {
      // Status filter
      if (statusFilter !== 'ALL' && scan.verdict !== statusFilter) {
        return false
      }
      // Channel mapping if not 'all'
      if (selectedChannel === 'postings' && scan.scanType !== 'JOB_POSTING') return false
      if (selectedChannel === 'emails' && scan.scanType !== 'RECRUITER_EMAIL') return false
      if (selectedChannel === 'offers' && scan.scanType !== 'OFFER_LETTER') return false

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase()
        const matchesId = scan.id.toLowerCase().includes(q)
        const matchesSubject = (scan.targetSubject || '').toLowerCase().includes(q)
        const matchesCompany = (scan.targetCompany || '').toLowerCase().includes(q)
        return matchesId || matchesSubject || matchesCompany
      }
      return true
    })
  }, [statusFilter, selectedChannel, searchQuery])

  // Channel helper icon
  const getChannelBadge = (type: string) => {
    switch (type) {
      case 'JOB_POSTING':
        return { label: 'Job Posting', icon: Globe }
      case 'RECRUITER_EMAIL':
        return { label: 'Recruiter Email', icon: Mail }
      case 'OFFER_LETTER':
        return { label: 'Offer PDF', icon: FileCheck }
      default:
        return { label: 'Investigation', icon: FileText }
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-scam-bg selection:text-scam-text transition-colors">
      {/* ------------------------------------------------------------------- */}
      {/* 3.A Clean Top Navigation Bar with Daylight/Obsidian Switcher        */}
      {/* ------------------------------------------------------------------- */}
      <header className="sticky top-0 z-30 h-16 bg-canvas/85 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
        {/* Left: Clean Brand Mark & Navigation Links */}
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2.5 group transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-md bg-accent text-accent-fg flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-base tracking-tight text-ink">
                HireShield
              </span>
              <span className="text-[11px] font-medium text-ink-muted bg-elevated px-2 py-0.5 rounded-md border border-border">
                Fraud Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links with Framer Motion layoutId */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { label: 'Overview', href: '/dashboard', active: true },
              { label: 'Scan Job / Email', href: '/scan', active: false },
              { label: 'Company Registry', href: '/registry', active: false },
              { label: 'Audit Logs', href: '/logs', active: false },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                  link.active
                    ? 'text-ink font-semibold'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <span>{link.label}</span>
                {link.active && (
                  <motion.div
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-ink"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Engine Status Pill, Daily Quota Meter, Theme Toggle, Primary CTA */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Interactive Engine Status Pill with Popover */}
          <div className="relative" ref={popoverRef}>
            <button
              onClick={() => setShowEngineStatus((prev) => !prev)}
              onMouseEnter={() => setShowEngineStatus(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono tabular-nums text-ink hover:border-ink/40 transition-all shadow-xs cursor-pointer select-none"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-safe" />
              </span>
              <span className="font-sans font-medium text-xs text-ink hidden sm:inline">
                All Systems Operational
              </span>
              <span className="text-ink-muted hidden sm:inline">·</span>
              <span className="text-ink-muted font-mono text-[11px]">410ms avg</span>
            </button>

            {/* Popover on Hover/Click */}
            <AnimatePresence>
              {showEngineStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  onMouseLeave={() => setShowEngineStatus(false)}
                  className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl p-4 z-40 text-xs font-sans space-y-3 specular-card"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-semibold text-ink">
                      Detection Cascade Health
                    </span>
                    <span className="font-mono text-[10px] text-safe bg-safe-bg px-1.5 py-0.5 rounded font-medium border border-safe">
                      SLA COMPLIANT
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-safe" />
                          <span className="font-medium text-ink">
                            DeBERTa-v3 Classifier
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted pl-3">
                          Local NLP classification tier
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-safe font-medium">
                        Online · 18ms
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-safe" />
                          <span className="font-medium text-ink">
                            Gemini 1.5 Flash
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted pl-3">
                          Deep semantic reasoning engine
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-safe font-medium">
                        Online · 392ms
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-warn" />
                          <span className="font-medium text-ink">
                            Regex Heuristic Fallback
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted pl-3">
                          Zero-downtime offline pattern safety
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-ink-muted font-medium">
                        Standby · 0.8ms
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px] text-ink-muted">
                    <span>CASCADE ROUTING:</span>
                    <span className="text-ink font-medium">98.4% AI Primary</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Daily Quota Meter */}
          <div
            className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-mono tabular-nums text-ink-muted shadow-xs select-none"
            title="7 scans remaining in current billing window"
          >
            <span className="font-medium text-ink">18 / 25</span>
            <span className="text-ink-muted">used today</span>
            <div className="w-10 h-1.5 bg-elevated rounded-full overflow-hidden">
              <div className="h-full bg-ink rounded-full" style={{ width: '72%' }} />
            </div>
          </div>

          {/* Daylight / Obsidian Theme Switcher */}
          <ThemeToggle />

          {/* Primary CTA */}
          <button
            onClick={() => router.push('/scan')}
            className="flex items-center space-x-1.5 bg-accent hover:opacity-90 active:scale-[0.98] text-accent-fg px-3.5 py-1.5 rounded-md text-xs font-medium transition-all shadow-xs cursor-pointer"
          >
            <span>+ New Scan</span>
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* Main Content Workspace                                              */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ----------------------------------------------------------------- */}
        {/* 3.B Header & Interactive Timeframe / Channel Controls             */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-ink">
              Recruitment Threat Overview
            </h1>
            <p className="text-sm text-ink-muted mt-1 font-sans">
              Real-time analysis of job postings, recruiter outreach, and offer documents.
            </p>
          </div>

          {/* Two Clean Segmented Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Channel Filter Segmented Control */}
            <div className="flex items-center bg-elevated p-1 rounded-lg border border-border">
              {[
                { id: 'all', label: 'All Scans' },
                { id: 'postings', label: 'Job Postings' },
                { id: 'emails', label: 'Recruiter Emails' },
                { id: 'offers', label: 'Offer PDFs' },
              ].map((tab) => {
                const isSelected = selectedChannel === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedChannel(tab.id as ChannelType)}
                    className={`relative px-3 py-1.5 text-xs font-medium transition-all select-none cursor-pointer rounded-md ${
                      isSelected
                        ? 'text-ink font-semibold'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeChannelPill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-surface rounded-md shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* 2. Date Range Segmented Control */}
            <div className="flex items-center bg-elevated p-1 rounded-lg border border-border">
              {(['7D', '30D', '90D'] as TimeRangeType[]).map((range) => {
                const isSelected = timeRange === range
                return (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`relative px-3 py-1.5 text-xs font-mono font-medium transition-all select-none cursor-pointer rounded-md ${
                      isSelected
                        ? 'text-ink font-bold'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeDatePill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-surface rounded-md shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{range}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3.C The 4-Column Structural Hairline KPI Strip                    */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 bg-border gap-[1px] border border-border rounded-xl overflow-hidden shadow-xs">
          {/* Cell 1: Total Scans Analyzed */}
          <div className="bg-surface p-6 flex flex-col justify-between hover:bg-elevated/40 transition-colors">
            <div>
              <div className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                Total Scans Analyzed
              </div>
              <div className="text-3xl font-mono tabular-nums font-semibold text-ink mt-2">
                <CountUpValue value={currentMetrics.totalScans} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-safe">
                ↑ {currentMetrics.totalScansTrend}
              </span>
              <MiniSparkline
                data={SPARKLINE_DATA[1]}
                color={isDark ? '#34D399' : '#0D9488'}
              />
            </div>
          </div>

          {/* Cell 2: Confirmed Scams Blocked */}
          <div className="bg-surface p-6 flex flex-col justify-between hover:bg-elevated/40 transition-colors">
            <div>
              <div className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                Confirmed Scams Blocked
              </div>
              <div className="text-3xl font-mono tabular-nums font-semibold text-scam mt-2">
                <CountUpValue value={currentMetrics.confirmedScams} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-scam">
                {currentMetrics.confirmedScamsPct}
              </span>
              <MiniSparkline
                data={SPARKLINE_DATA[2]}
                color={isDark ? '#F87171' : '#E11D48'}
              />
            </div>
          </div>

          {/* Cell 3: Suspicious / Escalated to AI */}
          <div className="bg-surface p-6 flex flex-col justify-between hover:bg-elevated/40 transition-colors">
            <div>
              <div className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                Suspicious / Escalated to AI
              </div>
              <div className="text-3xl font-mono tabular-nums font-semibold text-warn mt-2">
                <CountUpValue value={currentMetrics.suspiciousScans} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono font-medium text-warn">
                {currentMetrics.suspiciousScansPct}
              </span>
              <MiniSparkline
                data={SPARKLINE_DATA[3]}
                color={isDark ? '#FBBF24' : '#D97706'}
              />
            </div>
          </div>

          {/* Cell 4: Mean Detection Speed */}
          <div className="bg-surface p-6 flex flex-col justify-between hover:bg-elevated/40 transition-colors">
            <div>
              <div className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                Mean Detection Speed
              </div>
              <div className="text-3xl font-mono tabular-nums font-semibold text-ink mt-2">
                <CountUpValue value={currentMetrics.meanLatencyMs} suffix="ms" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono text-ink-muted">
                {currentMetrics.aiPrimaryPct}
              </span>
              <MiniSparkline
                data={SPARKLINE_DATA[4]}
                color={isDark ? '#8E8C84' : '#686660'}
              />
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3.D Main Analytical Section (12-Column Asymmetric Split)          */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Columns: Interactive Scan Volume & Threat Trend */}
          <div className="lg:col-span-8 bg-surface border border-border rounded-xl p-6 shadow-xs space-y-6 specular-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-sans font-semibold text-base text-ink">
                  Scan Volume vs. Confirmed Fraud
                </h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Daily verified traffic volume overlaid with high-confidence fraud detection rate.
                </p>
              </div>

              {/* Interactive Legend Checkbox Pills */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                {/* Verified Safe Toggle */}
                <button
                  onClick={() => setShowSafeSeries((v) => !v)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none text-[11px] ${
                    showSafeSeries
                      ? 'border-safe bg-safe-bg text-safe font-medium'
                      : 'border-border text-ink-muted opacity-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-[2px] bg-safe" />
                  <span>Verified Safe</span>
                </button>

                {/* Suspicious Toggle */}
                <button
                  onClick={() => setShowSuspiciousSeries((v) => !v)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none text-[11px] ${
                    showSuspiciousSeries
                      ? 'border-warn bg-warn-bg text-warn font-medium'
                      : 'border-border text-ink-muted opacity-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-[2px] bg-warn" />
                  <span>Suspicious</span>
                </button>

                {/* Confirmed Scam Toggle */}
                <button
                  onClick={() => setShowScamSeries((v) => !v)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer select-none text-[11px] ${
                    showScamSeries
                      ? 'border-scam bg-scam-bg text-scam font-medium'
                      : 'border-border text-ink-muted opacity-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-[2px] bg-scam" />
                  <span>Confirmed Scam</span>
                </button>
              </div>
            </div>

            {/* Recharts ComposedChart */}
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="scamGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isDark ? '#F87171' : '#E11D48'}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDark ? '#F87171' : '#E11D48'}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? '#262622' : '#F0EFEA'}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fill: isDark ? '#8E8C84' : '#686660',
                      fontSize: 11,
                      fontFamily: 'monospace',
                    }}
                    tickLine={false}
                    axisLine={{ stroke: isDark ? '#262622' : '#E6E4DD' }}
                  />

                  <YAxis
                    tick={{
                      fill: isDark ? '#8E8C84' : '#686660',
                      fontSize: 11,
                      fontFamily: 'monospace',
                    }}
                    tickLine={false}
                    axisLine={{ stroke: isDark ? '#262622' : '#E6E4DD' }}
                  />

                  <Tooltip content={<CustomChartTooltip />} />

                  {/* Verified Safe Bars */}
                  {showSafeSeries && (
                    <Bar
                      dataKey="safe"
                      fill={isDark ? '#262622' : '#E6E4DD'}
                      radius={[3, 3, 0, 0]}
                      barSize={14}
                      activeBar={{ fill: isDark ? '#34D399' : '#0D9488' }}
                    />
                  )}

                  {/* Suspicious Bars */}
                  {showSuspiciousSeries && (
                    <Bar
                      dataKey="suspicious"
                      fill={isDark ? 'rgba(217, 119, 6, 0.35)' : '#FDE68A'}
                      radius={[3, 3, 0, 0]}
                      barSize={14}
                      activeBar={{ fill: isDark ? '#FBBF24' : '#D97706' }}
                    />
                  )}

                  {/* Confirmed Scams Area Spline */}
                  {showScamSeries && (
                    <Area
                      type="monotone"
                      dataKey="scams"
                      stroke={isDark ? '#F87171' : '#E11D48'}
                      strokeWidth={2.5}
                      fill="url(#scamGradient)"
                      dot={{
                        fill: isDark ? '#F87171' : '#E11D48',
                        stroke: isDark ? '#121210' : '#FFFFFF',
                        strokeWidth: 2,
                        r: 3.5,
                      }}
                      activeDot={{
                        r: 6,
                        fill: isDark ? '#F87171' : '#E11D48',
                        stroke: isDark ? '#121210' : '#FFFFFF',
                        strokeWidth: 2,
                      }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Footer Summary of Chart */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
              <span>ROLLING AGGREGATION: {timeRange} WINDOW</span>
              <span>MEAN AI DETECTION CONFIDENCE: 98.4%</span>
            </div>
          </div>

          {/* Right 4 Columns: "Fraud Vector Breakdown" (Segmented Bar + Hover List) */}
          <div className="lg:col-span-4 bg-surface border border-border rounded-xl p-6 shadow-xs space-y-6 specular-card">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-sans font-semibold text-base text-ink">
                  Fraud Vector Breakdown
                </h2>
                <span className="font-mono text-[11px] text-ink-muted bg-canvas px-2 py-0.5 rounded border border-border">
                  NORMALIZED
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Categorical distribution of neutralized scam attempts.
              </p>
            </div>

            {/* Top Summary & Multi-Segment Horizontal Bar */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl font-semibold tabular-nums text-ink">
                  228 total flags
                </span>
                <span className="font-mono text-xs text-ink-muted">100% of threat payload</span>
              </div>

              {/* Single Multi-Segment Horizontal Bar */}
              <div className="h-3 rounded-full overflow-hidden flex gap-0.5 bg-canvas p-0.5 border border-border">
                {FRAUD_VECTORS.map((vec) => {
                  const isHovered = hoveredVectorId === vec.id
                  const isAnyHovered = hoveredVectorId !== null
                  const activeColor = isDark ? vec.darkColor : vec.lightColor

                  return (
                    <div
                      key={vec.id}
                      style={{
                        width: `${vec.percentage}%`,
                        backgroundColor: activeColor,
                        opacity: isAnyHovered ? (isHovered ? 1 : 0.35) : 1,
                        transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
                      }}
                      className="h-full rounded-sm transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredVectorId(vec.id)}
                      onMouseLeave={() => setHoveredVectorId(null)}
                      title={`${vec.name}: ${vec.percentage}%`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Interactive Category Rows */}
            <div className="space-y-2.5">
              {FRAUD_VECTORS.map((vec) => {
                const isHovered = hoveredVectorId === vec.id
                const isAnyHovered = hoveredVectorId !== null
                const activeColor = isDark ? vec.darkColor : vec.lightColor

                return (
                  <div
                    key={vec.id}
                    onMouseEnter={() => setHoveredVectorId(vec.id)}
                    onMouseLeave={() => setHoveredVectorId(null)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isHovered
                        ? 'border-ink bg-elevated/70 shadow-xs'
                        : isAnyHovered
                        ? 'border-border opacity-40 bg-surface'
                        : 'border-border bg-surface hover:border-ink/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: activeColor }}
                        />
                        <span className="font-medium text-xs text-ink">
                          {vec.name}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums text-ink shrink-0">
                        {vec.shortLabel}
                      </span>
                    </div>

                    {/* Smooth 1-line plain English explanation expansion */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] text-ink-muted mt-2 pt-2 border-t border-border italic font-sans leading-relaxed">
                            {vec.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Quick Action */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => router.push('/scan')}
                className="w-full py-2.5 px-3 bg-canvas hover:bg-elevated border border-border hover:border-ink/40 text-ink rounded-md font-sans text-xs font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>Run Deep Scan on New Listing</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* 3.E Recent Investigations Table + Slide-Over Quick Inspector      */}
        {/* ----------------------------------------------------------------- */}
        <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden specular-card">
          {/* Table Header & Search/Filter Controls */}
          <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-normal text-ink">
                Recent Threat Investigations
              </h2>
              <p className="text-xs text-ink-muted mt-0.5 font-sans">
                Click any row to open the complete Redline Risk Dossier inspector.
              </p>
            </div>

            {/* Live Search and Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Input */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by company, job, ID..."
                  className="w-full pl-8 pr-3 py-1.5 bg-canvas border border-border rounded-md text-xs font-sans text-ink placeholder-ink-muted focus:outline-none focus:border-ink focus:bg-surface transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center bg-elevated p-1 rounded-lg border border-border">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'CONFIRMED_SCAM', label: 'Scams' },
                  { id: 'SUSPICIOUS', label: 'Suspicious' },
                  { id: 'LEGITIMATE', label: 'Safe' },
                ].map((pill) => {
                  const isSelected = statusFilter === pill.id
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setStatusFilter(pill.id as any)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all select-none cursor-pointer ${
                        isSelected
                          ? 'bg-surface text-ink font-semibold shadow-xs'
                          : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {pill.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-canvas border-b border-border text-ink-muted font-sans font-medium uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-6">Target Role & Company</th>
                  <th className="py-3 px-6">Channel</th>
                  <th className="py-3 px-6">Risk Score</th>
                  <th className="py-3 px-6">Verdict</th>
                  <th className="py-3 px-6">Detection Engine</th>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6 text-right">Inspector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                {filteredInvestigations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-ink-muted">
                      No threat investigations matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvestigations.map((scan) => {
                    const isScam = scan.verdict === 'CONFIRMED_SCAM'
                    const isSuspicious = scan.verdict === 'SUSPICIOUS'
                    const isSafe = scan.verdict === 'LEGITIMATE'
                    const channelInfo = getChannelBadge(scan.scanType)
                    const ChannelIcon = channelInfo.icon

                    return (
                      <tr
                        key={scan.id}
                        onClick={() => setSelectedScan(scan)}
                        className="hover:bg-elevated/40 cursor-pointer transition-colors group"
                      >
                        {/* Target Role & Company */}
                        <td className="py-3.5 px-6 max-w-sm">
                          <div className="font-medium text-ink group-hover:underline truncate">
                            {scan.targetSubject}
                          </div>
                          <div className="text-[11px] text-ink-muted truncate mt-0.5">
                            {scan.targetCompany}
                          </div>
                        </td>

                        {/* Channel Badge */}
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-canvas border border-border text-[11px] text-ink-muted">
                            <ChannelIcon className="w-3 h-3 text-ink-muted" />
                            <span>{channelInfo.label}</span>
                          </span>
                        </td>

                        {/* Risk Score */}
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-elevated h-1.5 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${scan.riskScore}%`,
                                  backgroundColor: isScam
                                    ? isDark ? '#F87171' : '#E11D48'
                                    : isSuspicious
                                    ? isDark ? '#FBBF24' : '#D97706'
                                    : isDark ? '#34D399' : '#0D9488',
                                }}
                              />
                            </div>
                            <span
                              className={`font-mono text-xs font-semibold tabular-nums ${
                                isScam
                                  ? 'text-scam'
                                  : isSuspicious
                                  ? 'text-warn'
                                  : 'text-safe'
                              }`}
                            >
                              {scan.riskScore.toFixed(0)}
                              <span className="text-ink-muted font-normal text-[10px]">
                                /100
                              </span>
                            </span>
                          </div>
                        </td>

                        {/* Verdict Pill */}
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          {isScam && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-scam-bg text-scam border border-scam">
                              <span className="w-1.5 h-1.5 rounded-full bg-scam mr-1.5" />
                              Confirmed Scam
                            </span>
                          )}
                          {isSuspicious && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-warn-bg text-warn border border-warn">
                              <span className="w-1.5 h-1.5 rounded-full bg-warn mr-1.5" />
                              Suspicious
                            </span>
                          )}
                          {isSafe && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-sans font-medium bg-safe-bg text-safe border border-safe">
                              <span className="w-1.5 h-1.5 rounded-full bg-safe mr-1.5" />
                              Verified Safe
                            </span>
                          )}
                        </td>

                        {/* Detection Engine */}
                        <td className="py-3.5 px-6 whitespace-nowrap">
                          <span className="font-mono text-[11px] text-ink-muted bg-canvas px-2 py-0.5 rounded border border-border">
                            {scan.engineUsed}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3.5 px-6 whitespace-nowrap font-mono text-[11px] text-ink-muted">
                          {scan.createdAt}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-6 whitespace-nowrap text-right">
                          <span className="text-xs font-medium text-ink group-hover:underline flex items-center justify-end space-x-1">
                            <span>Inspect</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* Interactive Slide-Over Quick Inspector Drawer                       */}
      {/* ------------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedScan && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScan(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-Over Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="w-screen max-w-md bg-surface border-l border-border shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 border-b border-border bg-canvas flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-semibold text-ink bg-surface px-2 py-0.5 rounded border border-border">
                        {selectedScan.id}
                      </span>

                      {selectedScan.verdict === 'CONFIRMED_SCAM' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-scam-bg text-scam border border-scam">
                          ● Confirmed Scam
                        </span>
                      )}
                      {selectedScan.verdict === 'SUSPICIOUS' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-warn-bg text-warn border border-warn">
                          ● Suspicious
                        </span>
                      )}
                      {selectedScan.verdict === 'LEGITIMATE' && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-safe-bg text-safe border border-safe">
                          ● Verified Safe
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-ink-muted">
                      Scanned {selectedScan.createdAt} · {selectedScan.processingTimeMs}ms total latency
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedScan(null)}
                    className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-elevated transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
                  {/* Subject and Entity Card */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
                      Target Entity & Role
                    </div>
                    <h3 className="font-serif text-xl font-medium text-ink">
                      {selectedScan.targetSubject}
                    </h3>
                    <p className="text-xs text-ink-muted">{selectedScan.targetCompany}</p>
                  </div>

                  {/* Risk Score & Confidence Strip */}
                  <div className="p-4 rounded-xl bg-canvas border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ink-muted">Composite Threat Index</span>
                      <span
                        className={`font-mono text-lg font-bold tabular-nums ${
                          selectedScan.verdict === 'CONFIRMED_SCAM'
                            ? 'text-scam'
                            : selectedScan.verdict === 'SUSPICIOUS'
                            ? 'text-warn'
                            : 'text-safe'
                        }`}
                      >
                        {selectedScan.riskScore.toFixed(1)} / 100
                      </span>
                    </div>

                    <div className="w-full bg-elevated h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedScan.riskScore}%`,
                          backgroundColor:
                            selectedScan.verdict === 'CONFIRMED_SCAM'
                              ? isDark ? '#F87171' : '#E11D48'
                              : selectedScan.verdict === 'SUSPICIOUS'
                              ? isDark ? '#FBBF24' : '#D97706'
                              : isDark ? '#34D399' : '#0D9488',
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted pt-1">
                      <span>CONFIDENCE: {selectedScan.confidenceScore}%</span>
                      <span>ENGINE: {selectedScan.engineUsed}</span>
                    </div>
                  </div>

                  {/* AI Executive Summary */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                      AI Executive Summary
                    </div>
                    <div className="p-3.5 rounded-lg bg-surface border border-border text-xs text-ink leading-relaxed font-sans shadow-xs specular-card">
                      {selectedScan.aiSummary}
                    </div>
                  </div>

                  {/* Flagged Red-Flag Phrases */}
                  {selectedScan.flaggedKeywords && selectedScan.flaggedKeywords.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                          Highlighted Red-Flag Phrases ({selectedScan.flaggedKeywords.length})
                        </span>
                        <span className="font-mono text-[10px] text-scam bg-scam-bg px-1.5 py-0.5 rounded border border-scam">
                          SEEKING AVOIDANCE
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {selectedScan.flaggedKeywords.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-scam/30 bg-scam-bg/20 space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-bold text-scam uppercase tracking-wider">
                                {item.category.replace('_', ' ')}
                              </span>
                              {item.line && (
                                <span className="font-mono text-[10px] text-ink-muted">
                                  Line {item.line}
                                </span>
                              )}
                            </div>

                            <div className="font-mono text-[11px] text-ink font-semibold bg-surface/90 p-1.5 rounded border border-scam/30">
                              &ldquo;{item.keyword}&rdquo;
                            </div>

                            {item.explanation && (
                              <p className="text-[11px] text-ink-muted font-sans">
                                {item.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Recommended Directive
                    </div>
                    <div className="p-3.5 rounded-lg bg-canvas border border-border text-xs text-ink font-sans">
                      <span className="font-semibold text-ink block mb-0.5">
                        Actionable Guidance:
                      </span>
                      {selectedScan.recommendedAction}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-border bg-canvas flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedScan(null)}
                    className="px-4 py-2 border border-border rounded-md text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface transition-all cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => router.push(`/scan?case=${selectedScan.id}`)}
                    className="flex-1 flex items-center justify-center space-x-1.5 bg-accent hover:opacity-90 text-accent-fg px-4 py-2 rounded-md text-xs font-medium transition-all shadow-xs cursor-pointer"
                  >
                    <span>Open Full Redline Report</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
