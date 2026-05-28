'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  ShieldAlert, 
  Building2, 
  Camera, 
  FileText, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Zap,
  Shield
} from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'analyzer', label: 'AI Analyzer', icon: Search, href: '/dashboard/analyzer' },
  { id: 'chat', label: 'AI Chatbot', icon: MessageSquare, href: '/dashboard/chat' },
  { id: 'reports', label: 'Scam Reports', icon: ShieldAlert, href: '/dashboard/reports', badge: '14' },
  { id: 'company', label: 'Company Scores', icon: Building2, href: '/dashboard/company' },
  { id: 'ocr', label: 'OCR Scanner', icon: Camera, href: '/dashboard/ocr' },
  { id: 'resume', label: 'Resume Scanner', icon: FileText, href: '/dashboard/resume' },
  { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, href: '/dashboard/admin' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('hs_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => { 
    localStorage.removeItem('hs_token') 
    localStorage.removeItem('hs_user') 
    router.push('/') 
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Background glowing mesh */}
      <div className="mesh-glow" style={{ opacity: 0.5 }} />

      {/* Sidebar */}
      <aside style={{ 
        width: 260, 
        background: 'rgba(6, 11, 24, 0.85)', 
        borderRight: '1px solid rgba(255, 255, 255, 0.05)', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        height: '100vh', 
        zIndex: 100,
        backdropFilter: 'blur(16px)'
      }}>
        {/* Brand */}
        <div style={{ 
          padding: '24px 20px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ 
              width: 32, 
              height: 32, 
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' 
            }}>
              <ShieldCheck size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: 15, fontWeight: 800 }}>HireShield AI</div>
              <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>FRAUD RADAR APP</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <div 
                key={item.id} 
                onClick={() => router.push(item.href)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '10px 16px', 
                  cursor: 'pointer', 
                  borderRadius: 10,
                  position: 'relative',
                  color: active ? '#fff' : 'var(--text2)', 
                  fontSize: 13, 
                  fontWeight: active ? 600 : 500,
                  transition: 'color 0.2s',
                  background: active ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  border: active ? '1px solid rgba(59, 130, 246, 0.15)' : '1px solid transparent'
                }}
              >
                {/* Active side indicator pill */}
                {active && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    style={{
                      position: 'absolute',
                      left: 6,
                      width: 4,
                      height: 16,
                      borderRadius: 10,
                      background: '#3b82f6',
                      boxShadow: '0 0 8px #3b82f6'
                    }}
                  />
                )}

                <span style={{ 
                  color: active ? '#3b82f6' : hoveredItem === item.id ? '#a78bfa' : 'var(--text3)',
                  transition: 'color 0.2s',
                  display: 'inline-flex'
                }}>
                  <Icon size={16} />
                </span>

                <span style={{ flex: 1 }}>{item.label}</span>

                {item.badge && (
                  <span style={{ 
                    background: 'rgba(239, 68, 68, 0.12)', 
                    color: '#ef4444', 
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    fontSize: 9, 
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    borderRadius: 20, 
                    padding: '2px 8px' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {/* User Card */}
        <div style={{ 
          padding: 16, 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(3, 5, 16, 0.4)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 13, 
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.25)',
              textTransform: 'uppercase'
            }}>
              {user?.name?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                color: 'var(--text)', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{ 
                fontSize: 10, 
                color: 'var(--text3)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4 
              }}>
                <Zap size={9} style={{ color: '#f59e0b' }} /> Free Plan · {user?.role || 'user'}
              </div>
            </div>
            <button 
              onClick={logout} 
              title="Logout" 
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                color: 'var(--text3)', 
                cursor: 'pointer', 
                width: 28,
                height: 28,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.color = '#ef4444'
                e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.color = 'var(--text3)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content frame */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Sticky top-header */}
        <div style={{ 
          height: 60, 
          background: 'rgba(3, 7, 18, 0.7)', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 28px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ 
            fontFamily: 'var(--font-syne)', 
            fontSize: 15, 
            fontWeight: 800,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            {pathname === '/dashboard' ? (
              <LayoutDashboard size={16} style={{ color: '#3b82f6' }} />
            ) : (
              <Shield size={16} style={{ color: '#3b82f6' }} />
            )}
            {navItems.find(n => pathname === n.href)?.label || 'HireShield AI'}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              fontSize: 11, 
              color: 'var(--text3)',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              padding: '6px 12px',
              borderRadius: 20,
              fontWeight: 500,
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{ 
                width: 6, 
                height: 6, 
                borderRadius: '50%', 
                background: '#10b981', 
                boxShadow: '0 0 6px #10b981', 
                display: 'inline-block' 
              }} />
              AI RADAR CORE ACTIVE
            </div>
          </div>
        </div>
        
        {/* Children components rendering page content */}
        <div style={{ padding: 28, flex: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
