// Enhanced 3D Reactive Hero Canvas with Interactive Camera & Particle Constellations
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import ParticleField from './PartCleField';
import { FloatingWireIcosahedron, FloatingGlowOctahedron, FloatingCyberRing } from './FloatingShapes';

function CameraRig() {
  const { camera, mouse } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (mouse.x * 0.8 - target.current.x) * 0.05;
    target.current.y += (-mouse.y * 0.5 - target.current.y) * 0.05;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CentralNexusCore() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]} scale={1.4}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.15}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[8, 10, 5]} intensity={1.4} color="#818cf8" />
      <pointLight position={[-8, -6, -4]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[6, -4, 4]} intensity={0.6} color="#8b5cf6" />

      {/* Particle Cosmos */}
      <ParticleField count={2500} color="#60a5fa" size={0.035} radius={14} />

      {/* Centerpiece distorted energy core */}
      <CentralNexusCore />

      {/* Cyber rings */}
      <FloatingCyberRing position={[0, 0, 0]} radius={2.6} tube={0.02} color="#8b5cf6" speed={0.4} />
      <FloatingCyberRing position={[0, 0, 0]} radius={3.4} tube={0.015} color="#06b6d4" speed={-0.3} />

      {/* Floating geometric cyber shapes */}
      <FloatingWireIcosahedron position={[-3.2, 1.2, -1]} scale={0.7} color="#38bdf8" speed={1} />
      <FloatingWireIcosahedron position={[3.4, -1.2, -2]} scale={0.9} color="#818cf8" speed={0.8} />
      <FloatingGlowOctahedron position={[-2.4, -1.8, 1]} scale={0.6} color="#10b981" speed={1.2} />
      <FloatingGlowOctahedron position={[2.8, 2, -1.5]} scale={0.5} color="#f59e0b" speed={1.4} />
    </>
  );
}

const HeroScene = ({ className = 'absolute inset-0 w-full h-full' }) => {
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;