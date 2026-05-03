import { useState, useEffect } from 'react'
import API from '../utils/axios.js'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const categories = ['', 'exam', 'holiday', 'general', 'urgent']

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const res = await API.get('/announcements', {
        params: activeCategory ? { category: activeCategory } : {},
      })
      setAnnouncements(res.data)
    } catch (err) {
      setError('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [activeCategory])

  const getBadgeColor = (category) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-700 border border-red-200'
      case 'exam': return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
      case 'holiday': return 'bg-green-100 text-green-700 border border-green-200'
      default: return 'bg-blue-100 text-blue-700 border border-blue-200'
    }
  }

  const getBorderColor = (category) => {
    switch (category) {
      case 'urgent': return 'border-red-500'
      case 'exam': return 'border-yellow-500'
      case 'holiday': return 'border-green-500'
      default: return 'border-blue-500'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📢 Announcements</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Latest notices and updates from the college
            </p>
          </div>
          <div className="text-5xl opacity-20">📢</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left filter sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5">
                <h3 className="font-semibold text-sm">Filter by Category</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center justify-between ${
                      activeCategory === cat
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>
                      {cat === '' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                    {activeCategory === cat && <span>›</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right announcements list */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                Loading announcements...
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {!loading && announcements.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                No announcements found.
              </div>
            )}

            <div className="space-y-3">
              {announcements.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white rounded-lg shadow-sm border-l-4 ${getBorderColor(item.category)} p-5`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getBadgeColor(item.category)}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.content}
                  </p>
                  {item.postedBy && (
                    <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                      Posted by {item.postedBy.name} · {item.postedBy.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}