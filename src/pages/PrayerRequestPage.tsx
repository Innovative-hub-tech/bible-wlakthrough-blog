import { useState } from 'react'
import { FiSend, FiHeart, FiLock } from 'react-icons/fi'
import { submitPrayerRequest } from '../services/prayerRequests'

export default function PrayerRequestPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    isPrivate: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await submitPrayerRequest({
        name: formData.name,
        email: formData.email || undefined,
        request: formData.request,
        isPrivate: formData.isPrivate
      })
      setSuccess(true)
      setFormData({ name: '', email: '', request: '', isPrivate: false })
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error submitting prayer request:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHeart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Prayer Request</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your prayer needs with us. Our team is committed to praying for you and believing God for your breakthrough.
          </p>
        </div>

        {/* Scripture */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-8 text-white text-center">
          <p className="text-lg italic mb-2">
            "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours."
          </p>
          <p className="text-purple-200 font-medium">— Mark 11:24 (NIV)</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
              <p className="font-medium">Prayer request submitted!</p>
              <p className="text-sm mt-1">Thank you for sharing. We will be praying for you.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Prayer Request *
              </label>
              <textarea
                value={formData.request}
                onChange={(e) => setFormData({...formData, request: e.target.value})}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Share your prayer request here. Be as specific as you'd like..."
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPrivate"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isPrivate" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FiLock className="w-4 h-4" />
                Keep my request private (only visible to prayer team)
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium text-lg"
            >
              <FiSend className="w-5 h-5" />
              {submitting ? 'Submitting...' : 'Submit Prayer Request'}
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Our Commitment</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Every prayer request is treated with care and confidentiality. Our dedicated prayer team intercedes for each request received.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Need Urgent Prayer?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              For urgent prayer needs, you can also reach us directly via WhatsApp at <a href="https://wa.me/2347013989898" className="text-purple-600 hover:underline">+234 701 398 9898</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
