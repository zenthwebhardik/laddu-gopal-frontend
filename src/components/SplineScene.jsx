import { useState } from 'react';

/**
 * Embeds a Spline scene via iframe as a full-screen fixed background.
 * This provides an immersive 3D experience behind the glassy content layers.
 */
export default function SplineScene() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, // Behind all content (content will be on higher z-index)
        pointerEvents: 'none', // Allow clicks to pass through to the page
        background: 'var(--bg-primary)', // Base color before it loads
      }}
    >
      {/* Loading state */}
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: 'var(--text-tertiary)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
            zIndex: 1,
          }}
        >
          <div className="spinner" />
          Loading Immersive 3D Experience…
        </div>
      )}

      {/* Spline iframe – full screen */}
      <iframe
        src="https://my.spline.design/robotarm-L18sJNJVElInLrLTFpA56G6h/"
        title="3D Robot Arm — Spline"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
        allow="autoplay; fullscreen"
        loading="lazy"
      />
    </div>
  );
}
