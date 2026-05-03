import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth()

  // Not logged in — send to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but not admin
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}