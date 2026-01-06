import { useState } from 'react'
import { FiSave } from 'react-icons/fi'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Walkthrough Bible Series',
    tagline: "Journey Through God's Word",
    description: 'Sharing Bible content, church teachings, and Christian inspiration',
    whatsapp: '2347013989898',
    phone: '07013989898',
    email: 'awalkthroughlessonseries@gmail.com',
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // In production, save to Firestore
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your site settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Site Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input type="text" value={settings.tagline} onChange={(e) => setSettings({...settings, tagline: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={settings.description} onChange={(e) => setSettings({...settings, description: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input type="text" value={settings.whatsapp} onChange={(e) => setSettings({...settings, whatsapp: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="2347013989898" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input type="url" value={settings.facebook} onChange={(e) => setSettings({...settings, facebook: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
              <input type="url" value={settings.youtube} onChange={(e) => setSettings({...settings, youtube: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <input type="url" value={settings.twitter} onChange={(e) => setSettings({...settings, twitter: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="url" value={settings.instagram} onChange={(e) => setSettings({...settings, instagram: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50">
            <FiSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-green-600">Settings saved!</span>}
        </div>
      </form>
    </div>
  )
}
