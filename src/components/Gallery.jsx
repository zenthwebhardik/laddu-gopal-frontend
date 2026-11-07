import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WhatsAppIcon } from './Icons.jsx';
import { whatsappLink } from '../utils/business.js';

export function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index];
  const go = useCallback(
    (step) => onIndex((index + step + items.length) % items.length),
    [index, items.length, onIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [go, onClose]);

  if (!item) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <button className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Band karein">
        <X size={24} />
      </button>
      {items.length > 1 && (
        <>
          <button className="lightbox-btn lightbox-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Pichhli photo">
            <ChevronLeft size={26} />
          </button>
          <button className="lightbox-btn lightbox-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Agli photo">
            <ChevronRight size={26} />
          </button>
        </>
      )}
      <img src={item.img} alt={item.title} onClick={(e) => e.stopPropagation()} />
      <p className="lightbox-caption">
        {item.title}
        <span>{index + 1} / {items.length}</span>
      </p>
      <a
        className="btn btn-whatsapp"
        style={{ marginTop: 'var(--space-3)' }}
        href={whatsappLink(`Namaste, mujhe is design ka rate jaanna hai: "${item.title}". Size: `)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        <WhatsAppIcon size={18} /> Is design ka rate puchhein
      </a>
    </div>
  );
}

export default function Gallery({ items, filters, leadFirst = false }) {
  const [filter, setFilter] = useState(filters?.[0]?.value ?? 'all');
  const [open, setOpen] = useState(null);

  const shown = !filters || filter === 'all' ? items : items.filter((i) => i.category === filter);

  return (
    <>
      {filters && (
        <div className="gallery-filters" role="group" aria-label="Design filter">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              className="chip"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className={`gallery-grid ${leadFirst ? 'gallery-grid--lead' : ''}`}>
        {shown.map((item, i) => (
          <button key={item.id} type="button" className="gallery-item" onClick={() => setOpen(i)}>
            <figure style={{ height: '100%' }}>
              <img src={item.img} alt={item.title} loading="lazy" decoding="async" width="600" height="750" />
              <figcaption>{item.title}</figcaption>
            </figure>
          </button>
        ))}
      </div>

      {open !== null && (
        <Lightbox items={shown} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  );
}
