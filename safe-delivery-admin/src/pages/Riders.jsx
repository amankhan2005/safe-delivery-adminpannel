import { useEffect, useState } from 'react'
import { getRiders, getRiderById, approveRider, rejectRider, banRider } from '../utils/api'
import { fmtDate, fmtCurrency, fmtMiles } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import { RiderBadge, OnlineDot } from '../components/Badge'
import Modal from '../components/Modal'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { Search, Eye, CheckCircle, XCircle, Ban, Bike, Star, Phone, Mail, Calendar } from 'lucide-react'

const STATUSES = ['all', 'pending', 'approved', 'rejected', 'banned']

export default function Riders() {
  const [riders, setRiders] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (status !== 'all') params.status = status
      const r = await getRiders(params)
      setRiders(r.data.data.riders)
      setTotal(r.data.data.total)
      setPages(r.data.data.pages)
    } catch { toast.error('Failed to load riders') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [page, status])

  const openDetail = async (id) => {
    try {
      const r = await getRiderById(id)
      setSelected(r.data.data.rider)
      setDetailOpen(true)
    } catch { toast.error('Failed to load rider') }
  }

  const handleApprove = async (id) => {
    setActionLoading(true)
    try {
      await approveRider(id)
      toast.success('Rider approved!')
      setDetailOpen(false)
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
    finally { setActionLoading(false) }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) { toast.error('Reason required'); return }
    setActionLoading(true)
    try {
      await rejectRider(selected._id, rejectReason)
      toast.success('Rider rejected')
      setRejectModal(false); setDetailOpen(false); setRejectReason('')
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
    finally { setActionLoading(false) }
  }

  const handleBan = async (id) => {
    if (!confirm('Ban this rider?')) return
    setActionLoading(true)
    try {
      await banRider(id)
      toast.success('Rider banned')
      setDetailOpen(false)
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
    finally { setActionLoading(false) }
  }

  const filtered = search
    ? riders.filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()) || r.phone?.includes(search))
    : riders

  return (
    <div>
      <PageHeader title="Riders" subtitle={`${total} total riders`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-10" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 bg-white border border-surface-border rounded-xl p-1">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => { setStatus(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${status === s ? 'bg-brand-blue text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {s}
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
                {['Rider', 'Phone', 'Status', 'Online', 'KYC', 'Vehicle', 'Trips', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-300">No riders found</td></tr>
              )}
              {filtered.map((r) => (
                <tr key={r._id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {r.profilePhoto?.url
                        ? <img src={r.profilePhoto.url} className="w-8 h-8 rounded-full object-cover" />
                        : <div className="w-8 h-8 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue text-xs font-bold">{r.name?.charAt(0)}</div>
                      }
                      <span className="font-medium text-sm text-gray-800">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{r.phone}</td>
                  <td className="px-4 py-3"><RiderBadge status={r.status} /></td>
                  <td className="px-4 py-3"><OnlineDot isOnline={r.isOnline} /></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${r.kycCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.kycCompleted ? 'Complete' : `Step ${r.kycStep}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{r.vehicle?.type || '—'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-700">{r.totalTrips || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{fmtDate(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(r._id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-brand-blue transition-colors">
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
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Rider Details" width="max-w-2xl">
        {selected && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4">
              {selected.selfie?.url
                ? <img src={selected.selfie.url} className="w-16 h-16 rounded-2xl object-cover border-2 border-surface-border" />
                : <div className="w-16 h-16 rounded-2xl bg-brand-blue-light flex items-center justify-center text-brand-blue text-2xl font-bold">{selected.name?.charAt(0)}</div>
              }
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{selected.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <RiderBadge status={selected.status} />
                  <OnlineDot isOnline={selected.isOnline} />
                  {selected.kycCompleted && <span className="badge bg-green-100 text-green-700">KYC ✓</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Earnings</p>
                <p className="text-xl font-bold text-brand-blue">{fmtCurrency(selected.earnings?.total)}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-0.5">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" /> {selected.rating || 0} · {selected.totalTrips || 0} trips
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Phone, label: 'Phone', val: selected.phone },
                { icon: Mail, label: 'Email', val: selected.email },
                { icon: Calendar, label: 'DOB', val: selected.dob || '—' },
                { icon: Bike, label: 'Vehicle', val: selected.vehicle?.type ? `${selected.vehicle.type} · ${selected.vehicle.plate}` : '—' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-2.5 bg-surface rounded-xl p-3">
                  <Icon size={15} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-700">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vehicle detail */}
            {selected.vehicle?.model && (
              <div className="bg-surface rounded-xl p-3 text-sm grid grid-cols-3 gap-2">
                <div><p className="text-xs text-gray-400">Model</p><p className="font-medium">{selected.vehicle.model}</p></div>
                <div><p className="text-xs text-gray-400">Color</p><p className="font-medium">{selected.vehicle.color}</p></div>
                <div><p className="text-xs text-gray-400">Plate</p><p className="font-mono font-medium">{selected.vehicle.plate}</p></div>
              </div>
            )}

            {/* KYC Documents */}
            {selected.documents && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">KYC Documents</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selected.documents).map(([key, doc]) => doc?.url && (
                    <a key={key} href={doc.url} target="_blank" rel="noreferrer"
                      className="block rounded-xl overflow-hidden border border-surface-border hover:border-brand-blue transition-colors group">
                      <img src={doc.url} className="w-full h-24 object-cover group-hover:opacity-90 transition-opacity" />
                      <p className="text-xs text-center py-1.5 text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection reason */}
            {selected.rejectionReason && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-red-500 mb-1">Rejection Reason</p>
                <p className="text-sm text-red-700">{selected.rejectionReason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-surface-border">
              {selected.status !== 'approved' && (
                <button onClick={() => handleApprove(selected._id)} disabled={actionLoading} className="btn-primary flex items-center gap-2">
                  <CheckCircle size={15} /> Approve
                </button>
              )}
              {selected.status !== 'rejected' && selected.status !== 'banned' && (
                <button onClick={() => setRejectModal(true)} className="btn-ghost flex items-center gap-2 text-red-500 hover:bg-red-50">
                  <XCircle size={15} /> Reject
                </button>
              )}
              {selected.status !== 'banned' && (
                <button onClick={() => handleBan(selected._id)} disabled={actionLoading} className="btn-danger flex items-center gap-2 ml-auto">
                  <Ban size={15} /> Ban
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Reject reason modal */}
      <Modal open={rejectModal} onClose={() => setRejectModal(false)} title="Reject Rider">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Provide a reason for rejection. This will be sent to the rider via SMS and push notification.</p>
          <textarea
            className="input h-28 resize-none"
            placeholder="e.g. Documents not clear, please resubmit..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={handleReject} disabled={actionLoading} className="btn-danger">Confirm Reject</button>
            <button onClick={() => setRejectModal(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
