import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BarChart3, Users, Mail, FileText, TrendingUp, Eye, Lock, LogOut, RefreshCw, MapPin } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

/* ── Mini Line Chart (Canvas-drawn, no external lib) ────── */
function MiniLineChart({ data, width = 600, height = 220, color = '#bf953f' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map(d => d.count), 1);
    const xStep = chartW / Math.max(data.length - 1, 1);

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '11px Calibri, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');

    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    data.forEach((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (d.count / maxVal) * chartH;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + (data.length - 1) * xStep, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    data.forEach((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (d.count / maxVal) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    data.forEach((d, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + chartH - (d.count / maxVal) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#1a1a2e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // X-axis labels (every 5th)
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Calibri, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      if (i % Math.max(Math.floor(data.length / 7), 1) === 0 || i === data.length - 1) {
        const x = padding.left + i * xStep;
        const label = d.date?.substring(5) || '';
        ctx.fillText(label, x, height - padding.bottom + 16);
      }
    });
  }, [data, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', maxWidth: width, height, display: 'block' }}
    />
  );
}

/* ── Metric Card ────────────────────────────────────────── */
function MetricCard({ icon, label, value, sub, color = 'var(--accent-primary)' }) {
  return (
    <motion.div
      className="glass-card"
      style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minWidth: 0,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, border: `1px solid ${color}33`,
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ color: 'var(--text-primary)', fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.2 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {sub && <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: 2 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ── Data Table ─────────────────────────────────────────── */
function DataTable({ title, columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: 12, fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No records yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '24px', overflow: 'auto' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: 16, fontSize: '1.1rem' }}>{title}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '10px 12px',
                borderBottom: '2px solid var(--accent-primary)',
                color: 'var(--text-secondary)', fontWeight: 700,
                whiteSpace: 'nowrap', fontSize: '0.8rem',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{
              background: i % 2 === 0 ? 'rgba(191,149,63,0.04)' : 'transparent',
              transition: 'background 0.2s',
            }}>
              {columns.map((col, j) => (
                <td key={j} style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--border-secondary)',
                  color: 'var(--text-secondary)',
                  maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {col.render ? col.render(row) : row[col.key] || '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Admin Dashboard ───────────────────────────────── */
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', passcode: '' });
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Restore admin session
  useEffect(() => {
    const saved = sessionStorage.getItem('lgw_admin_token');
    if (saved) {
      setAdminToken(saved);
      setAuthed(true);
    }
  }, []);

  // Fetch dashboard data when authed
  const fetchDashboard = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const data = await res.json();
      setDashData(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authed, adminToken]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, passcode: loginForm.passcode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      setAdminToken(data.access_token);
      sessionStorage.setItem('lgw_admin_token', data.access_token);
      setAuthed(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setAdminToken(null);
    setDashData(null);
    sessionStorage.removeItem('lgw_admin_token');
  };

  /* ── Login Gate ──────────────────────────────────────── */
  if (!authed) {
    return (
      <section id="admin-dashboard" className="section-group">
        <section className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            className="glass-card"
            style={{ maxWidth: 420, width: '100%', padding: '48px 36px', textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #bf953f22, #bf953f44)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #bf953f33',
            }}>
              <Shield size={28} color="#bf953f" />
            </div>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: 8 }}>
              Admin Dashboard
            </h2>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 28 }}>
              Restricted access. Enter your admin credentials.
            </p>

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Admin Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  required
                  autoComplete="email"
                  id="admin-email"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Admin Passcode"
                  value={loginForm.passcode}
                  onChange={(e) => setLoginForm(p => ({ ...p, passcode: e.target.value }))}
                  required
                  autoComplete="current-password"
                  id="admin-passcode"
                />
              </div>
              {loginError && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 16, padding: '8px 12px', background: '#ef444412', borderRadius: 8, border: '1px solid #ef444422' }}>
                  🚫 {loginError}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loggingIn}
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                id="admin-login-btn"
              >
                {loggingIn ? 'Verifying...' : 'Access Dashboard →'}
              </button>
            </form>
          </motion.div>
        </section>
      </section>
    );
  }

  /* ── Dashboard View ──────────────────────────────────── */
  const v = dashData?.visitors || {};
  const c = dashData?.contacts || {};
  const eq = dashData?.enquiries || {};

  return (
    <section id="admin-dashboard" className="section-group">
      <section className="page-header" style={{ paddingBottom: 'var(--space-xl)' }}>
        <div className="container" style={{ zIndex: 2, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="section-label">
                <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Admin Panel
              </span>
              <h1 className="section-title" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
                Customer <span className="text-gradient">Analytics</span>
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary"
                onClick={fetchDashboard}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: '0.85rem' }}
                id="admin-refresh"
              >
                <RefreshCw size={16} className={loading ? 'spinning' : ''} /> Refresh
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: '0.85rem' }}
                id="admin-logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {fetchError && (
            <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: 24, padding: '12px', background: '#ef444412', borderRadius: 8 }}>
              ⚠ {fetchError}
            </div>
          )}

          {loading && !dashData ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>
              <div className="spinner" style={{ margin: '0 auto 16px', width: 32, height: 32 }} />
              Loading dashboard data...
            </div>
          ) : dashData ? (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {/* ── Metric Cards ── */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16, marginBottom: 32,
                }}>
                  <MetricCard
                    icon={<Eye size={22} color="#bf953f" />}
                    label="Site Visitors"
                    value={v.total || 0}
                    sub={`${v.last_7d || 0} this week · ${v.last_30d || 0} this month`}
                    color="#bf953f"
                  />
                  <MetricCard
                    icon={<Mail size={22} color="#22c55e" />}
                    label="Contact Inquiries"
                    value={c.total || 0}
                    sub={`${c.last_7d || 0} this week`}
                    color="#22c55e"
                  />
                  <MetricCard
                    icon={<FileText size={22} color="#3b82f6" />}
                    label="Customer Leads"
                    value={eq.total || 0}
                    sub={`${eq.last_7d || 0} this week`}
                    color="#3b82f6"
                  />
                  <MetricCard
                    icon={<Users size={22} color="#a855f7" />}
                    label="Registered Users"
                    value={dashData?.users?.total || 0}
                    color="#a855f7"
                  />
                  <MetricCard
                    icon={<TrendingUp size={22} color="#f59e0b" />}
                    label="Conversion Rate"
                    value={`${dashData?.conversion_rate || 0}%`}
                    sub="Enquiries ÷ Visitors"
                    color="#f59e0b"
                  />
                  <MetricCard
                    icon={<BarChart3 size={22} color="#ec4899" />}
                    label="Total Reviews"
                    value={dashData?.reviews?.total || 0}
                    color="#ec4899"
                  />
                </div>

                {/* ── Visitor Growth Chart ── */}
                <div className="glass-card" style={{ padding: '24px', marginBottom: 32 }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: 16, fontSize: '1.1rem' }}>
                    📈 Site Visitor Growth (Last 30 Days)
                  </h3>
                  {v.growth && v.growth.length > 0 ? (
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                      <MiniLineChart data={v.growth} width={Math.max(600, (v.growth.length * 25))} />
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                      No visitor data available yet. Visitor tracking will populate this chart automatically.
                    </p>
                  )}
                </div>

                {/* ── Data Tables ── */}
                <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                  <DataTable
                    title="📩 Recent Contact Inquiries"
                    columns={[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'subject', label: 'Subject' },
                      {
                        key: 'location_name', label: 'Location',
                        render: (row) => row.location_name || (row.latitude ? `${row.latitude?.toFixed(2)}, ${row.longitude?.toFixed(2)}` : '—')
                      },
                      {
                        key: 'created_at', label: 'Date',
                        render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
                      },
                    ]}
                    rows={c.recent || []}
                  />
                  <DataTable
                    title="📋 Recent Customer Leads"
                    columns={[
                      { key: 'reference', label: 'Ref' },
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'service', label: 'Service' },
                      {
                        key: 'location_name', label: 'Location',
                        render: (row) => row.location_name || (row.latitude ? `${row.latitude?.toFixed(2)}, ${row.longitude?.toFixed(2)}` : '—')
                      },
                      {
                        key: 'created_at', label: 'Date',
                        render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
                      },
                    ]}
                    rows={eq.recent || []}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>
      </section>
    </section>
  );
}
