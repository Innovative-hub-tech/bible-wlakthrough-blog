import { FiFileText, FiMessageSquare, FiUsers, FiEye, FiCalendar } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const stats = [
  { name: 'Total Posts', value: '24', icon: FiFileText, color: 'bg-purple-500', link: '/admin/posts' },
  { name: 'Comments', value: '156', icon: FiMessageSquare, color: 'bg-blue-500', link: '/admin/comments' },
  { name: 'Users', value: '1,234', icon: FiUsers, color: 'bg-green-500', link: '/admin/users' },
  { name: 'Total Views', value: '45.2K', icon: FiEye, color: 'bg-amber-500', link: '#' },
]

const recentPosts = [
  { id: '1', title: 'Understanding the Book of Romans', views: 1250, status: 'published' },
  { id: '2', title: 'The Power of Prayer', views: 890, status: 'published' },
  { id: '3', title: 'Walking in Faith', views: 2100, status: 'draft' },
]

const pendingComments = [
  { id: '1', author: 'John D.', content: 'Great article! Really helped me understand...', post: 'Understanding Romans' },
  { id: '2', author: 'Sarah M.', content: 'This was such a blessing to read!', post: 'The Power of Prayer' },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link to="/admin/posts" className="text-purple-600 text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{post.title}</p>
                  <p className="text-sm text-gray-500">{post.views.toLocaleString()} views</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  post.status === 'published' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Comments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Comments</h2>
            <Link to="/admin/comments" className="text-purple-600 text-sm hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {pendingComments.map((comment) => (
              <div key={comment.id} className="py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{comment.author}</p>
                  <span className="text-xs text-gray-500">on {comment.post}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs text-green-600 hover:underline">Approve</button>
                  <button className="text-xs text-red-600 hover:underline">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/posts/new"
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiFileText className="w-4 h-4" />
            New Post
          </Link>
          <Link
            to="/admin/events/new"
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <FiCalendar className="w-4 h-4" />
            New Event
          </Link>
          <Link
            to="/admin/comments"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiMessageSquare className="w-4 h-4" />
            Moderate Comments
          </Link>
        </div>
      </div>
    </div>
  )
}
