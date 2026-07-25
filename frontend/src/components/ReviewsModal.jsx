import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReviewsModal({ isOpen, onClose }) {
  const { API_BASE } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/comments/all`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load reviews');
          return res.json();
        })
        .then(data => {
          setReviews(data.reviews || []);
          setError(null);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, API_BASE]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="glass-card"
          style={{
            position: 'relative', width: '100%', maxWidth: '800px',
            maxHeight: '85vh', display: 'flex', flexDirection: 'column',
            padding: '0', overflow: 'hidden', background: 'var(--bg-card)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(191,149,63,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              All <span className="text-gradient">Client Reviews</span>
            </h2>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              fontSize: '1.5rem', cursor: 'pointer', padding: '4px 12px'
            }}>×</button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading reviews...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>No reviews yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {reviews.map((review, i) => (
                  <div key={i} style={{
                    padding: '20px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(191,149,63,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ fontWeight: 'bold' }}>{review.name || 'Anonymous'}</div>
                      <div style={{ color: '#bf953f' }}>
                        {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
                      </div>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      "{review.message}"
                    </p>
                    {review.created_at && (
                      <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
