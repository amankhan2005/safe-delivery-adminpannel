import { STATUS_COLORS, RIDER_STATUS_COLORS } from '../utils/helpers'

export function OrderBadge({ status }) {
  return (
    <span className={`badge ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

export function RiderBadge({ status }) {
  return (
    <span className={`badge ${RIDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export function OnlineDot({ isOnline }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse-dot' : 'bg-gray-300'}`} />
      <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </span>
  )
}
