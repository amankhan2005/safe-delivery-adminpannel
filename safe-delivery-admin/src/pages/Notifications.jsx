import { useState } from 'react'
import { sendNotification } from '../utils/api'
import PageHeader from '../components/PageHeader'
import toast from 'react-hot-toast'
import { Send, Bell, Info } from 'lucide-react'

const TEMPLATES = [
  { title: 'App Update', body: 'A new version of Safe Delivery is available. Please update your app.' },
  { title: 'Maintenance Notice', body: 'Safe Delivery will be under maintenance from 12AM–2AM tonight.' },
  { title: 'Welcome!', body: 'Welcome to Safe Delivery — Fast. Secure. Trusted.' },
  { title: 'Promo Alert', body: 'Use code SAVE20 for 20% off your next delivery! Limited time offer.' },
]

export default function Notifications() {
  const [form, setForm] = useState({ token: '', title: '', body: '', data: '' })
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.token.trim() || !form.title.trim() || !form.body.trim()) {
      toast.error('Token, title, and body are required')
      return
    }

    let parsedData = {}
    if (form.data.trim()) {
      try { parsedData = JSON.parse(form.data) }
      catch { toast.error('Data must be valid JSON'); return }
    }

    setLoading(true)
    try {
      await sendNotification({ token: form.token.trim(), title: form.title.trim(), body: form.body.trim(), data: parsedData })
      toast.success('Notification sent!')
      setForm({ token: '', title: '', body: '', data: '' })
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Push Notifications" subtitle="Send manual push notifications to any device" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card border border-surface-border p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Bell size={17} className="text-brand-blue" /> Compose Notification
            </h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">FCM Device Token *</label>
                <input className="input font-mono text-xs" placeholder="Paste FCM token here..."
                  value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Title *</label>
                <input className="input" placeholder="Notification title..." maxLength={100}
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Message *</label>
                <textarea className="input h-24 resize-none" placeholder="Notification message..."
                  value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Extra Data <span className="text-gray-400 font-normal">(optional JSON)</span>
                </label>
                <input className="input font-mono text-xs" placeholder='{"screen": "home", "orderId": "..."}'
                  value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Send size={15} />
                }
                Send Notification
              </button>
            </form>
          </div>
        </div>

        {/* Templates + Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-card border border-surface-border p-5">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Quick Templates</h3>
            <div className="space-y-2">
              {TEMPLATES.map((t) => (
                <button key={t.title}
                  onClick={() => setForm((f) => ({ ...f, title: t.title, body: t.body }))}
                  className="w-full text-left bg-surface hover:bg-blue-50 border border-surface-border hover:border-brand-blue/30 rounded-xl p-3 transition-all group">
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-brand-blue">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{t.body}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-brand-blue-light border border-brand-blue/10 rounded-2xl p-4">
            <div className="flex gap-2">
              <Info size={15} className="text-brand-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-brand-blue mb-1">How to get FCM tokens</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  FCM tokens are saved when users/riders log in. Retrieve them from the Rider or Customer detail screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
