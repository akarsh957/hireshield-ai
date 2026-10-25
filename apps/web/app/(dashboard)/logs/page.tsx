'use client'

import React, { useState } from 'react'
import {
  Terminal,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react'

interface TelemetryLog {
  id: string
  timestamp: string
  service: string
  endpoint: string
  method: string
  statusCode: number
  latencyMs: number
  severity: 'INFO' | 'WARN' | 'ERROR'
  message: string
}

const TELEMETRY_RECORDS: TelemetryLog[] = [
  {
    id: 'LOG-9482',
    timestamp: '19:31:04.120',
    service: 'cascade-orchestrator',
    endpoint: '/api/scans/inspect',
    method: 'POST',
    statusCode: 200,
    latencyMs: 388,
    severity: 'INFO',
    message: 'Cascade consensus completed: DeBERTa (0.94) + Gemini 1.5 Flash (0.98) -> CONFIRMED_SCAM',
  },
  {
    id: 'LOG-9481',
    timestamp: '19:30:48.804',
    service: 'ai-service:deberta',
    endpoint: '/v1/models/deberta-v3:predict',
    method: 'POST',
    statusCode: 200,
    latencyMs: 18,
    severity: 'INFO',
    message: 'Local transformer inference: sequence length 184 tokens processed in 18.2ms',
  },
  {
    id: 'LOG-9480',
    timestamp: '19:29:12.440',
    service: 'gateway:rate-limiter',
    endpoint: '/api/auth/login',
    method: 'POST',
    statusCode: 200,
    latencyMs: 12,
    severity: 'INFO',
    message: 'Client 127.0.0.1 token verification successful. Quota remaining: 7/25 requests/min',
  },
  {
    id: 'LOG-9479',
    timestamp: '19:28:05.191',
    service: 'database:neon',
    endpoint: 'SELECT 1 (health-probe)',
    method: 'INTERNAL',
    statusCode: 200,
    latencyMs: 64,
    severity: 'INFO',
    message: 'Connection pool heartbeat acknowledged by Neon serverless cluster',
  },
  {
    id: 'LOG-9478',
    timestamp: '19:26:30.012',
    service: 'cascade:heuristic-fallback',
    endpoint: '/api/scans/inspect',
    method: 'POST',
    statusCode: 200,
    latencyMs: 82,
    severity: 'WARN',
    message: 'FastAPI timeout simulator triggered: Rule-based regex fallback activated seamlessly',
  },
]

export default function TelemetryLogsPage() {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = TELEMETRY_RECORDS.filter((log) => {
    const matchesSearch =
      log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterSeverity === 'ALL') return matchesSearch
    return matchesSearch && log.severity === filterSeverity
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-ink-muted uppercase tracking-wider mb-1">
            <span>ENGINEERING TELEMETRY</span>
            <span>·</span>
            <span>CASCADE TRACING</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
            System Telemetry & Fallback Audit
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 font-sans">
            Diagnostic events, AI cascade latencies, Upstash Redis rate-limit triggers, and zero-downtime heuristic fallback logs.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center bg-surface p-1 rounded-lg border border-border specular-card text-xs font-mono">
          {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterSeverity === sev
                  ? 'bg-accent text-accent-fg font-semibold'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-surface p-4 rounded-xl border border-border specular-card flex items-center space-x-3">
        <Terminal className="w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter logs by endpoint, service name, or cascade trigger message..."
          className="w-full bg-transparent text-xs font-mono text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <span className="font-mono text-[11px] text-ink-muted whitespace-nowrap">
          {filteredLogs.length} Events Logged
        </span>
      </div>

      {/* Monospace Telemetry Terminal Card */}
      <div className="bg-surface dark:bg-[#121210] rounded-xl p-6 border border-border dark:border-[#262622] shadow-sm specular-card space-y-4">
        <div className="flex items-center justify-between border-b border-border dark:border-[#262622] pb-3 text-xs font-mono">
          <span className="text-ink dark:text-ink-muted font-semibold tracking-wide">
            STREAMING TRACE DUMP // PORT: 4000
          </span>
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-safe animate-ping" />
            <span className="text-safe font-semibold">SOCKET LIVE</span>
          </span>
        </div>

        <div className="divide-y divide-border/60 dark:divide-white/10 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-ink-muted font-mono text-xs">
              No telemetry events match your filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isWarn = log.severity === 'WARN'
              const isError = log.severity === 'ERROR'

              return (
                <div
                  key={log.id}
                  className="py-3.5 hover:bg-elevated/60 dark:hover:bg-white/5 px-2.5 rounded-lg transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-ink-muted text-[11px] font-mono">{log.timestamp}</span>
                      <span className="text-border dark:text-white/20">·</span>
                      <span className="px-2 py-0.5 rounded bg-elevated dark:bg-white/10 text-ink dark:text-white font-medium text-[10px] border border-border dark:border-white/10">
                        {log.service}
                      </span>
                      <span className="text-ink-muted dark:text-ink-muted text-[11px] font-mono">{log.endpoint}</span>
                      {isWarn && (
                        <span className="px-1.5 py-0.5 rounded bg-warn-bg text-warn border border-warn text-[10px] font-bold">
                          WARN
                        </span>
                      )}
                      {isError && (
                        <span className="px-1.5 py-0.5 rounded bg-scam-bg text-scam border border-scam text-[10px] font-bold">
                          ERROR
                        </span>
                      )}
                    </div>
                    <div className="text-ink dark:text-[#F4F4F0] text-xs leading-relaxed font-mono font-medium">
                      {log.message}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-[11px] font-mono">
                    <span className="text-ink-muted font-medium">HTTP {log.statusCode}</span>
                    <span className="px-2 py-0.5 rounded bg-canvas dark:bg-white/5 text-ink dark:text-white border border-border dark:border-white/10 font-semibold text-[11px]">
                      {log.latencyMs}ms
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
