import { useState, useEffect } from 'react'
import API from '../utils/axios.js'

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openSemester, setOpenSemester] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState('BCA')

  const courses = ['BCA', 'MCA', 'B.Com', 'MBA', 'BA']

  const fetchSyllabus = async () => {
    try {
      setLoading(true)
      const res = await API.get('/syllabus', {
        params: { course: selectedCourse },
      })
      setSyllabus(res.data)
    } catch (err) {
      setError('Failed to load syllabus')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSyllabus()
  }, [selectedCourse])

  const getTypeColor = (type) => {
    switch (type) {
      case 'practical': return 'bg-green-100 text-green-700'
      case 'elective': return 'bg-purple-100 text-purple-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">📚 Syllabus</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Semester wise subject listing for each course
            </p>
          </div>
          <div className="text-5xl opacity-20">📚</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left course selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-4 py-2.5">
                <h3 className="font-semibold text-sm">Select Course</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <button
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left px-4 py-3 text-sm transition flex items-center justify-between ${
                      selectedCourse === course
                        ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{course}</span>
                    {selectedCourse === course && <span>›</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right syllabus content */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                Loading syllabus...
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {!loading && syllabus.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center text-gray-400">
                No syllabus found for {selectedCourse}.
              </div>
            )}

            <div className="space-y-3">
              {syllabus.map((sem) => (
                <div
                  key={sem._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenSemester(
                      openSemester === sem.semester ? null : sem.semester
                    )}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                        {sem.semester}
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-800">
                          Semester {sem.semester}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {sem.subjects.length} subjects ·{' '}
                          {sem.subjects.reduce((sum, s) => sum + s.credits, 0)} total credits
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {openSemester === sem.semester ? '▲' : '▼'}
                    </span>
                  </button>

                  {openSemester === sem.semester && (
                    <div className="border-t border-gray-100">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-5 py-2.5 text-gray-600 font-medium text-xs">Subject</th>
                            <th className="text-center px-5 py-2.5 text-gray-600 font-medium text-xs">Code</th>
                            <th className="text-center px-5 py-2.5 text-gray-600 font-medium text-xs">Credits</th>
                            <th className="text-center px-5 py-2.5 text-gray-600 font-medium text-xs">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {sem.subjects.map((subject, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-5 py-2.5 text-gray-800">{subject.name}</td>
                              <td className="px-5 py-2.5 text-center text-gray-500 text-xs">{subject.code}</td>
                              <td className="px-5 py-2.5 text-center text-gray-800">{subject.credits}</td>
                              <td className="px-5 py-2.5 text-center">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(subject.type)}`}>
                                  {subject.type}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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