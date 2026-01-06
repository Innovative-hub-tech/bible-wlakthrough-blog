import { FiCalendar, FiMapPin, FiClock, FiExternalLink } from 'react-icons/fi'

// Mock events - will be replaced with Firebase data
const mockEvents = [
  {
    id: '1',
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly worship service filled with praise, prayer, and the Word of God.',
    date: new Date('2025-01-05T09:00:00'),
    endDate: new Date('2025-01-05T12:00:00'),
    location: 'Main Church Auditorium',
    isOnline: true,
    link: 'https://youtube.com/live',
  },
  {
    id: '2',
    title: 'Bible Study: Book of Acts',
    description: 'Deep dive into the Book of Acts and discover the power of the early church.',
    date: new Date('2025-01-08T18:00:00'),
    endDate: new Date('2025-01-08T20:00:00'),
    location: 'Fellowship Hall',
    isOnline: false,
  },
  {
    id: '3',
    title: 'Youth Conference 2025',
    description: 'A powerful gathering for young people to encounter God and grow in faith.',
    date: new Date('2025-01-15T10:00:00'),
    endDate: new Date('2025-01-17T16:00:00'),
    location: 'Conference Center',
    isOnline: true,
    link: 'https://youtube.com/live',
  },
  {
    id: '4',
    title: 'Prayer Night',
    description: 'A night dedicated to corporate prayer and intercession.',
    date: new Date('2025-01-20T19:00:00'),
    endDate: new Date('2025-01-20T22:00:00'),
    location: 'Prayer Room',
    isOnline: false,
  },
]

export default function EventsPage() {
  const upcomingEvents = mockEvents.filter(e => e.date >= new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const addToCalendar = (event: typeof mockEvents[0]) => {
    const startDate = event.date.toISOString().replace(/-|:|\.\d+/g, '')
    const endDate = event.endDate?.toISOString().replace(/-|:|\.\d+/g, '') || startDate
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || '')}`
    window.open(googleUrl, '_blank')
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join us for worship, fellowship, and spiritual growth
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {upcomingEvents.map(event => (
            <div key={event.id} className="card p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Date Badge */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {event.date.getDate()}
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-400 uppercase">
                      {event.date.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {event.description}
                      </p>
                    </div>
                    {event.isOnline && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-sm font-medium rounded-full">
                        Live Stream
                      </span>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(event.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {formatTime(event.date)} - {formatTime(event.endDate || event.date)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => addToCalendar(event)}
                      className="btn-primary text-sm"
                    >
                      Add to Calendar
                    </button>
                    {event.isOnline && event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Watch Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {upcomingEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No upcoming events at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
