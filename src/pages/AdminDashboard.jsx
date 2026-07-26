import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, RefreshCw, Send, MapPin, Mail, Phone, Lock, FileSpreadsheet } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal.jsx';
import SparkParticles from '../components/SparkParticles.jsx';
import { getUniqueCustomers, triggerWeeklyReport } from '../utils/api.js';

export default function AdminDashboard({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uniqueCount, setUniqueCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);

  // Validate credentials: restricted to authorized admin
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPasscode = passcode.trim();

    if (cleanEmail === 'admin@laddugopalenterprise.com' && cleanPasscode === '0000') {
      setAuthenticated(true);
      fetchAnalytics();
    } else {
      setAuthError('Invalid Admin credentials. Access restricted to authorized administrator.');
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getUniqueCustomers();
      setUniqueCount(data.total_unique_customers || 0);
      setRecentLeads(data.recent_leads || []);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualReportTrigger = async () => {
    setReportLoading(true);
    setReportMessage(null);
    try {
      const res = await triggerWeeklyReport();
      setReportMessage(res.message || 'Weekly Excel report successfully emailed to hardikgautam1401@gmail.com');
    } catch (err) {
      setReportMessage(`Report trigger error: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 10, 15, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
        cursor: 'default',
      }}
    >
      <div style={{ width: '100%', maxWidth: authenticated ? '900px' : '440px', position: 'relative' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: 0,
            color: '#fff',
            fontSize: '1.8rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>

        {!authenticated ? (
          /* Login Auth Gate */
          <motion.div
            className="glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '24px', cursor: 'default' }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 25px var(--accent-glow)',
              }}
            >
              <Lock size={32} />
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 800 }}>Admin Security Guard</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
              Restricted portal. Enter authorized email & passcode to access customer analytics.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    cursor: 'text',
                    caretColor: 'var(--accent-primary)',
                  }}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Admin Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoComplete="new-password"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    cursor: 'text',
                    caretColor: 'var(--accent-primary)',
                  }}
                />
              </div>

              {authError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                  ⚠ {authError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '0.5rem', cursor: 'pointer' }}
              >
                Authenticate & Access →
              </button>
            </form>
          </motion.div>
        ) : (
          /* Authenticated Dashboard */
          <motion.div
            className="glass-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ padding: '2rem', borderRadius: '24px', maxHeight: '85vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="section-label" style={{ marginBottom: '0.2rem' }}>Secured Dashboard</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                  Customer Reach <span className="text-gradient">& Analytics</span>
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={fetchAnalytics}
                  disabled={loading}
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={16} /> Refresh
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleManualReportTrigger}
                  disabled={reportLoading}
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileSpreadsheet size={16} /> {reportLoading ? 'Sending...' : 'Send Weekly Report'}
                </button>
              </div>
            </div>

            {reportMessage && (
              <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', color: '#22c55e', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                ✓ {reportMessage}
              </div>
            )}

            {/* Total Unique Customers Reach Widget */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Total Unique Customers Reach
                  </span>
                  <Users size={22} color="var(--accent-primary)" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
                  {loading ? '...' : uniqueCount.toLocaleString()}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                  Distinct Non-Duplicate Reach (Phone/Email)
                </span>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Admin Account
                  </span>
                  <ShieldCheck size={22} color="#22c55e" />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  hardikgautam1401@gmail.com
                </div>
                <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>
                  Verified & Authorized
                </span>
              </div>
            </div>

            {/* Recent Inquiry Leads Table */}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Recent Customer Inquiries & Leads</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Contact Details</th>
                    <th style={{ padding: '10px' }}>Query Message</th>
                    <th style={{ padding: '10px' }}>Location / Geolocation</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        No query entries found yet. Submit a contact or support form to see live entries.
                      </td>
                    </tr>
                  ) : (
                    recentLeads.map((lead) => (
                      <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                        <td style={{ padding: '10px', color: 'var(--text-primary)', fontWeight: 600 }}>{lead.name}</td>
                        <td style={{ padding: '10px' }}>
                          <div>📞 {lead.phone}</div>
                          <div>✉️ {lead.email}</div>
                        </td>
                        <td style={{ padding: '10px', maxWidth: '240px', whiteSpace: 'pre-wrap' }}>{lead.query}</td>
                        <td style={{ padding: '10px' }}>
                          {lead.latitude && lead.longitude ? (
                            <a
                              href={`https://maps.google.com/?q=${lead.latitude},${lead.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <MapPin size={14} /> Lat {lead.latitude.toFixed(4)}, Long {lead.longitude.toFixed(4)}
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
