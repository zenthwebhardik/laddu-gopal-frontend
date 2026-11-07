import Gallery from '../components/Gallery.jsx';
import { galleryImages } from '../utils/mediaData.js';
import { whatsappLink } from '../utils/business.js';

const gates = galleryImages.filter((item) => item.category === 'gates');

export default function GateDesigns() {
  return (
    <section className="section" id="gate-designs" aria-labelledby="gates-title">
      <div className="container">
        <div className="section-head">
          <h2 id="gates-title">Kaunsa gate pasand hai?</h2>
          <p>Photo par tap karke bada dekhiye. Koi bhi design aapke gate ke naap mein banwaya ja sakta hai.</p>
        </div>

        <Gallery items={gates} leadFirst />

        <p className="gallery-note">
          Design pasand aaya?{' '}
          <a
            className="link"
            href={whatsappLink('Namaste, mujhe ek gate design ka rate jaanna hai. Photo bhej raha/rahi hoon.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Uski photo WhatsApp kijiye
          </a>{' '}
          — size ke saath rate bata denge.
        </p>
      </div>
    </section>
  );
}
