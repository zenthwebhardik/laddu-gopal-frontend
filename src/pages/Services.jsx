import ScrollReveal from '../components/ScrollReveal.jsx';

const services = [
  { icon: '⚡', title: 'MIG Welding', desc: 'High-speed Metal Inert Gas welding for steel, aluminum, and stainless steel with minimal spatter and maximum deposition rates.' },
  { icon: '🔥', title: 'TIG Welding', desc: 'Precision Tungsten Inert Gas welding for aerospace-grade joints, exotic alloys, and thin-gauge materials requiring flawless aesthetics.' },
  { icon: '🛡️', title: 'Arc Welding', desc: 'Shielded Metal Arc Welding for robust structural steelwork, pipeline repairs, and heavy field construction in any environment.' },
  { icon: '⚙️', title: 'Custom Fabrication', desc: 'Bespoke metalwork from blueprint to final product — gates, frames, industrial structures, and ornamental art pieces.' },
  { icon: '🔧', title: 'Pipe Welding', desc: 'Certified pipe welding for oil & gas, plumbing, and industrial process lines with X-ray quality, zero-defect joints.' },
  { icon: '🏗️', title: 'Structural Welding', desc: 'Heavy-duty structural welding for buildings, bridges, and commercial constructions with full AWS D1.1 compliance.' },
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

          <div className="services-grid" id="services-grid">
            {services.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="glass-card service-card" id={`service-card-${i}`}>
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
