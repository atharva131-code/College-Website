import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TopBar from './components/TopBar.jsx'
import CollegeHeader from './components/CollegeHeader.jsx'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Announcements from './pages/Announcements'
import Results from './pages/Results'
import Courses from './pages/Courses'
import Events from './pages/Events'
import FeeStructure from './pages/FeeStructure'
import Syllabus from './pages/Syllabus'
import Chat from './pages/Chat'
import News from './pages/News'
import Search from './pages/Search'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AddAnnouncement from './pages/admin/AddAnnouncement.jsx'
import AddEvent from './pages/admin/AddEvent.jsx'
import AddCourse from './pages/admin/AddCourse.jsx'
import AddNews from './pages/admin/AddNews.jsx'
import AddResult from './pages/admin/AddResult.jsx'
import AddSyllabus from './pages/admin/AddSyllabus.jsx'
import NotFound from './pages/NotFound.jsx'

function Layout({ children }) {
  const location = useLocation()
  const hideFooter = location.pathname === '/chat'
  const hideHeader =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'

  return (
    <>
      {!hideHeader && <TopBar />}
      {!hideHeader && <CollegeHeader />}
      <Navbar />
      {children}
      {!hideFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/fees" element={<ProtectedRoute><FeeStructure /></ProtectedRoute>} />
          <Route path="/syllabus" element={<ProtectedRoute><Syllabus /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-announcement" element={<ProtectedRoute adminOnly={true}><AddAnnouncement /></ProtectedRoute>} />
          <Route path="/admin/add-event" element={<ProtectedRoute adminOnly={true}><AddEvent /></ProtectedRoute>} />
          <Route path="/admin/add-course" element={<ProtectedRoute adminOnly={true}><AddCourse /></ProtectedRoute>} />
          <Route path="/admin/add-news" element={<ProtectedRoute adminOnly={true}><AddNews /></ProtectedRoute>} />
          <Route path="/admin/add-result" element={<ProtectedRoute adminOnly={true}><AddResult /></ProtectedRoute>} />
          <Route path="/admin/add-syllabus" element={<ProtectedRoute adminOnly={true}><AddSyllabus /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}