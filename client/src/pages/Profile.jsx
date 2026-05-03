import { useState } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import API from '../utils/axios.js'

export default function Profile() {
  const { user, login, token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    rollNumber: user?.rollNumber || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await API.put('/users/profile', form)
      login(res.data.user, token)
      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (passwordForm.newPassword.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    setLoading(true)
    try {
      await API.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setSuccess('Password changed successfully!')
      setChangingPassword(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'bg-yellow-100 text-yellow-700'
      case 'teacher': return 'bg-green-100 text-green-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="bg-blue-800 text-white rounded-lg px-6 py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">👤 My Profile</h1>
            <p className="text-blue-200 text-sm mt-0.5">
              View and update your profile information
            </p>
          </div>
          <div className="text-5xl opacity-20">👤</div>
        </div>

        {/* Error and success */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Avatar card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 py-8 text-center">
                <div className="w-20 h-20 rounded-full bg-white text-blue-800 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-white font-semibold">{user?.name}</h2>
                <p className="text-blue-200 text-xs mt-0.5">{user?.email}</p>
                <span className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${getRoleColor()}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium text-gray-800">{user?.department || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Roll Number</span>
                  <span className="font-medium text-gray-800">{user?.rollNumber || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Role</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor()}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Edit form */}
          <div className="lg:col-span-2 space-y-4">

            {/* Profile details */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-5 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Profile Details</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-blue-200 hover:text-white"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="p-5">
                {!editing ? (
                  <div className="space-y-3">
                    {[
                      { label: 'Full Name', value: user?.name },
                      { label: 'Email', value: user?.email },
                      { label: 'Department', value: user?.department || 'Not set' },
                      { label: 'Roll Number', value: user?.rollNumber || 'Not set' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-500">{item.label}</span>
                        <span className="text-sm font-medium text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Department</label>
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
                      <label className="text-sm font-medium text-gray-700 block mb-1">Roll Number</label>
                      <input
                        type="text"
                        name="rollNumber"
                        value={form.rollNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Change password */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-800 text-white px-5 py-3">
                <h3 className="font-semibold text-sm">🔒 Change Password</h3>
              </div>
              <div className="p-5">
                {!changingPassword ? (
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition"
                  >
                    Change Password
                  </button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setChangingPassword(false)}
                        className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}