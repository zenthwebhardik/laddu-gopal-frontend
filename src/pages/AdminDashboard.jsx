import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, RefreshCw, Mail, Phone, Lock, FileSpreadsheet, X } from 'lucide-react';
import { adminLogin, getUniqueCustomers, triggerWeeklyReport } from '../utils/api.js';

const TYPE_LABEL = { REQUEST_QUERY: 'Rate form', CONTACT_US: 'Contact form' };

function formatWhen(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

// Admin login is checked by the backend (/auth/login with ADMIN_EMAIL / ADMIN_PASSCODE from
// the server's .env). The token lives only in this component's memory and is gone on reload.
export default function AdminDashboard({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [token, setToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [uniqueCount, setUniqueCount] = useState(0);
  const [recentLeads, setRecentLeads] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const logout = () => {
    setToken(null);
    setRecentLeads([]);
    setUniqueCount(0);
    setPasscode('');
  };

  const fetchAnalytics = async (t = token) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getUniqueCustomers(t);
      setUniqueCount(data.total_unique_customers || 0);
      setRecentLeads(data.recent_leads || []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout();
        setAuthError('Session khatam ho gaya ya ye admin account nahi hai. Dobara login karein.');
      } else {
        setLoadError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setLoggingIn(true);
    try {
      const data = await adminLogin(email.trim(), passcode);
      setToken(data.access_token);
      setPasscode('');
      fetchAnalytics(data.access_token);
    } catch (err) {
      setAuthError(err.status === 401 ? 'Email ya passcode galat hai.' : err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleReport = async () => {
    setReportLoading(true);
    setReportMessage(null);
    try {
      const res = await triggerWeeklyReport(token);
      setReportMessage(res.message);
    } catch (err) {
      setReportMessage(err.message);
    } finally {
      setReportLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="Admin">
      <div style={{ width: '100%', maxWidth: token ? '960px' : '440px', position: 'relative' }}>
        <button onClick={onClose} className="icon-btn" aria-label="Band karein" style={{ position: 'absolute', top: '-48px', right: 0, color: '#fff' }}>
          <X size={24} />
        </button>

        {!token ? (
          <motion.div className="panel admin-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Lock size={28} color="var(--accent-text)" style={{ marginBottom: 'var(--space-3)' }} />
            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Admin login</h2>
            <p style={{ marginBottom: 'var(--space-5)' }}>Sirf dukaan ke owner ke liye.</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">Email</label>
                <input id="admin-email" type="email" className="form-input" autoComplete="username"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-pass">Passcode</label>
                <input id="admin-pass" type="password" className="form-input" autoComplete="current-password"
                  value={passcode} onChange={(e) => setPasscode(e.target.value)} required />
              </div>
              {authError && <div className="form-error" role="alert" style={{ marginBottom: 'var(--space-3)' }}>{authError}</div>}
              <button type="submit" className="btn btn-primary w-full" disabled={loggingIn}>
                {loggingIn ? <><span className="spinner" /> Check kar rahe hain…</> : 'Login'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div className="panel admin-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Customer leads</h2>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => fetchAnalytics()} disabled={loading}>
                  <RefreshCw size={16} /> Refresh
                </button>
                <button className="btn btn-primary" onClick={handleReport} disabled={reportLoading}>
                  <FileSpreadsheet size={16} /> {reportLoading ? 'Bhej rahe hain…' : 'Weekly report email karein'}
                </button>
                <button className="btn btn-ghost" onClick={logout}>Logout</button>
              </div>
            </div>

            {reportMessage && <div className="notice" role="status">{reportMessage}</div>}
            {loadError && <div className="form-error" role="alert" style={{ marginBottom: 'var(--space-4)' }}>{loadError}</div>}

            <div className="admin-stat" style={{ marginBottom: 'var(--space-6)', maxWidth: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Alag-alag customers</span>
                <Users size={22} color="var(--accent-text)" />
              </div>
              <div className="value">{loading ? '…' : uniqueCount.toLocaleString('en-IN')}</div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-3)' }}>Mobile number ke hisaab se, bina duplicate</span>
            </div>

            <h3 style={{ marginBottom: 'var(--space-3)' }}>Haal ke leads</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Naam</th><th>Contact</th><th>Message</th><th>Kab</th></tr>
                </thead>
                <tbody>
                  {recentLeads.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>{loading ? 'Load ho raha hai…' : 'Abhi koi lead nahi hai.'}</td></tr>
                  ) : (
                    recentLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td style={{ color: 'var(--text)', fontWeight: 600 }}>
                          {lead.name}
                          <div style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--text-3)' }}>{TYPE_LABEL[lead.type] || lead.type}</div>
                        </td>
                        <td>
                          <a className="link" href={`tel:${lead.phone}`} style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Phone size={14} /> {lead.phone}</a>
                          {lead.email && <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Mail size={14} /> {lead.email}</div>}
                        </td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{lead.query}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{formatWhen(lead.created_at)}</td>
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
