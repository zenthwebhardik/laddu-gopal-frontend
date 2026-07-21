import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FluidParticles({ count = 2000 }) {
  const pointsRef = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Grid layout for a fluid mesh look
    const size = Math.ceil(Math.sqrt(count));
    const spacing = 0.4;
    
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        if (i >= count) break;
        
        const px = (x - size / 2) * spacing;
        const pz = (z - size / 2) * spacing;
        
        positions[i * 3] = px;
        positions[i * 3 + 1] = 0; // Y will be animated
        positions[i * 3 + 2] = pz;
        
        // Brand gradient (orange to deep red)
        const color = new THREE.Color();
        color.setHSL(0.05 + Math.random() * 0.05, 0.9, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        i++;
      }
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.5;
    const pos = pointsRef.current.geometry.attributes.position.array;
    const size = Math.ceil(Math.sqrt(count));
    
    let i = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        if (i >= count) break;
        
        const px = pos[i * 3];
        const pz = pos[i * 3 + 2];
        
        // Fluid wave math
        const wave1 = Math.sin(px * 0.5 + t) * 0.5;
        const wave2 = Math.cos(pz * 0.5 + t * 0.8) * 0.5;
        const wave3 = Math.sin((px + pz) * 0.3 + t * 1.2) * 0.3;
        
        pos[i * 3 + 1] = wave1 + wave2 + wave3;
        
        i++;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Gentle rotation
    pointsRef.current.rotation.y = Math.sin(t * 0.1) * 0.2;
    pointsRef.current.rotation.z = Math.cos(t * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef} position={[0, -2, -5]} rotation={[0.4, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function FluidBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: false, alpha: true }} // Disabled antialias for mobile performance
        dpr={[1, 1.5]} // Limit device pixel ratio for performance
      >
        <fog attach="fog" args={['#0a0a0a', 5, 15]} />
        <FluidParticles count={2500} />
      </Canvas>
    </div>
  );
}
