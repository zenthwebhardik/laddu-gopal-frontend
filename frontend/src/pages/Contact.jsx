import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { validateField } from '../utils/validators.js';
import { useAuth } from '../context/AuthContext.jsx';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  { icon: <MapPin size={24} />, title: 'Visit Us', text: 'Laddu Gopal Enterprise, Near Balaji Dharam Kanta, Ram Nagar Street No. 3, Jatal Road, Panipat, Haryana 132105' },
  { icon: <Phone size={24} />, title: 'Call Us', text: '+91 93069 58575\n+91 98765 43210' },
  { icon: <Mail size={24} />, title: 'Email Us', text: 'info@laddugopalwelding.com\nquotes@laddugopalwelding.com' },
  { icon: <Clock size={24} />, title: 'Working Hours', text: 'Mon — Sat: 8:00 AM – 7:00 PM\nSun: Emergency Only' },
];

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const { user, token, API_BASE } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill from logged-in user context
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const fieldTypes = {
        firstName: 'name',
        lastName: 'name',
        email: 'email',
        phone: 'phone',
        subject: 'subject',
        message: 'message',
      };
      const result = validateField(fieldTypes[field], value);
      setErrors((prev) => ({ ...prev, [field]: result.valid ? '' : result.error }));
    }
  }, [touched]);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldTypes = {
      firstName: 'name',
      lastName: 'name',
      email: 'email',
      phone: 'phone',
      subject: 'subject',
      message: 'message',
    };
    const result = validateField(fieldTypes[field], form[field]);
    setErrors((prev) => ({ ...prev, [field]: result.valid ? '' : result.error }));
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const fieldTypes = {
      firstName: 'name',
      lastName: 'name',
      email: 'email',
      phone: 'phone',
      subject: 'subject',
      message: 'message',
    };

    const newErrors = {};
    let valid = true;
    const allTouched = {};

    for (const [key, type] of Object.entries(fieldTypes)) {
      allTouched[key] = true;
      const result = validateField(type, form[key]);
      if (!result.valid) {
        newErrors[key] = result.error;
        valid = false;
      }
    }

    setTouched(allTouched);
    setErrors(newErrors);

    if (!valid) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE || 'http://localhost:8000/api/v1'}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to submit contact message. Please try again.');
      }
      
      setSubmitted(true);
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
    <section id="contact" className="section-group">
      <section className="page-header" id="contact-header">
        <SparkParticles count={15} />
        <div className="container relative" style={{ zIndex: 2 }}>
          <ScrollReveal>
            <span className="section-label">Get In Touch</span>
            <h1 className="section-title">
              Let's <span className="text-gradient">Build Together</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Have a project in mind? Need a quote? Reach out and our team
              will get back to you within 24 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-section" id="contact-form-section">
            {/* Contact Info */}
            <div className="contact-info" id="contact-info">
              {contactInfo.map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1} direction="left">
                  <div className="contact-info-item" id={`contact-info-${i}`}>
                    <div className="contact-icon">{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                      {item.text.split('\n').map((line, j) => (
                        <p key={j}>{line}</p>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              {/* Map Scene */}
              <ScrollReveal delay={0.4} direction="left">
                <div
                  className="glass-card"
                  id="spline-container"
                  style={{
                    height: 350,
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <iframe 
                    src="https://maps.google.com/maps?q=Laddu+Gopal+Enterprise,+Near+Balaji+Dharam+Kanta,+Panipat&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, flex: 1 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map Location"
                  ></iframe>
                  <div style={{ padding: '16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'center' }}>
                    <a 
                      href="https://maps.app.goo.gl/MDbgHCU9Udf7Pqq18" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '8px 24px', fontSize: '0.9rem', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                      <MapPin size={18} /> Get Directions
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <ScrollReveal direction="right">
              <div className="glass-card form-card" id="contact-form">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      className="success-message"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="success-icon">✓</div>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
                        Message Sent!
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => { setSubmitted(false); setForm(initialForm); setTouched({}); setErrors({}); }}
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      noValidate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-xl)', color: 'var(--text-primary)' }}>
                        Send Us a Message
                      </h3>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="firstName">First Name *</label>
                          <input
                            id="firstName"
                            type="text"
                            className={getFieldClass('firstName')}
                            placeholder="John"
                            value={form.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            onBlur={() => handleBlur('firstName')}
                          />
                          {errors.firstName && <div className="form-error" id="error-firstName">⚠ {errors.firstName}</div>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="lastName">Last Name *</label>
                          <input
                            id="lastName"
                            type="text"
                            className={getFieldClass('lastName')}
                            placeholder="Doe"
                            value={form.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            onBlur={() => handleBlur('lastName')}
                          />
                          {errors.lastName && <div className="form-error" id="error-lastName">⚠ {errors.lastName}</div>}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="email">Email Address *</label>
                          <input
                            id="email"
                            type="email"
                            className={getFieldClass('email')}
                            placeholder="john@example.com"
                            value={form.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                          />
                          {errors.email && <div className="form-error" id="error-email">⚠ {errors.email}</div>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="phone">Phone Number *</label>
                          <input
                            id="phone"
                            type="tel"
                            className={getFieldClass('phone')}
                            placeholder="+919876543210"
                            value={form.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                          />
                          {errors.phone && <div className="form-error" id="error-phone">⚠ {errors.phone}</div>}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="subject">Subject *</label>
                        <input
                          id="subject"
                          type="text"
                          className={getFieldClass('subject')}
                          placeholder="Project inquiry, quote request, etc."
                          value={form.subject}
                          onChange={(e) => updateField('subject', e.target.value)}
                          onBlur={() => handleBlur('subject')}
                        />
                        {errors.subject && <div className="form-error" id="error-subject">⚠ {errors.subject}</div>}
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="message">Message *</label>
                        <textarea
                          id="message"
                          className={`form-textarea ${touched.message ? (errors.message ? 'error' : 'valid') : ''}`}
                          placeholder="Tell us about your project, requirements, timeline..."
                          rows={5}
                          value={form.message}
                          onChange={(e) => updateField('message', e.target.value)}
                          onBlur={() => handleBlur('message')}
                        />
                        {errors.message && <div className="form-error" id="error-message">⚠ {errors.message}</div>}
                      </div>

                      {submitError && (
                        <div className="form-error" style={{ marginBottom: '1rem', textAlign: 'center', color: '#ef4444' }}>
                          ⚠ {submitError}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn btn-primary"
                        id="contact-submit"
                        disabled={submitting}
                        style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                      >
                        {submitting ? (
                          <><div className="spinner" /> Sending...</>
                        ) : (
                          'Send Message →'
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </section>
  );
}
