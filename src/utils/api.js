/**
 * API service helpers for Laddu Gopal Welding frontend.
 */


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

/**
 * Submit a customer query to POST /api/v1/queries
 */
export async function submitQuery(payload, token = null) {
  const res = await fetch(`${API_BASE}/queries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to submit query.');
  }
  return data;
}

/**
 * Fetch unique customer reach count & lead analytics from GET /api/v1/analytics/unique-customers
 */
export async function getUniqueCustomers(token = null) {
  const res = await fetch(`${API_BASE}/analytics/unique-customers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to fetch customer analytics.');
  }
  return data;
}

/**
 * Trigger manual weekly report email
 */
export async function triggerWeeklyReport(token = null) {
  const res = await fetch(`${API_BASE}/analytics/trigger-report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to trigger weekly report.');
  }
  return data;
}
