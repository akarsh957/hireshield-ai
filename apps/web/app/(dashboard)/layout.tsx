'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import EditorialShell from '@/components/layout/EditorialShell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname === '/dashboard') {
    return <main className="min-h-screen bg-canvas text-ink transition-colors">{children}</main>
  }

  return <EditorialShell>{children}</EditorialShell>
}
