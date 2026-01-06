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
  startAfter,
  DocumentSnapshot,
  Timestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Post, PostStatus, ContentType } from '../types'

const POSTS_COLLECTION = 'posts'

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Calculate reading time based on word count
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Create a new post
export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<string> {
  const now = Timestamp.now()
  const slug = generateSlug(postData.title)
  
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...postData,
    slug,
    readingTime: postData.contentType === 'text' ? calculateReadingTime(postData.content) : 0,
    views: 0,
    likes: 0,
    createdAt: now,
    updatedAt: now,
  })
  
  return docRef.id
}

// Get a single post by ID
export async function getPostById(id: string): Promise<Post | null> {
  const docRef = doc(db, POSTS_COLLECTION, id)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  
  return { id: docSnap.id, ...docSnap.data() } as Post
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('slug', '==', slug),
    where('status', '==', 'published'),
    limit(1)
  )
  
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Post
}


// Get posts with pagination
export async function getPosts(options: {
  status?: PostStatus
  category?: string
  authorId?: string
  contentType?: ContentType
  pageSize?: number
  lastDoc?: DocumentSnapshot
}): Promise<{ posts: Post[]; lastDoc: DocumentSnapshot | null }> {
  const { status = 'published', category, authorId, contentType, pageSize = 10, lastDoc } = options
  
  let q = query(collection(db, POSTS_COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'))
  
  if (category) {
    q = query(q, where('category', '==', category))
  }
  
  if (authorId) {
    q = query(q, where('authorId', '==', authorId))
  }
  
  if (contentType) {
    q = query(q, where('contentType', '==', contentType))
  }
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }
  
  q = query(q, limit(pageSize))
  
  const snapshot = await getDocs(q)
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
  const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null
  
  return { posts, lastDoc: newLastDoc }
}

// Get featured posts
export async function getFeaturedPosts(count: number = 3): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('status', '==', 'published'),
    where('featured', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
}

// Get trending posts (by views + likes)
export async function getTrendingPosts(count: number = 5): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('status', '==', 'published'),
    orderBy('views', 'desc'),
    limit(count)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
}

// Get recent posts
export async function getRecentPosts(count: number = 6): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
}

// Get related posts by category
export async function getRelatedPosts(postId: string, category: string, count: number = 4): Promise<Post[]> {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('status', '==', 'published'),
    where('category', '==', category),
    orderBy('createdAt', 'desc'),
    limit(count + 1)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Post))
    .filter(post => post.id !== postId)
    .slice(0, count)
}

// Update a post
export async function updatePost(id: string, data: Partial<Post>): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

// Delete a post
export async function deletePost(id: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id)
  await deleteDoc(docRef)
}

// Increment view count
export async function incrementViews(id: string): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, id)
  await updateDoc(docRef, {
    views: increment(1),
  })
}

// Toggle like on a post
export async function toggleLike(postId: string, _userId: string, isLiked: boolean): Promise<void> {
  const docRef = doc(db, POSTS_COLLECTION, postId)
  await updateDoc(docRef, {
    likes: increment(isLiked ? -1 : 1),
  })
}

// Search posts
export async function searchPosts(searchTerm: string, filters?: {
  category?: string
  contentType?: ContentType
}): Promise<Post[]> {
  // Note: Firestore doesn't support full-text search natively
  // For production, consider using Algolia or Elasticsearch
  // This is a basic implementation that searches by title
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  
  const snapshot = await getDocs(q)
  const searchLower = searchTerm.toLowerCase()
  
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Post))
    .filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      
      const matchesCategory = !filters?.category || post.category === filters.category
      const matchesType = !filters?.contentType || post.contentType === filters.contentType
      
      return matchesSearch && matchesCategory && matchesType
    })
}
