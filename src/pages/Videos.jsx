import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { Play } from 'lucide-react';

// Example initial videos
const initialVideos = [
  { id: 1, title: 'TIG Welding Precision', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { id: 2, title: 'Structural Steel Fabrication', url: 'https://www.youtube.com/embed/tgbNymZ7vqY' },
  { id: 3, title: 'Custom Pipe Welding', url: 'https://www.youtube.com/embed/9bZkp7q19f0' },
];

export default function Videos() {
  const [activeVideo, setActiveVideo] = useState(null);

  // Extract thumbnail safely (assuming standard YT URLs for demo)
  const getThumbnail = (url) => {
    let videoId = '';
    if (url.includes('embed/')) videoId = url.split('embed/')[1].split('?')[0];
    else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <section id="videos" className="section-group">
      <section className="page-header" style={{ paddingBottom: 'var(--space-2xl)' }}>
        <SparkParticles count={15} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <span className="section-label">Media Gallery</span>
            <h1 className="section-title">
              Welding <span className="text-gradient">in Action</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Watch our master craftsmen at work. See the precision, power, and art of industrial welding.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="portfolio-grid-new" style={{ marginTop: 'var(--space-md)' }}>
            {initialVideos.map((video, idx) => (
              <ScrollReveal key={video.id} delay={idx * 0.1}>
                <div 
                  className="glass-card" 
                  style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  onClick={() => setActiveVideo(video)}
                >
                  <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={getThumbnail(video.url)} 
                      alt={video.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                      className="hover-zoom"
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '60px', height: '60px', background: 'var(--accent-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px var(--accent-glow)' }}>
                        <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: 'var(--space-md)' }}>
                    <h3 style={{ fontSize: '1.2rem' }}>{video.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            style={{ zIndex: 9999, padding: 'var(--space-md)', flexDirection: 'column' }}
          >
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button 
                onClick={() => setActiveVideo(null)}
                style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-primary)', borderRadius: '50%', color: '#fff', width: '40px', height: '40px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <motion.div 
              className="glass-card"
              style={{ width: '100%', maxWidth: '900px', padding: 0, overflow: 'hidden', position: 'relative' }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                <iframe 
                  src={`${activeVideo.url}?autoplay=1`} 
                  title={activeVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </div>
              <div style={{ padding: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 0 }}>{activeVideo.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
