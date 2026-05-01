import { AreaChart, Area, ResponsiveContainer } from 'recharts'

const COLORS = {
  blue:   { iconBg: '#6366f1', iconColor: '#fff', spark: '#6366f1' },
  green:  { iconBg: '#10b981', iconColor: '#fff', spark: '#10b981' },
  purple: { iconBg: '#8b5cf6', iconColor: '#fff', spark: '#8b5cf6' },
  yellow: { iconBg: '#f59e0b', iconColor: '#fff', spark: '#f59e0b' },
  red:    { iconBg: '#ef4444', iconColor: '#fff', spark: '#ef4444' },
  cyan:   { iconBg: '#06b6d4', iconColor: '#fff', spark: '#06b6d4' },
}

/**
 * StatCard — no fake data.
 * Pass `chartData` (array of { date, count }) from weeklyOrdersChart for sparkline.
 * Pass `sub` for the small label below value.
 * No trend % shown unless real data is provided.
 */
export default function StatCard({ label, value, icon: Icon, color = 'blue', sub, chartData }) {
  const c = COLORS[color] || COLORS.blue

  // Build sparkline from real weekly data if provided, else no chart
  const spark = chartData && chartData.length > 0
    ? chartData.map((d, i) => ({ i, v: d.count ?? 0 }))
    : null

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e8ecf4',
        borderRadius: 14,
        padding: spark ? '18px 18px 12px' : '18px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.15s, transform 0.15s',
        cursor: 'default',
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
      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: c.iconBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: c.iconColor,
        }}>
          <Icon size={18} />
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', margin: 0 }}>
          {label}
        </p>
      </div>

      {/* Value */}
      <p style={{
        fontSize: 26, fontWeight: 700, color: '#111827',
        margin: '0 0 4px', lineHeight: 1, fontFamily: 'Sora, sans-serif',
      }}>
        {value}
      </p>

      {/* Sub label */}
      {sub && (
        <p style={{ fontSize: 11, color: '#9ca3af', margin: spark ? '0 0 10px' : 0 }}>
          {sub}
        </p>
      )}

      {/* Real sparkline — only if chartData passed */}
      {spark && (
        <ResponsiveContainer width="100%" height={40}>
          <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`sg_${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={c.spark} stopOpacity={0.15} />
                <stop offset="100%" stopColor={c.spark} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone" dataKey="v"
              stroke={c.spark} strokeWidth={1.5}
              fill={`url(#sg_${color})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}