import { useState, useEffect } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if auth is properly initialized
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn('Firebase Auth not initialized - running in demo mode')
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data() as User)
          }
        } catch (error) {
          console.warn('Error fetching user data:', error)
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    
    // Check if user exists in Firestore, if not create them
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || 'User',
        role: 'reader',
        photoURL: result.user.photoURL,
        permissions: {
          canPublish: false,
          canEditOwnPosts: false,
          canEditAllPosts: false,
          canManageUsers: false,
        },
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }
    
    return result.user
  }

  const register = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      displayName,
      role: 'reader',
      permissions: {
        canPublish: false,
        canEditOwnPosts: false,
        canEditAllPosts: false,
        canManageUsers: false,
      },
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    
    return result.user
  }

  const logout = () => signOut(auth)

  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email)

  const isAdmin = userData?.role === 'admin'
  const isCollaborator = userData?.role === 'collaborator' || isAdmin
  const canPublish = userData?.permissions.canPublish || isAdmin

  return {
    user,
    userData,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    isAdmin,
    isCollaborator,
    canPublish,
  }
}
