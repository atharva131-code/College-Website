import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/axios.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    announcements: 0,
    events: 0,
    courses: 0,
    news: 0,
  })
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [announcementsRes, eventsRes, coursesRes, newsRes] = await Promise.all([
        API.get('/announcements'),
        API.get('/events'),
        API.get('/courses'),
        API.get('/news'),
      ])
      setStats({
        announcements: announcementsRes.data.length,
        events: eventsRes.data.length,
        courses: coursesRes.data.length,
        news: newsRes.data.length,
      })
      setAnnouncements(announcementsRes.data)
      setEvents(eventsRes.data)
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    try {
      await API.delete(`/announcements/${id}`)
      setAnnouncements(announcements.filter((a) => a._id !== id))
      setStats((prev) => ({ ...prev, announcements: prev.announcements - 1 }))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await API.delete(`/events/${id}`)
      setEvents(events.filter((e) => e._id !== id))
      setStats((prev) => ({ ...prev, events: prev.events - 1 }))
    } catch (err) {
      alert('Failed to delete')
    }
  }

  const statCards = [
    { label: 'Announcements', value: stats.announcements, emoji: '📢', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Events', value: stats.events, emoji: '🎉', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Courses', value: stats.courses, emoji: '🎓', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    { label: 'News', value: stats.news, emoji: '📰', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  ]

  const quickActions = [
    { label: 'Add Announcement', path: '/admin/add-announcement', color: 'bg-blue-700 hover:bg-blue-800' },
    { label: 'Add Event', path: '/admin/add-event', color: 'bg-purple-600 hover:bg-purple-700' },
    { label: 'Add Course', path: '/admin/add-course', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Add News', path: '/admin/add-news', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { label: 'Add Result', path: '/admin/add-result', color: 'bg-red-600 hover:bg-red-700' },
    { label: 'Add Syllabus', path: '/admin/add-syllabus', color: 'bg-indigo-600 hover:bg-indigo-700' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Manage all college content from here
            </p>
          </div>
          <div className="text-5xl opacity-20">⚙️</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} border ${stat.border} rounded-lg p-4 text-center shadow-sm`}
            >
              <div className="text-3xl mb-2">{stat.emoji}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-blue-800 text-white px-5 py-3">
            <h2 className="font-semibold text-sm">Quick Actions</h2>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className={`${action.color} text-white px-4 py-2 rounded-lg text-sm font-medium transition`}
              >
                + {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-800 text-white px-5 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-sm">📢 Announcements</h2>
              <Link to="/admin/add-announcement" className="text-xs text-blue-200 hover:text-white">
                + Add
              </Link>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {announcements.length === 0 && (
                <p className="text-gray-400 text-sm px-5 py-4">No announcements yet.</p>
              )}
              {announcements.map((item) => (
                <div key={item._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.category} · {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnnouncement(item._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium ml-3 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-800 text-white px-5 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-sm">🎉 Events</h2>
              <Link to="/admin/add-event" className="text-xs text-blue-200 hover:text-white">
                + Add
              </Link>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {events.length === 0 && (
                <p className="text-gray-400 text-sm px-5 py-4">No events yet.</p>
              )}
              {events.map((item) => (
                <div key={item._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.category} · 📅 {new Date(item.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })} · 📍 {item.venue}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(item._id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium ml-3 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}