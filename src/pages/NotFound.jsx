import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { BUSINESS, telLink } from '../utils/business.js';

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <p className="code">404</p>
        <h1>Ye page nahi mila</h1>
        <p className="section-subtitle" style={{ marginTop: 'var(--space-3)' }}>
          Link galat ho sakta hai. Home page par jaaiye, ya seedha call kar lijiye.
        </p>
        <div className="actions">
          <Link to="/" className="btn btn-primary" id="notfound-home">Home page</Link>
          <a href={telLink} className="btn btn-secondary" id="notfound-contact">
            <Phone size={18} /> {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
