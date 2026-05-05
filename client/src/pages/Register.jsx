import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../utils/axios.js'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    department: '',
    rollNumber: '',
  })

  const [otp, setOtp] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Step 1 — Submit registration form
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
    setStep(3) // ← Skip OTP step, go straight to success
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed')
  } finally {
    setLoading(false)
  }
}
  // Step 2 — Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/auth/verify-otp', { email: form.email, otp })
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Wrong OTP')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setError('')
    setSuccess('')
    try {
      await API.post('/auth/resend-otp', { email: form.email })
      setSuccess('New OTP sent to your email!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP')
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎓</div>
          <h1 className="text-2xl font-bold text-blue-700">
            {step === 1 && 'Create Account'}
            {step === 2 && 'Verify Your Email'}
            {step === 3 && 'Registration Complete!'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && 'Fill in your details to register'}
            {step === 2 && `OTP sent to ${form.email}`}
            {step === 3 && 'Your account is ready'}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= s
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-500'
                }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4 border border-green-200">
            {success}
          </div>
        )}

        {/* Step 1 — Registration Form */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Email address
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
                Roll number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                placeholder="Roll no."
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
                Confirm password
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
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Register'}
            </button>
          </form>
        )}

        {/* Step 2 — OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 727568"
                maxLength={6}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg"
              />
              <p className="text-xs text-gray-400 mt-1 text-center">
                Check your email inbox and spam folder
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              className="w-full border border-blue-700 text-blue-700 hover:bg-blue-50 font-medium py-2.5 rounded-lg text-sm transition"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3 — Success */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <p className="text-gray-600 text-sm">
              Your email has been verified successfully. You can now login!
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Login link */}
        {step === 1 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}