import { useState, useEffect } from 'react'
import { FiSend, FiUser } from 'react-icons/fi'
import { collection, getDocs, addDoc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Testimony } from '../types'

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', content: '' })

  useEffect(() => {
    fetchTestimonies()
  }, [])

  const fetchTestimonies = async () => {
    try {
      const q = query(
        collection(db, 'testimonies'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      setTestimonies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimony)))
    } catch (error) {
      console.error('Error fetching testimonies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'testimonies'), {
        authorName: formData.name,
        authorEmail: formData.email,
        content: formData.content,
        status: 'pending',
        createdAt: Timestamp.now(),
      })
      setSuccess(true)
      setFormData({ name: '', email: '', content: '' })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting testimony:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Testimonies</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Read inspiring stories of faith and share your own testimony of God's goodness in your life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Testimonies List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Testimonies</h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            ) : testimonies.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No testimonies yet. Be the first to share!</p>
              </div>
            ) : (
              testimonies.map((testimony) => (
                <div key={testimony.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimony.authorName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {testimony.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{testimony.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Share Your Testimony</h2>
              
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg mb-4 text-sm">
                  Thank you! Your testimony has been submitted and will appear after review.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Testimony *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 resize-none"
                    placeholder="Share how God has worked in your life..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  <FiSend className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Testimony'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
