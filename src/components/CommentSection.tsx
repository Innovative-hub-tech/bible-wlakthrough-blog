import { useState } from 'react'
import { FiUser, FiSend } from 'react-icons/fi'

interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: Date
}

interface CommentSectionProps {
  postId: string
}

// Mock comments - will be replaced with Firebase data
const mockComments: Comment[] = [
  {
    id: '1',
    authorName: 'Sarah M.',
    content: 'This was such a blessing to read! The explanation of justification by faith really helped me understand Romans better.',
    createdAt: new Date('2024-12-29'),
  },
  {
    id: '2',
    authorName: 'David K.',
    content: 'Thank you for breaking down these complex theological concepts in such an accessible way. Looking forward to more studies!',
    createdAt: new Date('2024-12-28'),
  },
]

export default function CommentSection({ postId: _postId }: CommentSectionProps) {
  const [comments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSuccess(true)
    setNewComment({ name: '', email: '', content: '' })
    setLoading(false)

    setTimeout(() => setSuccess(false), 5000)
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
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <FiSend className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
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
                  {comment.createdAt.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
