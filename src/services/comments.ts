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
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Comment, CommentStatus } from '../types'

const COMMENTS_COLLECTION = 'comments'

// Create a new comment
export async function createComment(commentData: {
  postId: string
  authorName: string
  authorEmail: string
  content: string
  userId?: string
}): Promise<string> {
  const now = Timestamp.now()
  
  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
    ...commentData,
    status: 'pending' as CommentStatus,
    createdAt: now,
  })
  
  return docRef.id
}

// Get comments for a post
export async function getCommentsByPost(postId: string, status: CommentStatus = 'approved'): Promise<Comment[]> {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('postId', '==', postId),
    where('status', '==', status),
    orderBy('createdAt', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
}

// Get all comments (for admin moderation)
export async function getAllComments(status?: CommentStatus): Promise<Comment[]> {
  let q = query(collection(db, COMMENTS_COLLECTION), orderBy('createdAt', 'desc'))
  
  if (status) {
    q = query(q, where('status', '==', status))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment))
}

// Update comment status (approve/reject)
export async function updateCommentStatus(id: string, status: CommentStatus): Promise<void> {
  const docRef = doc(db, COMMENTS_COLLECTION, id)
  await updateDoc(docRef, { status })
}

// Delete a comment
export async function deleteComment(id: string): Promise<void> {
  const docRef = doc(db, COMMENTS_COLLECTION, id)
  await deleteDoc(docRef)
}

// Get comment count for a post
export async function getCommentCount(postId: string): Promise<number> {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('postId', '==', postId),
    where('status', '==', 'approved')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.size
}
