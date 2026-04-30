import Sidebar from './Sidebar'
import { Toaster } from 'react-hot-toast'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-60 flex-1 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-6 animate-fade-in">
          {children}
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#1B4FD8', secondary: '#fff' } },
        }}
      />
    </div>
  )
}
