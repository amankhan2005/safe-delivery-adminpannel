import { useEffect, useState } from 'react'
import { getOrders, getOrderById } from '../utils/api'
import { fmtDateTime, fmtCurrency, fmtMiles } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import { OrderBadge } from '../components/Badge'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { Search, Eye, MapPin, Package, User, Bike, Clock, CheckCircle } from 'lucide-react'

const STATUSES = ['all', 'searching', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (status !== 'all') params.status = status
      const r = await getOrders(params)
      setOrders(r.data.data.orders)
      setTotal(r.data.data.total)
      setPages(r.data.data.pages)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, status])

  const openDetail = async (id) => {
    try {
      const r = await getOrderById(id)
      setSelected(r.data.data.order)
      setDetailOpen(true)
    } catch { toast.error('Failed to load order') }
  }

  const filtered = search
    ? orders.filter((o) =>
        o._id?.includes(search) ||
        o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.pickup?.address?.toLowerCase().includes(search.toLowerCase())
      )
    : orders

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${total} total orders`} />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="Search order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5 bg-white border border-surface-border rounded-xl p-1">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${status === s ? 'bg-brand-blue text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="w-full">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                {['Order ID', 'Customer', 'Pickup → Drop', 'Distance', 'Fare', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-300">No orders found</td></tr>
              )}
              {filtered.map((o) => (
                <tr key={o._id} className="table-row">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">#{o._id?.slice(-8)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{o.customerId?.name || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-48">
                    <p className="truncate">{o.pickup?.address?.split(',')[0]}</p>
                    <p className="truncate text-gray-400">→ {o.drop?.address?.split(',')[0]}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{fmtMiles(o.distanceMiles)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-800">{fmtCurrency(o.fare)}</td>
                  <td className="px-4 py-3"><OrderBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{fmtDateTime(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(o._id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-brand-blue transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-4"><Pagination page={page} pages={pages} onPage={setPage} /></div>
      </div>

      {/* Order Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Order Details" width="max-w-2xl">
        {selected && (
          <div className="space-y-5">
            {/* Status + ID */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-gray-400">#{selected._id}</p>
                <OrderBadge status={selected.status} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-blue">{fmtCurrency(selected.fare)}</p>
                {selected.promoDiscount > 0 && (
                  <p className="text-xs text-green-600">-{fmtCurrency(selected.promoDiscount)} promo ({selected.promoCode})</p>
                )}
              </div>
            </div>

            {/* Route */}
            <div className="bg-surface rounded-2xl p-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-blue mt-1" />
                  <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Pickup</p>
                    <p className="text-sm font-medium text-gray-800">{selected.pickup?.address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selected.pickup?.contactName} · {selected.pickup?.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Drop</p>
                    <p className="text-sm font-medium text-gray-800">{selected.drop?.address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selected.drop?.contactName} · {selected.drop?.contactPhone}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2 border-t border-surface-border">
                <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={11} /> {fmtMiles(selected.distanceMiles)}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Package size={11} /> {selected.parcelWeight}</span>
                <span className="text-xs text-gray-500">Cash on delivery</span>
                {selected.otpVerified && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={11} /> OTP Verified</span>}
              </div>
            </div>

            {/* People */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1"><User size={11} /> Customer</p>
                <p className="font-medium text-sm">{selected.customerId?.name || '—'}</p>
                <p className="text-xs text-gray-400">{selected.customerId?.phone}</p>
              </div>
              <div className="bg-surface rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1"><Bike size={11} /> Rider</p>
                {selected.riderId
                  ? <>
                      <p className="font-medium text-sm">{selected.riderId?.name}</p>
                      <p className="text-xs text-gray-400">{selected.riderId?.phone}</p>
                    </>
                  : <p className="text-sm text-gray-300">Not assigned</p>
                }
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Created', val: selected.createdAt },
                  { label: 'Rider Assigned', val: selected.riderAssignedAt },
                  { label: 'Picked Up', val: selected.pickedUpAt },
                  { label: 'Delivered', val: selected.deliveredAt },
                  { label: 'Cancelled', val: selected.cancelledAt },
                ].filter((t) => t.val).map((t) => (
                  <div key={t.label} className="flex items-center gap-3">
                    <Clock size={12} className="text-gray-300 flex-shrink-0" />
                    <p className="text-xs text-gray-500 w-28">{t.label}</p>
                    <p className="text-xs font-medium text-gray-700">{fmtDateTime(t.val)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            {(selected.pickupPhoto?.url || selected.dropPhoto?.url) && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Photos</p>
                <div className="grid grid-cols-2 gap-3">
                  {selected.pickupPhoto?.url && (
                    <a href={selected.pickupPhoto.url} target="_blank" rel="noreferrer">
                      <img src={selected.pickupPhoto.url} className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity" />
                      <p className="text-xs text-center text-gray-400 mt-1">Pickup Photo</p>
                    </a>
                  )}
                  {selected.dropPhoto?.url && (
                    <a href={selected.dropPhoto.url} target="_blank" rel="noreferrer">
                      <img src={selected.dropPhoto.url} className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity" />
                      <p className="text-xs text-center text-gray-400 mt-1">Drop Photo</p>
                    </a>
                  )}
                </div>
              </div>
            )}

            {selected.cancellationReason && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-red-500 mb-1">Cancellation Reason</p>
                <p className="text-sm text-red-700">{selected.cancellationReason}</p>
              </div>
            )}

            {selected.notes && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-500 mb-1">Notes</p>
                <p className="text-sm text-blue-700">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
