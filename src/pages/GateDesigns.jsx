import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { Maximize2, ExternalLink } from 'lucide-react';
import { galleryImages } from '../utils/mediaData.js';

// Filter out gates and steel structure design images
const gateDesignItems = galleryImages.filter(item => item.category === 'gates' || item.category === 'grills');

const categories = ['All', 'gates', 'grills'];

export default function GateDesigns() {
  const [activeImage, setActiveImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDesigns = selectedCategory === 'All'
    ? gateDesignItems
    : gateDesignItems.filter(item => item.category === selectedCategory);

  return (
    <section id="gate-designs" className="section-group">
      <section className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
        <SparkParticles count={15} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <span className="section-label">Design Gallery</span>
            <h1 className="section-title">
              GATE & Steel <span className="text-gradient">Design Showcase</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Explore our collection of premium, handcrafted gate designs and civil engineering steel structures. From modern laser-cut steel to classic ornamental ironwork.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Scrollable Filter Bar */}
          <div className="craftsman-filter-bar" style={{ marginBottom: '2rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              className={`craftsman-filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
              style={{ padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}
            >
              All Gate & Grill Designs ({gateDesignItems.length})
            </button>
            <button
              type="button"
              className={`craftsman-filter-btn ${selectedCategory === 'gates' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('gates')}
              style={{ padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}
            >
              Main & Sliding Steel Gates
            </button>
            <button
              type="button"
              className={`craftsman-filter-btn ${selectedCategory === 'grills' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('grills')}
              style={{ padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}
            >
              Window & Balcony Grills
            </button>
          </div>

          <div className="craftsman-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredDesigns.map((gate, idx) => (
              <ScrollReveal key={gate.id} delay={idx * 0.05}>
                <div 
                  className="glass-card craftsman-card" 
                  style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onClick={() => setActiveImage(gate)}
                >
                  <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={gate.img} 
                      alt={gate.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="hover-reveal-flex">
                      <div style={{ width: '44px', height: '44px', background: 'var(--accent-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                        <Maximize2 size={20} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 0 }}>{gate.title}</h3>
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
            style={{ position: 'fixed', inset: 0, zIndex: 9999, padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)' }}
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
              <h3 style={{ fontSize: '1.3rem', marginTop: 'var(--space-md)', marginBottom: 'var(--space-xs)', textAlign: 'center' }}>{activeImage.title}</h3>
              <a 
                href={activeImage.imgeUrl} 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '0.85rem', color: '#f97316', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '8px' }}
              >
                View High-Res Image <ExternalLink size={14} />
              </a>
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
