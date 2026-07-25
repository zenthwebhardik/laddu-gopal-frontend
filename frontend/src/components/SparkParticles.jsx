import { useMemo } from 'react';

export default function SparkParticles({ count = 30 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * 30}%`,
      duration: `${4 + Math.random() * 6}s`,
      delay: `${Math.random() * 5}s`,
      size: `${2 + Math.random() * 3}px`,
    }));
  }, [count]);

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="spark-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
          }}
        />
      ))}
    </div>
  );
}
