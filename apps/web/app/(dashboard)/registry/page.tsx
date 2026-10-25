'use client'

import React, { useState } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  ExternalLink,
  AlertTriangle,
  Building,
  Mail,
  Calendar,
  Lock,
} from 'lucide-react'

interface RegistryEntry {
  id: string
  entityName: string
  reportedDomain: string
  category: 'EQUIPMENT_SCAM' | 'IMPERSONATION' | 'TELEGRAM_FRAUD' | 'VERIFIED_LEGITIMATE'
  verdict: 'CONFIRMED_SCAM' | 'LEGITIMATE'
  reportCount: number
  lastActive: string
  primaryIndicator: string
}

const REGISTRY_DATA: RegistryEntry[] = [
  {
    id: 'REG-1092',
    entityName: 'Apex Global Logistics LLC (Impersonator)',
    reportedDomain: 'apexlogistics-careers-us.com',
    category: 'EQUIPMENT_SCAM',
    verdict: 'CONFIRMED_SCAM',
    reportCount: 38,
    lastActive: '2 hours ago',
    primaryIndicator: 'Cashiers check overpayment scheme for MacBook hardware dispatch.',
  },
  {
    id: 'REG-1091',
    entityName: 'Vanguard Health Systems (Spoofed)',
    reportedDomain: 'vanguard-talent-acquisition.net',
    category: 'IMPERSONATION',
    verdict: 'CONFIRMED_SCAM',
    reportCount: 19,
    lastActive: 'Yesterday',
    primaryIndicator: 'Free webmail recruitment routing to deceptive questionnaire.',
  },
  {
    id: 'REG-1090',
    entityName: 'Stripe, Inc.',
    reportedDomain: 'stripe.com',
    category: 'VERIFIED_LEGITIMATE',
    verdict: 'LEGITIMATE',
    reportCount: 142,
    lastActive: '3 hours ago',
    primaryIndicator: 'Cryptographically signed DMARC/SPF authentication verified.',
  },
  {
    id: 'REG-1089',
    entityName: 'Web3 Venture Alpha Global',
    reportedDomain: 't.me/ArthurVance_Web3HR',
    category: 'TELEGRAM_FRAUD',
    verdict: 'CONFIRMED_SCAM',
    reportCount: 52,
    lastActive: '4 days ago',
    primaryIndicator: 'Demands cryptocurrency wallet allocation and off-platform interviews.',
  },
  {
    id: 'REG-1088',
    entityName: 'MedLife Diagnostics Care (Fake)',
    reportedDomain: 'medlife-online-work.org',
    category: 'EQUIPMENT_SCAM',
    verdict: 'CONFIRMED_SCAM',
    reportCount: 24,
    lastActive: '1 week ago',
    primaryIndicator: 'Pre-interview SSN credential and driver license harvesting.',
  },
]

export default function RegistryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'SCAM' | 'LEGITIMATE'>('ALL')

  const filteredEntries = REGISTRY_DATA.filter((entry) => {
    const matchesSearch =
      entry.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reportedDomain.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterCategory === 'SCAM') return matchesSearch && entry.verdict === 'CONFIRMED_SCAM'
    if (filterCategory === 'LEGITIMATE') return matchesSearch && entry.verdict === 'LEGITIMATE'
    return matchesSearch
  })

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-ink-muted uppercase tracking-wider mb-1">
            <span>PUBLIC SAFETY DATABASE</span>
            <span>·</span>
            <span>COMMUNITY & AI VERIFIED</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-ink">
            Recruitment Threat & Trust Registry
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1 font-sans">
            Global repository of verified recruitment entities, known malicious domain spoofing rings, and off-platform fraudulent handles.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-surface p-1 rounded-lg border border-border specular-card text-xs font-mono">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterCategory === 'ALL'
                ? 'bg-accent text-accent-fg font-semibold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            All Entities
          </button>
          <button
            onClick={() => setFilterCategory('SCAM')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterCategory === 'SCAM'
                ? 'bg-scam text-white font-semibold'
                : 'text-ink-muted hover:text-scam'
            }`}
          >
            Confirmed Scams
          </button>
          <button
            onClick={() => setFilterCategory('LEGITIMATE')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterCategory === 'LEGITIMATE'
                ? 'bg-safe text-white font-semibold'
                : 'text-ink-muted hover:text-safe'
            }`}
          >
            Verified Safe
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-surface p-4 rounded-xl border border-border specular-card flex items-center space-x-3">
        <Search className="w-4 h-4 text-ink-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company name, suspicious domain, email host, or telegram handle..."
          className="w-full bg-transparent text-xs font-sans text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <span className="font-mono text-[11px] text-ink-muted whitespace-nowrap">
          {filteredEntries.length} Records Found
        </span>
      </div>

      {/* Registry Table Card */}
      <div className="bg-surface rounded-xl border border-border specular-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6 font-medium">Record ID</th>
                <th className="py-3.5 px-6 font-medium">Reported Entity</th>
                <th className="py-3.5 px-6 font-medium">Reported Domain / Endpoint</th>
                <th className="py-3.5 px-6 font-medium">Status Verdict</th>
                <th className="py-3.5 px-6 font-medium">Primary Threat Indicator</th>
                <th className="py-3.5 px-6 font-medium text-right">Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {filteredEntries.map((item) => {
                const isScam = item.verdict === 'CONFIRMED_SCAM'
                return (
                  <tr key={item.id} className="hover:bg-elevated/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-ink">
                      {item.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-ink">
                      {item.entityName}
                    </td>
                    <td className="py-4 px-6 font-mono text-ink-muted">
                      {item.reportedDomain}
                    </td>
                    <td className="py-4 px-6 font-mono">
                      {isScam ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-scam-bg text-scam border border-scam">
                          ● CONFIRMED_SCAM
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-safe-bg text-safe border border-safe">
                          ● VERIFIED_SAFE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-muted max-w-xs">
                      {item.primaryIndicator}
                    </td>
                    <td className="py-4 px-6 font-mono text-right text-ink font-semibold">
                      {item.reportCount}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
