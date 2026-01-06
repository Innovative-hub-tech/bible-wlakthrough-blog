import { useState, useEffect } from 'react'
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi'
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Comment } from '../../types'

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      // Fetch all comments and sort in JavaScript to avoid composite index requirement
      const snapshot = await getDocs(collection(db, 'comments'))
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
      // Sort by createdAt descending
      commentsData.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0
        const dateB = b.createdAt?.toMillis?.() || 0
        return dateB - dateA
      })
      setComments(commentsData)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'comments', id), { status })
      setComments(comments.map(c => c.id === id ? { ...c, status } : c))
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      await deleteDoc(doc(db, 'comments', id))
      setComments(comments.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const filteredComments = comments.filter(c => filter === 'all' || c.status === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-600">Moderate user comments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status} ({comments.filter(c => status === 'all' || c.status === status).length})
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} comments found</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{comment.authorName}</p>
                      <p className="text-sm text-gray-500">{comment.authorEmail}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                      comment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <p className="text-sm text-gray-500">
                    Post ID: {comment.postId} • {comment.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(comment.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Approve"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
