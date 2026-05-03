import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🎓</div>
        <h1 className="text-6xl font-bold text-blue-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-medium transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}