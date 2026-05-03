import { Link } from 'react-router-dom'

export default function TopBar() {
  return (
    <div className="bg-gray-900 text-white text-xs py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left — quick links */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Welcome to Atharva College</span>
          <span className="text-gray-600">|</span>
          <Link to="/announcements" className="hover:text-yellow-400 transition">
            Notices & Circulars
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/fees" className="hover:text-yellow-400 transition text-yellow-300 font-medium">
            Fee Portal
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/results" className="hover:text-yellow-400 transition">
            Results
          </Link>
        </div>

        {/* Right — contact info */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-gray-400">📞 +91 99999 88888</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">✉️ info@Atharvacollege.edu.in</span>
        </div>
      </div>
    </div>
  )
}