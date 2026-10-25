'use client'

import React from 'react'
import EditorialShell from '@/components/layout/EditorialShell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EditorialShell>{children}</EditorialShell>
}
