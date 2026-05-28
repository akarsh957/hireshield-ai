import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HireShield AI — Intelligent Job Scam Detection',
  description: 'AI-powered fraud detection for job seekers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
