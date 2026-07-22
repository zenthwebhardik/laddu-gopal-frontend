import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand" style={{
            background: 'rgba(20, 20, 25, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ambient Glow */}
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at center, rgba(191, 149, 63, 0.05) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
            
            <Link to="/" className="nav-logo" id="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
              <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/logo.png" alt="Laddu Gopal Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <span style={{
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
            </Link>
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', position: 'relative', zIndex: 1 }}>
              Premium welding services delivering precision, strength, and reliability.
              Trusted by industries and homeowners since 2005.
            </p>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <a href="#services">MIG Welding</a>
            <a href="#services">TIG Welding</a>
            <a href="#services">Arc Welding</a>
            <a href="#services">Custom Fabrication</a>
            <a href="#services">Pipe Welding</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/">Home</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/support">Support</Link>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="mailto:info@laddugopalwelding.com">info@laddugopalwelding.com</a>
            <a>Near Balaji Dharam Kanta, Ram Nagar Street No. 3, Jatal Road, Panipat</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} Laddu Gopal Enterprise. All rights reserved.</span>
          <div className="footer-socials" style={{ padding: 0, display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="#" className="social-icon-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon-link" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            
            <style>{`
              .social-icon-link {
                color: var(--text-secondary);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.03);
              }
              .social-icon-link:hover {
                color: #bf953f;
                background: rgba(191, 149, 63, 0.1);
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(191, 149, 63, 0.2);
              }
            `}</style>
          </div>
        </div>
      </div>
    </footer>
  );
}
