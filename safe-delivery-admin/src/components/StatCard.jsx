export default function StatCard({ label, value, icon: Icon, color = 'blue', sub }) {
  const colors = {
    blue:   { bg: 'bg-brand-blue-light',  icon: 'text-brand-blue',  val: 'text-brand-blue' },
    red:    { bg: 'bg-brand-red-light',   icon: 'text-brand-red',   val: 'text-brand-red' },
    green:  { bg: 'bg-green-50',          icon: 'text-green-600',   val: 'text-green-700' },
    yellow: { bg: 'bg-yellow-50',         icon: 'text-yellow-600',  val: 'text-yellow-700' },
    purple: { bg: 'bg-purple-50',         icon: 'text-purple-600',  val: 'text-purple-700' },
  }
  const c = colors[color] || colors.blue
  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${c.val}`} style={{ fontFamily: 'Sora,sans-serif' }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`${c.bg} ${c.icon} p-2.5 rounded-xl`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}
