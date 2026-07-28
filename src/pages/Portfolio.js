import React, { useState, useEffect, useRef } from 'react';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';

const TECH_COLORS = {
  React:'#61dafb',Vue:'#42b883',Angular:'#dd0031','Node.js':'#68a063',
  Python:'#3776ab',TypeScript:'#3178c6',JavaScript:'#f7df1e',
  Firebase:'#ffca28',MongoDB:'#47a248',TailwindCSS:'#38bdf8',
  'Next.js':'#ffffff',Docker:'#2496ed',GraphQL:'#e10098',
  HTML:'#e34f26',CSS:'#1572b6',PHP:'#777bb4',
};
const tc = (t) => TECH_COLORS[t] || '#818cf8';

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#10b981,#059669)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
];

// --- Tilt Card Component ---
const TiltCard = ({ children, style, className }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div 
      ref={cardRef} 
      className={className}
      style={{ ...style, transition: 'transform 0.1s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};


const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getCollection(COLLECTIONS.PROJECTS);
      setProjects(data.sort((a, b) => b.order - a.order));
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Header */}
      <section style={s.headerSec}>
        <div style={{...s.orb, width:'400px', height:'400px', background:'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)', top:'-100px', right:'-100px'}} />
        <div style={{...s.headerContent, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)'}}>
          <h1 style={s.title}>System <span style={s.gradientText}>Architecture</span></h1>
          <p style={s.subtitle}>A collection of engineered applications, scalable architectures, and advanced data integrations.</p>
        </div>
      </section>

      {/* Content */}
      <section style={s.contentSec}>
        {loading ? (
          <div style={s.loaderWrap}><div style={s.spinner} /></div>
        ) : (
          <>
            {/* Filters */}
            {categories.length > 1 && (
              <div style={s.filterWrap}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)} style={{
                    ...s.filterBtn,
                    background: filter === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: filter === cat ? '#818cf8' : '#64748b',
                    borderColor: filter === cat ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)'
                  }}>
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={s.emptyState}>No architectures found matching criteria.</div>
            ) : (
              <div style={s.grid}>
                {filtered.map((proj, i) => {
                  const techs = proj.technologies || [];
                  const grad = gradients[i % gradients.length];
                  return (
                    <TiltCard key={proj.id} className="proj-card" style={{...s.card, animationDelay: `${i * 0.1}s`}}>
                      {proj.imageUrl ? (
                        <div style={{...s.cardBanner, background: `url(${proj.imageUrl}) center/cover`}}>
                          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent,rgba(12,12,26,0.95))',pointerEvents:'none'}} />
                          {proj.featured && <span style={s.featBadge}>★ Featured</span>}
                        </div>
                      ) : (
                        <div style={{...s.cardBanner, background: grad}}>
                          <span style={s.cardInitial}>{proj.title?.[0]?.toUpperCase()}</span>
                          {proj.featured && <span style={s.featBadge}>★ Featured</span>}
                        </div>
                      )}
                      
                      <div style={s.cardBody}>
                        <div style={s.cardHead}>
                          <h3 style={s.cardTitle}>{proj.title}</h3>
                          {proj.category && <span style={s.cardCat}>{proj.category}</span>}
                        </div>
                        <p style={s.cardDesc}>{proj.description}</p>
                        <div style={s.techRow}>
                          {techs.map(t => (
                            <span key={t} style={{fontSize:'10px',padding:'3px 10px',borderRadius:'20px',background:`${tc(t)}15`,color:tc(t),border:`1px solid ${tc(t)}25`,fontWeight:'600'}}>{t}</span>
                          ))}
                        </div>
                        <div style={s.cardLinks}>
                          {proj.liveUrl && (
                            <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={s.linkPrimary} className="hover-lift">
                              Execute Runtime ↗
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={s.linkGhost} className="hover-lift">
                              View Source ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .proj-card { opacity: 0; animation: fadeUp 0.6s ease forwards; }
  .proj-card:hover { border-color: rgba(99,102,241,0.3) !important; box-shadow: 0 30px 60px rgba(0,0,0,0.5) !important; }
  .hover-lift { transition: transform 0.2s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
  @media (max-width: 768px) {
    .grid-container { grid-template-columns: 1fr !important; }
  }
`;

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },
  headerSec: { position:'relative', padding:'120px 4vw 60px', textAlign:'center', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  headerContent: { position:'relative', zIndex:1, maxWidth:'700px', margin:'0 auto', transition:'all 0.8s ease' },
  title: { fontSize:'clamp(36px,5vw,56px)', fontWeight:'900', color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.03em' },
  gradientText: { background:'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  subtitle: { color:'#64748b', fontSize:'17px', lineHeight:'1.6', margin:0 },
  
  contentSec: { maxWidth:'1600px', margin:'0 auto', padding:'0 4vw 100px' },
  loaderWrap: { display:'flex', justifyContent:'center', padding:'80px 0' },
  spinner: { width:'32px', height:'32px', border:'3px solid rgba(99,102,241,0.2)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 1s linear infinite' },
  
  filterWrap: { display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'center', marginBottom:'40px' },
  filterBtn: { padding:'8px 20px', borderRadius:'12px', border:'1px solid', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.2s', backdropFilter:'blur(4px)' },
  
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'32px' },
  card: { background:'rgba(12,12,26,0.5)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'24px', overflow:'hidden', display:'flex', flexDirection:'column', transition:'all 0.3s', backdropFilter:'blur(10px)' },
  cardBanner: { height:'180px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
  cardInitial: { fontSize:'48px', fontWeight:'900', color:'rgba(255,255,255,0.9)', textShadow:'0 2px 15px rgba(0,0,0,0.3)', zIndex:1 },
  featBadge: { position:'absolute', top:'14px', right:'14px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', color:'#fbbf24', fontSize:'11px', fontWeight:'700', padding:'4px 12px', borderRadius:'20px', border:'1px solid rgba(251,191,36,0.3)', zIndex:2 },
  cardBody: { padding:'28px', flex:1, display:'flex', flexDirection:'column', zIndex:1 },
  cardHead: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'12px' },
  cardTitle: { color:'#f1f5f9', fontSize:'22px', fontWeight:'800', margin:0, letterSpacing:'-0.01em' },
  cardCat: { fontSize:'11px', fontWeight:'600', padding:'4px 12px', borderRadius:'20px', background:'rgba(99,102,241,0.12)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)', whiteSpace:'nowrap', flexShrink:0 },
  cardDesc: { color:'#94a3b8', fontSize:'14px', lineHeight:'1.65', margin:'0 0 20px', flex:1 },
  techRow: { display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'24px' },
  cardLinks: { display:'flex', gap:'12px', marginTop:'auto', paddingTop:'20px', borderTop:'1px solid rgba(255,255,255,0.05)' },
  linkPrimary: { flex:1, display:'flex', justifyContent:'center', alignItems:'center', padding:'12px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'12px', color:'white', fontSize:'14px', fontWeight:'700', textDecoration:'none' },
  linkGhost: { flex:1, display:'flex', justifyContent:'center', alignItems:'center', padding:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#94a3b8', fontSize:'14px', fontWeight:'600', textDecoration:'none', backdropFilter:'blur(4px)' },
  
  emptyState: { textAlign:'center', color:'#64748b', padding:'60px 0', fontSize:'16px' }
};

export default Portfolio;
