import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiBook, FiVideo, FiHeadphones, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Post, Event } from '../types'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch all posts and filter/sort in JS to avoid index requirements
      const postsSnapshot = await getDocs(collection(db, 'posts'))
      const allPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
      
      // Filter published posts and sort by createdAt
      const publishedPosts = allPosts
        .filter(post => post.status === 'published')
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.()?.getTime() || 0
          const dateB = b.createdAt?.toDate?.()?.getTime() || 0
          return dateB - dateA
        })
        .slice(0, 6)
      
      setPosts(publishedPosts)
      console.log('Fetched posts:', allPosts.length, 'Published:', publishedPosts.length)

      // Fetch all events and filter/sort in JS
      const eventsSnapshot = await getDocs(collection(db, 'events'))
      const allEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event))
      
      const now = new Date()
      const upcomingEvents = allEvents
        .filter(event => {
          const eventDate = event.date?.toDate?.()
          return eventDate && eventDate >= now
        })
        .sort((a, b) => {
          const dateA = a.date?.toDate?.()?.getTime() || 0
          const dateB = b.date?.toDate?.()?.getTime() || 0
          return dateA - dateB
        })
        .slice(0, 3)
      
      setEvents(upcomingEvents)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Walkthrough Bible Series
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Journey through God's Word with us. Discover Bible studies, sermons, devotionals, and Christian teachings to strengthen your faith.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/category/bible-studies" className="btn-secondary text-lg px-8 py-3">
                Start Reading
              </Link>
              <Link to="/category/sermons" className="bg-white/20 hover:bg-white/30 text-white font-medium py-3 px-8 rounded-lg transition-colors">
                Watch Latest
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Verse */}
      <section className="bg-amber-50 dark:bg-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-2">Daily Verse</p>
          <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 italic">
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
          </blockquote>
          <p className="text-gray-500 dark:text-gray-400 mt-2">— John 3:16 (NIV)</p>
        </div>
      </section>

      {/* Content Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Explore Our Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/category/bible-studies" className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bible Studies</h3>
              <p className="text-gray-600 dark:text-gray-400">Deep dive into Scripture with our comprehensive studies</p>
            </Link>

            <Link to="/category/sermons" className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiVideo className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Video Sermons</h3>
              <p className="text-gray-600 dark:text-gray-400">Watch inspiring messages from our pastors</p>
            </Link>

            <Link to="/category/devotionals" className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeadphones className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Audio Devotionals</h3>
              <p className="text-gray-600 dark:text-gray-400">Listen to daily devotionals on the go</p>
            </Link>

            <Link to="/events" className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upcoming Events</h3>
              <p className="text-gray-600 dark:text-gray-400">Join us for church events and gatherings</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            <Link to="/search" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-700 rounded-xl">
              <FiBook className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Posts Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back soon for inspiring content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} to={`/post/${post.slug}`} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative">
                    {post.thumbnail && (
                      <img 
                        src={post.thumbnail} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide broken image and show gradient background
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase">
                      {post.contentType || 'Article'}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.readingTime || 5} min read</span>
                      <span>{(post.publishedAt || post.createdAt)?.toDate?.()?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <Link to="/events" className="text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-3 text-center min-w-[60px]">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {event.date?.toDate?.()?.getDate()}
                      </span>
                      <span className="text-xs text-purple-500 block">
                        {event.date?.toDate?.()?.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-purple-100 mb-8">
            Subscribe to receive new posts, devotionals, and updates directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button type="submit" className="btn-secondary px-8 py-3">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
