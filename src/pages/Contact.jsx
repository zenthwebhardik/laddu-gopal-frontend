import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import LeadForm from '../components/LeadForm.jsx';
import { BUSINESS, telLink } from '../utils/business.js';

const contactInfo = [
  { icon: <MapPin size={22} />, title: 'Pata', text: BUSINESS.address, href: BUSINESS.mapsLink, external: true },
  { icon: <Phone size={22} />, title: 'Phone / WhatsApp', text: BUSINESS.phoneDisplay, href: telLink },
  { icon: <Mail size={22} />, title: 'Email', text: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  { icon: <Clock size={22} />, title: 'Samay', text: BUSINESS.hours },
];

export default function Contact() {
  return (
    <section id="contact" className="section section--plate" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-head" id="contact-header">
          <h2 id="contact-title">Dukaan par aaiye ya message kijiye</h2>
          <p>Call aur WhatsApp sabse jaldi hai. Form bhejenge to hum aapko call karke baat karenge.</p>
        </div>

        <div className="contact-grid">
          <div>
            <ul className="contact-list">
              {contactInfo.map((item) => (
                <li className="contact-info-item" key={item.title}>
                  <span className="contact-icon">{item.icon}</span>
                  <div>
                    <h3>{item.title}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                      >
                        {item.text}
                      </a>
                    ) : (
                      <p>{item.text}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="map-frame" id="map-container">
              <iframe
                src={BUSINESS.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Laddu Gopal Enterprise ka naksha"
              />
              <a href={BUSINESS.mapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <MapPin size={18} /> Google Maps par rasta dekhein
              </a>
            </div>
          </div>

          <div className="panel form-card" id="contact-form">
            <h3>Rate ke liye form</h3>
            <LeadForm source="contact" idPrefix="contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
