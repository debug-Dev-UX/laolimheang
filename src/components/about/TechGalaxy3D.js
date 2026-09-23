// Interactive 3D Skill Constellation Sphere with Fibonacci Distribution
import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sphere } from '@react-three/drei';
import ParticleField from '../three/PartCleField';

const SKILLS_LIST = [
  { name: 'React', category: 'Frontend', color: '#61dafb' },
  { name: 'TypeScript', category: 'Language', color: '#3178c6' },
  { name: 'Three.js', category: '3D/WebGL', color: '#38bdf8' },
  { name: 'Node.js', category: 'Backend', color: '#68a063' },
  { name: 'Python', category: 'AI/Backend', color: '#3776ab' },
  { name: 'Docker', category: 'DevOps', color: '#2496ed' },
  { name: 'Firebase', category: 'Cloud/DB', color: '#ffca28' },
  { name: 'Next.js', category: 'FullStack', color: '#ffffff' },
  { name: 'TailwindCSS', category: 'UI', color: '#38bdf8' },
  { name: 'PostgreSQL', category: 'Database', color: '#336791' },
  { name: 'GraphQL', category: 'API', color: '#e10098' },
  { name: 'AWS Cloud', category: 'Cloud', color: '#ff9900' },
  { name: 'MongoDB', category: 'Database', color: '#47a248' },
  { name: 'WebGL Shaders', category: '3D/Graphics', color: '#818cf8' },
  { name: 'Framer Motion', category: 'Animation', color: '#ec4899' },
  { name: 'Vue.js', category: 'Frontend', color: '#42b883' },
];

function SkillNode({ skill, position, onSelect, isSelected }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered || isSelected ? 1.5 : 0.6}
        />
      </mesh>
      <Html
        distanceFactor={7}
        position={[0, 0.15, 0]}
        style={{
          userSelect: 'none',
          pointerEvents: 'auto',
          transform: 'translate3d(-50%, -50%, 0)',
        }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(skill);
          }}
          style={{
            padding: '4px 10px',
            background: isSelected
              ? skill.color
              : hovered
              ? 'rgba(15, 23, 42, 0.95)'
              : 'rgba(5, 7, 20, 0.8)',
            border: `1.5px solid ${skill.color}`,
            borderRadius: '999px',
            color: isSelected ? '#030308' : '#ffffff',
            fontSize: '11px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: hovered || isSelected
              ? `0 0 20px ${skill.color}88`
              : '0 4px 12px rgba(0,0,0,0.5)',
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: isSelected ? '#030308' : skill.color,
            }}
          />
          {skill.name}
        </div>
      </Html>
    </group>
  );
}

function SphereGalaxy({ onSelectSkill, selectedSkill }) {
  const groupRef = useRef();
  const radius = 2.8;

  // Fibonacci sphere distribution
  const nodes = useMemo(() => {
    const total = SKILLS_LIST.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    return SKILLS_LIST.map((skill, i) => {
      const y = 1 - (i / (total - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY * radius;
      const posZ = Math.sin(theta) * radiusAtY * radius;
      const posY = y * radius;

      return {
        skill,
        position: [x, posY, posZ],
      };
    });
  }, [radius]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Pulsing Energy Core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={1.2}
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Orbiting skill nodes */}
      {nodes.map(({ skill, position }) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          position={position}
          onSelect={onSelectSkill}
          isSelected={selectedSkill?.name === skill.name}
        />
      ))}
    </group>
  );
}

const TechGalaxy3D = () => {
  const [selectedSkill, setSelectedSkill] = useState(SKILLS_LIST[0]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #0e112a 0%, #030308 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[6, 6, 6]} intensity={1.2} color="#818cf8" />
          <pointLight position={[-6, -6, -6]} intensity={0.8} color="#06b6d4" />
          <ParticleField count={1200} color="#818cf8" size={0.025} radius={10} />
          <SphereGalaxy onSelectSkill={setSelectedSkill} selectedSkill={selectedSkill} />
        </Suspense>
      </Canvas>

      {/* Top HUD Badge */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
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
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#818cf8',
            boxShadow: '0 0 10px #818cf8',
          }}
        />
        <span>3D Skill Constellation • Auto-Orbiting</span>
      </div>

      {/* Bottom Info Pill for Selected Skill */}
      {selectedSkill && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 20px',
            background: 'rgba(10, 14, 30, 0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: '999px',
            border: `1.5px solid ${selectedSkill.color}55`,
            boxShadow: `0 8px 30px ${selectedSkill.color}33`,
            color: '#f8fafc',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          <span style={{ color: selectedSkill.color }}>● {selectedSkill.name}</span>
          <span style={{ color: '#64748b' }}>|</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>{selectedSkill.category} Focus</span>
        </div>
      )}
    </div>
  );
};

export default TechGalaxy3D;
