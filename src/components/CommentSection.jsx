import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import ReviewsModal from './ReviewsModal.jsx';

export default function CommentSection() {
  const { user, API_BASE } = useAuth();
  
  const [topComments, setTopComments] = useState([]);
  const [stats, setStats] = useState({ average_rating: 0, total_count: 0 });
  
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch stats and top comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const [statsRes, topRes] = await Promise.all([
          fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/comments/all`),
          fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/comments/top?limit=4`)
        ]);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats({ average_rating: statsData.average_rating, total_count: statsData.total_count });
        }
        if (topRes.ok) {
          const topData = await topRes.json();
          setTopComments(topData);
        }
      } catch (err) {
        console.error('Failed to fetch comments', err);
      }
    };
    fetchComments();
  }, [API_BASE]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !text) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          rating,
          message: text
        })
      });

      if (!res.ok) throw new Error('Failed to post review.');

      setText('');
      setRating(5);
      setIsSuccess(true);
      
      setTimeout(() => setIsSuccess(false), 2500);
      
      // Optionally re-fetch stats to update total count
      fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/comments/all`)
        .then(r => r.json())
        .then(d => setStats({ average_rating: d.average_rating, total_count: d.total_count }))
        .catch(() => {});
        
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-section" id="comment-section">
      <div className="container">
        <div className="comment-container glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          
          <div className="text-center" style={{ marginBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }}>
            <span className="section-label">Community</span>
            <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
              Client <span className="text-gradient">Reviews</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.2rem', color: '#bf953f', fontWeight: 'bold' }}>
              <span>{stats.average_rating.toFixed(1)}</span>
              <span>
                {'★'.repeat(Math.round(stats.average_rating))}
                {'☆'.repeat(5 - Math.round(stats.average_rating))}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 'normal' }}>
                ({stats.total_count} reviews)
              </span>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn mt-4"
              style={{ background: 'transparent', border: '1px solid rgba(191,149,63,0.3)', color: '#bf953f' }}
            >
              See All Reviews
            </button>
          </div>

          <div className="comment-grid" style={{ position: 'relative', zIndex: 1 }}>
            {/* Comment Form */}
            <div className="comment-form-wrapper">
              <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>Leave a Review</h3>
              
              {!user ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', background: 'var(--bg-glass-hover)' }}>
                  <p style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>You must be logged in to post a review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="comment-form" style={{ position: 'relative' }}>
                  <div className="form-group" style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
                    <div className="comment-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem', cursor: 'default' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.name}</div>
                    </div>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rating:</label>
                    <div style={{ display: 'flex', gap: '4px', fontSize: '1.5rem', cursor: 'pointer', color: '#bf953f' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={() => setRating(star)}>
                          {star <= rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <textarea
                      placeholder="Write your review..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      required
                      className="form-input form-textarea"
                      rows="4"
                      style={{ 
                        borderColor: isSuccess ? 'var(--accent-primary)' : '',
                        boxShadow: isSuccess ? '0 0 15px rgba(245, 158, 11, 0.3)' : ''
                      }}
                    ></textarea>
                  </div>
                  
                  {submitError && (
                    <div className="form-error" style={{ marginBottom: '1rem', color: '#ef4444' }}>
                      ⚠ {submitError}
                    </div>
                  )}
                  
                  <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                    {submitting ? 'Posting...' : isSuccess ? '✓ Posted' : 'Post Review'}
                  </button>
                </form>
              )}
            </div>

            {/* Top Comments Feed */}
            <div className="comment-feed">
              <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>Top Reviews</h3>
              <div className="comments-list">
                <AnimatePresence initial={false}>
                  {topComments.map((comment, i) => (
                    <motion.div
                      key={comment.created_at || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="comment-item"
                    >
                      <div className="comment-avatar">{comment.name.charAt(0)}</div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <div>
                            <span className="comment-author">{comment.name}</span>
                            <span style={{ marginLeft: '8px', color: '#bf953f', fontSize: '0.8rem' }}>
                              {'★'.repeat(comment.rating)}
                            </span>
                          </div>
                          <span className="comment-time">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="comment-text">{comment.message}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {topComments.length === 0 && (
                  <div style={{ color: 'var(--text-secondary)' }}>No reviews yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
