import { useState, useEffect } from 'react'
import API from '../utils/axios.js'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeDepartment, setActiveDepartment] = useState('')
  const [search, setSearch] = useState('')

  const departments = ['', 'Computer Science', 'Commerce', 'Arts', 'Science']

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await API.get('/courses', {
        params: activeDepartment ? { department: activeDepartment } : {},
      })
      setCourses(res.data)
    } catch (err) {
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [activeDepartment])

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'Computer Science': return 'bg-blue-100 text-blue-700'
      case 'Commerce': return 'bg-yellow-100 text-yellow-700'
      case 'Arts': return 'bg-purple-100 text-purple-700'
      case 'Science': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatFee = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase()) ||
    course.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎓 Courses Offered</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              All courses offered by Atharva College
            </p>
          </div>
          <div className="text-5xl opacity-20">🎓</div>
        </div>

        {/* Search + filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by name or code..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={activeDepartment}
            onChange={(e) => setActiveDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === '' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            Loading courses...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 mb-4">
            {error}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            No courses found.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              {/* Card header */}
              <div className="bg-blue-800 text-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">{course.code}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getDepartmentColor(course.department)}`}>
                    {course.department}
                  </span>
                </div>
                <p className="text-blue-200 text-xs mt-0.5">{course.name}</p>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-800">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Seats</span>
                    <span className="font-medium text-gray-800">{course.totalSeats}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                    <span className="text-gray-500">Tuition Fee</span>
                    <span className="font-semibold text-blue-700">
                      {formatFee(course.fees.tuition)}/yr
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}