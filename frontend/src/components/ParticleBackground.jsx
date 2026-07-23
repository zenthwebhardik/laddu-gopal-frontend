import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 5000 }) {
  const mesh = useRef();
  
  const [positions, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      scales[i] = Math.random();
    }
    return [positions, scales];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = time * 0.05;
      mesh.current.rotation.x = time * 0.025;
      
      const geometry = mesh.current.geometry;
      const positionsArray = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Subtle wave motion
        positionsArray[i * 3 + 1] += Math.sin(time + positionsArray[i * 3]) * 0.002;
      }
      geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#f59e0b" // Accent color
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none', // Allow clicks to pass through to underlying content
        background: 'linear-gradient(to bottom, #0a0a0f, #13141a)',
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={['#0a0a0f', 2, 8]} />
        <ambientLight intensity={0.5} />
        <Particles count={3000} />
      </Canvas>
    </div>
  );
}
