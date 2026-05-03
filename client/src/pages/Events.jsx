import { useState, useEffect } from 'react'
import API from '../utils/axios.js'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const categories = ['', 'academic', 'cultural', 'sports', 'technical', 'other']

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await API.get('/events', {
        params: activeCategory ? { category: activeCategory } : {},
      })
      setEvents(res.data)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [activeCategory])

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-700'
      case 'cultural': return 'bg-purple-100 text-purple-700'
      case 'sports': return 'bg-green-100 text-green-700'
      case 'academic': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'technical': return '💻'
      case 'cultural': return '🎭'
      case 'sports': return '🏆'
      case 'academic': return '📖'
      default: return '🎉'
    }
  }

  const isUpcoming = (date) => new Date(date) >= new Date()

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎉 Events</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Upcoming and recent college events
            </p>
          </div>
          <div className="text-5xl opacity-20">🎉</div>
        </div>

        {/* Category filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            Loading events...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 mb-4">
            {error}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            No events found.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* Color top bar */}
              <div className={`h-1.5 ${
                event.category === 'technical' ? 'bg-blue-500' :
                event.category === 'cultural' ? 'bg-purple-500' :
                event.category === 'sports' ? 'bg-green-500' :
                event.category === 'academic' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${getCategoryColor(event.category)}`}>
                    {getCategoryEmoji(event.category)} {event.category.toUpperCase()}
                  </span>
                  {isUpcoming(event.date) ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-700">
                      Upcoming
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                      Completed
                    </span>
                  )}
                </div>

                <h2 className="text-base font-semibold text-gray-800 mb-2">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span>📅 {new Date(event.date).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}</span>
                  <span>📍 {event.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}