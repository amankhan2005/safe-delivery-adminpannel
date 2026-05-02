import { useEffect, useState } from 'react'
import { getInquiries, getInquiryById } from '../utils/api'
import { fmtDateTime } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { Search, Eye, Phone, Mail, MessageSquare, User, Bike } from 'lucide-react'

const ROLES = ['all', 'customer', 'rider']

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [role, setRole] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (role !== 'all') params.role = role
      const r = await getInquiries(params)
      setInquiries(r.data.data.inquiries)
      setTotal(r.data.data.total)
      setPages(r.data.data.pages)
    } catch {
      toast.error('Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page, role])

  const openDetail = async (id) => {
    try {
      const r = await getInquiryById(id)
      setSelected(r.data.data.inquiry)
      setDetailOpen(true)
    } catch {
      toast.error('Failed to load inquiry')
    }
  }

  const filtered = search
    ? inquiries.filter((i) =>
        `${i.firstName} ${i.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        i.email?.toLowerCase().includes(search.toLowerCase()) ||
        i.phone?.includes(search)
      )
    : inquiries

  return (
    <div>
      <PageHeader
        title="Support Inquiries"
        subtitle={`${total} total inquiries received`}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 bg-white border border-surface-border rounded-xl p-1">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                role === r ? 'bg-brand-blue text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {r === 'all' ? 'All' : r === 'rider' ? '🏍️ Rider' : '📦 Customer'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden">
        {loading ? <Spinner /> : (
          <table className="w-full">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                {['Name', 'Email', 'Phone', 'Role', 'Message Preview', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-300">
                    <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                    <p>No inquiries found</p>
                  </td>
                </tr>
              )}
              {filtered.map((inq) => (
                <tr key={inq._id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        inq.role === 'rider'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-brand-blue'
                      }`}>
                        {inq.firstName?.charAt(0)}
                      </div>
                      <span className="font-medium text-sm text-gray-800">
                        {inq.firstName} {inq.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{inq.email}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{inq.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      inq.role === 'rider'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-brand-blue'
                    }`}>
                      {inq.role === 'rider' ? '🏍️ Rider' : '📦 Customer'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 max-w-xs">
                    <p className="truncate">{inq.message}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{fmtDateTime(inq.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openDetail(inq._id)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-brand-blue transition-colors"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-4">
          <Pagination page={page} pages={pages} onPage={setPage} />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Inquiry Detail">
        {selected && (
          <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                selected.role === 'rider'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-blue-100 text-brand-blue'
              }`}>
                {selected.firstName?.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {selected.firstName} {selected.lastName}
                </h3>
                <span className={`badge mt-1 ${
                  selected.role === 'rider'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-brand-blue'
                }`}>
                  {selected.role === 'rider' ? '🏍️ Rider' : '📦 Customer'}
                </span>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400">Received</p>
                <p className="text-sm font-medium text-gray-700">{fmtDateTime(selected.createdAt)}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2.5 bg-surface rounded-xl p-3">
                <Mail size={15} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-700 break-all">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-surface rounded-xl p-3">
                <Phone size={15} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-700 font-mono">{selected.phone}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare size={12} /> Message
              </p>
              <div className="bg-brand-blue-light border-l-4 border-brand-blue rounded-r-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
              </div>
            </div>

            {/* Reply button */}
            <a
              href={`mailto:${selected.email}?subject=Re: Your Safe Delivery Inquiry&body=Hi ${selected.firstName},%0A%0AThank you for reaching out to Safe Delivery.%0A%0A`}
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              <Mail size={15} />
              Reply via Email
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}