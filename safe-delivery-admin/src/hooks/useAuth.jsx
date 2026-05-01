import { useState, useEffect, createContext, useContext } from 'react'
import { adminLogin as apiLogin } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sd_admin_token')
    const stored = localStorage.getItem('sd_admin_user')
    if (token && stored) {
      setAdmin(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    const { token, admin: adminData } = res.data.data
    localStorage.setItem('sd_admin_token', token)
    localStorage.setItem('sd_admin_user', JSON.stringify(adminData))
    setAdmin(adminData)
    return adminData
  }

  const logout = () => {
    localStorage.removeItem('sd_admin_token')
    localStorage.removeItem('sd_admin_user')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


 