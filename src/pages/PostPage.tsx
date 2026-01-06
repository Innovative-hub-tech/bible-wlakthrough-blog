import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiClock, FiEye, FiCalendar, FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa'
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Post } from '../types'
import { CATEGORIES } from '../config/constants'
import ShareModal from '../components/ShareModal'
import CommentSection from '../components/CommentSection'

export default function PostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      // Fetch all posts and find by slug
      const snapshot = await getDocs(collection(db, 'posts'))
      const allPosts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post))
      const foundPost = allPosts.find(p => p.slug === slug)
      
      if (foundPost) {
        setPost(foundPost)
        setLikeCount(foundPost.likes || 0)
        
        // Increment view count
        try {
          await updateDoc(doc(db, 'posts', foundPost.id), {
            views: increment(1)
          })
        } catch (e) {
          console.log('Could not update view count:', e)
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!post) return
    
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    
    try {
      await updateDoc(doc(db, 'posts', post.id), {
        likes: increment(newLiked ? 1 : -1)
      })
    } catch (e) {
      console.log('Could not update like count:', e)
    }
  }

  const getCategoryName = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The post you're looking for doesn't exist.</p>
        <Link to="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    )
  }

  const publishedDate = post.publishedAt?.toDate?.() || post.createdAt?.toDate?.() || new Date()

  return (
    <article className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <li><Link to="/" className="hover:text-purple-600">Home</Link></li>
            <li>/</li>
            <li><Link to={`/category/${post.category}`} className="hover:text-purple-600">{getCategoryName(post.category)}</Link></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate">{post.title}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-medium px-3 py-1 rounded-full mb-4">
            {getCategoryName(post.category)}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              {publishedDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              {post.readingTime || 5} min read
            </span>
            <span className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              {(post.views || 0).toLocaleString()} views
            </span>
            <span>By {post.authorName}</span>
          </div>
        </header>

        {/* Scripture of the Day */}
        {post.scriptureText && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
            <p className="text-sm font-medium text-purple-200 mb-2">Scripture of the Day</p>
            <blockquote className="text-lg md:text-xl italic mb-2">
              "{post.scriptureText}"
            </blockquote>
            {post.scriptureReference && (
              <p className="text-purple-200 font-medium">— {post.scriptureReference}</p>
            )}
          </div>
        )}

        {/* Featured Image */}
        <div className="aspect-video bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl mb-8 overflow-hidden">
          {post.thumbnail && (
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Video/Audio Player */}
        {post.contentType === 'video' && post.mediaUrl && (
          <div className="mb-8">
            {post.mediaUrl.includes('youtube.com') || post.mediaUrl.includes('youtu.be') ? (
              <div className="aspect-video">
                <iframe
                  src={post.mediaUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full rounded-xl"
                  allowFullScreen
                  title={post.title}
                />
              </div>
            ) : (
              <video controls className="w-full rounded-xl">
                <source src={post.mediaUrl} />
              </video>
            )}
          </div>
        )}

        {post.contentType === 'audio' && post.mediaUrl && (
          <div className="mb-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
            <audio controls className="w-full">
              <source src={post.mediaUrl} />
            </audio>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>
            
            <a href="#comments" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
              <FiMessageCircle className="w-5 h-5" />
              <span>Comments</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                bookmarked 
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiBookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              <FiShare2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map(tag => (
              <Link
                key={tag}
                to={`/search?q=${tag}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="card p-6 mb-12">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Share this post</h3>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection postId={post.id} />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          title={post.title}
          url={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </article>
  )
}
