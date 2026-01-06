import { FiX, FiCopy, FiCheck } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaTwitter, FaTiktok } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useState } from 'react'

interface ShareModalProps {
  title: string
  url: string
  onClose: () => void
}

export default function ShareModal({ title, url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'TikTok',
      icon: FaTiktok,
      color: 'bg-black hover:bg-gray-800',
      url: `https://www.tiktok.com/share?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Email',
      icon: MdEmail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share this post</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {shareLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white p-3 rounded-lg flex items-center justify-center transition-colors`}
              title={link.name}
            >
              <link.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Copy link */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 input-field text-sm"
          />
          <button
            onClick={copyToClipboard}
            className={`p-3 rounded-lg transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
