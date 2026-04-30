import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sd_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sd_admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const adminLogin = (data) => api.post('/admin/login', data)

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard')

// Riders
export const getRiders = (params) => api.get('/admin/riders', { params })
export const getRiderById = (id) => api.get(`/admin/riders/${id}`)
export const approveRider = (id) => api.post(`/admin/riders/${id}/approve`)
export const rejectRider = (id, reason) => api.post(`/admin/riders/${id}/reject`, { reason })
export const banRider = (id) => api.post(`/admin/riders/${id}/ban`)

// Customers
export const getCustomers = (params) => api.get('/admin/customers', { params })
export const getCustomerById = (id) => api.get(`/admin/customers/${id}`)

// Orders
export const getOrders = (params) => api.get('/admin/orders', { params })
export const getOrderById = (id) => api.get(`/admin/orders/${id}`)

// Pricing
export const getPricing = () => api.get('/admin/pricing')
export const updatePricing = (data) => api.put('/admin/pricing', data)
export const createPromoCode = (data) => api.post('/admin/pricing/promo', data)
export const deletePromoCode = (code) => api.delete(`/admin/pricing/promo/${code}`)

// Notifications
export const sendNotification = (data) => api.post('/notifications/send', data)

// Inquiries
export const getInquiries = (params) => api.get('/admin/inquiries', { params })
export const getInquiryById = (id) => api.get(`/admin/inquiries/${id}`)

export default api