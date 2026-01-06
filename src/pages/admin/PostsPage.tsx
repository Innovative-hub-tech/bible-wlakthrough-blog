import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch } from 'react-icons/fi'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Post } from '../../types'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
      setPosts(postsData)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      await deleteDoc(doc(db, 'posts', id))
      setPosts(posts.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || post.status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts found</p>
            <Link to="/admin/posts/new" className="text-purple-600 hover:underline">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-medium">{post.contentType.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-sm text-gray-500">By {post.authorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{post.views?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {post.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/post/${post.slug}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/posts/${post.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
