import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/axios.js'

export default function AddSyllabus() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    course: 'BCA',
    department: 'Computer Science',
    semester: '',
  })

  const [subjects, setSubjects] = useState([
    { name: '', code: '', credits: 4, type: 'theory' },
  ])

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubjectChange = (index, field, value) => {
    const updated = [...subjects]
    updated[index][field] = value
    setSubjects(updated)
  }

  const addSubject = () => {
    setSubjects([...subjects, { name: '', code: '', credits: 4, type: 'theory' }])
  }

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await API.post('/syllabus', {
        ...form,
        semester: Number(form.semester),
        subjects: subjects.map((s) => ({
          name: s.name,
          code: s.code,
          credits: Number(s.credits),
          type: s.type,
        })),
      })
      setSuccess('Syllabus added successfully!')
      setTimeout(() => navigate('/admin'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add syllabus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-blue-600 hover:underline mb-2 block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">📚 Add Syllabus</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg border border-green-200 mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Course</label>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="MBA">MBA</option>
                  <option value="BA">BA</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Department</label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Computer Science</option>
                  <option>Commerce</option>
                  <option>Arts</option>
                  <option>Science</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Semester</label>
              <input
                type="number"
                name="semester"
                value={form.semester}
                onChange={handleFormChange}
                placeholder="e.g. 1"
                min="1"
                max="8"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subjects */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Subjects</label>
                <button
                  type="button"
                  onClick={addSubject}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add subject
                </button>
              </div>
              <div className="space-y-2">
                {subjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                      placeholder="Subject name"
                      required
                      className="col-span-4 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={subject.code}
                      onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                      placeholder="Code"
                      required
                      className="col-span-3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={subject.credits}
                      onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                      placeholder="Credits"
                      min="1"
                      max="6"
                      className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={subject.type}
                      onChange={(e) => handleSubjectChange(index, 'type', e.target.value)}
                      className="col-span-2 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="theory">Theory</option>
                      <option value="practical">Practical</option>
                      <option value="elective">Elective</option>
                    </select>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="col-span-1 text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Syllabus'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}