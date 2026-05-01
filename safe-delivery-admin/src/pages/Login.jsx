import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import logo from '../assets/logo.png'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <Toaster position="top-right" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Safe Delivery" className="h-12 object-contain" />
          </div>

          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 bg-brand-blue-light text-brand-blue text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <ShieldCheck size={13} />
              Admin Portal
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-400 mt-1">Access the Safe Delivery dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Safe Delivery © {new Date().getFullYear()} — Admin Panel
        </p>
      </div>
    </div>
  )
}
