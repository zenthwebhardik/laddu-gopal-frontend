import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SparkParticles from '../components/SparkParticles.jsx';
import ScrollReveal from '../components/ScrollReveal.jsx';

const projects = [
  { id: 1, title: 'Industrial Pipeline System', category: 'Industrial', location: 'Gujarat', scope: 'Complete pipeline welding for a chemical processing plant with X-ray certified, zero-defect joints.', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000' },
  { id: 2, title: 'Custom Steel Entry Gate', category: 'Residential', location: 'Chandigarh', scope: 'Precision-crafted decorative steel gate with laser-cut floral patterns and powder-coat finish.', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000' },
  { id: 3, title: 'Multi-Story Steel Framework', category: 'Structural', location: 'Mumbai', scope: 'Commercial building steel structure spanning 6 floors with AWS D1.1 certified welds.', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2000' },
  { id: 4, title: 'Heavy Duty Structural Welds', category: 'Infrastructure', location: 'Delhi', scope: 'Heavy-duty expansion joints fabricated for national highway bridges ensuring maximum durability.', img: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&q=80&w=2000' },
  { id: 5, title: 'Precision TIG Welding', category: 'Residential', location: 'Pune', scope: 'Architectural steel staircase with floating treads and seamless glass railing integration.', img: 'https://images.unsplash.com/photo-1574805799981-d0b81c43235b?auto=format&fit=crop&q=80&w=2000' },
  { id: 6, title: 'Storage Tank Fabrication', category: 'Industrial', location: 'Chennai', scope: 'High-capacity stainless steel storage tanks for food-grade processing facilities.', img: 'https://images.unsplash.com/photo-1565518290231-155e9668bdcc?auto=format&fit=crop&q=80&w=2000' },
  { id: 7, title: 'Automotive Plant Racks', category: 'Commercial', location: 'Gurgaon', scope: 'Custom material handling racks engineered for robotic assembly line integration.', img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=2000' },
  { id: 8, title: 'MIG Welding Production', category: 'Structural', location: 'Bangalore', scope: 'Steel and glass canopy structure for a premium corporate park entrance.', img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000' },
  { id: 9, title: 'Pressure Vessel Welding', category: 'Industrial', location: 'Surat', scope: 'ASME certified pressure vessels manufactured for high-temperature chemical reactions.', img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=2000' },
  { id: 10, title: 'Modern Iron Fencing', category: 'Residential', location: 'Noida', scope: 'Outdoor living space framework utilizing weather-resistant treated steel profiles.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000' },
];

export default function Portfolio() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <section id="portfolio" style={{ paddingTop: '120px', minHeight: '100vh', position: 'relative' }}>
      <SparkParticles count={15} />
      
      <div className="container relative" style={{ zIndex: 2 }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4xl)' }}>
            <span className="section-label">Our Work</span>
            <h1 className="section-title">
              Featured <span className="text-gradient">Projects</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Explore our portfolio of premium welding and fabrication projects across industrial, commercial, and residential sectors.
            </p>
          </div>
        </ScrollReveal>

        <motion.div 
          className="portfolio-grid-new"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants} className="portfolio-card-new">
              <div className="portfolio-image-container">
                <img src={project.img} alt={project.title} loading="lazy" />
              </div>
              <div className="portfolio-content">
                <div className="portfolio-meta-new">
                  <span className="text-gradient">{project.category}</span>
                  <span style={{ color: 'var(--border-primary)' }}>|</span>
                  <span>{project.location}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.scope}</p>
                
                <div style={{ marginTop: 'auto' }}>
                  <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}>
                    View Case Study
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
