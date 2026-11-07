import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Plus } from 'lucide-react';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { BUSINESS, telLink, whatsappLink } from '../utils/business.js';

const faqs = [
  {
    q: 'Rate kaise pata chalega?',
    a: `Design ki photo aur size (chaudai × unchai) WhatsApp kar dijiye, ya ${BUSINESS.phoneDisplay} par call kijiye. Rate design, size aur material par depend karta hai, isliye bina size ke pakka rate batana mushkil hai.`,
  },
  {
    q: 'Kya apni photo wala design ban sakta hai?',
    a: 'Photo bhej dijiye. Design dekh kar bata denge ki kaise banega aur kitna kharcha aayega.',
  },
  {
    q: 'Kaam kitne din mein hota hai?',
    a: 'Ye size aur design par depend karta hai. Rate ke saath andaazan samay bhi bata diya jaata hai.',
  },
  {
    q: 'Purane gate ya grill ki repair hoti hai?',
    a: 'Haan, welding repair ka kaam bhi hota hai. Kya toota hai uski photo WhatsApp kar dijiye.',
  },
  {
    q: 'Dukaan kahan hai aur kab khulti hai?',
    a: `${BUSINESS.address}. ${BUSINESS.hours}. Aane se pehle ek baar call kar lijiye.`,
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="section" id="support" aria-labelledby="support-title">
      <div className="container">
        <div className="section-head" id="support-header">
          <h2 id="support-title">Aksar pooche jaane wale sawal</h2>
        </div>

        <div className="faq-list" id="faq-list">
          {faqs.map((faq, i) => (
            <div key={faq.q} className={`faq-item ${openFaq === i ? 'active' : ''}`} id={`faq-${i}`}>
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                id={`faq-btn-${i}`}
                aria-expanded={openFaq === i}
                aria-controls={`faq-answer-${i}`}
              >
                {faq.q}
                <span className="faq-toggle" aria-hidden="true"><Plus size={22} /></span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="faq-answer" id={`faq-answer-${i}`}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="faq-end">
          <p>Sawal yahan nahi mila? Seedha pooch lijiye.</p>
          <div className="cta-actions">
            <a href={telLink} className="btn btn-primary"><Phone size={18} /> {BUSINESS.phoneDisplay}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
