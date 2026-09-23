import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';

/* ══════════════════════════════════════════════
   GENERATIVE ART CANVAS — particle line overlay
══════════════════════════════════════════════ */
const GenerativeArtCanvas = ({ isHovered }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const linesRef  = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = 400;
    canvas.height = 400;

    const NUM = 30;
    class Line {
      constructor() { this.reset(); }
      reset() {
        this.x      = Math.random() * canvas.width;
        this.y      = Math.random() * canvas.height;
        this.speed  = Math.random() * 0.5 + 0.1;
        this.angle  = Math.random() * Math.PI * 2;
        this.length = Math.random() * 20 + 5;
      }
      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.strokeStyle = `rgba(168,85,247,${Math.random() * 0.3 + 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    linesRef.current = Array.from({ length: NUM }, () => new Line());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isHovered) linesRef.current.forEach(l => { l.update(); l.draw(); });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.5s',
        pointerEvents: 'none',
      }}
    />
  );
};

/* ══════════════════════════════════════════════
   SHARE BUTTON
══════════════════════════════════════════════ */
const ShareButton = ({ title, text, url, onToast }) => {
  const handleShare = async (e) => {
    e.stopPropagation();
    const shareData = { title, text, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(url);
      onToast('Link copied to clipboard!');
    }
  };

  return (
    <button onClick={handleShare} className="gal-share-btn" title="Share" style={sBtn}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share
    </button>
  );
};

/* ══════════════════════════════════════════════
   3-D TILT GALLERY CARD
══════════════════════════════════════════════ */
const GalleryCard = ({ item, index, onClick, onToast }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const frameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -18;
      const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  18;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    setIsHovered(false);
  }, []);

  const shareUrl = `${window.location.origin}/gallery`;

  return (
    <div
      ref={cardRef}
      className="gal-card"
      style={{ ...card, animationDelay: `${index * 0.08}s` }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(item)}
    >
      {/* Image layer */}
      <div style={cardInner}>
        <img
          src={item.imageUrl}
          alt={item.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.55s ease' }}
          className={isHovered ? 'gal-img-zoomed' : ''}
          onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/0a0a1a/6366f1?text=Gallery'; }}
        />

        {/* Generative canvas overlay */}
        <GenerativeArtCanvas isHovered={isHovered} />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }} />

        {/* Featured badge */}
        {item.featured && (
          <div style={featBadge}>★ Featured</div>
        )}

        {/* Arrow icon */}
        <div className="gal-arrow" style={arrowIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>

        {/* Text content */}
        <div className={isHovered ? 'gal-info gal-info-visible' : 'gal-info'} style={cardInfo}>
          <h3 style={cardTitle}>{item.title}</h3>
          {item.category && <p style={cardCat}>{item.category}</p>}
        </div>
      </div>

      {/* Share */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 20 }} onClick={e => e.stopPropagation()}>
        <ShareButton
          title={item.title}
          text={item.description || item.title}
          url={shareUrl}
          onToast={onToast}
        />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   LIGHTBOX MODAL
══════════════════════════════════════════════ */
const Lightbox = ({ item, onClose, onToast }) => {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  if (!item) return null;
  const shareUrl = `${window.location.origin}/gallery`;

  return (
    <div style={lb.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={lb.box}>
        <button style={lb.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div style={lb.imgWrap}>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/0a0a1a/6366f1?text=Gallery'; }}
          />
        </div>
        <div style={lb.info}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              {item.category && <span style={lb.cat}>{item.category}</span>}
              <h2 style={lb.title}>{item.title}</h2>
            </div>
            <ShareButton
              title={item.title}
              text={item.description || item.title}
              url={shareUrl}
              onToast={onToast}
            />
          </div>
          {item.description && <p style={lb.desc}>{item.description}</p>}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════════════ */
const Toast = ({ message, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={toastStyle}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {message}
    </div>
  );
};

/* ══════════════════════════════════════════════
   SKELETON LOADER
══════════════════════════════════════════════ */
const GallerySkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 28 }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="gal-skeleton" style={{ height: 320, borderRadius: 20, background: 'rgba(12,12,26,0.6)' }} />
    ))}
  </div>
);

/* ══════════════════════════════════════════════
   MAIN GALLERY PAGE
══════════════════════════════════════════════ */
const Gallery = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);
  const [toast, setToast]     = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    (async () => {
      try {
        const data = await getCollection(COLLECTIONS.GALLERY);
        setItems(data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const filtered   = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div style={page}>
      <style>{css}</style>

      {/* HERO */}
      <section style={hero}>
        <div style={{ ...orb, width: 560, height: 560, background: 'radial-gradient(circle,rgba(168,85,247,0.14),transparent 70%)', top: -200, right: -150 }} />
        <div style={{ ...orb, width: 400, height: 400, background: 'radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)', bottom: -100, left: -100 }} />
        <div style={{ position: 'relative', zIndex: 1, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.8s ease' }}>
          <span style={heroBadge}>✦ Creative Showcase</span>
          <h1 style={heroTitle}>
            Our <span style={gradientText}>Gallery</span>
          </h1>
          <p style={heroSub}>A curated selection of our finest work, where innovation meets elegant design.</p>
          {/* Hero share button */}
          <div style={{ marginTop: 28 }}>
            <ShareButton
              title="Gallery — LaolimHeang"
              text="Check out this creative gallery showcase!"
              url={`${window.location.origin}/gallery`}
              onToast={setToast}
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section style={content}>
        {loading ? (
          <GallerySkeleton />
        ) : (
          <>
            {/* Category Filters */}
            {categories.length > 1 && (
              <div style={filterWrap}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    style={{
                      ...filterBtn,
                      background:   filter === cat ? 'rgba(168,85,247,0.15)' : 'transparent',
                      color:        filter === cat ? '#c084fc' : '#64748b',
                      borderColor:  filter === cat ? 'rgba(168,85,247,0.35)' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={emptyState}>No gallery items found.</div>
            ) : (
              <div style={grid}>
                {filtered.map((item, i) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    index={i}
                    onClick={setSelected}
                    onToast={setToast}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Lightbox */}
      {selected && (
        <Lightbox item={selected} onClose={() => setSelected(null)} onToast={setToast} />
      )}

      {/* Floating page share button */}
      <button
        className="gal-share-btn"
        style={floatShareBtn}
        onClick={async () => {
          const url = `${window.location.origin}/gallery`;
          if (navigator.share) {
            try { await navigator.share({ title: 'Gallery — LaolimHeang', text: 'Check out this creative gallery!', url }); } catch (_) {}
          } else {
            await navigator.clipboard.writeText(url);
            setToast('Gallery link copied to clipboard!');
          }
        }}
        title="Share this gallery"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share Gallery
      </button>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
};

/* ══════════════════════════════════════════════
   CSS ANIMATIONS + UTILITIES
══════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateY(16px) translateX(-50%); }
    to   { opacity:1; transform:translateY(0)     translateX(-50%); }
  }

  .gal-card {
    opacity: 0;
    animation: fadeUp 0.55s ease forwards;
    transition: transform 0.12s ease-out, box-shadow 0.3s;
    cursor: pointer;
  }
  .gal-card:hover {
    box-shadow: 0 28px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.25) !important;
  }
  .gal-img-zoomed {
    transform: scale(1.1) !important;
  }
  .gal-info {
    position: relative; z-index: 10;
    transform: translateY(16px);
    opacity: 0;
    transition: transform 0.35s ease, opacity 0.35s ease;
  }
  .gal-info-visible {
    transform: translateY(0);
    opacity: 1 !important;
  }
  .gal-arrow {
    opacity: 0;
    transition: opacity 0.3s;
  }
  .gal-card:hover .gal-arrow { opacity: 1; }

  .gal-share-btn:hover {
    background: rgba(168,85,247,0.25) !important;
    border-color: rgba(168,85,247,0.5) !important;
    color: #e9d5ff !important;
  }

  .gal-skeleton {
    background: linear-gradient(90deg,
      rgba(20,20,40,0.6) 25%,
      rgba(40,40,70,0.6) 50%,
      rgba(20,20,40,0.6) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }

  @media (max-width: 640px) {
    .gal-grid { grid-template-columns: 1fr !important; }
  }
`;

/* ══════════════════════════════════════════════
   STYLE OBJECTS
══════════════════════════════════════════════ */
const page = {
  background: '#05050A',
  minHeight: '100vh',
  fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
  color: '#e2e8f0',
  overflowX: 'hidden',
};

const hero = {
  position: 'relative',
  padding: '120px 4vw 70px',
  textAlign: 'center',
  overflow: 'hidden',
};

const orb = {
  position: 'absolute',
  borderRadius: '50%',
  pointerEvents: 'none',
};

const heroBadge = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '5px 14px',
  background: 'rgba(168,85,247,0.1)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: 20,
  fontSize: 11, fontWeight: 700, color: '#c084fc',
  letterSpacing: '0.07em', textTransform: 'uppercase',
  marginBottom: 18,
};

const heroTitle = {
  fontSize: 'clamp(34px,5.5vw,62px)',
  fontWeight: 900,
  color: '#f1f5f9',
  margin: '0 0 16px',
  letterSpacing: '-0.03em',
  lineHeight: 1.12,
};

const gradientText = {
  background: 'linear-gradient(135deg,#a855f7,#6366f1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const heroSub = {
  color: '#64748b',
  fontSize: 17,
  lineHeight: 1.65,
  margin: '0 auto',
  maxWidth: 540,
};

const content = {
  maxWidth: 1600,
  margin: '0 auto',
  padding: '0 4vw 100px',
};

const filterWrap = {
  display: 'flex', flexWrap: 'wrap', gap: 10,
  justifyContent: 'center',
  marginBottom: 44,
};

const filterBtn = {
  padding: '8px 22px',
  borderRadius: 12,
  border: '1px solid',
  fontSize: 13, fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  backdropFilter: 'blur(4px)',
  fontFamily: 'inherit',
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
  gap: 28,
};

const card = {
  position: 'relative',
  height: 320,
  borderRadius: 20,
  background: 'rgba(12,12,26,0.7)',
  border: '1px solid rgba(255,255,255,0.06)',
  overflow: 'hidden',
};

const cardInner = {
  position: 'absolute', inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: 20,
  overflow: 'hidden',
};

const featBadge = {
  position: 'absolute', top: 14, right: 14, zIndex: 10,
  background: 'rgba(0,0,0,0.55)',
  backdropFilter: 'blur(8px)',
  color: '#fbbf24',
  fontSize: 11, fontWeight: 700,
  padding: '4px 12px',
  borderRadius: 20,
  border: '1px solid rgba(251,191,36,0.3)',
};

const arrowIcon = {
  position: 'absolute', top: 14, right: item => item.featured ? 80 : 14,
  zIndex: 11,
  color: 'white',
};

const cardInfo = {
  paddingBottom: 30,
};

const cardTitle = {
  color: '#f1f5f9',
  fontSize: 20, fontWeight: 800,
  margin: '0 0 4px',
};

const cardCat = {
  color: '#c084fc',
  fontSize: 12, fontWeight: 600,
  margin: 0,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
};

const sBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 12px',
  background: 'rgba(168,85,247,0.12)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: 20,
  color: '#c084fc',
  fontSize: 11, fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
};

/* Lightbox */
const lb = {
  backdrop: {
    position: 'fixed', inset: 0, zIndex: 999,
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  box: {
    position: 'relative',
    background: 'rgba(10,10,24,0.97)',
    border: '1px solid rgba(168,85,247,0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: 900,
    width: '100%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 14, zIndex: 10,
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#94a3b8', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  },
  imgWrap: {
    height: '55vh',
    minHeight: 240,
    overflow: 'hidden',
    flexShrink: 0,
  },
  info: {
    padding: '20px 24px 24px',
    overflowY: 'auto',
  },
  cat: {
    display: 'inline-block',
    fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.07em',
    color: '#c084fc',
    background: 'rgba(168,85,247,0.12)',
    border: '1px solid rgba(168,85,247,0.25)',
    borderRadius: 20,
    padding: '3px 10px',
    marginBottom: 8,
  },
  title: {
    color: '#f1f5f9', fontSize: 24, fontWeight: 800,
    margin: '4px 0 0', letterSpacing: '-0.02em',
  },
  desc: {
    color: '#94a3b8', fontSize: 14, lineHeight: 1.65,
    margin: '12px 0 0',
  },
};

const toastStyle = {
  position: 'fixed', bottom: 32, left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '10px 20px',
  background: 'rgba(10,10,24,0.95)',
  border: '1px solid rgba(52,211,153,0.3)',
  borderRadius: 50,
  color: '#e2e8f0',
  fontSize: 13, fontWeight: 600,
  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
  backdropFilter: 'blur(12px)',
  animation: 'toastIn 0.3s ease',
};

const emptyState = {
  textAlign: 'center',
  color: '#64748b',
  padding: '60px 0',
  fontSize: 16,
};

const floatShareBtn = {
  position: 'fixed', bottom: 28, right: 28, zIndex: 100,
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '12px 20px',
  background: 'rgba(10,10,24,0.92)',
  border: '1px solid rgba(168,85,247,0.25)',
  borderRadius: 50,
  color: '#c084fc',
  fontSize: 13, fontWeight: 700,
  cursor: 'pointer',
  backdropFilter: 'blur(14px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  transition: 'all 0.2s',
  fontFamily: "'Inter',sans-serif",
};

export default Gallery;
