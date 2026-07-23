import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SparkParticles from '../components/SparkParticles.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const showcaseData = {
  gates: [
    { id: 1, title: 'Modern Laser-Cut Steel', img: 'https://images.unsplash.com/photo-1542617757-bb6274431e77?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Classic Wrought Iron', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Industrial Sliding Gate', img: 'https://images.unsplash.com/photo-1620152427845-8f6a9e1cb07c?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Minimalist Entry Frame', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Ornamental Floral Gate', img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Heavy Duty Security Gate', img: 'https://images.unsplash.com/photo-1509391111737-05c083693fb1?auto=format&fit=crop&w=800&q=80' }
  ],
  stairs: [
    { id: 7, title: 'Floating Steel Staircase', img: 'https://images.unsplash.com/photo-1574805799981-d0b81c43235b?auto=format&fit=crop&w=800&q=80' },
    { id: 8, title: 'Industrial Mesh Railing', img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80' },
    { id: 9, title: 'Curved Wrought Iron', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' }, // Reusing elegant ironwork
    { id: 10, title: 'Minimalist Steel Balusters', img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&w=800&q=80' }
  ],
  custom: [
    { id: 11, title: 'Custom Steel Furniture', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80' },
    { id: 12, title: 'Metal Window Frames', img: 'https://images.unsplash.com/photo-1506161421711-b0db43e74b33?auto=format&fit=crop&w=800&q=80' },
    { id: 13, title: 'Structural Steel Beams', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' },
    { id: 14, title: 'Decorative Wall Panels', img: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=80' }
  ]
};

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('gates');
  const [activeImage, setActiveImage] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleScrollLeft = () => {
    const el = document.getElementById('carousel-' + activeTab);
    if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    const el = document.getElementById('carousel-' + activeTab);
    if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="section-group" style={{ position: 'relative', overflow: 'hidden' }}>
      <section className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
        <SparkParticles count={15} />
        
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center' }}>
              <span className="section-label">Master Showcase</span>
              <h1 className="section-title">
                Craftsmanship <span className="text-gradient">Gallery</span>
              </h1>
              <p className="section-subtitle mx-auto">
                Explore our portfolio of premium welding and fabrication projects. From majestic main gates to intricate custom metalwork.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="container" style={{ zIndex: 2, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            className={`tab-btn ${activeTab === 'gates' ? 'active' : ''}`} 
            onClick={() => setActiveTab('gates')}
          >
            Main Gates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stairs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('stairs')}
          >
            Staircase Grills
          </button>
          <button 
            className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`} 
            onClick={() => setActiveTab('custom')}
          >
            Custom Metalwork
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows */}
          <button className="carousel-nav prev" onClick={handleScrollLeft} aria-label="Scroll left">
            <ChevronLeft />
          </button>
          <button className="carousel-nav next" onClick={handleScrollRight} aria-label="Scroll right">
            <ChevronRight />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              variants={containerVariants}
              className="carousel-container"
              id={`carousel-${activeTab}`}
            >
              {showcaseData[activeTab].map((item) => (
                <motion.div key={item.id} variants={itemVariants} className="carousel-card">
                  <div 
                    className="glass-card" 
                    style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                    onClick={() => setActiveImage(item)}
                  >
                    <div style={{ position: 'relative', height: '250px', width: '100%', overflow: 'hidden' }}>
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                        className="hover-zoom"
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }} className="hover-reveal-flex">
                        <div style={{ width: '50px', height: '50px', background: 'var(--accent-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                          <Maximize2 size={24} />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: 'var(--space-md) var(--space-lg)', textAlign: 'center', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: 0 }}>{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
        .tab-btn {
          padding: 10px 24px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.95rem;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-primary);
          transition: all 0.3s ease;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-glass);
        }
        .tab-btn.active {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px var(--accent-glow);
        }
        .carousel-container {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          gap: 1.5rem;
          padding: 1rem 0 2rem 0;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
        .carousel-card {
          flex: 0 0 300px;
          scroll-snap-align: center;
        }
        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-glass);
          border: 1px solid var(--border-primary);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        .carousel-nav:hover {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
        }
        .carousel-nav.prev {
          left: -20px;
        }
        .carousel-nav.next {
          right: -20px;
        }
        @media (max-width: 768px) {
          .carousel-card {
            flex: 0 0 85vw;
          }
          .carousel-nav {
            display: none;
          }
        }
        .hover-zoom { transform: scale(1); }
        .glass-card:hover .hover-zoom { transform: scale(1.05); }
        .hover-reveal-flex { opacity: 0 !important; }
        .glass-card:hover .hover-reveal-flex { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
