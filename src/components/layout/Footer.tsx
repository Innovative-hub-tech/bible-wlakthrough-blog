import { Link } from 'react-router-dom'
import { FiFacebook, FiYoutube, FiTwitter, FiInstagram, FiMail, FiPhone } from 'react-icons/fi'
import { FaWhatsapp, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Walkthrough Bible Series</h2>
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Sharing Bible content, church teachings, and Christian inspiration to help you grow in faith and understanding of God's Word.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FiYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/category/bible-studies" className="hover:text-purple-400 transition-colors">Bible Studies</Link></li>
              <li><Link to="/category/sermons" className="hover:text-purple-400 transition-colors">Sermons</Link></li>
              <li><Link to="/category/devotionals" className="hover:text-purple-400 transition-colors">Devotionals</Link></li>
              <li><Link to="/testimonies" className="hover:text-purple-400 transition-colors">Testimonies</Link></li>
              <li><Link to="/events" className="hover:text-purple-400 transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://wa.me/2347013989898" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                  <FaWhatsapp className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href="tel:+2347013989898" className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
                  <FiPhone className="w-5 h-5" />
                  <span>07013989898</span>
                </a>
              </li>
              <li>
                <a href="mailto:awalkthroughlessonseries@gmail.com" className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
                  <FiMail className="w-5 h-5" />
                  <span>Email Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Walkthrough Bible Series. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
