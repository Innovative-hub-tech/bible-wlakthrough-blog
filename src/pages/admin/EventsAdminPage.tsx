import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Event } from '../../types'

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    isOnline: false,
    link: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)))
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: Timestamp.fromDate(new Date(formData.date)),
        location: formData.location,
        isOnline: formData.isOnline,
        link: formData.link,
      }

      if (editingEvent) {
        await updateDoc(doc(db, 'events', editingEvent.id), eventData)
      } else {
        await addDoc(collection(db, 'events'), { ...eventData, createdAt: Timestamp.now() })
      }
      
      fetchEvents()
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date?.toDate?.()?.toISOString().slice(0, 16) || '',
      location: event.location || '',
      isOnline: event.isOnline,
      link: event.link || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    try {
      await deleteDoc(doc(db, 'events', id))
      setEvents(events.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingEvent(null)
    setFormData({ title: '', description: '', date: '', location: '', isOnline: false, link: '' })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Manage church events</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          <FiPlus className="w-4 h-4" /> New Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Event title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg" rows={3} required />
            <input type="datetime-local" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.isOnline} onChange={(e) => setFormData({...formData, isOnline: e.target.checked})} />
              <span>Online Event</span>
            </label>
            {formData.isOnline && <input type="url" placeholder="Event link" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />}
            <div className="flex gap-2">
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg">Save</button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No events yet</div>
        ) : (
          <div className="divide-y">
            {events.map((event) => (
              <div key={event.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date?.toDate?.()?.toLocaleDateString()} • {event.location || 'Online'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(event)} className="p-2 text-gray-400 hover:text-blue-600"><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
