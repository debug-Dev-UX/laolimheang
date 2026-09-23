// 3D Spatial Project Images Vault & Architectural Media Showcase
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { getStoredCategories } from '../data/projectImagesData';
import CyberHUD, { playCyberTone } from '../components/common/CyberHUD';

const ProjectImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [categories, setCategories] = useState(() => getStoredCategories());
  const [activeLightbox, setActiveLightbox] = useState(null);

  useEffect(() => {
    loadImages();

    const handleCategoriesUpdate = () => {
      setCategories(getStoredCategories());
    };
    window.addEventListener('storage', handleCategoriesUpdate);
    window.addEventListener('categories-updated', handleCategoriesUpdate);
    return () => {
      window.removeEventListener('storage', handleCategoriesUpdate);
      window.removeEventListener('categories-updated', handleCategoriesUpdate);
    };
  }, []);

  const loadImages = async () => {
    try {
      const data = await getCollection(COLLECTIONS.PROJECT_IMAGES);
      if (data && data.length > 0) {
        setImages(data);
        return;
      }
    } catch (err) {
      console.warn('No project images in Firestore or permission limited:', err);
    }
    try {
      const local = localStorage.getItem('custom_project_images');
      setImages(local ? JSON.parse(local) : []);
    } catch (e) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const projectList = images.length > 0
    ? ['All', ...new Set(images.map((img) => img.projectName).filter(Boolean))]
    : [];

  const dynamicCategories = ['All', ...categories];

  const filtered = images.filter((img) => {
    const matchProject = selectedProject === 'All' || img.projectName === selectedProject;
    const matchType = selectedType === 'All' || img.imageType === selectedType;
    return matchProject && matchType;
  });

  const openLightbox = (img) => {
    playCyberTone('click');
    setActiveLightbox(img);
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
        paddingBottom: '120px',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-160px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          filter: 'blur(130px)',
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
            <span>Dedicated Project Media & Blueprint Vault</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 900,
              color: '#f8fafc',
              margin: '0 0 16px',
              letterSpacing: '-0.03em',
            }}
          >
            Project <span style={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Image Vault</span>
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
            A curated archive of UI interfaces, mobile responsive viewports, system topology diagrams, and database schemas crafted for every project.
          </p>

          {/* Stats Ribbon */}
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
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#38bdf8' }}>{images.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Project Assets</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#34d399' }}>{projectList.length > 1 ? projectList.length - 1 : 0}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Projects Documented</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24' }}>High Res</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Retina Telemetry</div>
            </div>
          </div>
        </motion.div>

        {/* Filter Controls: Only show if there are images */}
        {images.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
            {/* Projects Filter */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', justifyContent: 'center' }}>
              {projectList.map((pName) => (
                <button
                  key={pName}
                  type="button"
                  onClick={() => {
                    playCyberTone('click');
                    setSelectedProject(pName);
                  }}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: selectedProject === pName ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(12, 14, 28, 0.6)',
                    color: selectedProject === pName ? '#ffffff' : '#94a3b8',
                    border: selectedProject === pName ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: selectedProject === pName ? '0 4px 20px rgba(99, 102, 241, 0.4)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {pName}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {dynamicCategories.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    playCyberTone('click');
                    setSelectedType(type);
                  }}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedType === type ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    borderColor: selectedType === type ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid',
                    color: selectedType === type ? '#c7d2fe' : '#64748b',
                    transition: 'all 0.2s',
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project Images 3D Matrix */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b' }}>
            Loading Project Vault...
          </div>
        ) : images.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '90px 24px',
              background: 'rgba(12, 14, 28, 0.5)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '44px', marginBottom: '16px' }}>🖼️</div>
            <h3 style={{ color: '#f8fafc', fontSize: '20px', fontWeight: 800, margin: '0 0 8px' }}>
              Project Vault is Empty
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              No project images or architecture blueprints have been uploaded to the database yet.
            </p>
            <Link
              to={ROUTES.ADMIN_PROJECT_IMAGES}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
              }}
            >
              <span>Upload in Admin Panel →</span>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(12, 14, 28, 0.5)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📂</div>
            <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>No media assets match your filter</h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Try selecting a different project filter or category pill.</p>
          </div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '28px',
            }}
          >
            {filtered.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => openLightbox(img)}
                style={{
                  background: 'rgba(12, 14, 28, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(99, 102, 241, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.6)';
                }}
              >
                {/* Visual Area */}
                <div style={{ position: 'relative', height: '220px', background: '#050714', overflow: 'hidden' }}>
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(12, 14, 28, 0.95) 100%)' }} />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      {img.imageType}
                    </span>
                    {img.aspectRatio && (
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '8px', background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', color: '#94a3b8' }}>
                        {img.aspectRatio}
                      </span>
                    )}
                  </div>

                  {img.featured && (
                    <span style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '11px', fontWeight: 800, color: '#fbbf24', background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                      ★ Key Blueprint
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>
                    {img.projectName}
                  </div>
                  <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.3 }}>
                    {img.title}
                  </h3>

                  {img.description && (
                    <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: '0 0 18px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {img.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>Enlarge Blueprint</span>
                      <span>↗</span>
                    </span>
                    <Link
                      to={ROUTES.PORTFOLIO}
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '11px', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}
                    >
                      View in Portfolio →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(3, 4, 12, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '1000px',
                width: '100%',
                maxHeight: '92vh',
                background: 'rgba(12, 14, 28, 0.96)',
                borderRadius: '28px',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                boxShadow: '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.2)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>
                    {activeLightbox.projectName} • {activeLightbox.imageType}
                  </span>
                  <h2 style={{ color: '#f8fafc', fontSize: '22px', fontWeight: 900, margin: '4px 0 0' }}>
                    {activeLightbox.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLightbox(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Lightbox Image Preview */}
              <div style={{ maxHeight: '62vh', overflow: 'hidden', borderRadius: '18px', background: '#020308', display: 'flex', justifyContent: 'center', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <img
                  src={activeLightbox.imageUrl}
                  alt={activeLightbox.title}
                  style={{ maxWidth: '100%', maxHeight: '62vh', objectFit: 'contain' }}
                />
              </div>

              {activeLightbox.description && (
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, margin: '18px 0 0' }}>
                  {activeLightbox.description}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '18px' }}>
                <a
                  href={activeLightbox.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Open Original High-Res ↗
                </a>
                <Link
                  to={ROUTES.PORTFOLIO}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  View Full Architecture in Portfolio →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CyberHUD />
    </div>
  );
};

export default ProjectImages;
