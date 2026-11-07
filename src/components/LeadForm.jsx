import { useState } from 'react';
import { Check } from 'lucide-react';
import { submitLead } from '../utils/api.js';
import { BUSINESS, telLink, whatsappLink } from '../utils/business.js';

const JOBS = ['Main gate', 'Sliding gate', 'Railing', 'Window grill', 'Shed', 'Repair', 'Kuch aur'];

const empty = { name: '', phone: '', job: '', details: '', area: '', email: '' };

const PHONE_RE = /^(\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Naam likhiye';
  if (!PHONE_RE.test(f.phone.trim())) e.phone = 'Sahi mobile number likhiye (10 ank)';
  if (!f.job) e.job = 'Kya banwana hai, chuniye';
  if (f.email.trim() && !EMAIL_RE.test(f.email.trim())) e.email = 'Email sahi nahi lag raha (ya khaali chhod dijiye)';
  return e;
}

function buildMessage(f) {
  return [
    `Kaam: ${f.job}`,
    f.details.trim() && `Details: ${f.details.trim()}`,
    f.area.trim() && `Area: ${f.area.trim()}`,
  ].filter(Boolean).join('\n');
}

/**
 * The one lead form on the site (Contact section + "Rate maangiye" modal).
 * Only name, mobile and job type are required.
 */
export default function LeadForm({ source = 'quote', idPrefix = 'lead', onDone }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');
  const [sent, setSent] = useState(null);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((x) => ({ ...x, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${idPrefix}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    const message = buildMessage(form);
    try {
      await submitLead(
        { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() || null, message },
        source
      );
      setSent({ name: form.name.trim(), phone: form.phone.trim(), message });
      setStatus('sent');
      setForm(empty);
    } catch (err) {
      setServerError(err.message);
      setStatus('error');
    }
  };

  const fieldProps = (field) => ({
    id: `${idPrefix}-${field}`,
    value: form[field],
    onChange: set(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${idPrefix}-${field}-error` : undefined,
    className: `form-input ${errors[field] ? 'error' : ''}`,
  });

  const errorText = (field) =>
    errors[field] && <div className="form-error" id={`${idPrefix}-${field}-error`}>{errors[field]}</div>;

  if (status === 'sent' && sent) {
    return (
      <div className="success-message" role="status">
        <div className="success-icon"><Check size={28} /></div>
        <h3>Request mil gayi</h3>
        <p>Dhanyavaad {sent.name}. Hum {sent.phone} par call karenge.</p>
        <div className="lead-done-actions">
          <a
            className="btn btn-whatsapp"
            href={whatsappLink(`Namaste, maine website par form bhara hai (${sent.name}, ${sent.phone}). Design ki photo bhej raha/rahi hoon.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Design ki photo WhatsApp karein
          </a>
          <button type="button" className="btn btn-secondary" onClick={() => { setStatus('idle'); onDone?.(); }}>
            {onDone ? 'Band karein' : 'Ek aur request'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="lead-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor={`${idPrefix}-name`}>Naam</label>
          <input type="text" autoComplete="name" {...fieldProps('name')} />
          {errorText('name')}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${idPrefix}-phone`}>Mobile number</label>
          <input type="tel" inputMode="tel" autoComplete="tel" placeholder="98xxxxxxxx" {...fieldProps('phone')} />
          {errorText('phone')}
        </div>
      </div>

      <fieldset className="form-group">
        <legend className="form-label" id={`${idPrefix}-job`} tabIndex={-1}>Kya banwana hai?</legend>
        <div className="job-chips" role="radiogroup" aria-labelledby={`${idPrefix}-job`} aria-describedby={errors.job ? `${idPrefix}-job-error` : undefined}>
          {JOBS.map((job) => (
            <label key={job} className={`chip chip-radio ${form.job === job ? 'is-on' : ''}`}>
              <input type="radio" name={`${idPrefix}-job`} value={job} checked={form.job === job} onChange={set('job')} />
              {job}
            </label>
          ))}
        </div>
        {errorText('job')}
      </fieldset>

      <div className="form-group">
        <label className="form-label" htmlFor={`${idPrefix}-details`}>
          Size ya details <span className="optional">(zaroori nahi)</span>
        </label>
        <textarea rows={3} placeholder="Jaise: 10 × 7 feet, jaali design, kaala rang" {...fieldProps('details')} className="form-textarea" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor={`${idPrefix}-area`}>
            Area / mohalla <span className="optional">(zaroori nahi)</span>
          </label>
          <input type="text" autoComplete="address-level3" {...fieldProps('area')} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={`${idPrefix}-email`}>
            Email <span className="optional">(zaroori nahi)</span>
          </label>
          <input type="email" autoComplete="email" {...fieldProps('email')} />
          {errorText('email')}
        </div>
      </div>

      {status === 'error' && (
        <div className="form-error" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
          {serverError}. Seedha <a className="link" href={telLink}>{BUSINESS.phoneDisplay}</a> par call kar sakte hain.
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={status === 'sending'}>
        {status === 'sending' ? <><span className="spinner" /> Bhej rahe hain…</> : 'Rate ke liye bhejein'}
      </button>
    </form>
  );
}
