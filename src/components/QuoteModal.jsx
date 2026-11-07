import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import LeadForm from './LeadForm.jsx';
import { whatsappLink } from '../utils/business.js';

export default function QuoteModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const first = document.getElementById('quote-name');
    first?.focus();
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="auth-modal-drag-handle" />
            <h2 className="auth-title" id="quote-title">Rate maangiye</h2>
            <p className="auth-subtitle">
              Naam, mobile aur kaam batayiye — hum call karke rate batayenge. Jaldi ho to{' '}
              <a className="link" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a> kar dijiye.
            </p>
            <LeadForm source="quote" idPrefix="quote" onDone={onClose} />
            <button className="auth-close-btn" onClick={onClose} aria-label="Band karein">
              <X size={22} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
