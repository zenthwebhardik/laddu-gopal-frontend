import { Phone } from 'lucide-react';
import { WhatsAppIcon } from './Icons.jsx';
import { telLink, whatsappLink } from '../utils/business.js';

// Phones: fixed Call / WhatsApp bar. Larger screens: one floating WhatsApp button.
export default function WhatsAppButton() {
  return (
    <>
      <div className="mobile-action-bar">
        <a href={telLink} className="btn btn-primary">
          <Phone size={18} /> Call karein
        </a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <WhatsAppIcon size={18} /> WhatsApp
        </a>
      </div>
      <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="wa-float" aria-label="WhatsApp par message karein">
        <WhatsAppIcon size={22} /> WhatsApp
      </a>
    </>
  );
}
