import { useEffect, useState } from 'react'
import { getDashboard } from '../utils/api'
import { fmtCurrency } from '../utils/helpers'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import {
  Bike, Users, ShoppingBag, TrendingUp,
  Package, Wifi, WifiOff, Clock, MessageSquare,
  Calendar, ChevronDown, ArrowUpRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = {
  delivered: '#22c55e', searching: '#f59e0b', assigned: '#3b82f6',
  in_transit: '#8b5cf6', picked_up: '#06b6d4', cancelled: '#ef4444',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e8ecf4', borderRadius: 10,
      padding: '9px 13px', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.07)'
    }}>
      <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, margin: 0 }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  )
}

function getDateRange() {
  const end   = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 6)
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} — ${fmt(end)}`
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const pieData    = Object.entries(data?.orderStatusBreakdown || {}).map(([name, value]) => ({ name, value }))
  const chartData  = data?.weeklyOrdersChart || []

  return (
    <div>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 22, animation: 'slideUp 0.35s ease both',
      }}>
        <h1 style={{
          fontSize: 20, fontWeight: 700, color: '#111827',
          fontFamily: 'Sora, sans-serif', margin: 0, letterSpacing: '-0.2px',
        }}>
          Dashboard
        </h1>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'border-color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#1B4FD8'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          <Calendar size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
            {getDateRange()}
          </span>
          <ChevronDown size={13} style={{ color: '#9ca3af', marginLeft: 2 }} />
        </div>
      </div>

      {/* ── STAT CARDS ROW 1 — sparkline from real weeklyOrdersChart ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total Orders"
          value={data?.totalOrders ?? 0}
          icon={ShoppingBag}
          color="blue"
          sub="All time orders"
          chartData={chartData}
        />
        <StatCard
          label="Total Riders"
          value={data?.totalRiders ?? 0}
          icon={Bike}
          color="green"
          sub={`${data?.pendingApprovals ?? 0} pending approval`}
          chartData={chartData}
        />
        <StatCard
          label="Total Customers"
          value={data?.totalCustomers ?? 0}
          icon={Users}
          color="purple"
          sub="Registered users"
          chartData={chartData}
        />
        <StatCard
          label="Total Revenue"
          value={fmtCurrency(data?.todayRevenue)}
          icon={TrendingUp}
          color="yellow"
          sub="Today's earnings"
          chartData={chartData}
        />
      </div>

      {/* ── STAT CARDS ROW 2 — no chart, just value + sub ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Today Deliveries"
          value={data?.todayDeliveries ?? 0}
          icon={Package}
          color="cyan"
          sub="Delivered today"
        />
        <StatCard
          label="Riders Online"
          value={data?.onlineRiders ?? 0}
          icon={Wifi}
          color="green"
          sub={`${data?.offlineRiders ?? 0} currently offline`}
        />
        <StatCard
          label="Pending Approvals"
          value={data?.pendingApprovals ?? 0}
          icon={Clock}
          color="yellow"
          sub="Awaiting KYC review"
        />

        {/* Inquiry card — matches StatCard style exactly */}
        <div
          onClick={() => navigate('/inquiries')}
          style={{
            background: '#fff', border: '1px solid #e8ecf4', borderRadius: 14,
            padding: '18px', cursor: 'pointer',
            transition: 'box-shadow 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.07)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8212B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <MessageSquare size={18} />
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', margin: 0 }}>Total Inquiries</p>
          </div>
          <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px', fontFamily: 'Sora,sans-serif', lineHeight: 1 }}>
            {data?.totalInquiries ?? 0}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ArrowUpRight size={11} style={{ color: '#9ca3af' }} />
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>View all inquiries</p>
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-surface-border" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Sora,sans-serif', margin: 0 }}>
                Orders Overview
              </h2>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Daily order volume — last 7 days</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#6b7280' }}>
              This Week <ChevronDown size={11} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1B4FD8" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Orders" stroke="#1B4FD8" strokeWidth={2}
                fill="url(#blueGrad)"
                dot={{ fill: '#1B4FD8', r: 3, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 5, fill: '#1B4FD8', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-surface-border" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Sora,sans-serif', margin: 0 }}>
              Orders by Status
            </h2>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Breakdown</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="44%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={7}
                  formatter={v => <span style={{ fontSize: 10, color: '#64748b' }}>{v.replace(/_/g, ' ')}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d1d5db', fontSize: 12 }}>
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-surface-border" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Sora,sans-serif', margin: 0 }}>
                Rider Availability
              </h2>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>Approved riders — live</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulseDot 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Live</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={68}>
            <BarChart data={[{ name: 'Riders', Online: data?.onlineRiders ?? 0, Offline: data?.offlineRiders ?? 0 }]} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Online"  fill="#1B4FD8" radius={[6, 0, 0, 6]} barSize={24} />
              <Bar dataKey="Offline" fill="#e2e8f0" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
              <Wifi size={12} style={{ color: '#1B4FD8' }} />
              Online: <b style={{ color: '#1B4FD8', marginLeft: 2 }}>{data?.onlineRiders ?? 0}</b>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b7280' }}>
              <WifiOff size={12} style={{ color: '#9ca3af' }} />
              Offline: <b style={{ color: '#374151', marginLeft: 2 }}>{data?.offlineRiders ?? 0}</b>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/inquiries')}
          className="bg-white rounded-2xl p-5 border border-surface-border"
          style={{ cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#1B4FD8'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,79,216,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8ecf4'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827', fontFamily: 'Sora,sans-serif', margin: 0 }}>
                Support Inquiries
              </h2>
              <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>All submitted requests</p>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8212B' }}>
              <MessageSquare size={15} />
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Customers', Icon: Users, value: data?.totalInquiries ?? 0, color: '#1B4FD8', bg: '#eff6ff' },
              { label: 'Drivers',   Icon: Bike,  value: '—',                       color: '#E8212B', bg: '#fff0f0' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: row.bg, borderRadius: 10, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                  <row.Icon size={13} style={{ color: row.color }} />
                  {row.label}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 14, fontSize: 11, color: '#9ca3af' }}>
            <ArrowUpRight size={12} />
            View all inquiries
          </div>
        </div>

      </div>
    </div>
  )
}