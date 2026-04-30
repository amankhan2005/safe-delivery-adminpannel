import { format, formatDistanceToNow } from 'date-fns'

export const fmtDate = (d) => d ? format(new Date(d), 'dd MMM yyyy') : '—'
export const fmtDateTime = (d) => d ? format(new Date(d), 'dd MMM yyyy, hh:mm a') : '—'
export const fmtAgo = (d) => d ? formatDistanceToNow(new Date(d), { addSuffix: true }) : '—'
export const fmtCurrency = (n) => `$${(n || 0).toFixed(2)}`
export const fmtMiles = (n) => `${(n || 0).toFixed(1)} mi`

export const STATUS_COLORS = {
  searching:  'bg-yellow-100 text-yellow-700',
  assigned:   'bg-blue-100 text-blue-700',
  picked_up:  'bg-purple-100 text-purple-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
}

export const RIDER_STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  banned:   'bg-gray-100 text-gray-600',
}
