import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper.jsx';

export default function NotFound() {
  return (
    <PageWrapper>
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-4xl) var(--space-xl)',
          position: 'relative',
        }}
      >
        {/* Background orbs */}
        <div className="hero-bg-effects" aria-hidden>
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'clamp(6rem, 20vw, 12rem)',
              fontWeight: 900,
              lineHeight: 1,
              background: 'var(--accent-gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 'var(--space-lg)',
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-md)',
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              marginBottom: 'var(--space-2xl)',
              maxWidth: 460,
            }}
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary" id="notfound-home">
              ← Back to Home
            </Link>
            <Link to="/contact" className="btn btn-secondary" id="notfound-contact">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
