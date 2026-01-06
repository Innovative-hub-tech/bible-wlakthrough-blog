export const SITE_NAME = 'Walkthrough Bible Series'
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://walkthroughbibleseries.netlify.app'

export const SITE_CONFIG = {
  name: SITE_NAME,
  tagline: 'Journey Through God\'s Word',
  description: 'Sharing Bible content, church teachings, and Christian inspiration',
  contact: {
    whatsapp: '2347013989898',
    phone: '07013989898',
    email: 'awalkthroughlessonseries@gmail.com',
  },
  social: {
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
    tiktok: '',
  },
}

export const CATEGORIES = [
  { id: 'bible-studies', name: 'Bible Studies', slug: 'bible-studies', icon: '📖' },
  { id: 'sermons', name: 'Sermons', slug: 'sermons', icon: '🎤' },
  { id: 'devotionals', name: 'Devotionals', slug: 'devotionals', icon: '🙏' },
  { id: 'testimonies', name: 'Testimonies', slug: 'testimonies', icon: '✨' },
  { id: 'church-news', name: 'Church News', slug: 'church-news', icon: '⛪' },
]

export const CONTENT_TYPES = {
  TEXT: 'text',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const

export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  COLLABORATOR: 'collaborator',
  READER: 'reader',
} as const
