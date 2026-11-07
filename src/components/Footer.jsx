import { BUSINESS, telLink, whatsappLink } from '../utils/business.js';

export default function Footer({ onOpenAdmin }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <a href="/#hero" className="brand">
              <img src="/logo.png" alt="" width="38" height="38" />
              <span className="brand-name">Laddu Gopal Enterprise</span>
            </a>
            <p>Main gate, sliding gate, railing, window grill aur shed ka kaam. {BUSINESS.address}.</p>
          </div>

          <div className="footer-col">
            <h3>Sampark</h3>
            <a href={telLink}>Call: {BUSINESS.phoneDisplay}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp: {BUSINESS.phoneDisplay}</a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            <p>{BUSINESS.hours}</p>
          </div>

          <div className="footer-col">
            <h3>Site par</h3>
            <a href="/#services">Kya banate hain</a>
            <a href="/#gate-designs">Gate designs</a>
            <a href="/#portfolio">Railing aur grill</a>
            <a href="/#contact">Rasta aur contact</a>
            <a href="/#support">Sawal-jawab</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} Laddu Gopal Enterprise, Panipat</span>
          <button type="button" onClick={onOpenAdmin}>Admin login</button>
        </div>
      </div>
    </footer>
  );
}
