import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import API from '../utils/axios.js'
import HeroSlider from '../components/HeroSlider.jsx'

export default function Home() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, eventsRes, newsRes] = await Promise.all([
          API.get('/announcements'),
          API.get('/events'),
          API.get('/news'),
        ])
        setAnnouncements(announcementsRes.data.slice(0, 5))
        setEvents(eventsRes.data.slice(0, 4))
        setNews(newsRes.data.slice(0, 3))
      } catch (err) {
        console.error('Failed to fetch home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getBadgeColor = (category) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'exam': return 'bg-yellow-100 text-yellow-700'
      case 'holiday': return 'bg-green-100 text-green-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats bar */}
      <div className="bg-blue-800 text-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { number: '4200+', label: 'Students' },
              { number: '180+', label: 'Faculty' },
              { number: '24', label: 'Courses' },
              { number: '98%', label: 'Placement' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-yellow-400">{stat.number}</div>
                <div className="text-blue-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3 column layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">

            {/* Quick links */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5">
                <h3 className="font-semibold text-sm">🔗 Quick Links</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Student Corner', path: '/profile', emoji: '👨‍🎓' },
                  { label: 'Online Results', path: '/results', emoji: '📊' },
                  { label: 'Fee Portal', path: '/fees', emoji: '💰' },
                  { label: 'Syllabus', path: '/syllabus', emoji: '📚' },
                  { label: 'Accreditations', path: '/', emoji: '🏆' },
                  { label: 'Rankings', path: '/', emoji: '📈' },
                  { label: 'Online Study', path: '/chat', emoji: '💻' },
                ].map((link) => (
                  <Link
                    key={link.path + link.label}
                    to={link.path}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <span>{link.emoji}</span>
                    <span>{link.label}</span>
                    <span className="ml-auto text-gray-400">›</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming events */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5 flex items-center justify-between">
                <h3 className="font-semibold text-sm">🎉 Upcoming Events</h3>
                <Link to="/events" className="text-xs text-blue-200 hover:text-white">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <p className="text-gray-400 text-sm px-4 py-3">Loading...</p>
                ) : events.length === 0 ? (
                  <p className="text-gray-400 text-sm px-4 py-3">No events yet.</p>
                ) : (
                  events.map((event) => (
                    <div key={event._id} className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="bg-blue-700 text-white text-center rounded px-2 py-1 shrink-0">
                          <div className="text-xs font-bold">
                            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric' })}
                          </div>
                          <div className="text-xs">
                            {new Date(event.date).toLocaleDateString('en-IN', { month: 'short' })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800 leading-tight">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            📍 {event.venue}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center content */}
          <div className="lg:col-span-6 space-y-4">

            {/* Latest announcements */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5 flex items-center justify-between">
                <h3 className="font-semibold text-sm">📢 Latest Announcements</h3>
                <Link to="/announcements" className="text-xs text-blue-200 hover:text-white">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <p className="text-gray-400 text-sm px-4 py-3">Loading...</p>
                ) : announcements.length === 0 ? (
                  <p className="text-gray-400 text-sm px-4 py-3">No announcements yet.</p>
                ) : (
                  announcements.map((item) => (
                    <div key={item._id} className="px-4 py-3 hover:bg-gray-50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-700 mt-1.5 shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getBadgeColor(item.category)}`}>
                              {item.category.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Latest news */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5 flex items-center justify-between">
                <h3 className="font-semibold text-sm">📰 Latest News</h3>
                <Link to="/news" className="text-xs text-blue-200 hover:text-white">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <p className="text-gray-400 text-sm px-4 py-3">Loading...</p>
                ) : news.length === 0 ? (
                  <p className="text-gray-400 text-sm px-4 py-3">No news yet.</p>
                ) : (
                  news.map((item) => (
                    <div key={item._id} className="px-4 py-3 hover:bg-gray-50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {item.content}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-3 space-y-4">

            {/* Principal message */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5">
                <h3 className="font-semibold text-sm">👨‍💼 From the Principal</h3>
              </div>
              <div className="p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold mx-auto mb-3">
                  P
                </div>
                <p className="font-semibold text-gray-800 text-sm">Dr. Virat Kohli</p>
                <p className="text-blue-600 text-xs mb-3">Principal</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Welcome to Atharva College — a place where dreams are nurtured and futures are built. We are committed to academic excellence and holistic development.
                </p>
                <div className="flex gap-2 mt-3">        
                </div>
              </div>
            </div>

            {/* Admin quick access */}
            {user?.role === 'admin' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 text-sm mb-3">
                  ⚙️ Admin Panel
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Add Announcement', path: '/admin/add-announcement' },
                    { label: 'Add Event', path: '/admin/add-event' },
                    { label: 'Add Result', path: '/admin/add-result' },
                    { label: 'Dashboard', path: '/admin' },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block text-xs text-yellow-700 hover:text-yellow-900 hover:underline transition"
                    >
                      › {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Notice board */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-2.5">
                <h3 className="font-semibold text-sm">📌 Notice Board</h3>
              </div>
              <div className="p-4 space-y-2">
                {loading ? (
                  <p className="text-gray-400 text-xs">Loading...</p>
                ) : (
                  announcements.slice(0, 3).map((item) => (
                    <div key={item._id} className="flex items-start gap-2">
                      <span className="text-red-500 text-xs mt-0.5">●</span>
                      <p className="text-xs text-gray-700 leading-tight">
                        {item.title}
                      </p>
                    </div>
                  ))
                )}
                <Link
                  to="/announcements"
                  className="block text-xs text-blue-600 hover:underline mt-2"
                >
                  View all notices →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}