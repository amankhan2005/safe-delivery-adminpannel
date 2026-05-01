import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Bike, ShoppingBag,
  Tag, Bell, LogOut, ChevronRight, MessageSquare,
  Shield
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import logo2 from '../assets/logo.png'

const NAV = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/riders',     icon: Bike,            label: 'Riders' },
  { to: '/customers',  icon: Users,           label: 'Customers' },
  { to: '/orders',     icon: ShoppingBag,     label: 'Orders' },
  { to: '/pricing',    icon: Tag,             label: 'Pricing & Promos' },
  { to: '/inquiries',  icon: MessageSquare,   label: 'Inquiries' },
  { to: '/notify',     icon: Bell,            label: 'Notifications' },
]

export default function Sidebar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-30 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B1F4B 0%, #0f2860 60%, #0B1F4B 100%)' }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, #1A6FD4 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, #E8212B 0%, transparent 50%)`
        }}
      />

      {/* ── LOGO SECTION ── */}
      <div className="relative flex flex-col items-center pt-7 pb-6 px-5">
       

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-white font-bold text-lg tracking-wide leading-none"
            style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '0.04em' }}
          >
            SAFE <span style={{ color: '#E8212B' }}>DELIVERY</span>
          </h1>
          <p className="text-xs mt-1 font-medium tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}
          >
            Admin Console
          </p>
        </div>

        {/* Divider */}
        <div className="w-full mt-5 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
        />
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="relative flex-1 px-3 py-2 space-y-0.5 overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
       

        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #1A6FD4 0%, #1550aa 100%)',
              boxShadow: '0 4px 15px rgba(26,111,212,0.35)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                {/* Icon container */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <Icon size={15} />
                </div>
                <span className="flex-1">{label}</span>
                <ChevronRight
                  size={13}
                  className={`transition-all ${isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-30'}`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── ADMIN PROFILE + LOGOUT ── */}
      <div className="relative px-4 py-4">
        {/* Top border */}
        <div className="mb-3 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
        />

        {/* Admin info card */}
        <div className="rounded-xl px-3 py-3 mb-2"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E8212B, #c01a1d)' }}
            >
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {admin?.name || 'Admin'}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {admin?.email}
              </p>
            </div>

            {/* Admin badge */}
            <div className="flex-shrink-0">
              <Shield size={14} style={{ color: '#1A6FD4' }} />
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-all duration-150"
          style={{
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(232,33,43,0.15)'
            e.currentTarget.style.color = '#ff6b6b'
            e.currentTarget.style.borderColor = 'rgba(232,33,43,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}