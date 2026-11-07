import { useEffect, useRef } from 'react';

// A few welding sparks falling from one point in the hero photo.
// Desktop only, paused off-screen and skipped for reduced motion.
export default function HeroSparks() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!wide || reduce) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const sparks = [];
    const spawn = () => {
      const ox = w * 0.42;
      const oy = h * 0.46;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
      const speed = 1.5 + Math.random() * 3.2;
      sparks.push({ x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1 });
    };

    let raf = 0;
    let visible = true;
    let burst = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      burst -= 1;
      if (burst <= 0) {
        const n = 6 + Math.floor(Math.random() * 10);
        for (let i = 0; i < n; i += 1) spawn();
        burst = 18 + Math.random() * 50;
      }
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.vy += 0.09;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.018;
        if (s.life <= 0 || s.y > h) { sparks.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(255, ${150 + Math.floor(s.life * 90)}, 70, ${s.life})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-sparks" aria-hidden="true" style={{ width: '100%', height: '100%' }} />;
}
