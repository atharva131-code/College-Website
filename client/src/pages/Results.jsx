import { useState } from 'react'
import API from '../utils/axios.js'

export default function Results() {
  const [rollNumber, setRollNumber] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setError('')
    setResults([])
    setSearched(true)
    setLoading(true)
    try {
      const res = await API.get(`/results/${rollNumber}`)
      setResults(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'No results found')
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-700'
      case 'A': return 'bg-green-100 text-green-600'
      case 'B+': return 'bg-blue-100 text-blue-700'
      case 'B': return 'bg-blue-100 text-blue-600'
      case 'C': return 'bg-yellow-100 text-yellow-700'
      case 'D': return 'bg-orange-100 text-orange-700'
      case 'F': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📊 Examination Results</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Search your results by roll number
            </p>
          </div>
          <div className="text-5xl opacity-20">📊</div>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-3">
            Enter Roll Number
          </h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g. BCA-23119"
              required
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Results'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">
            Enter your complete roll number as provided by the examination cell
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 mb-4">
            {error}
          </div>
        )}

        {/* No results */}
        {searched && !loading && results.length === 0 && !error && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            No results found for roll number "{rollNumber}"
          </div>
        )}

        {/* Results */}
        {results.map((result) => (
          <div
            key={result._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
          >
            {/* Student header */}
            <div className="bg-blue-800 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{result.studentName}</h2>
                  <p className="text-blue-200 text-sm mt-0.5">
                    Roll No: {result.rollNumber} · {result.department} · Semester {result.semester}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                    result.result === 'Pass'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {result.result}
                  </span>
                  <p className="text-blue-200 text-xs mt-1">
                    {result.percentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* Marks table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-600 font-medium">Subject</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">Marks Obtained</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">Max Marks</th>
                    <th className="text-center px-6 py-3 text-gray-600 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-800 font-medium">
                        {subject.name}
                      </td>
                      <td className="px-6 py-3 text-center text-gray-800">
                        {subject.marks}
                      </td>
                      <td className="px-6 py-3 text-center text-gray-500">
                        {subject.totalMarks}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getGradeColor(subject.grade)}`}>
                          {subject.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                  <tr>
                    <td className="px-6 py-3 font-bold text-gray-800">Total</td>
                    <td className="px-6 py-3 text-center font-bold text-gray-800">
                      {result.obtainedMarks}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-gray-800">
                      {result.totalMarks}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-blue-700">
                      {result.percentage}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}