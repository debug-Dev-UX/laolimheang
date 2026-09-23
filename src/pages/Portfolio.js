// 3D Spatial Architecture & Portfolio Showcase
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import ProjectShowcase3D from '../components/portfolio/ProjectShowcase3D';
import ProjectCard3D from '../components/portfolio/ProjectCard3D';
import ProjectInspectorModal3D from '../components/portfolio/ProjectInspectorModal3D';
import CyberHUD, { playCyberTone } from '../components/common/CyberHUD';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('orbit'); // 'orbit' | 'grid'
  const [inspectedProject, setInspectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getCollection(COLLECTIONS.PROJECTS);
      if (data && data.length > 0) {
        setProjects(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.warn('Could not load projects from database:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = projects.length > 0
    ? ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))]
    : [];

  const filtered = projects.filter((p) => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologies || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleInspect = (proj) => {
    playCyberTone('click');
    setInspectedProject(proj);
  };

  return (
    <div
      style={{
        background: '#030308',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        paddingBottom: '100px',
      }}
    >
      {/* Background radial ambient lights */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '120px 24px 0', position: 'relative', zIndex: 1 }}>
        {/* Header HUD Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#818cf8',
                boxShadow: '0 0 8px #818cf8',
              }}
            />
            <span>3D Interactive Architecture Suite</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 900,
              color: '#f8fafc',
              margin: '0 0 16px',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            System <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Architecture</span> & Works
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '17px',
              maxWidth: '680px',
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Explore high-availability distributed systems, neural networks, and interactive 3D spatial web applications crafted by Lao Limheang.
          </p>

          {/* HUD Stats Ribbon */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '24px',
              padding: '16px 32px',
              background: 'rgba(12, 14, 28, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#38bdf8' }}>{projects.length > 0 ? `${projects.length}+` : 0}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Architectures</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#34d399' }}>99.99%</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Target Uptime</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24' }}>60 FPS</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>WebGL Render</div>
            </div>
          </div>
        </motion.div>

        {/* View Switcher & Search Bar Control Ribbon: Only show if there are projects */}
        {projects.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
                background: 'rgba(12, 14, 28, 0.5)',
                backdropFilter: 'blur(16px)',
                padding: '14px 20px',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.07)',
              }}
            >
              {/* Dual 3D View Switcher */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(5, 7, 18, 0.8)',
                  padding: '4px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    playCyberTone('click');
                    setViewMode('orbit');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: viewMode === 'orbit' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                    color: viewMode === 'orbit' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'orbit' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  <span>3D Orbit Cylinder</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playCyberTone('click');
                    setViewMode('grid');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: viewMode === 'grid' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: viewMode === 'grid' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>3D Spatial Grid</span>
                </button>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search architecture or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 40px',
                    background: 'rgba(5, 7, 18, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '36px',
                justifyContent: 'center',
              }}
            >
              {categories.map((cat) => {
                const isSelected = filter === cat;
                const count =
                  cat === 'All'
                    ? projects.length
                    : projects.filter((p) => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playCyberTone('click');
                      setFilter(cat);
                    }}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '999px',
                      border: isSelected
                        ? '1.5px solid rgba(99, 102, 241, 0.6)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isSelected
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(12, 14, 28, 0.5)',
                      color: isSelected ? '#c7d2fe' : '#94a3b8',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'none',
                    }}
                  >
                    <span>{cat}</span>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#ffffff' : '#64748b',
                        fontWeight: 800,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Content Section: 3D Orbit Carousel vs 3D Spatial Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
            Loading Architectures...
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '90px 24px',
              background: 'rgba(12, 14, 28, 0.5)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🛰️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
              No Architectures Documented
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              No portfolio projects have been added to the system architecture yet.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'rgba(12, 14, 28, 0.5)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
              No Architectures Found
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Try adjusting your search query or switching category filters.
            </p>
          </div>
        ) : viewMode === 'orbit' ? (
          <motion.div
            key="orbit-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProjectShowcase3D projects={filtered} onInspect={handleInspect} />

            {/* Quick Summary Grid Below 3D Orbit */}
            <div style={{ marginTop: '56px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Active Architectural Blueprints ({filtered.length})
                </h2>
                <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 700 }}>
                  Click any card to inspect full telemetry
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: '24px',
                }}
              >
                {filtered.map((proj, idx) => (
                  <ProjectCard3D
                    key={proj.id || idx}
                    project={proj}
                    onInspect={handleInspect}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '28px',
            }}
          >
            {filtered.map((proj, idx) => (
              <ProjectCard3D
                key={proj.id || idx}
                project={proj}
                onInspect={handleInspect}
                index={idx}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* 3D Inspector Modal */}
      {inspectedProject && (
        <ProjectInspectorModal3D
          project={inspectedProject}
          onClose={() => setInspectedProject(null)}
        />
      )}

      {/* Cyber HUD audio & controls */}
      <CyberHUD />
    </div>
  );
};

export default Portfolio;
