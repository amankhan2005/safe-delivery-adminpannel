import { useEffect, useState } from 'react'
import { getCustomers, getCustomerById } from '../utils/api'
import { fmtDate, fmtDateTime, fmtCurrency } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import { OrderBadge } from '../components/Badge'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { Search, Eye, Phone, Mail, ShoppingBag, Calendar } from 'lucide-react'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await getCustomers({ page, limit: 15 })
      setCustomers(r.data.data.customers)
      setTotal(r.data.data.total)
      setPages(r.data.data.pages)
    } catch { toast.error('Failed to load customers') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page])

  const openDetail = async (id) => {
    try {
      const r = await getCustomerById(id)
      setSelected(r.data.data)
      setDetailOpen(true)
    } catch { toast.error('Failed to load customer') }
  }

  const filtered = search
    ? customers.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.toLowerCase().includes(search.toLowerCase()))
    : customers

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${total} registered customers`} />

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="Search by name, phone or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="w-full">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                {['Customer', 'Phone', 'Email', 'Verified', 'Orders', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-300">No customers found</td></tr>
              )}
              {filtered.map((c) => (
                <tr key={c._id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                        {c.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.isPhoneVerified && c.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {c.isPhoneVerified && c.isEmailVerified ? '✓ Verified' : 'Partial'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">{c.totalOrders || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{fmtDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(c._id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-brand-blue transition-colors">
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

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Customer Details" width="max-w-2xl">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">
                {selected.customer?.name?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{selected.customer?.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className={`badge ${selected.customer?.isPhoneVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    Phone {selected.customer?.isPhoneVerified ? '✓' : '✗'}
                  </span>
                  <span className={`badge ${selected.customer?.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    Email {selected.customer?.isEmailVerified ? '✓' : '✗'}
                  </span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-brand-blue">{selected.customer?.totalOrders || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Phone, label: 'Phone', val: selected.customer?.phone },
                { icon: Mail, label: 'Email', val: selected.customer?.email },
                { icon: Calendar, label: 'Joined', val: fmtDate(selected.customer?.createdAt) },
                { icon: ShoppingBag, label: 'First Login', val: selected.customer?.isFirstLogin ? 'Not yet' : 'Done' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-2.5 bg-surface rounded-xl p-3">
                  <Icon size={15} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-700 break-all">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Orders</p>
              {selected.orders?.length === 0
                ? <p className="text-sm text-gray-300 text-center py-6">No orders yet</p>
                : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selected.orders?.map((o) => (
                      <div key={o._id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-3">
                        <div>
                          <p className="text-xs text-gray-400 font-mono">{o._id?.slice(-8)}</p>
                          <p className="text-sm font-medium text-gray-700 mt-0.5 truncate max-w-xs">{o.pickup?.address?.split(',')[0]} → {o.drop?.address?.split(',')[0]}</p>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <OrderBadge status={o.status} />
                          <p className="text-sm font-bold text-gray-800 mt-1">{fmtCurrency(o.fare)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
