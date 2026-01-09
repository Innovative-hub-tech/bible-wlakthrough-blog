import { Timestamp } from 'firebase/firestore'

export interface User {
  uid: string
  email: string
  displayName: string
  role: 'admin' | 'collaborator' | 'reader'
  photoURL?: string
  permissions: {
    canPublish: boolean
    canEditOwnPosts: boolean
    canEditAllPosts: boolean
    canManageUsers: boolean
  }
  isActive: boolean
  lastLogin?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type ContentType = 'text' | 'video' | 'audio'
export type PostStatus = 'draft' | 'published' | 'archived'
export type CommentStatus = 'pending' | 'approved' | 'rejected'

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  contentType: ContentType
  mediaUrl?: string
  thumbnail?: string
  authorId: string
  authorName: string
  category: string
  tags: string[]
  status: PostStatus
  featured?: boolean
  likes: number
  likedBy?: string[]
  views: number
  readingTime?: number
  duration?: number
  // Scripture fields (new)
  scripture1Reference?: string
  scripture1Text?: string
  scripture2Reference?: string
  scripture2Text?: string
  // Legacy scripture fields (for backward compatibility)
  scriptureReference?: string
  scriptureText?: string
  // Short prayer
  shortPrayer?: string
  publishedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Comment {
  id: string
  postId: string
  authorName: string
  authorEmail: string
  content: string
  userId?: string
  status: CommentStatus
  createdAt: Timestamp
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  order: number
  postCount: number
  createdAt: Timestamp
}

export interface Event {
  id: string
  title: string
  description: string
  date: Timestamp
  endDate?: Timestamp
  location?: string
  isOnline: boolean
  link?: string
  imageUrl?: string
  createdAt: Timestamp
}

export interface Testimony {
  id: string
  authorName: string
  authorEmail?: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
}

export interface PrayerRequest {
  id: string
  name: string
  email?: string
  request: string
  isPrivate: boolean
  createdAt: Timestamp
}

export interface Subscriber {
  id: string
  email: string
  name?: string
  isConfirmed: boolean
  subscribedAt: Timestamp
  unsubscribedAt?: Timestamp
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: Timestamp
}

export interface SiteSettings {
  siteName: string
  tagline?: string
  description?: string
  logoUrl?: string
  contactInfo: {
    whatsapp?: string
    phone?: string
    email?: string
    address?: string
  }
  socialLinks: {
    facebook?: string
    youtube?: string
    twitter?: string
    instagram?: string
    tiktok?: string
  }
  liveStreamUrl?: string
  isLiveNow: boolean
}
