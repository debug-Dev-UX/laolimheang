// Immersive 3D Project Inspector Modal with Spatial Preview & Architectural Specs
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const ProjectInspectorModal3D = ({ project, onClose }) => {
  const previewRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleMouseMove = (e) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((e.clientY - rect.top - cy) / cy) * -15;
    const ry = ((e.clientX - rect.left - cx) / cx) * 15;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const gradient =
    project.gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)';

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'rgba(3, 4, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '920px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'rgba(12, 14, 28, 0.92)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            boxShadow: '0 30px 100px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.2)',
            borderRadius: '28px',
            padding: '36px',
            position: 'relative',
            color: '#e2e8f0',
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
          >
            ✕
          </button>

          {/* Grid Layout: Left 3D Perspective Visualizer, Right Deep Specs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
              gap: '32px',
            }}
          >
            {/* Left: 3D Holographic Perspective Preview */}
            <div style={{ perspective: 1000, display: 'flex', flexDirection: 'column' }}>
              <div
                ref={previewRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  height: '280px',
                  borderRadius: '20px',
                  background: project.imageUrl
                    ? `url(${project.imageUrl}) center/cover`
                    : gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(15px)`,
                  transition: 'transform 0.12s ease-out',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.3)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(3, 3, 8, 0.1) 0%, rgba(10, 12, 24, 0.8) 100%)',
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '64px',
                      fontWeight: 900,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {project.title?.[0]?.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#38bdf8',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      marginTop: '8px',
                    }}
                  >
                    INTERACTIVE 3D PERSPECTIVE PREVIEW
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              {project.metrics && project.metrics.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${project.metrics.length}, 1fr)`,
                    gap: '12px',
                    marginTop: '20px',
                  }}
                >
                  {project.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          color: '#34d399',
                          marginBottom: '4px',
                        }}
                      >
                        {m.value}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Technical Specification Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  {project.category || 'Architecture'}
                </span>
                {project.status && (
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#10b981',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    {project.status}
                  </span>
                )}
              </div>

              <h2
                style={{
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#f8fafc',
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                }}
              >
                {project.title}
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.65',
                  color: '#94a3b8',
                  margin: '0 0 20px',
                }}
              >
                {project.description}
              </p>

              {/* Architecture Highlights */}
              {project.architecture && (
                <div style={{ marginBottom: '22px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#c7d2fe',
                      marginBottom: '10px',
                    }}
                  >
                    Architectural Highlights
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
                    {project.architecture.map((arch, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>
                        {arch}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              <div style={{ marginBottom: '28px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#c7d2fe',
                    marginBottom: '10px',
                  }}
                >
                  Technology Ecosystem
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(project.technologies || []).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '8px',
                        background: `${tc(tech)}18`,
                        color: tc(tech),
                        border: `1px solid ${tc(tech)}35`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', marginTop: 'auto' }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                    }}
                  >
                    <span>Launch Live Demo</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px 20px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#e2e8f0',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Source Repository</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectInspectorModal3D;
