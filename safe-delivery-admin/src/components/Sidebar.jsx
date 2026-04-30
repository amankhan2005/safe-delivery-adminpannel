import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Bike, ShoppingBag,
  Tag, Bell, LogOut, ChevronRight, MessageSquare
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'

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

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-surface-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-border">
        <img src={logo} alt="Safe Delivery" className="h-9 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive
                ? 'bg-brand-blue-light text-brand-blue font-semibold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-30" />
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-4 py-4 border-t border-surface-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}