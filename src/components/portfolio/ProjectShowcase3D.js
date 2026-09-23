// 3D WebGL Cylindrical Orbit Carousel using React Three Fiber & Drei Html
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import ParticleField from '../three/PartCleField';
import { FloatingCyberRing } from '../three/FloatingShapes';

const TECH_COLORS = {
  React: '#61dafb',
  Vue: '#42b883',
  Angular: '#dd0031',
  'Node.js': '#68a063',
  Python: '#3776ab',
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Firebase: '#ffca28',
  MongoDB: '#47a248',
  TailwindCSS: '#38bdf8',
  'Next.js': '#ffffff',
  Docker: '#2496ed',
  GraphQL: '#e10098',
};

const tc = (tech) => TECH_COLORS[tech] || '#818cf8';

// 3D Card within Cylindrical Orbit
function OrbitCard({ project, angle, radius, onSelect, isActive }) {
  const [hovered, setHovered] = useState(false);
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotY = angle;

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <Html
        transform
        distanceFactor={6.8}
        position={[0, 0, 0]}
        style={{
          width: '320px',
          userSelect: 'none',
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onSelect(project)}
          style={{
            background: isActive
              ? 'rgba(18, 20, 42, 0.95)'
              : hovered
              ? 'rgba(15, 17, 36, 0.9)'
              : 'rgba(10, 11, 24, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: isActive
              ? '2px solid #818cf8'
              : hovered
              ? '1.5px solid rgba(99, 102, 241, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: hovered || isActive
              ? '0 20px 50px rgba(99, 102, 241, 0.4), 0 0 25px rgba(6, 182, 212, 0.25)'
              : '0 10px 30px rgba(0, 0, 0, 0.6)',
            padding: '20px',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glowing Top Pill */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              {project.category || 'Architecture'}
            </span>
            {project.featured && (
              <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700 }}>
                ★ Top Pick
              </span>
            )}
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#f8fafc',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontSize: '12px',
              color: '#94a3b8',
              lineHeight: 1.5,
              margin: '0 0 16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
            {(project.technologies || []).slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: `${tc(t)}18`,
                  color: tc(t),
                  border: `1px solid ${tc(t)}30`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Click to open badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#818cf8',
            }}
          >
            <span>Click to Inspect 3D</span>
            <span style={{ transform: 'translateX(2px)' }}>→</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Carousel Group that handles rotation, drag, and velocity
function CarouselGroup({ projects, onSelect, activeIndex }) {
  const groupRef = useRef();
  const rotationY = useRef(0);
  const targetRotationY = useRef(0);
  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const velocity = useRef(0);

  const radius = Math.max(3.8, (projects.length * 2.8) / (2 * Math.PI));
  const total = projects.length || 1;

  // Auto-align when activeIndex changes
  useEffect(() => {
    if (activeIndex !== null && activeIndex >= 0 && activeIndex < total) {
      const step = (Math.PI * 2) / total;
      targetRotationY.current = -activeIndex * step;
    }
  }, [activeIndex, total]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!isDragging.current) {
      // Gentle auto-rotation if idle
      if (Math.abs(velocity.current) < 0.001) {
        targetRotationY.current += delta * 0.08;
      } else {
        velocity.current *= 0.92;
        targetRotationY.current += velocity.current;
      }
    }

    // Smooth spring interpolation
    rotationY.current += (targetRotationY.current - rotationY.current) * 0.08;
    groupRef.current.rotation.y = rotationY.current;
  });

  // Pointer drag listeners on the canvas
  useEffect(() => {
    const handleDown = (e) => {
      isDragging.current = true;
      previousPointerX.current = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      velocity.current = 0;
    };

    const handleMove = (e) => {
      if (!isDragging.current) return;
      const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const deltaX = currentX - previousPointerX.current;
      previousPointerX.current = currentX;

      const rotDelta = (deltaX / window.innerWidth) * Math.PI * 1.5;
      targetRotationY.current += rotDelta;
      velocity.current = rotDelta;
    };

    const handleUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchstart', handleDown);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return (
    <group ref={groupRef}>
      {projects.map((proj, idx) => {
        const angle = (idx / total) * Math.PI * 2;
        return (
          <OrbitCard
            key={proj.id || idx}
            project={proj}
            angle={angle}
            radius={radius}
            onSelect={onSelect}
            isActive={activeIndex === idx}
          />
        );
      })}
    </group>
  );
}

const ProjectShowcase3D = ({ projects = [], onInspect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (project) => {
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx !== -1) setActiveIndex(idx);
    if (onInspect) onInspect(project);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at center, #0c0f24 0%, #030308 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 20px 80px rgba(0, 0, 0, 0.8), inset 0 0 60px rgba(99, 102, 241, 0.05)',
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.6, 7.8], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#818cf8" />
          <pointLight position={[0, -4, 2]} intensity={0.8} color="#06b6d4" />
          <ParticleField count={1800} color="#6366f1" size={0.03} radius={12} />
          <FloatingCyberRing position={[0, -1.8, 0]} radius={4.5} tube={0.02} color="#6366f1" speed={0.2} />
          <CarouselGroup projects={projects} onSelect={handleSelect} activeIndex={activeIndex} />
        </Suspense>
      </Canvas>

      {/* Cyber HUD Overlay Controls */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(5, 7, 20, 0.75)',
            backdropFilter: 'blur(10px)',
            borderRadius: '999px',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#c7d2fe',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#06b6d4',
              boxShadow: '0 0 10px #06b6d4',
            }}
          />
          <span>3D Spatial Orbit • Drag to Spin</span>
        </div>

        {/* Carousel indicators */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            pointerEvents: 'auto',
          }}
        >
          {projects.map((p, idx) => (
            <button
              key={p.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              style={{
                width: activeIndex === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: activeIndex === idx ? '#818cf8' : 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              title={p.title}
            />
          ))}
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span>↔ Drag horizontally to explore spatial architecture</span>
      </div>
    </div>
  );
};

export default ProjectShowcase3D;
