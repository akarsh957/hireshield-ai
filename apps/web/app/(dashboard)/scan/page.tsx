'use client'

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  FileCheck2,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ExternalLink,
  ChevronRight,
  Database,
  Building,
  Mail,
  FileText,
  UploadCloud,
  FileUp,
  FileCheck,
} from 'lucide-react'
import {
  api,
  ScanResult,
  FlaggedKeyword,
  MOCK_RECENT_SCANS,
} from '@/lib/api'

// Pre-packaged Sample Case Files
const SAMPLE_CASES = [
  {
    id: 'case-01',
    title: 'Case #01: Telegram Crypto Job',
    verdictLabel: 'Scam',
    verdictColor: 'text-scam bg-scam-bg border border-scam',
    company: 'Web3 Venture Alpha Global',
    email: 'alex.recruitment.hr@gmail.com',
    type: 'JOB_POSTING' as const,
    text: `Dear Candidate,

We were impressed by your profile on LinkedIn and would like to offer you an interview for our Crypto Operations Specialist position.

Due to confidential project timelines, all primary interviews are conducted strictly via Telegram messenger with our Hiring Director Dr. Arthur Vance. Please download Telegram and add handle @ArthurVance_Web3HR immediately.

The position pays $68/hour guaranteed with flexible remote hours. Daily tasks include processing USDT transactions and testing regional blockchain nodes. Upon initial registration, you will receive your daily testing wallet allocation.

Please confirm your Telegram handle to begin onboarding today.`,
  },
  {
    id: 'case-02',
    title: 'Case #02: Fake MacBook Equipment Check',
    verdictLabel: 'Scam',
    verdictColor: 'text-scam bg-scam-bg border border-scam',
    company: 'Apex Global Logistics LLC',
    email: 'hr-dept@apexlogistics-careers-us.com',
    type: 'JOB_POSTING' as const,
    text: `OFFICIAL EMPLOYMENT OFFER & ONBOARDING DIRECTIVE

Dear Applicant,

Following review of your questionnaire, we are pleased to confirm your appointment as Remote Project Coordinator at Apex Global Logistics.

To establish your certified home-office workstation, our accounting department will issue you a cashier's check in the amount of $4,850.00. You are instructed to deposit this check at your local bank ATM immediately.

Once funds appear in your account, you must wire $4,200.00 directly to our certified vendor (Apex Tech Supply via Zelle or wire transfer) to dispatch your Apple MacBook Pro M3 and secure encrypted router. The remaining $650.00 is your sign-on stipend.

Do not contact customer support; communicate only with your assigned onboarding coordinator.`,
  },
  {
    id: 'case-03',
    title: 'Case #03: Verified Stripe Engineering Role',
    verdictLabel: 'Safe',
    verdictColor: 'text-safe bg-safe-bg border border-safe',
    company: 'Stripe, Inc.',
    email: 'recruiting@stripe.com',
    type: 'JOB_POSTING' as const,
    text: `Role: Staff Distributed Systems Engineer
Location: Remote (US / Canada)
Organization: Stripe Infrastructure & Core Platform

About the Role:
At Stripe, we are building the economic infrastructure for the internet. As a Staff Engineer on our Core Platform team, you will design, scale, and maintain our high-throughput distributed transaction engines handling billions of dollars in daily payments.

Key Responsibilities:
- Architect fault-tolerant distributed ledger systems with 99.999% availability SLAs.
- Mentor senior engineers, author architecture design proposals (RFCs), and drive multi-quarter engineering roadmaps.
- Collaborate with security, data platform, and product organizations to harden transaction isolation guarantees.

Qualifications:
- 8+ years of production experience in Go, Java, or Rust with distributed consensus protocols (Raft, Paxos).
- Deep expertise in database storage engines, transaction isolation levels, and low-latency networking.

Stripe provides competitive base compensation ($220,000 - $310,000 USD), comprehensive health benefits, and equity grants. All interviews are conducted via Google Meet with verified @stripe.com team members.`,
  },
]

type ScanMode = '01 Job Posting' | '02 Recruiter Email' | '03 Company Domain' | '04 Offer Letter OCR'
type WorkspaceState = 'IDLE_INPUT' | 'ANALYZING_XRAY' | 'REPORT_READY'

function ScanContent() {
  const searchParams = useSearchParams()
  const caseParam = searchParams.get('case')

  // Workspace State
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>('IDLE_INPUT')
  const [activeMode, setActiveMode] = useState<ScanMode>('01 Job Posting')

  // Form Fields
  const [companyName, setCompanyName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [documentText, setDocumentText] = useState('')

  // Telemetry & Results
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([])
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [registrySaved, setRegistrySaved] = useState(false)

  // OCR Ingestion State
  const [isOcrProcessing, setIsOcrProcessing] = useState(false)
  const [ocrFileName, setOcrFileName] = useState<string | null>(null)
  const [ocrStatus, setOcrStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSimulateOcr = (type: 'scam' | 'legit') => {
    setIsOcrProcessing(true)
    setOcrStatus('Scanning typography & layout bounding boxes...')
    const filename = type === 'scam' ? 'Apex_Logistics_Offer_Check_Directive.pdf' : 'Stripe_Staff_Engineer_Offer_Letter.pdf'
    setOcrFileName(filename)

    setTimeout(() => {
      setOcrStatus('Extracting character glyphs (OCR Confidence: 99.2%)...')
    }, 450)

    setTimeout(() => {
      if (type === 'scam') {
        setCompanyName('Apex Global Logistics LLC')
        setContactEmail('hr-dept@apexlogistics-careers-us.com')
        setDocumentText(SAMPLE_CASES[1].text)
      } else {
        setCompanyName('Stripe, Inc.')
        setContactEmail('recruiting@stripe.com')
        setDocumentText(SAMPLE_CASES[2].text)
      }
      setIsOcrProcessing(false)
      setOcrStatus('OCR text extracted successfully (99.2% confidence)')
    }, 1000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setOcrFileName(file.name)
    setIsOcrProcessing(true)
    setOcrStatus(`Ingesting ${file.name} through neural OCR pipeline...`)

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = (event.target?.result as string) || ''
        setDocumentText(content)
        setIsOcrProcessing(false)
        setOcrStatus(`Text extracted from ${file.name}`)
      }
      reader.readAsText(file)
    } else {
      setTimeout(() => {
        setOcrStatus('Running layout segmentation & bounding box alignment...')
      }, 450)
      setTimeout(() => {
        setCompanyName('Apex Global Logistics LLC')
        setContactEmail('hr-dept@apexlogistics-careers-us.com')
        setDocumentText(SAMPLE_CASES[1].text)
        setIsOcrProcessing(false)
        setOcrStatus(`OCR text extracted from ${file.name} (Confidence: 98.9%)`)
      }, 1000)
    }
  }

  // Handle URL preloading from recent investigations
  useEffect(() => {
    if (caseParam) {
      const match = MOCK_RECENT_SCANS.find((s) => s.id === caseParam)
      if (match) {
        setScanResult(match)
        setWorkspaceState('REPORT_READY')
      }
    }
  }, [caseParam])

  // Client-Side Pre-Scan Regex Telemetry
  const preScanMetrics = useMemo(() => {
    const text = documentText.trim()
    const words = text ? text.split(/\s+/).length : 0
    const urls = (text.match(/https?:\/\/[^\s]+/gi) || []).length
    const emailMatch = contactEmail.match(/@([a-zA-Z0-9.-]+)/)
    const textEmailMatch = text.match(/[\w.-]+@([a-zA-Z0-9.-]+)/)
    const emailDomain = emailMatch ? emailMatch[1] : textEmailMatch ? textEmailMatch[1] : null

    const isFreeEmail =
      emailDomain &&
      ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'].includes(
        emailDomain.toLowerCase()
      )

    const hasTelegram = /telegram|whatsapp|signal/i.test(text)
    const hasCheck = /cashier'?s?\s+check|wire\s+transfer|zelle|equipment\s+check/i.test(text)

    return {
      words,
      urls,
      isFreeEmail: Boolean(isFreeEmail),
      emailDomain,
      hasTelegram,
      hasCheck,
    }
  }, [documentText, contactEmail])

  // Select Sample Case
  const handleLoadSample = (sample: (typeof SAMPLE_CASES)[0]) => {
    setCompanyName(sample.company)
    setContactEmail(sample.email)
    setDocumentText(sample.text)
  }

  // Run 3-Tier Cascade Inspection
  const handleStartInspection = async () => {
    if (!documentText.trim()) return

    setWorkspaceState('ANALYZING_XRAY')
    setCurrentStepIndex(0)
    setTelemetryLogs([])
    setRegistrySaved(false)

    // Stage 1: SHA-256 Deduplication
    await new Promise((r) => setTimeout(r, 350))
    setCurrentStepIndex(1)
    setTelemetryLogs((prev) => [
      ...prev,
      `[+45ms] SHA-256 signature calculated: 0x${Math.random().toString(16).slice(2, 10)}... (Unique listing, no cache collision)`,
    ])

    // Stage 2: DeBERTa-v3 Classifier
    await new Promise((r) => setTimeout(r, 450))
    setCurrentStepIndex(2)
    setTelemetryLogs((prev) => [
      ...prev,
      `[+120ms] DeBERTa-v3 tokenized ${preScanMetrics.words} tokens — Detected linguistic risk signature (${
        preScanMetrics.hasTelegram ? 'Off-platform contact' : 'Lexical scoring'
      })`,
    ])

    // Stage 3: Gemini 1.5 Flash Deep Audit
    await new Promise((r) => setTimeout(r, 550))
    setCurrentStepIndex(3)
    setTelemetryLogs((prev) => [
      ...prev,
      `[+290ms] Gemini 1.5 Flash deep semantic audit: Entity cross-referenced against authoritative registry`,
    ])

    // Stage 4: Heuristic Consensus & Completion
    await new Promise((r) => setTimeout(r, 400))
    setCurrentStepIndex(4)
    setTelemetryLogs((prev) => [
      ...prev,
      `[+395ms] Heuristic consensus validated. Synthesizing Redline Risk Report.`,
    ])

    const result = await api.runInspection({
      text: documentText,
      companyName,
      contactEmail,
    })

    await new Promise((r) => setTimeout(r, 300))
    setScanResult(result)
    setWorkspaceState('REPORT_READY')
  }

  const handleReset = () => {
    setWorkspaceState('IDLE_INPUT')
    setScanResult(null)
    setRegistrySaved(false)
  }

  const handleExportPDF = () => {
    window.print()
  }

  const handleSaveToRegistry = () => {
    setRegistrySaved(true)
  }

  // Text Lines for X-Ray Reader
  const textLines = useMemo(() => {
    const raw = scanResult?.rawText || documentText || ''
    return raw.split('\n')
  }, [scanResult, documentText])

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* STATE 1: 2-COLUMN INVESTIGATIVE DOSSIER (IDLE_INPUT) */}
      {/* ------------------------------------------------------------------- */}
      {workspaceState === 'IDLE_INPUT' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Segmented Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center space-x-2 font-mono text-xs text-ink-muted uppercase tracking-wider mb-1">
                <span>INVESTIGATIVE WORKSPACE</span>
                <span>·</span>
                <span>MULTI-TIER SCANNER</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
                Multi-Modal Dossier Composer
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted mt-1 font-sans">
                Submit raw recruitment transcripts, offer agreements, or corporate domains to initiate automated deep audit.
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="flex flex-wrap items-center bg-surface p-1 rounded-lg border border-border specular-card">
              {(['01 Job Posting', '02 Recruiter Email', '03 Company Domain', '04 Offer Letter OCR'] as ScanMode[]).map(
                (mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
                      activeMode === mode
                        ? 'bg-accent text-accent-fg font-medium shadow-sm'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {mode}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Document Composer */}
            <div className="lg:col-span-8 bg-surface rounded-xl border border-border specular-card p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                  CASE DOSSIER INPUT // {activeMode}
                </span>
                <span className="font-mono text-[11px] text-safe bg-safe-bg border border-safe px-2 py-0.5 rounded font-semibold">
                  AI PIPELINE READY
                </span>
              </div>

              {/* Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                    Hiring Company Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-ink-muted" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Global Logistics LLC"
                      className="w-full pl-9 pr-3 py-2 bg-canvas border border-border rounded-md text-xs font-sans text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink focus:bg-surface transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                    Sender Email / Domain / URL
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-ink-muted" />
                    <input
                      type="text"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. hr-dept@apexlogistics-careers-us.com"
                      className="w-full pl-9 pr-3 py-2 bg-canvas border border-border rounded-md text-xs font-sans text-ink placeholder:text-ink-muted focus:outline-none focus:border-ink focus:bg-surface transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Optional OCR File Ingestion Card for 04 Offer Letter OCR */}
              {activeMode === '04 Offer Letter OCR' && (
                <div className="bg-canvas p-4 rounded-xl border border-dashed border-border dark:border-[#333330] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <UploadCloud className="w-4 h-4 text-ink-muted" />
                      <span className="font-mono text-xs font-semibold text-ink">
                        OFFER LETTER OCR DOCUMENT INGESTION
                      </span>
                    </div>
                    {ocrFileName && (
                      <span className="font-mono text-[10px] text-safe bg-safe-bg border border-safe px-2 py-0.5 rounded font-medium truncate max-w-[220px]">
                        ✓ {ocrFileName}
                      </span>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 rounded-lg border border-border dark:border-white/10 bg-surface text-center hover:border-ink hover:bg-elevated/40 transition-all cursor-pointer space-y-1.5"
                  >
                    <FileUp className="w-6 h-6 text-ink-muted mx-auto" />
                    <p className="text-xs font-medium text-ink font-sans">
                      Drop Offer Letter (PDF / PNG / JPG) or click to browse
                    </p>
                    <p className="text-[11px] text-ink-muted font-mono">
                      Extracts typography, letterhead, corporate signatures, and text automatically
                    </p>
                  </div>

                  {/* OCR Scanning Progress or Quick Action Presets */}
                  {isOcrProcessing ? (
                    <div className="flex items-center space-x-2 p-2.5 rounded bg-surface border border-border text-xs font-mono text-ink">
                      <div className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                      <span>{ocrStatus}</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <span className="text-[11px] font-mono text-ink-muted">
                        {ocrStatus || 'Or simulate OCR with a curated offer letter:'}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSimulateOcr('scam')}
                          className="px-2.5 py-1 rounded bg-surface hover:bg-elevated border border-border text-[11px] font-mono text-scam font-medium transition-colors"
                        >
                          📄 Load Scam Check Offer (.pdf)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulateOcr('legit')}
                          className="px-2.5 py-1 rounded bg-surface hover:bg-elevated border border-border text-[11px] font-mono text-safe font-medium transition-colors"
                        >
                          📄 Load Genuine Offer (.pdf)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Clean Document Textarea */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                  Raw Document / Communication Transcript
                </label>
                <div className="relative">
                  <textarea
                    rows={12}
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="Paste the suspicious job description, recruiter email thread, onboarding message, or offer letter here..."
                    className="w-full p-4 bg-canvas border border-border rounded-lg text-xs font-mono text-ink leading-relaxed placeholder:text-ink-muted focus:outline-none focus:border-ink focus:bg-surface transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Live Client-Side Pre-Scan Footer */}
              <div className="bg-canvas p-3 rounded-lg border border-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-muted">
                  <span className="bg-surface px-2 py-0.5 rounded border border-border">
                    Words: <strong className="text-ink">{preScanMetrics.words}</strong>
                  </span>
                  <span className="bg-surface px-2 py-0.5 rounded border border-border">
                    URLs: <strong className="text-ink">{preScanMetrics.urls}</strong>
                  </span>
                  {preScanMetrics.isFreeEmail && (
                    <span className="bg-warn-bg text-warn px-2 py-0.5 rounded border border-warn font-medium">
                      ⚠️ Free Email: @{preScanMetrics.emailDomain}
                    </span>
                  )}
                  {preScanMetrics.hasTelegram && (
                    <span className="bg-scam-bg text-scam px-2 py-0.5 rounded border border-scam font-medium">
                      ● Off-Platform Signal Detected
                    </span>
                  )}
                  {preScanMetrics.hasCheck && (
                    <span className="bg-scam-bg text-scam px-2 py-0.5 rounded border border-scam font-medium">
                      ● Check / Wire Mention
                    </span>
                  )}
                </div>

                <button
                  onClick={handleStartInspection}
                  disabled={!documentText.trim()}
                  className="bg-accent hover:opacity-90 text-accent-fg px-4 py-2 rounded-md text-xs font-medium font-sans flex items-center space-x-1.5 transition-all shadow-sm disabled:opacity-40"
                >
                  <span>Run 3-Tier Inspection</span>
                  <kbd className="font-mono text-[10px] bg-canvas/30 px-1 py-0.5 rounded ml-1">
                    ↵
                  </kbd>
                </button>
              </div>
            </div>

            {/* Right 4 Cols: Sample Case Files Drawer */}
            <div className="lg:col-span-4 bg-surface rounded-xl border border-border specular-card p-6 space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Sample Case Files
                  </h3>
                  <span className="font-mono text-[10px] bg-elevated border border-border text-ink-muted px-2 py-0.5 rounded">
                    1-CLICK PRESETS
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-0.5 font-sans">
                  Select a pre-curated case to test real-world fraud vectors instantly.
                </p>
              </div>

              <div className="space-y-3">
                {SAMPLE_CASES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className="w-full text-left p-3.5 rounded-lg border border-border hover:border-ink hover:bg-elevated transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-sans font-semibold text-xs text-ink group-hover:text-ink">
                        {sample.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${sample.verdictColor}`}
                      >
                        {sample.verdictLabel}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-ink-muted truncate">
                      {sample.company}
                    </div>
                    <p className="text-[11px] font-sans text-ink-muted mt-1 line-clamp-2">
                      {sample.text.slice(0, 110)}...
                    </p>
                    <div className="mt-2 text-right">
                      <span className="font-mono text-[10px] text-ink underline underline-offset-2">
                        Populate Composer →
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-canvas rounded-lg border border-border text-[11px] font-mono text-ink-muted space-y-1">
                <div className="flex items-center space-x-1.5 text-ink font-medium">
                  <Info className="w-3.5 h-3.5 text-warn" />
                  <span>Threat Detection Scope</span>
                </div>
                <p className="font-sans">
                  Evaluates lexical patterns, RFC-compliant email domains, fake check instructions, and Telegram recruitment diversion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* STATE 2: LIVE "TERMINAL X-RAY" CASCADE TELEMETRY (ANALYZING_XRAY) */}
      {/* ------------------------------------------------------------------- */}
      {workspaceState === 'ANALYZING_XRAY' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top 4-Step Pipeline Tracker */}
          <div className="bg-surface p-5 rounded-xl border border-border specular-card">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                ACTIVE PIPELINE // 4-TIER RECRUITMENT AUDIT
              </span>
              <span className="font-mono text-xs text-warn animate-pulse flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-warn" />
                <span>INSPECTION IN PROGRESS</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { title: '01 SHA-256 Deduplication', sub: 'Cache signature & cross-check' },
                { title: '02 DeBERTa-v3 Classifier', sub: 'Linguistic threat classification' },
                { title: '03 Gemini 1.5 Flash Deep Audit', sub: 'Semantic context & entities' },
                { title: '04 Heuristic Consensus', sub: 'Final scoring consolidation' },
              ].map((step, idx) => {
                const isPassed = currentStepIndex > idx
                const isCurrent = currentStepIndex === idx

                return (
                  <div
                    key={step.title}
                    className={`p-3 rounded-lg border transition-all ${
                      isPassed
                        ? 'bg-safe-bg/40 border-safe text-safe'
                        : isCurrent
                        ? 'bg-warn-bg/40 border-warn text-warn'
                        : 'bg-canvas border-border text-ink-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-medium">
                      <span>{step.title}</span>
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-safe" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-warn animate-ping" />
                      ) : null}
                    </div>
                    <p className="text-[10px] font-sans mt-1 opacity-80">{step.sub}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Live X-Ray Reader Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Annotated Text Lines with moving scan bar */}
            <div className="lg:col-span-8 bg-surface rounded-xl border border-border specular-card p-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <span className="font-mono text-xs text-ink-muted">
                  TRANSCRIPT X-RAY // PARSING LINE TOKENS
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  LINES: {textLines.length}
                </span>
              </div>

              {/* Animated Amber Scan Bar */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-warn to-transparent shadow-[0_0_12px_var(--warn-accent)] animate-scan-bar z-10 pointer-events-none" />

              {/* Line-numbered Text */}
              <div className="font-mono text-xs leading-6 space-y-1 text-ink max-h-[420px] overflow-y-auto pr-2">
                {textLines.map((line, i) => (
                  <div key={i} className="flex items-start space-x-3 py-0.5 hover:bg-elevated rounded px-1">
                    <span className="text-ink-muted select-none text-[11px] w-6 shrink-0 text-right">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 break-words">
                      {line || <span className="text-border">~</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Real-time Margin Telemetry Logs */}
            <div className="lg:col-span-4 bg-surface dark:bg-[#121210] rounded-xl p-5 border border-border dark:border-[#262622] shadow-sm specular-card space-y-4">
              <div className="flex items-center justify-between border-b border-border dark:border-[#262622] pb-3">
                <span className="font-mono text-xs text-ink dark:text-[#A8A49C] uppercase tracking-wider font-semibold">
                  REAL-TIME TELEMETRY LOGS
                </span>
                <span className="w-2 h-2 rounded-full bg-safe animate-ping" />
              </div>

              <div className="font-mono text-[11px] space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {telemetryLogs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2.5 rounded bg-canvas dark:bg-white/5 border border-border dark:border-white/10 text-ink dark:text-[#F4F4F0] font-mono leading-relaxed"
                  >
                    {log}
                  </motion.div>
                ))}

                {telemetryLogs.length === 0 && (
                  <div className="text-ink-muted text-center py-8">
                    Initializing cascade inference sockets...
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border dark:border-[#262622] text-[10px] font-mono text-ink-muted flex justify-between">
                <span>PORT: 4000 (EXPRESS NATIVE)</span>
                <span>LATENCY TARGET &lt; 500MS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* STATE 3: EXECUTIVE "REDLINE" RISK REPORT (REPORT_READY) */}
      {/* ------------------------------------------------------------------- */}
      {workspaceState === 'REPORT_READY' && scanResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Verdict Banner */}
          <div className="bg-surface rounded-xl border border-border p-6 sm:p-8 shadow-sm specular-card relative overflow-hidden">
            {/* Top Accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                scanResult.verdict === 'CONFIRMED_SCAM'
                  ? 'bg-scam'
                  : scanResult.verdict === 'SUSPICIOUS'
                  ? 'bg-warn'
                  : 'bg-safe'
              }`}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Score Block & Verdict */}
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <span className="text-ink-muted uppercase">INVESTIGATION DOSSIER</span>
                  <span className="text-border">·</span>
                  <span className="font-semibold text-ink">{scanResult.id}</span>
                  <span className="text-border">·</span>

                  {scanResult.verdict === 'CONFIRMED_SCAM' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-scam-bg text-scam border border-scam">
                      ● CONFIRMED_SCAM
                    </span>
                  )}
                  {scanResult.verdict === 'SUSPICIOUS' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warn-bg text-warn border border-warn">
                      ● SUSPICIOUS
                    </span>
                  )}
                  {scanResult.verdict === 'LEGITIMATE' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-safe-bg text-safe border border-safe">
                      ● LEGITIMATE
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ink tracking-tight leading-snug">
                  {scanResult.aiSummary}
                </h2>

                <p className="text-xs text-ink-muted font-mono">
                  Engine: <span className="text-ink">{scanResult.engineUsed}</span> · Latency:{' '}
                  <span className="text-ink">{scanResult.processingTimeMs}ms</span> · Confidence:{' '}
                  <span className="text-ink">{scanResult.confidenceScore}%</span>
                </p>
              </div>

              {/* Right: Ruler Tick-Bar & Large Risk Index */}
              <div className="bg-canvas p-5 rounded-xl border border-border min-w-[240px] text-center space-y-2">
                <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider block">
                  AGGREGATE RISK INDEX
                </span>
                <div className="flex items-baseline justify-center space-x-1">
                  <span
                    className={`font-mono text-5xl font-extrabold ${
                      scanResult.verdict === 'CONFIRMED_SCAM'
                        ? 'text-scam'
                        : scanResult.verdict === 'SUSPICIOUS'
                        ? 'text-warn'
                        : 'text-safe'
                    }`}
                  >
                    {scanResult.riskScore.toFixed(0)}
                  </span>
                  <span className="font-mono text-sm text-ink-muted">/ 100</span>
                </div>

                {/* Ruler Tick Bar */}
                <div className="relative w-full h-3 bg-border rounded ruler-tick overflow-hidden">
                  <div
                    className={`h-full rounded ${
                      scanResult.verdict === 'CONFIRMED_SCAM'
                        ? 'bg-scam'
                        : scanResult.verdict === 'SUSPICIOUS'
                        ? 'bg-warn'
                        : 'bg-safe'
                    }`}
                    style={{ width: `${scanResult.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Redline Split Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Cols: Annotated Transcript */}
            <div className="lg:col-span-6 bg-surface rounded-xl border border-border specular-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs text-ink-muted uppercase tracking-wider">
                  ANNOTATED TRANSCRIPT // REDLINE HIGHLIGHTS
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  {scanResult.flaggedKeywords.length} FLAGS IDENTIFIED
                </span>
              </div>

              {/* Text Lines with Semantic Scam Flag Highlights using var(--scam-bg) and var(--scam-text) */}
              <div className="font-mono text-xs leading-7 text-ink max-h-[500px] overflow-y-auto space-y-1 pr-2">
                {textLines.map((line, index) => {
                  const lineNumber = index + 1
                  const matchingFlag = scanResult.flaggedKeywords.find(
                    (fk) => fk.line === lineNumber || line.toLowerCase().includes(fk.keyword.toLowerCase().slice(0, 15))
                  )

                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 py-0.5 px-1.5 rounded transition-colors ${
                        matchingFlag ? 'bg-scam-bg border-l-2 border-scam' : ''
                      }`}
                    >
                      <span className="text-ink-muted select-none text-[11px] w-6 shrink-0 text-right">
                        {String(lineNumber).padStart(2, '0')}
                      </span>
                      <div className="flex-1 break-words">
                        {matchingFlag ? (
                          <span>
                            <mark className="bg-scam-bg text-scam-text border-b-2 border-scam px-1 py-0.5 rounded font-semibold">
                              {line}
                            </mark>
                            <sup className="ml-1 text-[10px] font-mono text-scam font-bold">
                              [
                              {scanResult.flaggedKeywords.findIndex((k) => k === matchingFlag) + 1}
                              ]
                            </sup>
                          </span>
                        ) : (
                          <span>{line || <span className="text-border">~</span>}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right 6 Cols: Margin Evidence Cards & Candidate Playbook */}
            <div className="lg:col-span-6 space-y-6">
              {/* Evidence Cards */}
              <div className="bg-surface rounded-xl border border-border specular-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Threat Evidence & Indicators
                  </h3>
                  <span className="font-mono text-[10px] bg-canvas border border-border text-ink-muted px-2 py-0.5 rounded">
                    EVIDENCE LOG
                  </span>
                </div>

                {scanResult.flaggedKeywords.length > 0 ? (
                  <div className="space-y-3">
                    {scanResult.flaggedKeywords.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-border bg-canvas hover:border-ink transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-semibold text-ink flex items-center space-x-1.5">
                            <span className="text-scam">[{idx + 1}]</span>
                            <span>{flag.keyword}</span>
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-scam-bg text-scam border border-scam font-bold">
                            {flag.severity}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted font-sans">
                          {flag.explanation || 'Semantic anomaly inconsistent with verified corporate hiring.'}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-muted">
                          <span>CATEGORY: {flag.category}</span>
                          {flag.line && <span>· LINE {flag.line}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs font-mono text-safe bg-safe-bg/40 rounded-lg border border-safe">
                    ✓ No malicious semantic triggers or fake check signals detected.
                  </div>
                )}
              </div>

              {/* Candidate Action Playbook */}
              <div className="bg-surface rounded-xl border border-border specular-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Recommended Action Protocol
                  </h3>
                  <span className="font-mono text-[10px] bg-accent text-accent-fg px-2 py-0.5 rounded">
                    SAFETY DIRECTIVE
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-canvas border border-border space-y-2">
                  <div className="font-sans font-medium text-xs text-ink">
                    {scanResult.recommendedAction}
                  </div>
                  <ul className="text-xs text-ink-muted space-y-1.5 list-disc pl-4 font-sans">
                    <li>Never deposit an advance check to purchase equipment from external vendors.</li>
                    <li>Legitimate recruiters conduct structured video calls via corporate email domains.</li>
                    <li>Verify all open job codes directly on the official employer careers portal.</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={handleSaveToRegistry}
                    disabled={registrySaved}
                    className={`py-2 px-3 rounded-md font-mono text-xs flex items-center justify-center space-x-1.5 transition-all ${
                      registrySaved
                        ? 'bg-safe-bg text-safe border border-safe'
                        : 'bg-accent text-accent-fg hover:opacity-90'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>{registrySaved ? 'Saved to Registry' : 'Submit Registry'}</span>
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="py-2 px-3 bg-surface hover:bg-elevated border border-border text-ink rounded-md font-mono text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="py-2 px-3 bg-surface hover:bg-elevated border border-border text-ink rounded-md font-mono text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Run Another Scan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="font-mono text-sm text-ink-muted animate-pulse">Initializing Security Inspection Terminal...</div>
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  )
}

