import { useState, useEffect } from 'react'
import { FiUser, FiSend } from 'react-icons/fi'
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Comment } from '../types'

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      // Fetch all comments and filter by postId, only show approved ones
      const snapshot = await getDocs(collection(db, 'comments'))
      const allComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
      
      // Filter by postId and approved status, then sort by date
      const postComments = allComments
        .filter(c => c.postId === postId && c.status === 'approved')
        .sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0
          const dateB = b.createdAt?.toMillis?.() || 0
          return dateB - dateA
        })
      
      setComments(postComments)
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Save comment to Firestore with pending status
      await addDoc(collection(db, 'comments'), {
        postId,
        authorName: newComment.name.trim(),
        authorEmail: newComment.email.trim(),
        content: newComment.content.trim(),
        status: 'pending', // Comments need admin approval
        createdAt: Timestamp.now(),
      })

      setSuccess(true)
      setNewComment({ name: '', email: '', content: '' })

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to submit comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="comments" className="pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="card p-6 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leave a Comment</h3>
        
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg mb-4 text-sm">
            Thank you for your comment! It will appear after moderation.
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={newComment.email}
                onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment *
            </label>
            <textarea
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              rows={4}
              className="input-field resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                <FiUser className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white">{comment.authorName}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {comment.createdAt?.toDate?.()?.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) || 'N/A'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
