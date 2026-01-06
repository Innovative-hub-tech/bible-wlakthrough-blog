import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiSave, FiEye, FiImage, FiVideo, FiMusic, FiX } from 'react-icons/fi'
import { doc, getDoc, addDoc, updateDoc, collection, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../config/firebase'
import { useAuthContext } from '../../context/AuthContext'
import { CATEGORIES } from '../../config/constants'
import { generateSlug, calculateReadingTime } from '../../services/posts'

type ContentType = 'text' | 'video' | 'audio'

export default function PostEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, userData } = useAuthContext()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    contentType: 'text' as ContentType,
    category: 'bible-studies',
    tags: '',
    mediaUrl: '',
    thumbnail: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
  })

  useEffect(() => {
    if (isEditing && id) {
      fetchPost(id)
    }
  }, [id, isEditing])

  const fetchPost = async (postId: string) => {
    setLoading(true)
    try {
      const docRef = doc(db, 'posts', postId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setFormData({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          contentType: data.contentType || 'text',
          category: data.category || 'bible-studies',
          tags: data.tags?.join(', ') || '',
          mediaUrl: data.mediaUrl || '',
          thumbnail: data.thumbnail || '',
          status: data.status || 'draft',
          featured: data.featured || false,
        })
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'media') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      
      if (type === 'thumbnail') {
        setFormData({ ...formData, thumbnail: url })
      } else {
        setFormData({ ...formData, mediaUrl: url })
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      const slug = generateSlug(formData.title)
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      
      const postData = {
        title: formData.title,
        slug,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        contentType: formData.contentType,
        category: formData.category,
        tags,
        mediaUrl: formData.mediaUrl,
        thumbnail: formData.thumbnail,
        status,
        featured: formData.featured,
        readingTime: formData.contentType === 'text' ? calculateReadingTime(formData.content) : 0,
        authorId: user?.uid,
        authorName: userData?.displayName || user?.email || 'Anonymous',
        updatedAt: Timestamp.now(),
      }

      if (isEditing && id) {
        await updateDoc(doc(db, 'posts', id), postData)
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          views: 0,
          likes: 0,
          createdAt: Timestamp.now(),
        })
      }

      navigate('/admin/posts')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <FiEye className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <input
            type="text"
            placeholder="Post title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-2xl font-bold border-0 focus:ring-0 p-0 placeholder-gray-400"
          />
        </div>

        {/* Content Type */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
          <div className="flex gap-4">
            {[
              { type: 'text', icon: FiImage, label: 'Text Article' },
              { type: 'video', icon: FiVideo, label: 'Video' },
              { type: 'audio', icon: FiMusic, label: 'Audio' },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setFormData({ ...formData, contentType: type as ContentType })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.contentType === type
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Featured Image</label>
          {formData.thumbnail ? (
            <div className="relative">
              <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={() => setFormData({ ...formData, thumbnail: '' })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
              <FiImage className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-500">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} className="hidden" />
            </label>
          )}
        </div>

        {/* Media URL for video/audio */}
        {formData.contentType !== 'text' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {formData.contentType === 'video' ? 'Video URL' : 'Audio URL'}
            </label>
            <input
              type="url"
              placeholder="Enter URL or upload file..."
              value={formData.mediaUrl}
              onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Supports YouTube, Vimeo links or direct file URLs
            </p>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Content</label>
          <textarea
            placeholder="Write your post content here... (HTML supported)"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          />
          <p className="text-sm text-gray-500 mt-2">
            You can use HTML tags for formatting: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;blockquote&gt;, etc.
          </p>
        </div>

        {/* Excerpt */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Excerpt (optional)</label>
          <textarea
            placeholder="Brief description for previews..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category & Tags */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
              <input
                type="text"
                placeholder="faith, prayer, bible (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-gray-700">Feature this post on homepage</span>
          </label>
        </div>
      </div>
    </div>
  )
}
