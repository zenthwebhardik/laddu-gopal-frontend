import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SparkParticles from '../components/SparkParticles.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { Maximize2, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const showcaseData = {
  gates: [
    { id: 1, title: 'Motorized Cantilever Gate', img: 'https://images.unsplash.com/photo-1542617757-bb6274431e77?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Classic Wrought Iron Gate', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Industrial Sliding Gate', img: 'https://images.unsplash.com/photo-1620152427845-8f6a9e1cb07c?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Minimalist Entry Frame', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Ornamental Floral Gate', img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Heavy Duty Security Gate', img: 'https://images.unsplash.com/photo-1509391111737-05c083693fb1?auto=format&fit=crop&w=800&q=80' },
    { id: 7, title: 'Contemporary Steel Gate', img: 'https://images.unsplash.com/photo-1613506161421-3965582f3471?auto=format&fit=crop&w=800&q=80' },
    { id: 8, title: 'Rustic Ranch Gate', img: 'https://images.unsplash.com/photo-1590211113032-15957d15905f?auto=format&fit=crop&w=800&q=80' },
    { id: 9, title: 'Automated Track Gate', img: 'https://images.unsplash.com/photo-1534065664188-33e36e78eb58?auto=format&fit=crop&w=800&q=80' },
    { id: 10, title: 'Modern Privacy Gate', img: 'https://images.unsplash.com/photo-1512411985444-6330033fa4c7?auto=format&fit=crop&w=800&q=80' }
  ],
  grills: [
    { id: 11, title: 'Wrought Iron Window Guard', img: 'https://images.unsplash.com/photo-1574805799981-d0b81c43235b?auto=format&fit=crop&w=800&q=80' },
    { id: 12, title: 'Decorative Security Grill', img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80' },
    { id: 13, title: 'Modern Balcony Grill', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80' },
    { id: 14, title: 'Geometric Window Frame', img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&w=800&q=80' },
    { id: 15, title: 'Heavy Iron Protection', img: 'https://images.unsplash.com/photo-1506161421711-b0db43e74b33?auto=format&fit=crop&w=800&q=80' },
    { id: 16, title: 'Classic Victorian Grill', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' },
    { id: 17, title: 'Minimalist Balustrade', img: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=80' },
    { id: 18, title: 'Custom Arched Guard', img: 'https://images.unsplash.com/photo-1617104068361-b5186b1c4b12?auto=format&fit=crop&w=800&q=80' },
    { id: 19, title: 'Industrial Mesh Cover', img: 'https://images.unsplash.com/photo-1545084931-e406f890e793?auto=format&fit=crop&w=800&q=80' },
    { id: 20, title: 'Louvered Steel Grill', img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80' }
  ],
  custom: [
    { id: 21, title: 'Custom Steel Furniture', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80' },
    { id: 22, title: 'Structural Steel Beams', img: 'https://images.unsplash.com/photo-1509391111737-05c083693fb1?auto=format&fit=crop&w=800&q=80' },
    { id: 23, title: 'Floating Staircase', img: 'https://images.unsplash.com/photo-1574805799981-d0b81c43235b?auto=format&fit=crop&w=800&q=80' },
    { id: 24, title: 'Decorative Wall Panels', img: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=800&q=80' },
    { id: 25, title: 'Spiral Metal Stairs', img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80' },
    { id: 26, title: 'Welded Fire Pit', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' },
    { id: 27, title: 'Plasma Cut Signage', img: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?auto=format&fit=crop&w=800&q=80' },
    { id: 28, title: 'Industrial Shelving', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80' },
    { id: 29, title: 'Steel Planters', img: 'https://images.unsplash.com/photo-1506161421711-b0db43e74b33?auto=format&fit=crop&w=800&q=80' },
    { id: 30, title: 'Custom Metal Canopy', img: 'https://images.unsplash.com/photo-1613506161421-3965582f3471?auto=format&fit=crop&w=800&q=80' }
  ]
};

const allImages = [
  ...showcaseData.gates.map(img => ({ ...img, category: 'gates' })),
  ...showcaseData.grills.map(img => ({ ...img, category: 'grills' })),
  ...showcaseData.custom.map(img => ({ ...img, category: 'custom' }))
];

const videosData = [
  { id: 1, title: 'Heavy Gate Fabrication', embed: 'https://www.youtube.com/embed/ScMzIvxBSi4' },
  { id: 2, title: 'Plasma Cutting Custom Designs', embed: 'https://www.youtube.com/embed/5aLh7e1w_bE' },
  { id: 3, title: 'Precision TIG Welding', embed: 'https://www.youtube.com/embed/1OZZqL-bEwM' },
  { id: 4, title: 'Security Grill Assembly', embed: 'https://www.youtube.com/embed/O_uQZ76s8t8' }
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const displayImages = activeTab === 'all' 
    ? allImages 
    : allImages.filter(img => img.category === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
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
        {/* Filter Tabs */}
        <div className="filter-container">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            All Projects
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gates' ? 'active' : ''}`} 
            onClick={() => setActiveTab('gates')}
          >
            Moving & Sliding Gates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'grills' ? 'active' : ''}`} 
            onClick={() => setActiveTab('grills')}
          >
            Window & Security Grills
          </button>
          <button 
            className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`} 
            onClick={() => setActiveTab('custom')}
          >
            Architectural & Custom Metalwork
          </button>
        </div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={containerVariants}
            className="portfolio-grid"
          >
            {displayImages.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} className="grid-card">
                <div 
                  className="glass-card" 
                  style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <div style={{ position: 'relative', height: '280px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                      loading="lazy"
                    />
                    <div className="hover-reveal-flex" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }}>
                      <div style={{ width: '50px', height: '50px', background: 'var(--accent-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                        <Maximize2 size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="card-title-container">
                    <h3 className="card-title">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Video Section */}
        <div style={{ marginTop: '5rem' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="section-label">Process & Techniques</span>
              <h2 className="section-title" style={{ fontSize: '2.5rem' }}>
                Fabrication in <span className="text-gradient">Action</span>
              </h2>
              <p className="section-subtitle mx-auto" style={{ maxWidth: '600px' }}>
                Watch our expert welders and fabricators bring raw metal to life with precision techniques and state-of-the-art equipment.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="video-grid">
            {videosData.map((video) => (
              <ScrollReveal key={video.id}>
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                    <iframe 
                      src={video.embed} 
                      title={video.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderTop: '1px solid var(--border-primary)' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Play size={18} className="text-accent" /> {video.title}
                    </h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIndex(null)}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 9999, padding: 'var(--space-md)', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(5px)'
            }}
          >
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10000 }}>
              <button 
                onClick={() => setActiveImageIndex(null)}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', width: '44px', height: '44px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease' }}
                className="lightbox-close-btn"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <button 
              className="lightbox-nav prev" 
              onClick={handlePrev}
              style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10000, transition: 'all 0.3s ease' }}
            >
              <ChevronLeft size={28} />
            </button>
            
            <button 
              className="lightbox-nav next" 
              onClick={handleNext}
              style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10000, transition: 'all 0.3s ease' }}
            >
              <ChevronRight size={28} />
            </button>

            <motion.div 
              style={{ width: '100%', maxWidth: '1000px', padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={displayImages[activeImageIndex].img} 
                alt={displayImages[activeImageIndex].title}
                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
              />
              <div style={{ marginTop: '1.5rem', textAlign: 'center', background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff', fontWeight: 500 }}>
                  {displayImages[activeImageIndex].title}
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginTop: '5px' }}>
                  {activeImageIndex + 1} of {displayImages.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .filter-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        
        .tab-btn {
          padding: 12px 28px;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.95rem;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-primary);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          min-height: 36px;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-glass);
          transform: translateY(-2px);
        }
        .tab-btn:active {
          transform: scale(0.95);
        }
        .tab-btn.active {
          background: var(--accent-gradient);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 15px var(--accent-glow);
        }
        
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 1rem 0;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .card-title-container {
          padding: var(--space-md) var(--space-lg);
          text-align: center;
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-glass);
        }

        .card-title {
          font-size: 1.1rem;
          margin-bottom: 0;
          font-weight: 600;
        }
        
        @media (max-width: 1024px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .filter-container {
            justify-content: flex-start;
            flex-wrap: nowrap;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0 10px 10px 10px;
            margin-left: -10px;
            margin-right: -10px;
          }
          .filter-container::-webkit-scrollbar {
            display: none;
          }
          .tab-btn {
            padding: 8px 18px;
            font-size: 0.85rem;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .video-grid {
            grid-template-columns: 1fr;
          }
          .lightbox-nav {
            top: auto !important;
            bottom: 20px !important;
            transform: none !important;
          }
          .lightbox-nav.prev {
            left: 30% !important;
          }
          .lightbox-nav.next {
            right: 30% !important;
          }
          .card-title-container {
            padding: 12px 10px;
          }
          .card-title {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 640px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .card-title-container {
            padding: 8px 6px;
          }
          .card-title {
            font-size: 0.75rem;
          }
        }
        
        .hover-zoom { transform: scale(1); }
        .glass-card:hover .hover-zoom { transform: scale(1.08); }
        .hover-reveal-flex { opacity: 0 !important; }
        .glass-card:hover .hover-reveal-flex { opacity: 1 !important; }
        
        .lightbox-close-btn:hover, .lightbox-nav:hover {
          background: var(--accent-gradient) !important;
          border-color: transparent !important;
          transform: scale(1.1) !important;
        }
        
        .lightbox-nav {
          transform: translateY(-50%) scale(1);
        }
        
        .text-accent {
          color: #f97316; /* Primary accent color */
        }
      `}</style>
    </section>
  );
}
