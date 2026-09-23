// 3D Floating Cyber Geometric Meshes for Backgrounds and HUDs
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export const FloatingWireIcosahedron = ({ position = [0, 0, 0], scale = 1, color = '#6366f1', speed = 1.2 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed;
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.2;
    }
  });

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.6} floatIntensity={0.8} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.35}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
};

export const FloatingGlowOctahedron = ({ position = [0, 0, 0], scale = 0.8, color = '#06b6d4', speed = 1.5 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed;
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.8} floatIntensity={1} position={position}>
      <mesh ref={meshRef} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.4}
          opacity={0.7}
          transparent
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

export const FloatingCyberRing = ({ position = [0, 0, 0], radius = 2, tube = 0.03, color = '#8b5cf6', speed = 0.8 }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      const t = state.clock.elapsedTime * speed;
      ringRef.current.rotation.x = t * 0.2 + Math.PI / 4;
      ringRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[radius, tube, 16, 80]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.9}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

export const FloatingCyberCluster = ({ count = 6 }) => {
  const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];
  const items = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2,
      ],
      scale: 0.3 + Math.random() * 0.4,
      color: colors[i % colors.length],
      speed: 0.8 + Math.random() * 0.8,
      type: i % 2 === 0 ? 'icosa' : 'octa',
    }));
  }, [count]);

  return (
    <group>
      {items.map((item, idx) =>
        item.type === 'icosa' ? (
          <FloatingWireIcosahedron
            key={idx}
            position={item.pos}
            scale={item.scale}
            color={item.color}
            speed={item.speed}
          />
        ) : (
          <FloatingGlowOctahedron
            key={idx}
            position={item.pos}
            scale={item.scale}
            color={item.color}
            speed={item.speed}
          />
        )
      )}
    </group>
  );
};

export default FloatingCyberCluster;
