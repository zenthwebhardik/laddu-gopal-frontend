import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { Maximize2 } from 'lucide-react';

const gateDesigns = [
  { id: 1, title: 'Modern Laser-Cut Steel', img: 'https://images.unsplash.com/photo-1542617757-bb6274431e77?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Classic Wrought Iron', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Industrial Sliding Gate', img: 'https://images.unsplash.com/photo-1620152427845-8f6a9e1cb07c?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Minimalist Entry Frame', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Ornamental Floral Gate', img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Heavy Duty Security Gate', img: 'https://images.unsplash.com/photo-1509391111737-05c083693fb1?auto=format&fit=crop&w=800&q=80' },
  { id: 7, title: 'Contemporary Wood & Steel', img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=800&q=80' },
  { id: 8, title: 'Double Swing Estate Gate', img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80' },
  { id: 9, title: 'Automated Track Gate', img: 'https://images.unsplash.com/photo-1632152646200-a29d5b40449f?auto=format&fit=crop&w=800&q=80' },
  { id: 10, title: 'Custom Artistic Forged', img: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80' },
];

export default function GateDesigns() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section id="gate-designs" className="section-group">
      <section className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
        <SparkParticles count={15} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <span className="section-label">Design Gallery</span>
            <h1 className="section-title">
              Gate Designs <span className="text-gradient">Showcase</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Explore our collection of premium, handcrafted gate designs. From modern laser-cut steel to classic ornamental ironwork.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="portfolio-grid-new" style={{ marginTop: 'var(--space-md)' }}>
            {gateDesigns.map((gate, idx) => (
              <ScrollReveal key={gate.id} delay={idx * 0.1}>
                <div 
                  className="glass-card" 
                  style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  onClick={() => setActiveImage(gate)}
                >
                  <div style={{ position: 'relative', height: '300px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={gate.img} 
                      alt={gate.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="hover-reveal-flex">
                      <div style={{ width: '50px', height: '50px', background: 'var(--accent-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                        <Maximize2 size={24} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 0 }}>{gate.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            style={{ zIndex: 9999, padding: 'var(--space-md)', flexDirection: 'column' }}
          >
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button 
                onClick={() => setActiveImage(null)}
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', borderRadius: '50%', color: '#fff', width: '40px', height: '40px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <motion.div 
              className="glass-card"
              style={{ width: '100%', maxWidth: '900px', padding: 'var(--space-sm)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImage.img} 
                alt={activeImage.title}
                style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              />
              <h3 style={{ fontSize: '1.4rem', marginTop: 'var(--space-md)', marginBottom: 'var(--space-xs)', textAlign: 'center' }}>{activeImage.title}</h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hover-zoom {
          transform: scale(1);
        }
        .glass-card:hover .hover-zoom {
          transform: scale(1.05);
        }
        .hover-reveal-flex {
          opacity: 0 !important;
        }
        .glass-card:hover .hover-reveal-flex {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
