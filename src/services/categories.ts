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
import { Category } from '../types'

const CATEGORIES_COLLECTION = 'categories'

// Default categories for the blog
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Bible Study', slug: 'bible-study', description: 'In-depth Bible studies and teachings', postCount: 0, order: 1 },
  { name: 'Devotionals', slug: 'devotionals', description: 'Daily devotionals and spiritual reflections', postCount: 0, order: 2 },
  { name: 'Sermons', slug: 'sermons', description: 'Sermon recordings and transcripts', postCount: 0, order: 3 },
  { name: 'Testimonies', slug: 'testimonies', description: 'Inspiring testimonies from believers', postCount: 0, order: 4 },
  { name: 'Christian Living', slug: 'christian-living', description: 'Practical guides for Christian life', postCount: 0, order: 5 },
  { name: 'Prayer', slug: 'prayer', description: 'Prayer guides and resources', postCount: 0, order: 6 },
  { name: 'Worship', slug: 'worship', description: 'Worship music and resources', postCount: 0, order: 7 },
  { name: 'Events', slug: 'events', description: 'Church events and announcements', postCount: 0, order: 8 },
]

// Create a new category
export async function createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'postCount'>): Promise<string> {
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    ...categoryData,
    postCount: 0,
    createdAt: Timestamp.now(),
  })
  
  return docRef.id
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('name', 'asc'))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    // Return default categories if none exist
    return DEFAULT_CATEGORIES.map((cat, index) => ({
      ...cat,
      id: `default-${index}`,
      createdAt: Timestamp.now(),
    })) as Category[]
  }
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category))
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find(cat => cat.slug === slug) || null
}

// Update category
export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id)
  await updateDoc(docRef, data)
}

// Delete category
export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id)
  await deleteDoc(docRef)
}

// Initialize default categories
export async function initializeCategories(): Promise<void> {
  const existing = await getDocs(collection(db, CATEGORIES_COLLECTION))
  
  if (existing.empty) {
    for (const category of DEFAULT_CATEGORIES) {
      await createCategory(category)
    }
  }
}
