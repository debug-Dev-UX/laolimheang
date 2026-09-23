// Interactive 3D Holographic Tilt Card with Dynamic Specular Lighting
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

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

const ProjectCard3D = ({ project, onInspect, index = 0 }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setCoords({ x: px, y: py });

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -12;
    const ry = ((x - cx) / cx) * 12;
    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setCoords({ x: 50, y: 50 });
  };

  const gradient =
    project.gradient || 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: hovered
            ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(18px) scale(1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
          background: 'rgba(12, 14, 28, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: hovered
            ? '1px solid rgba(99, 102, 241, 0.45)'
            : '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: hovered
            ? '0 25px 60px -12px rgba(99, 102, 241, 0.35), 0 0 35px rgba(6, 182, 212, 0.2)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => onInspect && onInspect(project)}
      >
        {/* Dynamic Specular Glare overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? `radial-gradient(circle 300px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.16), transparent 70%)`
              : 'transparent',
            pointerEvents: 'none',
            zIndex: 10,
            transition: 'background 0.15s ease',
          }}
        />

        {/* Top Banner / Visual Header */}
        <div
          style={{
            height: '190px',
            position: 'relative',
            background: project.imageUrl
              ? `url(${project.imageUrl}) center/cover`
              : gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Subtle dark gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(3, 3, 8, 0.1) 0%, rgba(12, 14, 28, 0.95) 100%)',
            }}
          />

          {/* Fallback initial or icon */}
          {!project.imageUrl && (
            <div
              style={{
                fontSize: '44px',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.85)',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                letterSpacing: '-0.03em',
                zIndex: 1,
              }}
            >
              {project.title?.[0]?.toUpperCase()}
            </div>
          )}

          {/* Status Badge */}
          {project.status && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                padding: '4px 10px',
                background: 'rgba(3, 7, 18, 0.65)',
                backdropFilter: 'blur(10px)',
                borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              {project.status}
            </div>
          )}

          {/* Featured Badge */}
          {project.featured && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '4px 12px',
                background: 'rgba(245, 158, 11, 0.18)',
                backdropFilter: 'blur(10px)',
                borderRadius: '999px',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                color: '#fbbf24',
                fontSize: '11px',
                fontWeight: 700,
                zIndex: 2,
              }}
            >
              ★ Featured
            </div>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#f8fafc',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              {project.title}
            </h3>
            {project.category && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {project.category}
              </span>
            )}
          </div>

          {project.tagline && (
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 12px', fontWeight: 500, lineHeight: 1.4 }}>
              {project.tagline}
            </p>
          )}

          <p
            style={{
              color: '#64748b',
              fontSize: '13px',
              lineHeight: 1.6,
              margin: '0 0 18px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {project.description}
          </p>

          {/* Tech Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: '8px',
                  background: `${tc(tech)}18`,
                  color: tc(tech),
                  border: `1px solid ${tc(tech)}30`,
                }}
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 4 && (
              <span style={{ fontSize: '11px', color: '#64748b', padding: '3px 6px' }}>
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Card Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspect && onInspect(project);
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.2))',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#c7d2fe',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>Inspect 3D Specs</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Live Demo"
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#e2e8f0',
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="Source Code"
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard3D;
