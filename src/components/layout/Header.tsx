import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiSearch, FiSun, FiMoon, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { useAuthContext } from '../../context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  const navigate = useNavigate()
  const { user, userData, logout, isAdmin, isCollaborator } = useAuthContext()

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleSearchClick = () => {
    navigate('/search')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bible Studies', path: '/category/bible-studies' },
    { name: 'Sermons', path: '/category/sermons' },
    { name: 'Devotionals', path: '/category/devotionals' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Walkthrough Bible
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Series</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button 
              onClick={handleSearchClick}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* User menu or Login button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {userData?.displayName || user.email?.split('@')[0]}
                  </span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {(isAdmin || isCollaborator) && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await logout()
                        setIsUserMenuOpen(false)
                        navigate('/')
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex btn-primary text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                {(isAdmin || isCollaborator) && (
                  <Link
                    to="/admin"
                    className="block py-2 text-purple-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await logout()
                    setIsMenuOpen(false)
                    navigate('/')
                  }}
                  className="block py-2 text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 text-purple-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
