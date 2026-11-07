import Gallery from '../components/Gallery.jsx';
import { galleryImages } from '../utils/mediaData.js';

const railings = galleryImages.filter((item) => item.category === 'grills');

export default function Portfolio() {
  return (
    <section className="section section--plate" id="portfolio" aria-labelledby="railing-title">
      <div className="container">
        <div className="section-head">
          <h2 id="railing-title">Seedhi, balcony aur khidki ke liye</h2>
          <p>Laser-cut panel, saadi patti ya pipe — jagah aur budget ke hisaab se design chuniye.</p>
        </div>
        <Gallery items={railings} />
      </div>
    </section>
  );
}
