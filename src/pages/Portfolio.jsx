import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SparkParticles from '../components/SparkParticles.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { Maximize2, ChevronLeft, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { galleryImages, videoGallery } from '../utils/mediaData.js';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  const displayImages = activeTab === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
                GATE & Steel Design <span className="text-gradient">Gallery</span>
              </h1>
              <p className="section-subtitle mx-auto">
                Explore our portfolio of 23+ high-definition GATE steel designs, civil engineering structures, TIG welding & tank fabrication projects.
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
            All Projects ({galleryImages.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gates' ? 'active' : ''}`} 
            onClick={() => setActiveTab('gates')}
          >
            GATE & Steel Gates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'grills' ? 'active' : ''}`} 
            onClick={() => setActiveTab('grills')}
          >
            Window & Balcony Grills
          </button>
          <button 
            className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`} 
            onClick={() => setActiveTab('custom')}
          >
            Civil Engineering & Steelwork
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
                  <div style={{ position: 'relative', height: '260px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                      loading="lazy"
                    />
                    <div className="hover-reveal-flex" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }}>
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
              <span className="section-label">Process & Field Execution</span>
              <h2 className="section-title" style={{ fontSize: '2.5rem' }}>
                Civil & Steel Fabrication <span className="text-gradient">Videos</span>
              </h2>
              <p className="section-subtitle mx-auto" style={{ maxWidth: '650px' }}>
                Watch our expert welders, civil engineering specialists, and fabricators in action across TIG welding, GATE steel design, and tank fabrication.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="video-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {videoGallery.map((video) => (
              <ScrollReveal key={video.id}>
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-lg)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', background: '#000' }}>
                    <iframe 
                      src={video.embed} 
                      title={video.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', borderTop: '1px solid var(--border-primary)', flexGrow: 1 }}>
                    <span style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 600, textTransform: 'uppercase' }}>{video.category}</span>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 0, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Play size={16} className="text-accent" /> {video.title}
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
              background: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(8px)'
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
                style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
              />
              <div style={{ marginTop: '1.2rem', textAlign: 'center', background: 'rgba(0,0,0,0.7)', padding: '12px 24px', borderRadius: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#fff', fontWeight: 500 }}>
                  {displayImages[activeImageIndex].title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    {activeImageIndex + 1} of {displayImages.length}
                  </span>
                  <a 
                    href={displayImages[activeImageIndex].imgeUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ fontSize: '0.8rem', color: '#f97316', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  >
                    View Source <ExternalLink size={12} />
                  </a>
                </div>
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
          font-size: 1.05rem;
          margin-bottom: 0;
          font-weight: 600;
          line-height: 1.4;
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
          .card-title-container {
            padding: 12px 10px;
          }
          .card-title {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 640px) {
          .portfolio-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 16px;
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
          color: #f97316;
        }
      `}</style>
    </section>
  );
}
