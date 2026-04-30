import { useEffect, useState } from 'react'
import { getDashboard } from '../utils/api'
import { fmtCurrency } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import Spinner from '../components/Spinner'
import { useNavigate } from 'react-router-dom'
import {
  Bike, Users, ShoppingBag, TrendingUp,
  Package, Wifi, WifiOff, Clock, MessageSquare
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
    <div className="bg-white border border-surface-border rounded-xl shadow-card px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const pieData = Object.entries(data?.orderStatusBreakdown || {}).map(([name, value]) => ({ name, value }))

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview · ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Stats Grid — Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Riders" value={data?.totalRiders ?? 0} icon={Bike} color="blue" sub={`${data?.pendingApprovals ?? 0} pending approval`} />
        <StatCard label="Online Now" value={data?.onlineRiders ?? 0} icon={Wifi} color="green" sub={`${data?.offlineRiders ?? 0} offline`} />
        <StatCard label="Customers" value={data?.totalCustomers ?? 0} icon={Users} color="purple" />
        <StatCard label="Total Orders" value={data?.totalOrders ?? 0} icon={ShoppingBag} color="yellow" />
      </div>

      {/* Stats Grid — Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today Deliveries" value={data?.todayDeliveries ?? 0} icon={Package} color="green" />
        <StatCard label="Today Revenue" value={fmtCurrency(data?.todayRevenue)} icon={TrendingUp} color="blue" />
        <StatCard label="Pending Approvals" value={data?.pendingApprovals ?? 0} icon={Clock} color="yellow" />

        {/* Inquiry stat card — clickable */}
        <div
          onClick={() => navigate('/inquiries')}
          className="stat-card cursor-pointer hover:border-brand-blue/40 hover:shadow-card-hover transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total Inquiries
              </p>
              <p
                className="text-3xl font-bold mt-1 text-brand-red"
                style={{ fontFamily: 'Sora,sans-serif' }}
              >
                {data?.totalInquiries ?? 0}
              </p>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-brand-blue transition-colors">
                View all →
              </p>
            </div>
            <div className="bg-brand-red-light text-brand-red p-2.5 rounded-xl">
              <MessageSquare size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Weekly Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card border border-surface-border">
          <h2 className="font-bold text-gray-800 mb-4">Orders — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.weeklyOrdersChart || []}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Orders" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#blueGrad)" dot={{ fill: '#1B4FD8', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-card border border-surface-border">
          <h2 className="font-bold text-gray-800 mb-4">Order Status</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ fontSize: 11, color: '#64748b' }}>{v.replace('_', ' ')}</span>
                  )}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Bottom Row — Rider availability + Recent Inquiries summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Rider Availability */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-card border border-surface-border">
          <h2 className="font-bold text-gray-800 mb-4">Rider Availability</h2>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart
              data={[{ name: 'Riders', Online: data?.onlineRiders ?? 0, Offline: data?.offlineRiders ?? 0 }]}
              layout="vertical"
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Online" fill="#22c55e" radius={[6, 0, 0, 6]} barSize={28} />
              <Bar dataKey="Offline" fill="#e2e8f0" radius={[0, 6, 6, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Online: <b className="text-green-600">{data?.onlineRiders ?? 0}</b>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              Offline: <b>{data?.offlineRiders ?? 0}</b>
            </span>
          </div>
        </div>

        {/* Inquiry Summary Card */}
        <div
          onClick={() => navigate('/inquiries')}
          className="bg-white rounded-2xl p-5 shadow-card border border-surface-border cursor-pointer hover:border-brand-red/30 hover:shadow-card-hover transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Support Inquiries</h2>
            <div className="bg-brand-red-light text-brand-red p-2 rounded-xl">
              <MessageSquare size={16} />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                📦 Customer
              </span>
              <span className="text-sm font-bold text-brand-blue">
                {data?.totalInquiries ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                🏍️ Driver
              </span>
              <span className="text-sm font-bold text-brand-red">—</span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4 group-hover:text-brand-blue transition-colors">
            Click to view all inquiries →
          </p>
        </div>

      </div>
    </div>
  )
}