import { motion } from 'framer-motion';

export default function AuthBranding() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0 10px',
      position: 'relative'
    }}>
      {/* Luxury Metallic Gold Text */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          fontFamily: '"Cinzel", "Playfair Display", serif',
          fontSize: '2rem',
          fontWeight: 800,
          margin: 0,
          letterSpacing: '2px',
          background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 12px rgba(191, 149, 63, 0.4))',
          textAlign: 'center'
        }}
      >
        LADDU GOPAL
      </motion.h1>

      {/* Elegant Flute (Bansuri) Graphic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ marginTop: '15px', position: 'relative', width: '120px', height: '30px' }}
      >
        {/* Ambient Glow behind Flute */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '20px',
          background: 'rgba(251, 191, 36, 0.2)',
          filter: 'blur(10px)',
          borderRadius: '50%'
        }}></div>

        <svg viewBox="0 0 200 40" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="fluteGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bf953f" />
              <stop offset="50%" stopColor="#fcf6ba" />
              <stop offset="100%" stopColor="#b38728" />
            </linearGradient>
            
            <linearGradient id="morPankhGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          
          {/* Flute Body */}
          <rect x="20" y="15" width="160" height="6" rx="3" fill="url(#fluteGold)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
          
          {/* Flute Holes */}
          <circle cx="60" cy="18" r="1.5" fill="#1a120c" />
          <circle cx="80" cy="18" r="1.5" fill="#1a120c" />
          <circle cx="100" cy="18" r="1.5" fill="#1a120c" />
          <circle cx="120" cy="18" r="1.5" fill="#1a120c" />
          <circle cx="140" cy="18" r="1.5" fill="#1a120c" />
          
          {/* Tassels / Strings */}
          <path d="M 40 21 Q 45 35 40 40" fill="none" stroke="url(#fluteGold)" strokeWidth="1" />
          <path d="M 42 21 Q 50 35 48 40" fill="none" stroke="url(#fluteGold)" strokeWidth="1" />
          
          {/* Subtle Peacock Feather accent attached to flute */}
          <path d="M 170 18 Q 190 0 195 10 Q 185 25 175 20 Z" fill="url(#morPankhGradient)" />
          <circle cx="185" cy="12" r="2.5" fill="#fbbf24" />
          <circle cx="185" cy="12" r="1" fill="#1e3a8a" />
        </svg>

        {/* CSS Floating Gold Particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: [-10, -30], 
              x: [0, (i % 2 === 0 ? 15 : -15)],
              opacity: [0, 0.8, 0] 
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: `${20 + i * 15}%`,
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: '#fcf6ba',
              boxShadow: '0 0 5px #bf953f'
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
