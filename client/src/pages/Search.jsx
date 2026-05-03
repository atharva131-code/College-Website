import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/axios.js'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ announcements: [], news: [] })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const [announcementsRes, newsRes] = await Promise.all([
        API.get('/announcements'),
        API.get('/news'),
      ])
      const filteredAnnouncements = announcementsRes.data.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())
      )
      const filteredNews = newsRes.data.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())
      )
      setResults({ announcements: filteredAnnouncements, news: filteredNews })
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalResults = results.announcements.length + results.news.length

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🔍 Search</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Search across announcements and news
            </p>
          </div>
          <div className="text-5xl opacity-20">🔍</div>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements, news..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results count */}
        {searched && !loading && (
          <p className="text-sm text-gray-500 mb-4">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>
        )}

        {/* Announcements results */}
        {results.announcements.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <div className="bg-blue-800 text-white px-5 py-3">
              <h2 className="font-semibold text-sm">
                📢 Announcements ({results.announcements.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {results.announcements.map((item) => (
                <Link
                  to="/announcements"
                  key={item._id}
                  className="block px-5 py-3 hover:bg-gray-50 transition"
                >
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.content}</p>
                  <span className="text-xs text-blue-600 mt-1 inline-block">
                    {item.category.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* News results */}
        {results.news.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <div className="bg-blue-800 text-white px-5 py-3">
              <h2 className="font-semibold text-sm">
                📰 News ({results.news.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {results.news.map((item) => (
                <Link
                  to="/news"
                  key={item._id}
                  className="block px-5 py-3 hover:bg-gray-50 transition"
                >
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.content}</p>
                  <span className="text-xs text-green-600 mt-1 inline-block">
                    {item.category.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {searched && !loading && totalResults === 0 && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  )
}