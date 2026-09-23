// GPU-Accelerated 3D Reactive Particle Field
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export const ParticleField = ({ count = 2500, color = '#6366f1', size = 0.035, radius = 15 }) => {
  const pointsRef = useRef();
  const { mouse } = useThree();

  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * radius;
      const sinPhi = Math.sin(phi);

      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      const time = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = time;
      pointsRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Mouse influence
      pointsRef.current.rotation.x += (mouse.y * 0.2 - pointsRef.current.rotation.x) * 0.05;
      pointsRef.current.rotation.y += (mouse.x * 0.3 - pointsRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
};

export default ParticleField;
