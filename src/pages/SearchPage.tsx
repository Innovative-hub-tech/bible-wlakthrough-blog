import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch, FiClock, FiEye, FiFilter, FiBook } from 'react-icons/fi'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Post } from '../types'
import { CATEGORIES } from '../config/constants'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(queryParam)
  const [showFilters, setShowFilters] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    contentType: '',
    category: '',
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, queryParam, filters])

  const fetchPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'posts'))
      const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
      
      // Filter and sort in JS
      const publishedPosts = allPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.()?.getTime() || 0
          const dateB = b.createdAt?.toDate?.()?.getTime() || 0
          return dateB - dateA
        })
      
      setPosts(publishedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    let results = posts

    // Filter by search query
    if (queryParam) {
      const searchLower = queryParam.toLowerCase()
      results = results.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Filter by content type
    if (filters.contentType) {
      results = results.filter(post => post.contentType === filters.contentType)
    }

    // Filter by category
    if (filters.category) {
      results = results.filter(post => post.category === filters.category)
    }

    setFilteredPosts(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams({ q: searchQuery })
  }

  const getCategoryName = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Search
          </h1>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, topics, tags..."
              className="w-full px-6 py-4 pr-14 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-purple-600"
            >
              <FiSearch className="w-6 h-6" />
            </button>
          </form>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600"
          >
            <FiFilter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content Type
                </label>
                <select
                  value={filters.contentType}
                  onChange={(e) => setFilters({ ...filters, contentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {queryParam && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{queryParam}"
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <Link key={post.id} to={`/post/${post.slug}`} className="card overflow-hidden group">
                <div className="h-40 bg-gradient-to-br from-purple-400 to-purple-600">
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
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                    {getCategoryName(post.category)}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {post.readingTime || 5} min
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
        ) : queryParam ? (
          <div className="text-center py-12">
            <FiSearch className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No results found for "{queryParam}"</p>
            <p className="text-sm text-gray-500">Try different keywords or browse our categories</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiBook className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Enter a search term to find posts</p>
          </div>
        )}
      </div>
    </div>
  )
}
