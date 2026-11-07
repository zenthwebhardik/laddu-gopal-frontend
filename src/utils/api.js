import { API_BASE } from './business.js';

async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Server se connect nahi ho paaya');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // FastAPI validation errors arrive as a list; show the first readable message.
    const detail = Array.isArray(data.detail)
      ? data.detail[0]?.msg?.replace(/^Value error, /, '')
      : data.detail;
    const err = new Error(detail || 'Kuch gadbad ho gayi, dobara koshish karein');
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * Website lead. Backend schema (InquiryCreate): { name, phone, email?, message }.
 * source 'quote' → POST /queries (REQUEST_QUERY), 'contact' → POST /contact (CONTACT_US).
 */
export function submitLead(payload, source = 'quote') {
  return request(source === 'contact' ? '/contact/' : '/queries/', { method: 'POST', body: payload });
}

/** Admin login. Returns { access_token, user }. Only ADMIN_EMAIL/ADMIN_PASSCODE from the server .env work. */
export function adminLogin(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

/** Admin only: unique customer count + 20 latest leads. */
export function getUniqueCustomers(token) {
  return request('/analytics/unique-customers', { token });
}

/** Admin only: build the weekly Excel report and email it. */
export function triggerWeeklyReport(token) {
  return request('/analytics/trigger-report', { method: 'POST', token });
}
