import { useState, useEffect } from 'react'
import API from '../utils/axios.js'

export default function FeeStructure() {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeDepartment, setActiveDepartment] = useState('')

  const departments = ['', 'Computer Science', 'Commerce', 'Arts', 'Science']

  const fetchFees = async () => {
    try {
      setLoading(true)
      const res = await API.get('/fees', {
        params: activeDepartment ? { department: activeDepartment } : {},
      })
      setFees(res.data)
    } catch (err) {
      setError('Failed to load fee structure')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFees()
  }, [activeDepartment])

  const formatFee = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">💰 Fee Structure</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              Annual fee details for all courses
            </p>
          </div>
          <div className="text-5xl opacity-20">💰</div>
        </div>

        {/* Department filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-2 flex-wrap">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeDepartment === dept
                  ? 'bg-blue-800 text-white border-blue-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {dept === '' ? 'All' : dept}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-white rounded-lg p-8 text-center text-gray-400">
            Loading fee structure...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 mb-4">
            {error}
          </div>
        )}

        {!loading && fees.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-800 text-white">
                      <th className="text-left px-5 py-3.5 font-medium">Course</th>
                      <th className="text-left px-5 py-3.5 font-medium">Department</th>
                      <th className="text-center px-5 py-3.5 font-medium">Duration</th>
                      <th className="text-right px-5 py-3.5 font-medium">Tuition</th>
                      <th className="text-right px-5 py-3.5 font-medium">Hostel</th>
                      <th className="text-right px-5 py-3.5 font-medium">Exam</th>
                      <th className="text-right px-5 py-3.5 font-medium">Total/Year</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {fees.map((course, index) => (
                      <tr
                        key={course._id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800">{course.code}</p>
                          <p className="text-xs text-gray-400">{course.name}</p>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{course.department}</td>
                        <td className="px-5 py-3.5 text-center text-gray-600">{course.duration}</td>
                        <td className="px-5 py-3.5 text-right text-gray-700">
                          {formatFee(course.fees.tuition)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-700">
                          {formatFee(course.fees.hostel)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-700">
                          {formatFee(course.fees.exam)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-blue-700">
                          {formatFee(
                            course.fees.tuition +
                            course.fees.hostel +
                            course.fees.exam
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Fees shown are per year. Total course fee = Annual fee × Duration years. All fees are subject to revision by the college management. For more details contact the accounts office.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}