import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { PrayerRequest } from '../types'

const PRAYER_REQUESTS_COLLECTION = 'prayerRequests'

// Submit a prayer request
export async function submitPrayerRequest(data: {
  name: string
  email?: string
  request: string
  isPrivate: boolean
}): Promise<string> {
  const docRef = await addDoc(collection(db, PRAYER_REQUESTS_COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  })
  
  return docRef.id
}

// Get all prayer requests (for admin)
export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  const q = query(collection(db, PRAYER_REQUESTS_COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest))
}

// Delete prayer request
export async function deletePrayerRequest(id: string): Promise<void> {
  const docRef = doc(db, PRAYER_REQUESTS_COLLECTION, id)
  await deleteDoc(docRef)
}
