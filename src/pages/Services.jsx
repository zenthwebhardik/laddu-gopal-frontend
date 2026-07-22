import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal.jsx';
import { Zap, Flame, Shield, Settings, Wrench, Building2 } from 'lucide-react';

const services = [
  { icon: <Zap size={28} />, title: 'MIG Welding', desc: 'High-speed Metal Inert Gas welding for steel, aluminum, and stainless steel with minimal spatter and maximum deposition rates.' },
  { icon: <Flame size={28} />, title: 'TIG Welding', desc: 'Precision Tungsten Inert Gas welding for aerospace-grade joints, exotic alloys, and thin-gauge materials requiring flawless aesthetics.' },
  { icon: <Shield size={28} />, title: 'Arc Welding', desc: 'Shielded Metal Arc Welding for robust structural steelwork, pipeline repairs, and heavy field construction in any environment.' },
  { icon: <Settings size={28} />, title: 'Custom Fabrication', desc: 'Bespoke metalwork from blueprint to final product — gates, frames, industrial structures, and ornamental art pieces.' },
  { icon: <Wrench size={28} />, title: 'Pipe Welding', desc: 'Certified pipe welding for oil & gas, plumbing, and industrial process lines with X-ray quality, zero-defect joints.' },
  { icon: <Building2 size={28} />, title: 'Structural Welding', desc: 'Heavy-duty structural welding for buildings, bridges, and commercial constructions with full AWS D1.1 compliance.' },
];

export default function Services() {
  return (
    <div className="section-group" style={{ paddingTop: '80px' }}>
      <section className="section" id="services">
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Our Expertise</span>
              <h2 className="section-title">
                World-Class <span className="text-gradient">Welding Services</span>
              </h2>
              <p className="section-subtitle mx-auto">
                A full spectrum of welding and fabrication services backed by
                certified professionals and state-of-the-art equipment.
              </p>
            </div>
          </ScrollReveal>

          <div className="services-grid" id="services-grid" style={{ perspective: '1000px' }}>
            {services.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, zIndex: 10 }}
                className="glass-card service-card" 
                id={`service-card-${i}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div 
                  className="service-icon-clean" 
                  style={{ 
                    width: '56px', height: '56px', borderRadius: '12px', 
                    background: 'var(--bg-glass)', border: '1px solid var(--border-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    marginBottom: '1.5rem', color: 'var(--text-primary)'
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ transform: 'translateZ(20px)' }}>{s.title}</h3>
                <p style={{ transform: 'translateZ(10px)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
