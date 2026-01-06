import { Post } from '../types'
import { SITE_NAME, SITE_URL } from '../config/constants'

// Generate share URLs for different platforms
export function generateShareUrls(post: Post) {
  const postUrl = `${SITE_URL}/post/${post.slug}`
  const title = encodeURIComponent(post.title)
  const text = encodeURIComponent(`${post.title} - ${post.excerpt}`)
  
  return {
    whatsapp: `https://wa.me/?text=${title}%20${encodeURIComponent(postUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(postUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${title}`,
    email: `mailto:?subject=${title}&body=${text}%0A%0A${encodeURIComponent(postUrl)}`,
  }
}

// Copy link to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

// Use native share API if available
export async function nativeShare(post: Post): Promise<boolean> {
  if (!navigator.share) return false
  
  try {
    await navigator.share({
      title: post.title,
      text: post.excerpt,
      url: `${SITE_URL}/post/${post.slug}`,
    })
    return true
  } catch {
    return false
  }
}

// Generate Open Graph meta tags
export function generateOGTags(post: Post) {
  return {
    'og:title': post.title,
    'og:description': post.excerpt,
    'og:image': post.thumbnail || `${SITE_URL}/og-default.jpg`,
    'og:url': `${SITE_URL}/post/${post.slug}`,
    'og:type': 'article',
    'og:site_name': SITE_NAME,
    'twitter:card': 'summary_large_image',
    'twitter:title': post.title,
    'twitter:description': post.excerpt,
    'twitter:image': post.thumbnail || `${SITE_URL}/og-default.jpg`,
  }
}
