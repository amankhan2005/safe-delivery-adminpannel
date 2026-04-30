import { useEffect, useState } from 'react'
import { getPricing, updatePricing, createPromoCode, deletePromoCode } from '../utils/api'
import { fmtDate } from '../utils/helpers'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { Tag, Plus, Trash2, DollarSign, Percent, Edit3 } from 'lucide-react'

export default function Pricing() {
  const [pricing, setPricing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editRate, setEditRate] = useState(false)
  const [newRate, setNewRate] = useState('')
  const [promoModal, setPromoModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [promo, setPromo] = useState({ code: '', discount: '', type: 'flat', expiresAt: '', usageLimit: '100' })

  const load = async () => {
    setLoading(true)
    try {
      const r = await getPricing()
      setPricing(r.data.data.pricing)
      setNewRate(r.data.data.pricing.costPerMile)
    } catch { toast.error('Failed to load pricing') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleUpdateRate = async () => {
    const val = parseFloat(newRate)
    if (!val || val <= 0) { toast.error('Enter a valid rate'); return }
    setActionLoading(true)
    try {
      await updatePricing({ costPerMile: val })
      toast.success('Rate updated!')
      setEditRate(false)
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
    finally { setActionLoading(false) }
  }

  const handleAddPromo = async () => {
    if (!promo.code || !promo.discount || !promo.type) { toast.error('Fill all required fields'); return }
    setActionLoading(true)
    try {
      await createPromoCode({
        code: promo.code,
        discount: parseFloat(promo.discount),
        type: promo.type,
        expiresAt: promo.expiresAt || undefined,
        usageLimit: parseInt(promo.usageLimit) || 100,
      })
      toast.success('Promo code created!')
      setPromoModal(false)
      setPromo({ code: '', discount: '', type: 'flat', expiresAt: '', usageLimit: '100' })
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
    finally { setActionLoading(false) }
  }

  const handleDeletePromo = async (code) => {
    if (!confirm(`Deactivate promo code ${code}?`)) return
    try {
      await deletePromoCode(code)
      toast.success('Promo deactivated')
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <PageHeader
        title="Pricing & Promos"
        subtitle="Manage delivery rates and promotional codes"
        action={
          <button onClick={() => setPromoModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add Promo Code
          </button>
        }
      />

      {/* Cost per mile card */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-border p-6 mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cost per Mile</p>
            {editRate ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number" step="0.01" min="0.01"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="input pl-8 w-32"
                  />
                </div>
                <button onClick={handleUpdateRate} disabled={actionLoading} className="btn-primary">Save</button>
                <button onClick={() => setEditRate(false)} className="btn-ghost">Cancel</button>
              </div>
            ) : (
              <p className="text-4xl font-bold text-brand-blue" style={{ fontFamily: 'Sora,sans-serif' }}>
                ${pricing?.costPerMile?.toFixed(2)}
                <span className="text-lg text-gray-400 font-normal ml-1">/ mile</span>
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">Currency: {pricing?.currency || 'USD'} · Applies to all new orders</p>
          </div>
          {!editRate && (
            <button onClick={() => setEditRate(true)} className="btn-ghost flex items-center gap-2">
              <Edit3 size={15} /> Edit Rate
            </button>
          )}
        </div>
      </div>

      {/* Promo Codes */}
      <div className="bg-white rounded-2xl shadow-card border border-surface-border overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border flex items-center gap-2">
          <Tag size={16} className="text-brand-blue" />
          <h2 className="font-bold text-gray-800">Promo Codes</h2>
          <span className="ml-auto badge bg-brand-blue-light text-brand-blue">{pricing?.promoCodes?.length || 0} total</span>
        </div>

        {(!pricing?.promoCodes || pricing.promoCodes.length === 0) ? (
          <div className="text-center py-16 text-gray-300">
            <Tag size={32} className="mx-auto mb-3 opacity-30" />
            <p>No promo codes yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                {['Code', 'Discount', 'Type', 'Usage', 'Expires', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricing.promoCodes.map((p) => (
                <tr key={p.code} className="table-row">
                  <td className="px-4 py-3 font-mono font-bold text-brand-blue text-sm">{p.code}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    {p.type === 'flat' ? `$${p.discount}` : `${p.discount}%`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.type === 'flat' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {p.type === 'flat' ? <DollarSign size={10} /> : <Percent size={10} />}
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.usedCount} / {p.usageLimit}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{p.expiresAt ? fmtDate(p.expiresAt) : 'Never'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.isActive && (
                      <button onClick={() => handleDeletePromo(p.code)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Promo Modal */}
      <Modal open={promoModal} onClose={() => setPromoModal(false)} title="Create Promo Code">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Promo Code *</label>
            <input className="input font-mono uppercase" placeholder="e.g. SAVE20" value={promo.code}
              onChange={(e) => setPromo({ ...promo, code: e.target.value.toUpperCase() })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Discount *</label>
              <input type="number" min="0.01" step="0.01" className="input" placeholder="e.g. 20"
                value={promo.discount} onChange={(e) => setPromo({ ...promo, discount: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Type *</label>
              <select className="input" value={promo.type} onChange={(e) => setPromo({ ...promo, type: e.target.value })}>
                <option value="flat">Flat ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Expires At</label>
              <input type="date" className="input" value={promo.expiresAt}
                onChange={(e) => setPromo({ ...promo, expiresAt: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Usage Limit</label>
              <input type="number" min="1" className="input" value={promo.usageLimit}
                onChange={(e) => setPromo({ ...promo, usageLimit: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleAddPromo} disabled={actionLoading} className="btn-primary">Create Promo</button>
            <button onClick={() => setPromoModal(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
