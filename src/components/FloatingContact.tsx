import { FaWhatsapp } from 'react-icons/fa'
import { SITE_CONFIG } from '../config/constants'

export default function FloatingContact() {
  return (
    <a
      href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" />
    </a>
  )
}
