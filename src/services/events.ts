import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Event } from '../types'

const EVENTS_COLLECTION = 'events'

// Create a new event
export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...eventData,
    createdAt: Timestamp.now(),
  })
  
  return docRef.id
}

// Get all events
export async function getEvents(): Promise<Event[]> {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event))
}

// Get upcoming events
export async function getUpcomingEvents(count: number = 5): Promise<Event[]> {
  const now = Timestamp.now()
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('date', '>=', now),
    orderBy('date', 'asc'),
    limit(count)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event))
}

// Get event by ID
export async function getEventById(id: string): Promise<Event | null> {
  const docRef = doc(db, EVENTS_COLLECTION, id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Event
}

// Update event
export async function updateEvent(id: string, data: Partial<Event>): Promise<void> {
  const docRef = doc(db, EVENTS_COLLECTION, id)
  await updateDoc(docRef, data)
}

// Delete event
export async function deleteEvent(id: string): Promise<void> {
  const docRef = doc(db, EVENTS_COLLECTION, id)
  await deleteDoc(docRef)
}

// Generate Google Calendar link
export function generateGoogleCalendarLink(event: Event): string {
  const startDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // Default 2 hours
  
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '')
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: event.description,
    location: event.location || '',
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Generate Apple Calendar link (ICS format)
export function generateAppleCalendarLink(event: Event): string {
  const startDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
  
  const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z'
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n')
  
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`
}
