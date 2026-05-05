import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../utils/axios.js'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    rollNumber: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
        rollNumber: form.rollNumber,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Left panel */}
        <div className="bg-blue-800 text-white p-10 flex flex-col justify-center">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold mb-2">Join Atharva College</h2>
          <p className="text-blue-200 text-sm mb-6">
            Create your account and get access to all college resources
          </p>
          <div className="space-y-3">
            {[
              'Access results and syllabus',
              'Stay updated with announcements',
              'Chat with classmates and teachers',
              'View fee structure and events',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-blue-100">
                <span className="text-green-400">✓</span>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-blue-700">
            <p className="text-blue-300 text-xs">
              NAAC A+ Accredited · Established 1995
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-10 flex flex-col justify-center overflow-y-auto">

          {/* Success screen */}
          {success ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Your account has been created. You can now login!
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
              <p className="text-gray-500 text-sm mb-6">Fill in your details to register</p>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={handleChange}
                    placeholder="BCA2024001"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}