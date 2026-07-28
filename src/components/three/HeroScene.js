// src/components/three/HeroScene.jsx
// Three.js / React Three Fiber animated hero background

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Particle field
function ParticleField({ count = 3000 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

// Floating geometric mesh
function FloatingOrb({ position, scale, speed, color }) {
  const ref = useRef();
  const offset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * speed + offset.current) * 0.3;
      ref.current.rotation.x = t * speed * 0.4;
      ref.current.rotation.z = t * speed * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// Main ring
function RingMesh() {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={[2, 0, -2]}>
      <torusGeometry args={[2, 0.02, 16, 100]} />
      <meshStandardMaterial color="#60a5fa" transparent opacity={0.3} />
    </mesh>
  );
}

// Scene setup
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <ParticleField count={2500} />
      <FloatingOrb position={[-3, 0.5, -1]} scale={0.6} speed={0.4} color="#3b82f6" />
      <FloatingOrb position={[3, -0.5, -2]} scale={0.8} speed={0.3} color="#60a5fa" />
      <FloatingOrb position={[0, 1.5, -3]} scale={0.4} speed={0.5} color="#93c5fd" />
      <FloatingOrb position={[-1.5, -1, 1]} scale={0.5} speed={0.35} color="#2563eb" />
      <RingMesh />
    </>
  );
}

// Camera that responds to mouse
function CameraRig() {
  const { camera, mouse } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (mouse.x * 0.5 - target.current.x) * 0.05;
    target.current.y += (-mouse.y * 0.3 - target.current.y) * 0.05;
    camera.position.x = target.current.x;
    camera.position.y = target.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

const HeroScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CameraRig />
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroScene;