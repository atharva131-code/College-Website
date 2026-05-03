import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import API from '../utils/axios.js'
import { useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user) fetchUnreadCount()
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get('/announcements')
      const recent = res.data.filter((a) => {
        const diff = Date.now() - new Date(a.createdAt).getTime()
        return diff < 7 * 24 * 60 * 60 * 1000
      })
      setUnreadCount(recent.length)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`)
      setSearchQuery('')
    }
  }

  const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'Academics',
      dropdown: [
        { label: 'Courses', path: '/courses' },
        { label: 'Syllabus', path: '/syllabus' },
        { label: 'Results', path: '/results' },
        { label: 'Fee Structure', path: '/fees' },
      ],
    },
    {
      label: 'Campus Life',
      dropdown: [
        { label: 'Events', path: '/events' },
        { label: 'News', path: '/news' },
        { label: 'Chat', path: '/chat' },
      ],
    },
    { label: 'Announcements', path: '/announcements' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="bg-blue-800 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">

          {/* Nav items */}
          <div className="hidden md:flex items-center h-full">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative h-full flex items-center"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className="h-full px-4 text-sm font-medium hover:bg-blue-700 flex items-center gap-1 transition">
                      {item.label}
                      <span className="text-xs">▼</span>
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-b-lg min-w-48 z-50">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className="block px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition border-b border-gray-100 last:border-0"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="h-full px-4 text-sm font-medium hover:bg-blue-700 flex items-center transition"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Admin link */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="h-full px-4 text-sm font-medium bg-yellow-500 hover:bg-yellow-400 text-blue-900 flex items-center transition"
              >
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Search */}
            {user && (
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-blue-700 text-white placeholder-blue-300 text-sm px-3 py-1 rounded-l border border-blue-600 focus:outline-none w-32"
                />
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-3 py-1 rounded-r text-sm transition"
                >
                  🔍
                </button>
              </form>
            )}

            {/* Notification bell */}
            {user && (
              <Link to="/announcements" className="relative">
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* User menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="text-sm text-blue-200 hover:text-white hidden md:block transition"
                >
                  👋 {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-800 hover:bg-blue-50 text-sm font-medium px-3 py-1 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 text-sm font-medium px-3 py-1 rounded transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white text-xl"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-blue-900 py-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <p className="px-4 py-2 text-sm font-medium text-blue-300">
                      {item.label}
                    </p>
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="block px-8 py-2 text-sm text-blue-200 hover:text-white transition"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="block px-4 py-2 text-sm hover:bg-blue-700 transition"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-yellow-400 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                ⚙️ Admin Panel
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:text-red-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-yellow-400"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}