import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthBranding from './AuthBranding.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth success
    login({ 
      name: formData.name || (isLogin ? 'Demo User' : 'New User'), 
      location: 'Local Region' 
    });
    onClose();
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
            
            <AuthBranding />
            
            <h2 className="auth-title" style={{ marginTop: '0.5rem', fontFamily: '"Cinzel", "Playfair Display", serif', fontWeight: 700 }}>
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="auth-subtitle" style={{ letterSpacing: '0.5px' }}>
              {isLogin ? 'Sign in to access your luxury portfolio.' : 'Discover the Laddu Gopal craftsmanship.'}
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {isLogin ? 'Sign In' : 'Register'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: 'var(--space-md) 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span style={{ padding: '0 var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>

              <button type="button" className="btn w-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => login({ name: 'Google User', location: 'Global' }) && onClose()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" width="18" height="18" fill="currentColor">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
                {isLogin ? 'Sign In with Google' : 'Register with Google'}
              </button>
            </form>

            <div className="auth-toggle">
              <span className="text-secondary">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button" 
                className="text-primary font-medium"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Sign In'}
              </button>
            </div>
            
            <button className="auth-close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
