import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiClock, FiEye, FiBook } from 'react-icons/fi'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Post } from '../types'
import { CATEGORIES } from '../config/constants'

export default function CategoryPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  
  const category = CATEGORIES.find(c => c.slug === slug || c.id === slug)

  useEffect(() => {
    if (slug) {
      fetchPosts()
    }
  }, [slug])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const categoryId = category?.id || slug
      const snapshot = await getDocs(collection(db, 'posts'))
      const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
      
      // Filter and sort in JS
      const categoryPosts = allPosts
        .filter(post => post.status === 'published' && post.category === categoryId)
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.()?.getTime() || 0
          const dateB = b.createdAt?.toDate?.()?.getTime() || 0
          return dateB - dateA
        })
      
      setPosts(categoryPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!category) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">The category "{slug}" doesn't exist.</p>
        <Link to="/" className="text-purple-600 hover:text-purple-700">Go back home</Link>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-4xl mb-4 block">{category.icon}</span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Browse all {category.name.toLowerCase()} content
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} to={`/post/${post.slug}`} className="card overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative">
                  {post.thumbnail && (
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  {post.contentType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  )}
                  {post.contentType === 'audio' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">🎧</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                    {category.name}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {post.contentType === 'text' 
                        ? `${post.readingTime || 5} min read` 
                        : `${post.duration || 0} min`}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye className="w-4 h-4" />
                      {(post.views || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <FiBook className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Posts Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back soon for {category.name.toLowerCase()} content!</p>
          </div>
        )}
      </div>
    </div>
  )
}
