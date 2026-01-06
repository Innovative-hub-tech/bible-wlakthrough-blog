import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCesGqtm-BYXFc6mFEbuPZ7KVdqM5QDk74',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bible-walkthrough.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bible-walkthrough',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bible-walkthrough.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '56353485636',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:56353485636:web:49e35f104017163d5d5d11',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
