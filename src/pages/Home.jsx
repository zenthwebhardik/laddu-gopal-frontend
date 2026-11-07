import { Phone } from 'lucide-react';
import HeroSparks from '../components/HeroSparks.jsx';
import { WhatsAppIcon } from '../components/Icons.jsx';
import { BUSINESS, telLink, whatsappLink } from '../utils/business.js';

const steps = [
  {
    title: 'Design chuniye',
    text: 'Neeche diye gate aur railing designs mein se chuniye, ya apni pasand ki photo WhatsApp kar dijiye.',
  },
  {
    title: 'Naap aur rate',
    text: 'Gate ya grill ka size batayiye. Design, size aur material dekh kar rate aur samay bata diya jaata hai.',
  },
  {
    title: 'Banwai',
    text: 'Rate tay hone ke baad kaam shuru hota hai. Beech mein koi badlaav ho to call par baat kar lijiye.',
  },
];

export default function Home({ onOpenQuote }) {
  return (
    <>
      <section className="hero" id="hero" aria-labelledby="hero-title">
        <div className="hero-media">
          <img
            src="/assets/work/work-16.webp"
            alt="Laser-cut jaali wala double main gate"
            width="600"
            height="750"
            fetchPriority="high"
          />
        </div>
        <HeroSparks />

        <div className="container">
          <div className="hero-inner">
            <h1 id="hero-title">Gate, grill aur railing — aapke naap se</h1>
            <p className="hero-lead">
              Main gate, sliding gate, seedhi ki railing, window grill aur shed. Design chuniye,
              size batayiye — rate ke liye seedha call ya WhatsApp karein.
            </p>

            <div className="hero-actions">
              <a href={telLink} className="btn btn-primary btn-lg" id="hero-cta-primary">
                <Phone size={20} /> Call: {BUSINESS.phoneDisplay}
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                id="hero-cta-whatsapp"
              >
                <WhatsAppIcon size={20} /> WhatsApp
              </a>
            </div>

            <p className="hero-meta">
              <span>{BUSINESS.addressShort} · {BUSINESS.hours}</span>
              <button type="button" className="link" onClick={onOpenQuote} id="hero-cta-secondary">
                Ya form bhar kar rate maangiye
              </button>
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <h2 id="how-title">Kaam kaise hota hai</h2>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li className="step" key={s.title}>
                <span className="step-no">{i + 1}.</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--plate" id="about" aria-labelledby="about-title">
        <div className="container about">
          <img
            src="/assets/images/laddu-gopal.jpg"
            alt="Laddu Gopal ji"
            className="about-img"
            loading="lazy"
            width="320"
            height="400"
          />
          <div>
            <h2 id="about-title">Laddu Gopal Enterprise, Jatal Road</h2>
            <p>
              Ghar aur dukaan ke liye loha aur steel ka kaam — main gate, sliding gate, seedhi aur balcony
              ki railing, window grill, aur tin shed ka dhancha.
            </p>
            <p>
              Dukaan {BUSINESS.address} par hai. Aana ho to pehle call kar lijiye.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="cta-section" aria-labelledby="cta-title">
        <div className="container">
          <div className="plate cta-plate" id="cta-banner">
            <div>
              <h2 id="cta-title">Rate jaanna hai?</h2>
              <p>Design ki photo aur size WhatsApp kar dijiye, ya seedha call kijiye.</p>
            </div>
            <div className="cta-actions">
              <a href={telLink} className="btn btn-primary" id="cta-contact">
                <Phone size={18} /> {BUSINESS.phoneDisplay}
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon size={18} /> WhatsApp
              </a>
              <button type="button" className="btn btn-secondary" onClick={onOpenQuote} id="cta-quote">
                Form bharein
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
