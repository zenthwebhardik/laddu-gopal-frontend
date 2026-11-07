import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { BUSINESS, telLink } from '../utils/business.js';

const navItems = [
  { id: 'services', label: 'Kaam' },
  { id: 'gate-designs', label: 'Gate' },
  { id: 'portfolio', label: 'Railing & Grill' },
  { id: 'videos', label: 'Design ideas' },
  { id: 'contact', label: 'Contact' },
  { id: 'support', label: 'Sawal-Jawab' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('');
  const lastY = useRef(0);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 240 && y > lastY.current && !open);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    if (!onHome) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    );
    ['hero', ...navItems.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const href = (id) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header className={`site-header ${hidden ? 'is-hidden' : ''}`} id="main-nav">
        <div className="container">
          <a href={onHome ? '#hero' : '/'} className="brand" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="" width="38" height="38" />
            <span className="brand-name">
              Laddu Gopal Enterprise
              <small>Gate · Grill · Railing — {BUSINESS.addressShort}</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="Main">
            {navItems.map(({ id, label }) => (
              <a key={id} href={href(id)} className={`nav-link ${active === id ? 'active' : ''}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a href={telLink} className="btn btn-primary header-call">
              <Phone size={18} /> {BUSINESS.phoneDisplay}
            </a>
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              id="theme-toggle"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="icon-btn menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Menu band karein' : 'Menu kholein'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              id="mobile-toggle"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile">
          <a href={href('hero')} className="mobile-link" onClick={() => setOpen(false)}>Home</a>
          {navItems.map(({ id, label }) => (
            <a key={id} href={href(id)} className="mobile-link" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <div className="mobile-menu-foot">
            <span>{BUSINESS.hours}</span>
          </div>
        </nav>
      )}
    </>
  );
}
