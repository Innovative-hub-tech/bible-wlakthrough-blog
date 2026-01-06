import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { FiHome, FiFileText, FiMessageSquare, FiUsers, FiCalendar, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: FiHome },
  { name: 'Posts', path: '/admin/posts', icon: FiFileText },
  { name: 'Comments', path: '/admin/comments', icon: FiMessageSquare },
  { name: 'Users', path: '/admin/users', icon: FiUsers },
  { name: 'Events', path: '/admin/events', icon: FiCalendar },
  { name: 'Settings', path: '/admin/settings', icon: FiSettings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, userData, loading, logout, isAdmin, isCollaborator } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin && !isCollaborator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin area.</p>
          <Link to="/" className="text-purple-600 hover:underline">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {userData?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {userData?.displayName || 'User'}
              </p>
              <p className="text-gray-400 text-xs truncate">{userData?.role || 'reader'}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white w-full px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
