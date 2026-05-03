import { useState, useEffect } from 'react'
import API from '../utils/axios.js'

export default function News() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('')

  const categories = ['', 'academic', 'sports', 'cultural', 'achievement', 'general']

  const fetchNews = async () => {
    try {
      setLoading(true)
      const res = await API.get('/news', {
        params: activeCategory ? { category: activeCategory } : {},
      })
      setNews(res.data)
    } catch (err) {
      setError('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [activeCategory])

  const getBadgeColor = (category) => {
    switch (category) {
      case 'sports': return 'bg-green-100 text-green-700'
      case 'cultural': return 'bg-purple-100 text-purple-700'
      case 'achievement': return 'bg-yellow-100 text-yellow-700'
      case 'academic': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'sports': return '🏏'
      case 'cultural': return '🎭'
      case 'achievement': return '🏆'
      case 'academic': return '📖'
      default: return '📰'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📰 College News</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Latest news and updates from Atharva College
            </p>
          </div>
          <div className="text-5xl opacity-20">📰</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left filter */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5">
                <h3 className="font-semibold text-sm">Categories</h3>
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
                      {cat === '' ? 'All News' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                    {activeCategory === cat && <span>›</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right news list */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                Loading news...
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {!loading && news.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                No news found.
              </div>
            )}

            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getBadgeColor(item.category)}`}>
                      {getCategoryEmoji(item.category)} {item.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 mb-2">
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