import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Shield, Settings, Wrench, Building2, Trophy, Truck, Microscope, Clock, MessageSquare, PenTool, CheckCircle, Factory, Droplet, Home as HomeIcon, Play } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

import { Link } from 'react-router-dom';

import FluidBackground from '../components/FluidBackground.jsx';
import WeldingSparkCanvas from '../components/WeldingSparkCanvas.jsx';

/* ─── Service data ──────────────────────────────────────────── */
const services = [
  { icon: <Zap size={24} />, title: 'MIG Welding', desc: 'High-speed Metal Inert Gas welding for steel, aluminum, and stainless steel with minimal spatter and maximum deposition rates.' },
  { icon: <Flame size={24} />, title: 'TIG Welding', desc: 'Precision Tungsten Inert Gas welding for aerospace-grade joints, exotic alloys, and thin-gauge materials requiring flawless aesthetics.' },
  { icon: <Shield size={24} />, title: 'Arc Welding', desc: 'Shielded Metal Arc Welding for robust structural steelwork, pipeline repairs, and heavy field construction in any environment.' },
  { icon: <Settings size={24} />, title: 'Custom Fabrication', desc: 'Bespoke metalwork from blueprint to final product — gates, frames, industrial structures, and ornamental art pieces.' },
  { icon: <Wrench size={24} />, title: 'Pipe Welding', desc: 'Certified pipe welding for oil & gas, plumbing, and industrial process lines with X-ray quality, zero-defect joints.' },
  { icon: <Building2 size={24} />, title: 'Structural Welding', desc: 'Heavy-duty structural welding for buildings, bridges, and commercial constructions with full AWS D1.1 compliance.' },
];

const features = [
  { num: '01', icon: <Trophy size={20} />, title: 'Certified Welders', desc: 'AWS & ASME certified professionals with 15+ years of hands-on experience across every welding discipline and material type.' },
  { num: '02', icon: <Truck size={20} />, title: 'On-Site Services', desc: 'Fully equipped mobile welding units dispatched to your site for emergency repairs and large-scale location projects.' },
  { num: '03', icon: <Microscope size={20} />, title: 'NDT Quality Assurance', desc: 'Non-destructive testing, X-ray inspection, and ISO 9001 certified quality management for every critical joint.' },
  { num: '04', icon: <Clock size={20} />, title: '24/7 Emergency', desc: 'Round-the-clock emergency welding services for critical infrastructure failures and urgent industrial breakdowns.' },
];

const marqueeItems = [
  'MIG Welding', 'TIG Welding', 'Custom Fabrication', 'Pipe Welding',
  'Structural Steel', 'Arc Welding', 'AWS Certified', 'ISO 9001',
  '19+ Years', '500+ Projects', '24/7 Service', 'On-Site Support',
];

const processSteps = [
  { step: '01', title: 'Consultation', desc: 'We discuss your project requirements, materials, tolerances, and timeline to fully understand your needs.', icon: <MessageSquare size={24} /> },
  { step: '02', title: 'Design & Quote', desc: 'Our engineers produce detailed drawings and a transparent, itemised cost estimate with no hidden charges.', icon: <PenTool size={24} /> },
  { step: '03', title: 'Fabrication', desc: 'Our certified welders execute the work to precision using the right process for your material and application.', icon: <Zap size={24} /> },
  { step: '04', title: 'QA & Delivery', desc: 'Every weld passes visual, dimensional, and NDT checks before handover with full documentation.', icon: <CheckCircle size={24} /> },
];

const gateDesigns = [
  { id: 1, title: 'Stainless Steel Gate', image: 'https://images.unsplash.com/photo-1533423996375-f914ab160932?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'Designer Safety Gate', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop' },
  { id: 3, title: 'Iron Main Gate', image: 'https://images.unsplash.com/photo-1466025287146-da9b0a7c490a?q=80&w=600&auto=format&fit=crop' },
  { id: 4, title: 'Modern Laser Cut Gate', image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=600&auto=format&fit=crop' },
  { id: 5, title: 'Automatic Sliding Gate', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop' },
  { id: 6, title: 'Classic Wrought Iron', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop' },
  { id: 7, title: 'Wood & Steel Fusion', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=600&auto=format&fit=crop' },
  { id: 8, title: 'Industrial Security Gate', image: 'https://images.unsplash.com/photo-1596768341641-f7615951d953?q=80&w=600&auto=format&fit=crop' },
];

/* ─── Animated Counter ──────────────────────────────────────── */
function AnimatedCounter({ end, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const wrapRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(end);
          };
          tick();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={wrapRef}>{count}{suffix}</span>;
}

/* ─── Marquee Strip ─────────────────────────────────────────── */
function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Home Page ─────────────────────────────────────────────── */
export default function Home({ onOpenQuote }) {
  const magneticPrimary   = useMagnetic(0.3);
  const magneticSecondary = useMagnetic(0.2);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedGate, setSelectedGate] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero-wrapper">
      {/* ═══════════ HERO ═══════════ */}
      <section className="hero" id="hero">
        <div className="hero-bg-effects">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <SparkParticles count={40} />

        <div className="container">
          {/* Left: Copy */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              className="hero-badge"
              id="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="pulse-dot" />
              Precision Welding Since 2005
            </motion.div>

            <h1 className="hero-title" id="hero-title">
              Forging{' '}
              <span className="text-gradient">Strength</span>
              <br />
              With{' '}
              <span className="text-gradient">Fire & Steel</span>
            </h1>

            <p className="hero-description" id="hero-desc">
              From intricate TIG artistry to heavy-duty structural fabrication,
              Laddu Gopal Enterprise delivers unmatched precision, certified quality,
              and craftsmanship that stands the test of time.
            </p>

            <div className="hero-cta" id="hero-cta">
              <button
                onClick={() => {
                  if (onOpenQuote) onOpenQuote();
                }}
                className="btn btn-primary btn-magnetic"
                id="hero-cta-primary"
                ref={magneticPrimary.ref}
                onMouseMove={magneticPrimary.onMouseMove}
                onMouseLeave={magneticPrimary.onMouseLeave}
              >
                Get a Free Quote →
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('gate-designs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.href = '/portfolio';
                }}
                className="btn btn-secondary btn-magnetic"
                id="hero-cta-secondary"
                ref={magneticSecondary.ref}
                onMouseMove={magneticSecondary.onMouseMove}
                onMouseLeave={magneticSecondary.onMouseLeave}
              >
                View Our Work
              </button>
            </div>

            <div className="hero-stats" id="hero-stats">
              {[
                { end: 500, suffix: '+', label: 'Projects Delivered' },
                { end: 19,  suffix: '+', label: 'Years Experience' },
                { end: 98,  suffix: '%', label: 'Client Satisfaction' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="hero-stat-value">
                    <AnimatedCounter end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="hero-3d-placeholder" />
        </div>
      </section>

      {/* ═══════════ MARQUEE ═══════════ */}
      <section id="marquee-section" style={{ overflow: 'hidden', padding: 'var(--space-xl) 0', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)' }}>
        <Marquee />
      </section>

      {/* ═══════════ ABOUT HERITAGE ═══════════ */}
      <section className="section" id="about" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-orb hero-orb-2" style={{ top: '20%', left: '-10%', opacity: 0.3 }} />
        <div className="container">
          <div className="two-column-grid">
            <ScrollReveal direction="left">
              <span className="section-label">Our Heritage</span>
              <h2 className="section-title">
                Forged in <span className="text-gradient">Panipat</span>
              </h2>
              <p className="section-subtitle heritage-desc" style={{ textAlign: 'left', marginLeft: 0 }}>
                Since 2005, Laddu Gopal Enterprise has been the backbone of structural and artistic metalwork in the region. What started as a small fabrication shop has evolved into a premier welding enterprise, trusted by industrial giants and residential clients alike.
              </p>
              <p className="heritage-desc-secondary" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
                Our commitment to zero-defect tolerances and cutting-edge metallurgical practices ensures that every beam we weld and every pipe we fuse stands the test of time, pressure, and elements.
              </p>
              <div className="hero-stats" style={{ display: 'flex', gap: 'var(--space-xl)' }}>
                <div>
                  <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>19+</div>
                  <div className="hero-stat-label">Years Strong</div>
                </div>
                <div>
                  <div className="hero-stat-value" style={{ fontSize: '2.5rem' }}>10k+</div>
                  <div className="hero-stat-label">Tons of Steel</div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="glass-card hide-on-mobile" style={{ padding: 'var(--space-md)', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80" 
                  alt="Welding in action" 
                  style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', height: '400px' }}
                />
                <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={40} color="#bf953f" />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Award Winning</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industrial Excellence 2023</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════ INDUSTRIES SERVED ═══════════ */}
      <section className="section" id="industries" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-secondary) 100%)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Where We Work</span>
              <h2 className="section-title">
                Industries We <span className="text-gradient">Serve</span>
              </h2>
            </div>
          </ScrollReveal>
          <div style={{ position: 'relative', marginTop: 'var(--space-xl)', overflow: 'hidden' }}>
            <div 
              style={{ 
                display: 'flex', 
                gap: 'var(--space-lg)', 
                width: 'max-content',
                animation: 'marqueeScroll 25s linear infinite reverse',
              }}
            >
              {[
                { icon: <Factory size={48} color="var(--text-primary)" />, name: 'Manufacturing', desc: 'Heavy machinery and factory infrastructure.' },
                { icon: <Building2 size={48} color="var(--text-primary)" />, name: 'Construction', desc: 'Structural beams, towers, and commercial high-rises.' },
                { icon: <Droplet size={48} color="var(--text-primary)" />, name: 'Oil & Gas', desc: 'High-pressure pipeline and vessel fabrication.' },
                { icon: <HomeIcon size={48} color="var(--text-primary)" />, name: 'Residential', desc: 'Bespoke gates, railings, and architectural elements.' },
                // Duplicate for infinite marquee effect
                { icon: <Factory size={48} color="var(--text-primary)" />, name: 'Manufacturing', desc: 'Heavy machinery and factory infrastructure.' },
                { icon: <Building2 size={48} color="var(--text-primary)" />, name: 'Construction', desc: 'Structural beams, towers, and commercial high-rises.' },
                { icon: <Droplet size={48} color="var(--text-primary)" />, name: 'Oil & Gas', desc: 'High-pressure pipeline and vessel fabrication.' },
                { icon: <HomeIcon size={48} color="var(--text-primary)" />, name: 'Residential', desc: 'Bespoke gates, railings, and architectural elements.' }
              ].map((ind, i) => (
                <div key={i} className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center', width: '280px', flexShrink: 0 }}>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{ind.icon}</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{ind.name}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 3D WELDER + FEATURES ═══════════ */}
      <section className="section" id="features">
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Why Choose Us</span>
              <h2 className="section-title">
                Built on <span className="text-gradient">Excellence</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Every project benefits from our four core commitments that
                make Laddu Gopal Enterprise the trusted choice of industry leaders.
              </p>
            </div>
          </ScrollReveal>

          <div className="features-showcase">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="features-3d-wrapper" 
              id="features-3d" 
              style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-primary)', boxShadow: '0 0 40px rgba(191, 149, 63, 0.15)', cursor: 'pointer' }}
              onMouseEnter={() => { if (window.innerWidth > 768 && videoRef.current) videoRef.current.play(); }}
              onMouseLeave={() => { if (window.innerWidth > 768 && videoRef.current) videoRef.current.pause(); }}
              onClick={() => { 
                if (window.innerWidth <= 768 && videoRef.current) {
                  if (videoRef.current.paused) videoRef.current.play();
                  else videoRef.current.pause();
                }
              }}
            >
              <video 
                ref={videoRef}
                src="https://www.w3schools.com/html/mov_bbb.mp4" 
                loop 
                muted 
                playsInline
                poster="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ padding: '20px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#fff', boxShadow: '0 4px 15px var(--accent-glow)' }} className="play-icon-mobile hide-on-desktop">
                  <Play size={32} />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="features-list" 
              id="features-list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
            >
              {features.map((f, i) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, x: 50, scale: 0.9 },
                    visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', bounce: 0.4 } }
                  }}
                  className="feature-item glass-card" 
                  id={`feature-${i}`} 
                  style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}
                >
                  <div className="feature-number">{f.num}</div>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{f.icon} {f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROCESS ═══════════ */}
      <section className="section" id="process">
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Our Process</span>
              <h2 className="section-title">
                From Idea to <span className="text-gradient">Finished Weld</span>
              </h2>
              <p className="section-subtitle mx-auto">
                A streamlined 4-step workflow so you always know exactly
                where your project stands and what comes next.
              </p>
            </div>
          </ScrollReveal>

          <motion.div 
            className="process-grid" 
            id="process-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {processSteps.map((step, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.5 } }
                }}
                className="process-card glass-card" 
                id={`process-${i}`}
              >
                <div className="process-step-num">{step.step}</div>
                <div className="process-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#bf953f' }}>{step.icon}</div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="process-arrow">→</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ GATE DESIGNS SHOWCASE ═══════════ */}
      <section className="section" id="gate-designs">
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Our Craftsmanship</span>
              <h2 className="section-title">
                Premium <span className="text-gradient">Gate Designs</span>
              </h2>
              <p className="section-subtitle mx-auto">
                Explore our custom-built gates tailored for security, elegance, and durability.
              </p>
            </div>
          </ScrollReveal>
          <div style={{ position: 'relative', marginTop: 'var(--space-2xl)', overflow: 'hidden' }}>
            {/* Carousel track using CSS animation */}
            <div 
              style={{ 
                display: 'flex', 
                gap: 'var(--space-lg)', 
                width: 'max-content',
                animation: 'marqueeScroll 40s linear infinite',
                cursor: 'grab'
              }}
              onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
              onMouseDown={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            >
              {[...gateDesigns, ...gateDesigns].map((gate, idx) => (
                <div 
                  key={`${gate.id}-${idx}`} 
                  className="glass-card" 
                  style={{ 
                    padding: '12px', overflow: 'hidden', cursor: 'pointer', 
                    transition: 'transform 0.3s ease', width: '320px', flexShrink: 0 
                  }} 
                  onClick={() => setSelectedGate(gate)}
                >
                  <div style={{ borderRadius: '8px', overflow: 'hidden', height: '250px', position: 'relative' }}>
                    <img src={gate.image} alt={gate.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-zoom" />
                  </div>
                  <h3 style={{ marginTop: '16px', textAlign: 'center', fontSize: '1.2rem' }}>{gate.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedGate && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', padding: '24px' }}
            onClick={() => setSelectedGate(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{ position: 'relative', maxWidth: '900px', width: '100%', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedGate(null)}
                style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
              <img src={selectedGate.image} alt={selectedGate.title} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '85vh', borderRadius: '12px' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ CTA BANNER ═══════════ */}
      <section
        className="section"
        id="cta-section"
        style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-4xl)' }}
      >
        <SparkParticles count={20} />
        <div className="container">
          <ScrollReveal>
            <div
              className="glass-card cta-banner text-center"
              id="cta-banner"
            >
              <div className="cta-orb" />
              <span className="section-label" style={{ justifyContent: 'center' }}>
                Ready to Start?
              </span>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-md)' }}>
                Let's Build Something{' '}
                <span className="text-gradient">Extraordinary</span>
              </h2>
              <p
                className="section-subtitle mx-auto"
                style={{ marginBottom: 'var(--space-2xl)' }}
              >
                Get a free consultation and detailed quote today.
                Our team responds within 24 hours.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-md)',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button 
                  onClick={() => { if (onOpenQuote) onOpenQuote(); }} 
                  className="btn btn-primary" 
                  id="cta-contact"
                >
                  Request a Quote →
                </button>
                <Link to="/support" className="btn btn-secondary" id="cta-support">
                  Need Help?
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </section>
  );
}
