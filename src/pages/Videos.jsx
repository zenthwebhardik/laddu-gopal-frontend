import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { videoGallery } from '../utils/mediaData.js';

function VideoLightbox({ video, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={video.title} onClick={onClose}>
      <button className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Band karein">
        <X size={24} />
      </button>
      <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`${video.embed}?autoplay=1`}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="lightbox-caption">
        {video.title}
        <span>YouTube: {video.channel}</span>
      </p>
    </div>
  );
}

export default function Videos() {
  const [active, setActive] = useState(null);

  return (
    <section className="section" id="videos" aria-labelledby="videos-title">
      <div className="container">
        <div className="section-head">
          <h2 id="videos-title">Aur design dekhne hain?</h2>
          <p>
            YouTube par doosre channels ke kuch acche design collection. Jo pasand aaye, uska screenshot
            WhatsApp kar dijiye.
          </p>
        </div>

        <div className="video-grid">
          {videoGallery.map((video) => (
            <button key={video.id} type="button" className="video-card" onClick={() => setActive(video)}>
              <div className="video-thumb">
                <img src={video.thumbnail} alt="" loading="lazy" decoding="async" width="480" height="270" />
                <span className="play" aria-hidden="true"><Play size={20} fill="currentColor" /></span>
              </div>
              <h3>{video.title}</h3>
              <span className="video-src">YouTube · {video.channel}</span>
            </button>
          ))}
        </div>
      </div>

      {active && <VideoLightbox video={active} onClose={() => setActive(null)} />}
    </section>
  );
}
