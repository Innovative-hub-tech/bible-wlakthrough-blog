import {
  collection,
  doc,
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
import { Testimony } from '../types'

const TESTIMONIES_COLLECTION = 'testimonies'

// Submit a new testimony
export async function submitTestimony(data: {
  authorName: string
  authorEmail?: string
  content: string
}): Promise<string> {
  const docRef = await addDoc(collection(db, TESTIMONIES_COLLECTION), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now(),
  })
  
  return docRef.id
}

// Get approved testimonies
export async function getApprovedTestimonies(count?: number): Promise<Testimony[]> {
  let q = query(
    collection(db, TESTIMONIES_COLLECTION),
    where('status', '==', 'approved'),
    orderBy('createdAt', 'desc')
  )
  
  if (count) {
    q = query(q, limit(count))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimony))
}

// Get all testimonies (for admin)
export async function getAllTestimonies(status?: 'pending' | 'approved' | 'rejected'): Promise<Testimony[]> {
  let q = query(collection(db, TESTIMONIES_COLLECTION), orderBy('createdAt', 'desc'))
  
  if (status) {
    q = query(q, where('status', '==', status))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimony))
}

// Update testimony status
export async function updateTestimonyStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
  const docRef = doc(db, TESTIMONIES_COLLECTION, id)
  await updateDoc(docRef, { status })
}

// Delete testimony
export async function deleteTestimony(id: string): Promise<void> {
  const docRef = doc(db, TESTIMONIES_COLLECTION, id)
  await deleteDoc(docRef)
}
