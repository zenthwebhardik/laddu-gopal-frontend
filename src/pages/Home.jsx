import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

import { Link } from 'react-router-dom';

import FluidBackground from '../components/FluidBackground.jsx';

/* ─── Service data ──────────────────────────────────────────── */
const services = [
  { icon: '⚡', title: 'MIG Welding', desc: 'High-speed Metal Inert Gas welding for steel, aluminum, and stainless steel with minimal spatter and maximum deposition rates.' },
  { icon: '🔥', title: 'TIG Welding', desc: 'Precision Tungsten Inert Gas welding for aerospace-grade joints, exotic alloys, and thin-gauge materials requiring flawless aesthetics.' },
  { icon: '🛡️', title: 'Arc Welding', desc: 'Shielded Metal Arc Welding for robust structural steelwork, pipeline repairs, and heavy field construction in any environment.' },
  { icon: '⚙️', title: 'Custom Fabrication', desc: 'Bespoke metalwork from blueprint to final product — gates, frames, industrial structures, and ornamental art pieces.' },
  { icon: '🔧', title: 'Pipe Welding', desc: 'Certified pipe welding for oil & gas, plumbing, and industrial process lines with X-ray quality, zero-defect joints.' },
  { icon: '🏗️', title: 'Structural Welding', desc: 'Heavy-duty structural welding for buildings, bridges, and commercial constructions with full AWS D1.1 compliance.' },
];

const features = [
  { num: '01', icon: '🏆', title: 'Certified Welders', desc: 'AWS & ASME certified professionals with 15+ years of hands-on experience across every welding discipline and material type.' },
  { num: '02', icon: '🚐', title: 'On-Site Services', desc: 'Fully equipped mobile welding units dispatched to your site for emergency repairs and large-scale location projects.' },
  { num: '03', icon: '🔬', title: 'NDT Quality Assurance', desc: 'Non-destructive testing, X-ray inspection, and ISO 9001 certified quality management for every critical joint.' },
  { num: '04', icon: '🕐', title: '24/7 Emergency', desc: 'Round-the-clock emergency welding services for critical infrastructure failures and urgent industrial breakdowns.' },
];

const marqueeItems = [
  'MIG Welding', 'TIG Welding', 'Custom Fabrication', 'Pipe Welding',
  'Structural Steel', 'Arc Welding', 'AWS Certified', 'ISO 9001',
  '19+ Years', '500+ Projects', '24/7 Service', 'On-Site Support',
];

const processSteps = [
  { step: '01', title: 'Consultation', desc: 'We discuss your project requirements, materials, tolerances, and timeline to fully understand your needs.', icon: '💬' },
  { step: '02', title: 'Design & Quote', desc: 'Our engineers produce detailed drawings and a transparent, itemised cost estimate with no hidden charges.', icon: '📐' },
  { step: '03', title: 'Fabrication', desc: 'Our certified welders execute the work to precision using the right process for your material and application.', icon: '⚡' },
  { step: '04', title: 'QA & Delivery', desc: 'Every weld passes visual, dimensional, and NDT checks before handover with full documentation.', icon: '✅' },
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
export default function Home() {
  const magneticPrimary   = useMagnetic(0.3);
  const magneticSecondary = useMagnetic(0.2);
  const [scrollProgress, setScrollProgress] = useState(0);

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
              Laddu Gopal Welding delivers unmatched precision, certified quality,
              and craftsmanship that stands the test of time.
            </p>

            <div className="hero-cta" id="hero-cta">
              <Link
                to="/contact"
                className="btn btn-primary btn-magnetic"
                id="hero-cta-primary"
                ref={magneticPrimary.ref}
                onMouseMove={magneticPrimary.onMouseMove}
                onMouseLeave={magneticPrimary.onMouseLeave}
              >
                Get a Free Quote →
              </Link>
              <Link
                to="/portfolio"
                className="btn btn-secondary btn-magnetic"
                id="hero-cta-secondary"
                ref={magneticSecondary.ref}
                onMouseMove={magneticSecondary.onMouseMove}
                onMouseLeave={magneticSecondary.onMouseLeave}
              >
                View Our Work
              </Link>
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

          {/* Right: Empty space to let the background Spline scene show through */}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', alignItems: 'center' }}>
            <ScrollReveal direction="left">
              <span className="section-label">Our Heritage</span>
              <h2 className="section-title">
                Forged in <span className="text-gradient">Chandigarh</span>
              </h2>
              <p className="section-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>
                Since 2005, Laddu Gopal Welding has been the backbone of structural and artistic metalwork in the region. What started as a small fabrication shop has evolved into a premier welding enterprise, trusted by industrial giants and residential clients alike.
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', lineHeight: 1.6 }}>
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
              <div className="glass-card" style={{ padding: 'var(--space-md)', position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80" 
                  alt="Welding in action" 
                  style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', height: '400px' }}
                />
                <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: 'var(--space-md)', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
                  <span style={{ fontSize: '2rem' }}>🏆</span>
                  <div style={{ fontWeight: 'bold' }}>Award Winning</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industrial Excellence 2023</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
            {[
              { icon: '🏭', name: 'Manufacturing', desc: 'Heavy machinery and factory infrastructure.' },
              { icon: '🏗️', name: 'Construction', desc: 'Structural beams, towers, and commercial high-rises.' },
              { icon: '🛢️', name: 'Oil & Gas', desc: 'High-pressure pipeline and vessel fabrication.' },
              { icon: '🏡', name: 'Residential', desc: 'Bespoke gates, railings, and architectural elements.' }
            ].map((ind, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center', height: '100%' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{ind.icon}</div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{ind.name}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{ind.desc}</p>
                </div>
              </ScrollReveal>
            ))}
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
                make Laddu Gopal Welding the trusted choice of industry leaders.
              </p>
            </div>
          </ScrollReveal>

          <div className="features-showcase">
            {/* Fluid Particle Background */}
            <ScrollReveal direction="left">
              <div className="features-3d-wrapper" id="features-3d" style={{ position: 'relative' }}>
                <FluidBackground />
              </div>
            </ScrollReveal>

            {/* Feature list */}
            <div className="features-list" id="features-list">
              {features.map((f, i) => (
                <ScrollReveal key={i} delay={i * 0.12} direction="right">
                  <div className="feature-item glass-card" id={`feature-${i}`} style={{ padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                    <div className="feature-number">{f.num}</div>
                    <div>
                      <h4>{f.icon} {f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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

          <div className="process-grid" id="process-grid">
            {processSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div className="process-card glass-card" id={`process-${i}`}>
                  <div className="process-step-num">{step.step}</div>
                  <div className="process-icon">{step.icon}</div>
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-desc">{step.desc}</p>
                  {i < processSteps.length - 1 && (
                    <div className="process-arrow">→</div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary pages removed from single-page scroll */}

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
                <Link to="/contact" className="btn btn-primary" id="cta-contact">
                  Request a Quote →
                </Link>
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
