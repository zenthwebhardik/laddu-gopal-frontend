import { useEffect, useRef } from 'react';

export default function LavaCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let points = [];
    let sparkles = [];
    let mouse = { x: -100, y: -100 };
    let isDrawing = false;
    let frameId;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isDrawing = true;
      
      points.push({ x: mouse.x, y: mouse.y, age: 0 });
      
      // Spawn sparkles when moving
      if (Math.random() > 0.4) {
        sparkles.push({
          x: mouse.x + (Math.random() - 0.5) * 10,
          y: mouse.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 1,
          size: Math.random() * 3 + 1
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Hide when mouse stops moving for a while
    const hideTimeout = setInterval(() => {
      isDrawing = false;
    }, 100);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Lava Trail
      if (points.length > 1) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];
          
          // Age the point rapidly
          p1.age += 0.05;
          
          const maxAge = 0.4; // Seconds
          if (p1.age > maxAge) continue;

          // Color calculation based on age (White -> Orange -> Red -> Black)
          const progress = p1.age / maxAge;
          
          let r = 255;
          let g = 255;
          let b = 255;
          
          if (progress < 0.2) {
            // White to Yellow
            b = 255 - (progress / 0.2) * 255;
          } else if (progress < 0.5) {
            // Yellow to Red
            b = 0;
            g = 255 - ((progress - 0.2) / 0.3) * 255;
          } else {
            // Red to Dark
            b = 0;
            g = 0;
            r = 255 - ((progress - 0.5) / 0.5) * 200;
          }

          const alpha = 1 - progress;
          const width = 8 * Math.pow((1 - progress), 2); // Taper off width

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
          ctx.lineWidth = width;
          
          // Add glow effect for fresh points
          if (progress < 0.3) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(255, 100, 0, ${alpha})`;
          } else {
            ctx.shadowBlur = 0;
          }
          
          ctx.stroke();
        }

        // Cleanup old points
        points[points.length - 1].age += 0.05;
        points = points.filter(p => p.age < 0.4);
      }

      // Draw Sparkles
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(255, 200, 100, 0.8)';
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.04; // Fade out quickly
        
        if (s.life <= 0) continue;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, ${200 * s.life}, ${100 * s.life}, ${s.life})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0; // Reset
      sparkles = sparkles.filter(s => s.life > 0);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(hideTimeout);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
