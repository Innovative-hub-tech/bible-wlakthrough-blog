import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { ContactMessage } from '../types'
import { SITE_CONFIG } from '../config/constants'

const CONTACT_COLLECTION = 'contactMessages'

// Submit a contact message
export async function submitContactMessage(data: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<string> {
  const docRef = await addDoc(collection(db, CONTACT_COLLECTION), {
    ...data,
    isRead: false,
    createdAt: Timestamp.now(),
  })
  
  return docRef.id
}

// Get all contact messages (for admin)
export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, CONTACT_COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage))
}

// Mark message as read
export async function markMessageAsRead(id: string): Promise<void> {
  const docRef = doc(db, CONTACT_COLLECTION, id)
  await updateDoc(docRef, { isRead: true })
}

// Delete contact message
export async function deleteContactMessage(id: string): Promise<void> {
  const docRef = doc(db, CONTACT_COLLECTION, id)
  await deleteDoc(docRef)
}

// Generate WhatsApp link
export function getWhatsAppLink(message?: string): string {
  const phone = SITE_CONFIG.contact.whatsapp
  const text = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${phone}${text ? `?text=${text}` : ''}`
}

// Generate phone link
export function getPhoneLink(): string {
  return `tel:${SITE_CONFIG.contact.phone}`
}

// Generate email link
export function getEmailLink(subject?: string): string {
  const email = SITE_CONFIG.contact.email
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  return `mailto:${email}${subjectParam}`
}
