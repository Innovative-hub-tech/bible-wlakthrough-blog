import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi'
import { SITE_CONFIG } from '../config/constants'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setLoading(false)

    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out with questions, prayer requests, or just to say hello!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaWhatsapp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp</h3>
                <p className="text-gray-600 dark:text-gray-400">{SITE_CONFIG.contact.phone}</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:+234${SITE_CONFIG.contact.phone.slice(1)}`}
              className="card p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiPhone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
                <p className="text-gray-600 dark:text-gray-400">{SITE_CONFIG.contact.phone}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="card p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiMail className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm break-all">{SITE_CONFIG.contact.email}</p>
              </div>
            </a>

            {/* Location */}
            <div className="card p-6 flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">Nigeria</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h2>

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50"
                >
                  <FiSend className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
