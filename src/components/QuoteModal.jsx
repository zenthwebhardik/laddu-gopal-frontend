import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '' });
  const [submitted, setSubmitted] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (submitted) {
        // Reset after close
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', phone: '', details: '' });
        }, 500);
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            className="auth-modal glass-card"
            style={{ maxWidth: '500px', width: '100%' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) onClose();
            }}
          >
            <div className="auth-modal-drag-handle" />
            
            <h2 className="auth-title" style={{ marginTop: '0.5rem', fontFamily: '"Cinzel", "Playfair Display", serif', fontWeight: 700 }}>
              Request a Quote
            </h2>
            <p className="auth-subtitle" style={{ letterSpacing: '0.5px', marginBottom: 'var(--space-2xl)' }}>
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
                style={{ padding: 'var(--space-2xl) 0' }}
              >
                <div style={{ fontSize: '3rem', color: 'var(--success)', margin: '0 auto var(--space-md)' }}>✓</div>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>Quote Requested!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We will review your details and contact you shortly.</p>
                <button className="btn btn-primary" style={{ marginTop: 'var(--space-xl)' }} onClick={onClose}>
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="quote-name">Full Name</label>
                  <input
                    type="text"
                    id="quote-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quote-email">Email Address</label>
                  <input
                    type="email"
                    id="quote-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quote-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="quote-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quote-details">Project Details</label>
                  <textarea
                    id="quote-details"
                    className="form-textarea"
                    style={{ width: '100%', padding: '14px 16px', background: 'var(--bg-input)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-secondary)' }}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Describe your project requirements..."
                    rows={4}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 'var(--space-md)' }}>
                  Submit Request
                </button>
              </form>
            )}

            <button className="auth-close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
