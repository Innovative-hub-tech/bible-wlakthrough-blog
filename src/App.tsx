import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'
import FloatingContact from './components/FloatingContact'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const PostPage = lazy(() => import('./pages/PostPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const TestimoniesPage = lazy(() => import('./pages/TestimoniesPage'))
const PrayerRequestPage = lazy(() => import('./pages/PrayerRequestPage'))

// Admin pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const PostsPage = lazy(() => import('./pages/admin/PostsPage'))
const PostEditorPage = lazy(() => import('./pages/admin/PostEditorPage'))
const CommentsPage = lazy(() => import('./pages/admin/CommentsPage'))
const UsersPage = lazy(() => import('./pages/admin/UsersPage'))
const EventsAdminPage = lazy(() => import('./pages/admin/EventsAdminPage'))
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'))

function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
    </div>
  )
}

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="post/:slug" element={<PostPage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="testimonies" element={<TestimoniesPage />} />
            <Route path="prayer-request" element={<PrayerRequestPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/new" element={<PostEditorPage />} />
            <Route path="posts/:id/edit" element={<PostEditorPage />} />
            <Route path="comments" element={<CommentsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="events" element={<EventsAdminPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
      <FloatingContact />
    </>
  )
}

export default App
