import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-8">

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* College info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎓</span>
              <span className="font-bold text-lg">Atharva College</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students with quality education, innovation and excellence since 2005.
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-gray-400 text-xs">📍 Lucknow, Uttar Pradesh</p>
              <p className="text-gray-400 text-xs">📞 +91 99999 88888</p>
              <p className="text-gray-400 text-xs">✉️ info@Atharvacollege.edu.in</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-300">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Announcements', path: '/announcements' },
                { label: 'Results', path: '/results' },
                { label: 'Syllabus', path: '/syllabus' },
                { label: 'News', path: '/news' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-400 hover:text-white text-sm transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Academics */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-300">Academics</h3>
            <div className="space-y-2">
              {[
                { label: 'Courses', path: '/courses' },
                { label: 'Fee Structure', path: '/fees' },
                { label: 'Events', path: '/events' },
                { label: 'Chat', path: '/chat' },
                { label: 'Profile', path: '/profile' },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-400 hover:text-white text-sm transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Accreditation */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-300">Accreditation</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs text-gray-300 font-medium">NAAC A+ Accredited</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📜</div>
                <p className="text-xs text-gray-300 font-medium">UGC Recognized</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © 2026 Atharva College. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            Built using MERN Stack
          </p>
        </div>
      </div>

    </footer>
  )
}