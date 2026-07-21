import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { validateField } from '../utils/validators.js';
import { useAuth } from '../context/AuthContext.jsx';

/* ── FAQ Data ────────────────────────────────────────────── */
const faqs = [
  {
    q: 'What types of welding do you offer?',
    a: 'We provide MIG, TIG, Arc (SMAW), Flux-Cored, and specialized pipe welding services. Our team is AWS and ASME certified for all major welding processes, covering structural steel, stainless steel, aluminum, and exotic alloys.',
  },
  {
    q: 'Do you offer on-site welding services?',
    a: 'Yes! We have fully equipped mobile welding units that can be dispatched to your location. Whether it\'s an emergency repair, construction site, or industrial facility, our team comes prepared with all necessary equipment and PPE.',
  },
  {
    q: 'How do I get a quote for my project?',
    a: 'You can request a free quote through our Contact page, call us directly at +91 98765 43210, or submit a support ticket below with your project details. We typically respond within 24 hours with a detailed estimate.',
  },
  {
    q: 'What certifications do your welders hold?',
    a: 'Our welders hold AWS (American Welding Society), ASME (American Society of Mechanical Engineers), and CWI (Certified Welding Inspector) certifications. We also maintain ISO 9001 quality management compliance.',
  },
  {
    q: 'Do you handle emergency welding repairs?',
    a: 'Absolutely. We offer 24/7 emergency welding services for critical infrastructure, industrial breakdowns, and urgent structural repairs. Call our emergency line anytime for immediate assistance.',
  },
  {
    q: 'What is your typical project turnaround time?',
    a: 'Turnaround depends on project scope. Small repairs can be completed same-day, while large fabrication projects typically take 1-4 weeks. We provide detailed timelines with every quote and always meet our deadlines.',
  },
  {
    q: 'Do you provide quality inspection reports?',
    a: 'Yes, all projects come with comprehensive quality documentation including visual inspection reports, NDT (Non-Destructive Testing) results when required, and material test certificates. We use X-ray, ultrasonic, and dye penetrant testing.',
  },
];

/* ── Multi-Step Form ─────────────────────────────────────── */
const stepLabels = ['Details', 'Issue', 'Review'];

const issueCategories = [
  'Project Inquiry',
  'Technical Support',
  'Quality Concern',
  'Warranty Claim',
  'Emergency Repair',
  'General Question',
];

const priorityLevels = [
  { value: 'low', label: '🟢 Low — General inquiry', color: '#22c55e' },
  { value: 'medium', label: '🟡 Medium — Needs attention', color: '#f59e0b' },
  { value: 'high', label: '🔴 High — Urgent issue', color: '#ef4444' },
];

const initialTicket = {
  name: '',
  email: '',
  phone: '',
  category: '',
  priority: 'medium',
  subject: '',
  description: '',
};

export default function Support() {
  const { user, token, API_BASE } = useAuth();

  /* FAQ state */
  const [openFaq, setOpenFaq] = useState(null);

  /* Stepper state */
  const [step, setStep] = useState(0);
  const [ticket, setTicket] = useState(initialTicket);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [touched, setTouched] = useState({});
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill from logged-in user context
  useEffect(() => {
    if (user) {
      setTicket(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const updateTicket = useCallback((field, value) => {
    setTicket((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const typeMap = { name: 'name', email: 'email', phone: 'phone', subject: 'subject', description: 'message' };
      if (typeMap[field]) {
        const result = validateField(typeMap[field], value);
        setErrors((prev) => ({ ...prev, [field]: result.valid ? '' : result.error }));
      }
    }
  }, [touched]);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const typeMap = { name: 'name', email: 'email', phone: 'phone', subject: 'subject', description: 'message' };
    if (typeMap[field]) {
      const result = validateField(typeMap[field], ticket[field]);
      setErrors((prev) => ({ ...prev, [field]: result.valid ? '' : result.error }));
    }
  }, [ticket]);

  const validateStep = (stepIndex) => {
    const stepFields = [
      ['name', 'email', 'phone'],
      ['category', 'subject', 'description'],
    ];

    if (stepIndex >= stepFields.length) return true;

    const fields = stepFields[stepIndex];
    const typeMap = { name: 'name', email: 'email', phone: 'phone', subject: 'subject', description: 'message' };
    const newErrors = {};
    const newTouched = {};
    let valid = true;

    for (const field of fields) {
      newTouched[field] = true;
      if (typeMap[field]) {
        const result = validateField(typeMap[field], ticket[field]);
        if (!result.valid) {
          newErrors[field] = result.error;
          valid = false;
        }
      } else if (field === 'category' && !ticket.category) {
        newErrors.category = 'Please select a category';
        valid = false;
      }
    }

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return valid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSubmitTicket = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const backendPayload = {
      name: ticket.name,
      phone: ticket.phone,
      email: ticket.email,
      service: ticket.category || 'General Inquiry',
      message: `Priority: ${ticket.priority}\nSubject: ${ticket.subject}\n\n${ticket.description}`,
    };

    try {
      const res = await fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(backendPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to submit enquiry. Please try again.');
      }
      setTicketSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldClass = (field) => {
    if (!touched[field]) return 'form-input';
    if (errors[field]) return 'form-input error';
    return 'form-input valid';
  };

  return (
    <section id="support" className="section-group">
      {/* Header */}
      <section className="page-header" id="support-header">
        <SparkParticles count={15} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <span className="section-label">Support Center</span>
            <h1 className="section-title">
              How Can We <span className="text-gradient">Help You?</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Browse our FAQ or submit a support ticket — our team is here to
              assist you with any question or concern.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">FAQ</span>
              <h2 className="section-title">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="faq-list" id="faq-list">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className={`faq-item ${openFaq === i ? 'active' : ''}`} id={`faq-${i}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    id={`faq-btn-${i}`}
                  >
                    {faq.q}
                    <span className="faq-toggle">+</span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="faq-answer">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-step Support Ticket */}
      <section className="section" id="ticket-section">
        <div className="container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Submit a Ticket</span>
              <h2 className="section-title">
                Support <span className="text-gradient">Request Form</span>
              </h2>
              <p className="section-subtitle mx-auto" style={{ marginBottom: 'var(--space-3xl)' }}>
                Can't find your answer above? Submit a detailed support ticket
                and our team will respond within 24 hours.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="glass-card" style={{ maxWidth: 700, margin: '0 auto', padding: 'var(--space-3xl)' }} id="ticket-form-card">
              <AnimatePresence mode="wait">
                {ticketSubmitted ? (
                  <motion.div
                    key="submitted"
                    className="success-message"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="success-icon">✓</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
                      Ticket Submitted!
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
                      Your ticket ID: <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                        LGW-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                      </strong>
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-xl)', fontSize: '0.9rem' }}>
                      We'll get back to you at {ticket.email} within 24 hours.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setTicketSubmitted(false);
                        setTicket(initialTicket);
                        setStep(0);
                        setTouched({});
                        setErrors({});
                      }}
                    >
                      Submit Another Ticket
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Stepper */}
                    <div className="stepper" id="stepper">
                      {stepLabels.map((label, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                          <div className={`step-indicator ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
                            <div className="step-circle">
                              {i < step ? '✓' : i + 1}
                            </div>
                            <span className="step-label">{label}</span>
                          </div>
                          {i < stepLabels.length - 1 && (
                            <div className={`step-connector ${i < step ? 'completed' : ''}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                      {step === 0 && (
                        <motion.div
                          key="step-0"
                          className="step-content"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="form-group">
                            <label className="form-label" htmlFor="ticket-name">Full Name *</label>
                            <input
                              id="ticket-name"
                              type="text"
                              className={getFieldClass('name')}
                              placeholder="Your full name"
                              value={ticket.name}
                              onChange={(e) => updateTicket('name', e.target.value)}
                              onBlur={() => handleBlur('name')}
                            />
                            {errors.name && <div className="form-error">⚠ {errors.name}</div>}
                          </div>

                          <div className="form-row">
                            <div className="form-group">
                              <label className="form-label" htmlFor="ticket-email">Email *</label>
                              <input
                                id="ticket-email"
                                type="email"
                                className={getFieldClass('email')}
                                placeholder="your@email.com"
                                value={ticket.email}
                                onChange={(e) => updateTicket('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                              />
                              {errors.email && <div className="form-error">⚠ {errors.email}</div>}
                            </div>
                            <div className="form-group">
                              <label className="form-label" htmlFor="ticket-phone">Phone *</label>
                              <input
                                id="ticket-phone"
                                type="tel"
                                className={getFieldClass('phone')}
                                placeholder="+919876543210"
                                value={ticket.phone}
                                onChange={(e) => updateTicket('phone', e.target.value)}
                                onBlur={() => handleBlur('phone')}
                              />
                              {errors.phone && <div className="form-error">⚠ {errors.phone}</div>}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 1 && (
                        <motion.div
                          key="step-1"
                          className="step-content"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="form-group">
                            <label className="form-label" htmlFor="ticket-category">Category *</label>
                            <select
                              id="ticket-category"
                              className={`form-select ${touched.category ? (errors.category ? 'error' : ticket.category ? 'valid' : '') : ''}`}
                              value={ticket.category}
                              onChange={(e) => {
                                updateTicket('category', e.target.value);
                                setErrors((prev) => ({ ...prev, category: '' }));
                              }}
                              style={{
                                background: 'var(--bg-input)',
                                color: ticket.category ? 'var(--text-primary)' : 'var(--text-tertiary)',
                              }}
                            >
                              <option value="">Select a category...</option>
                              {issueCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                            {errors.category && <div className="form-error">⚠ {errors.category}</div>}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Priority</label>
                            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                              {priorityLevels.map((p) => (
                                <button
                                  key={p.value}
                                  type="button"
                                  className={`btn ${ticket.priority === p.value ? 'btn-primary' : 'btn-secondary'}`}
                                  onClick={() => updateTicket('priority', p.value)}
                                  style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="ticket-subject">Subject *</label>
                            <input
                              id="ticket-subject"
                              type="text"
                              className={getFieldClass('subject')}
                              placeholder="Brief description of your issue"
                              value={ticket.subject}
                              onChange={(e) => updateTicket('subject', e.target.value)}
                              onBlur={() => handleBlur('subject')}
                            />
                            {errors.subject && <div className="form-error">⚠ {errors.subject}</div>}
                          </div>

                          <div className="form-group">
                            <label className="form-label" htmlFor="ticket-desc">Description *</label>
                            <textarea
                              id="ticket-desc"
                              className={`form-textarea ${touched.description ? (errors.description ? 'error' : 'valid') : ''}`}
                              placeholder="Provide detailed information about your issue or request..."
                              rows={5}
                              value={ticket.description}
                              onChange={(e) => updateTicket('description', e.target.value)}
                              onBlur={() => handleBlur('description')}
                            />
                            {errors.description && <div className="form-error">⚠ {errors.description}</div>}
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step-2"
                          className="step-content"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-xl)', color: 'var(--text-primary)' }}>
                            Review Your Ticket
                          </h3>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 2fr',
                              gap: 'var(--space-md)',
                              fontSize: '0.9rem',
                            }}
                          >
                            {[
                              ['Name', ticket.name],
                              ['Email', ticket.email],
                              ['Phone', ticket.phone],
                              ['Category', ticket.category],
                              ['Priority', priorityLevels.find((p) => p.value === ticket.priority)?.label],
                              ['Subject', ticket.subject],
                            ].map(([label, value], i) => (
                              <div key={i} style={{ display: 'contents' }}>
                                <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>{label}</span>
                                <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                              </div>
                            ))}
                          </div>

                          <div style={{ marginTop: 'var(--space-lg)' }}>
                            <span style={{ color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.9rem' }}>Description</span>
                            <p style={{
                              color: 'var(--text-secondary)',
                              marginTop: 'var(--space-sm)',
                              fontSize: '0.9rem',
                              lineHeight: 1.7,
                              padding: 'var(--space-md)',
                              background: 'var(--bg-glass)',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-secondary)',
                            }}>
                              {ticket.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="step-actions" id="step-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={prevStep}
                        disabled={step === 0}
                        style={{ opacity: step === 0 ? 0.3 : 1 }}
                      >
                        ← Back
                      </button>

                      {step < 2 ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={nextStep}
                          id="step-next"
                        >
                          Continue →
                        </button>
                      ) : (
                        <>
                          {submitError && (
                            <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center', color: '#ef4444' }}>
                              ⚠ {submitError}
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-primary w-full mt-6"
                            onClick={handleSubmitTicket}
                            disabled={submitting}
                            id="ticket-submit"
                            style={{ fontSize: '1.1rem', padding: '16px' }}
                          >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </section>
  );
}
