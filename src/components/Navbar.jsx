import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '#services', label: 'Services' },
  { path: '#portfolio', label: 'Portfolio' },
  { path: '#contact', label: 'Contact' },
  { path: '#support', label: 'Support' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subnavVisible, setSubnavVisible] = useState(false);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    let timeoutId;
    if (subnavVisible) {
      timeoutId = setTimeout(() => {
        setSubnavVisible(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [subnavVisible]);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/stats/unique-users')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setUserCount(data.count))
      .catch(() => {});
  }, []);

  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sections = ['hero', 'services', 'portfolio', 'contact', 'support'].map(id => document.getElementById(id));
    sections.forEach(section => section && observer.observe(section));

    return () => {
      sections.forEach(section => section && observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav 
        className={`navbar ${scrolled ? 'scrolled' : ''}`} 
        id="main-nav"
        onClick={() => {
          if (window.innerWidth <= 768) {
            setSubnavVisible(true);
          }
        }}
      >
        <div className="container" style={{ justifyContent: 'space-between' }}>
          
          <div className="nav-brand-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '32px' }}>
            <a href="#hero" className="nav-brand" aria-label="Home" onClick={handleNavClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '800', fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
              <div className="logo-icon" style={{ 
                width: '42px', height: '42px', 
                background: 'var(--accent-gradient)', 
                borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                boxShadow: '0 4px 15px var(--accent-glow)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img src="/logo.png" alt="Laddu Gopal Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)', pointerEvents: 'none' }}></div>
              </div>
              <span className="logo-text" style={{
                fontFamily: '"Cinzel", "Playfair Display", serif',
                background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '800',
                fontSize: '1.2rem',
                filter: 'drop-shadow(0 2px 4px rgba(191, 149, 63, 0.2))'
              }}>LADDU GOPAL ENTERPRISE</span>
            </a>
          </div>

          <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="nav-links">
            <a
              href="#hero"
              className={`nav-link mobile-only-link ${activeSection === 'hero' ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              Home
            </a>
            {navItems.map(({ path, label }) => (
              <a
                key={path}
                href={path}
                className={`nav-link ${activeSection === path.substring(1) ? 'active' : ''}`}
                id={`nav-link-${label.toLowerCase()}`}
                onClick={handleNavClick}
              >
                {label}
              </a>
            ))}
            
            <div className="mobile-only-link" style={{ padding: '16px' }}>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          </div>

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', position: 'relative', zIndex: 1002 }}>
            {userCount !== null && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(191,149,63,0.15), rgba(191,149,63,0.05))',
                border: '1px solid rgba(191,149,63,0.2)',
                fontSize: '0.75rem', fontWeight: '600',
                color: '#bf953f', whiteSpace: 'nowrap',
              }}>
                <span>👥</span>
                <span>{userCount.toLocaleString()}</span>
              </div>
            )}
            <button
              className="theme-toggle nav-desktop-cta"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              className={`mobile-toggle ${mobileOpen ? 'active' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              id="mobile-toggle"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Sub Header (Scrollable) */}
      <AnimatePresence>
        {subnavVisible && (
          <motion.div 
            className="mobile-sub-nav"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href="/" className="sub-nav-link" onClick={() => setMobileOpen(false)}>Home</a>
            <a href="/#services" className="sub-nav-link" onClick={() => setMobileOpen(false)}>Services</a>
            <a href="/#gate-designs" className="sub-nav-link" onClick={() => setMobileOpen(false)}>Portfolio</a>
            <a href="/contact" className="sub-nav-link" onClick={() => setMobileOpen(false)}>Contact Us</a>
            <a href="/support" className="sub-nav-link" onClick={() => setMobileOpen(false)}>Support</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
