import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Subscriber } from '../types'

const SUBSCRIBERS_COLLECTION = 'subscribers'

// Subscribe to newsletter
export async function subscribe(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  // Check if already subscribed
  const q = query(collection(db, SUBSCRIBERS_COLLECTION), where('email', '==', email))
  const existing = await getDocs(q)
  
  if (!existing.empty) {
    const subscriber = existing.docs[0].data() as Subscriber
    if (subscriber.isConfirmed && !subscriber.unsubscribedAt) {
      return { success: false, message: 'You are already subscribed!' }
    }
    
    // Resubscribe if previously unsubscribed
    await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, existing.docs[0].id), {
      isConfirmed: true,
      unsubscribedAt: null,
      subscribedAt: Timestamp.now(),
    })
    return { success: true, message: 'Welcome back! You have been resubscribed.' }
  }
  
  // New subscription
  await addDoc(collection(db, SUBSCRIBERS_COLLECTION), {
    email,
    name: name || null,
    isConfirmed: true, // In production, implement email confirmation
    subscribedAt: Timestamp.now(),
    unsubscribedAt: null,
  })
  
  return { success: true, message: 'Thank you for subscribing!' }
}

// Unsubscribe from newsletter
export async function unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
  const q = query(collection(db, SUBSCRIBERS_COLLECTION), where('email', '==', email))
  const existing = await getDocs(q)
  
  if (existing.empty) {
    return { success: false, message: 'Email not found in our subscribers list.' }
  }
  
  await updateDoc(doc(db, SUBSCRIBERS_COLLECTION, existing.docs[0].id), {
    unsubscribedAt: Timestamp.now(),
  })
  
  return { success: true, message: 'You have been unsubscribed successfully.' }
}

// Get all active subscribers (for admin)
export async function getActiveSubscribers(): Promise<Subscriber[]> {
  const q = query(
    collection(db, SUBSCRIBERS_COLLECTION),
    where('isConfirmed', '==', true),
    where('unsubscribedAt', '==', null)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subscriber))
}
