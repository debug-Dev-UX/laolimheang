import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';

const TECH_COLORS = {
  React:'#61dafb',Vue:'#42b883',Angular:'#dd0031','Node.js':'#68a063',
  Python:'#3776ab',TypeScript:'#3178c6',JavaScript:'#f7df1e',
  Firebase:'#ffca28',MongoDB:'#47a248',TailwindCSS:'#38bdf8',
  'Next.js':'#ffffff',Docker:'#2496ed',GraphQL:'#e10098',
};
const tc = (t) => TECH_COLORS[t] || '#818cf8';

// --- Data Structure Visualizer Component (Canvas) ---
const NetworkVisualizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = canvas.parentElement.clientHeight;

    const nodes = [];
    const numNodes = 35;
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.5,
      });
    }

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - dist/120})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#818cf8';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

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


const Home = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    setMounted(true);
    Promise.allSettled([
      getCollection(COLLECTIONS.PROJECTS),
      getCollection(COLLECTIONS.SERVICES),
    ]).then(([pr, sr]) => {
      if (pr.status === 'fulfilled') setProjects(pr.value.filter(p => p.featured).slice(0, 3));
      if (sr.status === 'fulfilled') setServices(sr.value.filter(s => s.featured).slice(0, 3));
    });
  }, []);

  const stats = settings ? [
    { value: settings.stat1Value || '3+', label: settings.stat1Label || 'Years Experience' },
    { value: settings.stat2Value || '20+', label: settings.stat2Label || 'Projects Built' },
    { value: settings.stat3Value || '100%', label: settings.stat3Label || 'Client Satisfaction' },
  ] : [];

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── HERO ── */}
      <section style={s.hero}>
        {/* Abstract Data Structure Background */}
        <div style={{position:'absolute', inset:0, zIndex:0, opacity:0.6}}>
          <NetworkVisualizer />
        </div>
        
        {/* Orbs */}
        <div style={{...s.orb, width:'500px', height:'500px', background:'radial-gradient(circle,rgba(99,102,241,0.15),transparent 70%)', top:'-100px', left:'-150px'}} />
        <div style={{...s.orb, width:'400px', height:'400px', background:'radial-gradient(circle,rgba(139,92,246,0.12),transparent 70%)', top:'50px', right:'-100px'}} />

        <div style={s.heroContent}>
          <div style={{...s.heroBadge, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition:'all 0.6s ease'}}>
            <span style={s.heroBadgeDot} />
            Data-Driven & Algorithmic Excellence
          </div>

          <h1 style={{...s.heroTitle, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition:'all 0.7s ease 0.1s'}}>
            Hi, I'm <span style={s.heroGradient}>{settings?.siteName || 'LaolimHeang'}</span>
            <br />Full-Stack Engineer
          </h1>

          <p style={{...s.heroSub, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition:'all 0.7s ease 0.2s'}}>
            I architect and engineer premium digital systems — focusing on scalability, robust data structures, and pixel-perfect interfaces. Turning complex logic into elegant solutions.
          </p>

          <div style={{...s.heroActions, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition:'all 0.7s ease 0.3s'}}>
            <Link to="/portfolio" style={s.heroCta} className="hero-cta">
              Explore Architecture
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/contact" style={s.heroGhost} className="hero-ghost">
              Initialize Connection
            </Link>
          </div>

          {/* Dynamic Stats */}
          <div style={{...s.heroStats, opacity: mounted ? 1 : 0, transition:'all 0.7s ease 0.5s'}}>
            {stats.map((stat, i) => (
              <div key={i} style={s.statItem}>
                <span style={s.statVal}>{stat.value}</span>
                <span style={s.statLbl}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual: Graph/Code Card Hybrid */}
        <TiltCard style={{...s.heroVisual, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition:'all 0.9s ease 0.2s'}}>
          <div style={s.codeCard}>
            <div style={s.cardHeader}>
              <div style={{...s.dot, background:'#ff5f57'}} />
              <div style={{...s.dot, background:'#ffbd2e'}} />
              <div style={{...s.dot, background:'#28c840'}} />
              <span style={s.cardFile}>binary_tree.ts</span>
            </div>
            <div style={s.code}>
              <div><span style={s.kw}>class</span> <span style={s.fn}>Node</span>&lt;<span style={s.key}>T</span>&gt; {'{'}</div>
              <div style={{paddingLeft:'16px'}}><span style={s.kw}>constructor</span>(<span style={s.kw}>public</span> value: <span style={s.key}>T</span>) {'{}'}</div>
              <div style={{paddingLeft:'16px'}}><span style={s.kw}>public</span> left: <span style={s.fn}>Node</span>&lt;<span style={s.key}>T</span>&gt; | <span style={s.key}>null</span> = <span style={s.key}>null</span>;</div>
              <div style={{paddingLeft:'16px'}}><span style={s.kw}>public</span> right: <span style={s.fn}>Node</span>&lt;<span style={s.key}>T</span>&gt; | <span style={s.key}>null</span> = <span style={s.key}>null</span>;</div>
              <div>{'}'}</div>
              <br/>
              <div><span style={s.kw}>const</span> <span style={s.fn}>engineer</span> = <span style={s.kw}>new</span> <span style={s.fn}>Node</span>(</div>
              <div style={{paddingLeft:'16px'}}><span style={s.str}>"Problem Solver"</span></div>
              <div>);</div>
              <div style={{marginTop:'8px', color:'#334155'}}>
                <span style={s.kw}>export default</span> engineer;
                <span style={s.cursor}>|</span>
              </div>
            </div>
          </div>
          {/* Floating tech badges */}
          {['Algorithms','Architecture','System Design','O(1)'].map((tech, i) => (
            <div key={tech} style={{...s.floatBadge, ...floatPositions[i]}}>
              <span style={{color: '#c084fc', fontSize:'10px', fontWeight:'700'}}>{tech}</span>
            </div>
          ))}
        </TiltCard>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      {projects.length > 0 && (
        <section style={s.section}>
          <div style={s.sectionHead}>
            <span style={s.sectionLabel}>Execution</span>
            <h2 style={s.sectionTitle}>Featured Architectures</h2>
            <p style={s.sectionSub}>A selection of my best engineered systems</p>
          </div>
          <div style={s.projectGrid}>
            {projects.map((proj, i) => {
              const techs = proj.technologies || [];
              const grad = gradients[i % gradients.length];
              return (
                <TiltCard key={proj.id} className="proj-card" style={s.projCard}>
                  {proj.imageUrl ? (
                    <div style={{...s.projBanner, background: `url(${proj.imageUrl}) center/cover`}}>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent,rgba(12,12,26,0.95))',pointerEvents:'none'}} />
                      {proj.featured && <span style={s.featBadge}>★ Featured</span>}
                    </div>
                  ) : (
                    <div style={{...s.projBanner, background: grad}}>
                      <span style={s.projInitial}>{proj.title?.[0]?.toUpperCase()}</span>
                      {proj.featured && <span style={s.featBadge}>★ Featured</span>}
                    </div>
                  )}
                  
                  <div style={s.projBody}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px',marginBottom:'6px'}}>
                      <h3 style={s.projTitle}>{proj.title}</h3>
                      {proj.category && <span style={s.projCat}>{proj.category}</span>}
                    </div>
                    <p style={s.projDesc}>{proj.description}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginTop:'8px'}}>
                      {techs.slice(0,4).map(t => (
                        <span key={t} style={{fontSize:'10px',padding:'2px 8px',borderRadius:'20px',background:`${tc(t)}15`,color:tc(t),border:`1px solid ${tc(t)}25`,fontWeight:'600'}}>{t}</span>
                      ))}
                    </div>
                    <div style={{display:'flex',gap:'12px',marginTop:'12px'}}>
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={s.projLink}>Compile & Run ↗</a>}
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{...s.projLink, color:'#475569'}}>View Source ↗</a>}
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
          <div style={{textAlign:'center',marginTop:'32px'}}>
            <Link to="/portfolio" style={s.viewAllBtn} className="view-all-btn">Inspect All Nodes →</Link>
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      {services.length > 0 && (
        <section style={{...s.section, background:'rgba(99,102,241,0.03)', borderTop:'1px solid rgba(99,102,241,0.06)', borderBottom:'1px solid rgba(99,102,241,0.06)', padding:'80px 24px'}}>
          <div style={s.sectionHead}>
            <span style={s.sectionLabel}>Operations</span>
            <h2 style={s.sectionTitle}>Computational Services</h2>
            <p style={s.sectionSub}>Optimized solutions for complex requirements</p>
          </div>
          <div style={s.serviceGrid}>
            {services.map((svc, i) => (
              <TiltCard key={svc.id} className="svc-card" style={s.svcCard}>
                <div style={{...s.svcIcon, background: `${svcColors[i % svcColors.length]}18`, border:`1px solid ${svcColors[i % svcColors.length]}30`}}>
                  <span style={{color: svcColors[i % svcColors.length], fontSize:'22px'}}>{svcEmoji[i % svcEmoji.length]}</span>
                </div>
                <h3 style={s.svcTitle}>{svc.title}</h3>
                <p style={s.svcDesc}>{svc.description}</p>
                <div style={{marginTop:'auto'}}>
                  {(svc.features || []).slice(0,3).map((f,fi) => (
                    <div key={fi} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                      <span style={{color:`${svcColors[i % svcColors.length]}`,fontSize:'12px'}}>O(1)</span>
                      <span style={{color:'#64748b',fontSize:'12.5px'}}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'16px',paddingTop:'14px',borderTop:'1px solid rgba(99,102,241,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{color:'#34d399',fontWeight:'700',fontSize:'18px'}}>${Number(svc.price||0).toLocaleString()}<span style={{color:'#334155',fontSize:'11px',fontWeight:'400'}}>{svc.currency&&svc.currency!=='USD'?` ${svc.currency}`:''}</span></span>
                  <Link to="/contact" style={{fontSize:'13px',fontWeight:'600',color:svcColors[i%svcColors.length],textDecoration:'none'}}>Execute →</Link>
                </div>
              </TiltCard>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'32px'}}>
            <Link to="/services" style={s.viewAllBtn} className="view-all-btn">View All Operations →</Link>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section style={s.ctaBanner}>
        <div style={s.ctaOrb} />
        <h2 style={s.ctaTitle}>Ready to Deploy?</h2>
        <p style={s.ctaSub}>Let's compile your ideas into a scalable reality.</p>
        <Link to="/contact" style={s.ctaBtn} className="hero-cta">
          Initialize Project →
        </Link>
      </section>

    </div>
  );
};

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#10b981,#059669)',
];
const svcColors = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ec4899'];
const svcEmoji = ['⚡','⚙️','🕸️','☁️','🛡️','📊'];
const floatPositions = [
  { top:'-12px', left:'50px' },
  { bottom:'-10px', right:'20px' },
  { top:'50%', right:'-14px' },
  { bottom:'30px', left:'-14px' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .hero-cta:hover { box-shadow:0 12px 32px rgba(99,102,241,0.45) !important; }
  .hero-ghost:hover { background:rgba(99,102,241,0.1) !important; color:#818cf8 !important; }
  .proj-card:hover { border-color:rgba(99,102,241,0.4) !important; box-shadow:0 25px 60px rgba(0,0,0,0.5) !important; }
  .svc-card { transition: all 0.3s ease !important; }
  .svc-card:hover { border-color:rgba(99,102,241,0.4) !important; transform: translateY(-8px) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
  .view-all-btn:hover { background:rgba(99,102,241,0.15) !important; color:#818cf8 !important; }
`;

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },

  // Hero
  hero: { position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'40px', padding:'80px 4vw', maxWidth:'1600px', margin:'0 auto', flexWrap:'wrap', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none', zIndex:0 },
  heroContent: { flex:'1', minWidth:'320px', maxWidth:'580px', position:'relative', zIndex:2 },
  heroBadge: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:'20px', fontSize:'13px', fontWeight:'500', color:'#34d399', marginBottom:'24px', backdropFilter:'blur(5px)' },
  heroBadgeDot: { width:'7px', height:'7px', borderRadius:'50%', background:'#34d399', boxShadow:'0 0 8px #34d399', animation:'blink 2s infinite' },
  heroTitle: { fontSize:'clamp(36px,5vw,62px)', fontWeight:'900', lineHeight:'1.1', color:'#f1f5f9', margin:'0 0 20px', letterSpacing:'-0.03em' },
  heroGradient: { background:'linear-gradient(135deg,#6366f1,#a78bfa,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  heroSub: { color:'#94a3b8', fontSize:'17px', lineHeight:'1.65', margin:'0 0 32px', maxWidth:'480px' },
  heroActions: { display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'48px' },
  heroCta: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'13px 26px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'12px', color:'white', fontWeight:'700', fontSize:'15px', textDecoration:'none', boxShadow:'0 4px 20px rgba(99,102,241,0.4)', transition:'all 0.25s' },
  heroGhost: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'13px 26px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:'12px', color:'#94a3b8', fontWeight:'600', fontSize:'15px', textDecoration:'none', transition:'all 0.25s', backdropFilter:'blur(10px)' },
  heroStats: { display:'flex', gap:'32px', flexWrap:'wrap' },
  statItem: { display:'flex', flexDirection:'column', gap:'2px' },
  statVal: { fontSize:'26px', fontWeight:'800', color:'#f1f5f9', letterSpacing:'-0.02em', textShadow:'0 0 20px rgba(255,255,255,0.2)' },
  statLbl: { fontSize:'12px', color:'#64748b', fontWeight:'500', textTransform:'uppercase', letterSpacing:'0.05em' },

  // Code card
  heroVisual: { flex:'1', minWidth:'300px', maxWidth:'480px', position:'relative', zIndex:2 },
  codeCard: { background:'rgba(10,10,25,0.75)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:'16px', overflow:'hidden', boxShadow:'0 30px 60px rgba(0,0,0,0.6)', backdropFilter:'blur(16px)' },
  cardHeader: { display:'flex', alignItems:'center', gap:'6px', padding:'12px 16px', background:'rgba(99,102,241,0.08)', borderBottom:'1px solid rgba(99,102,241,0.1)' },
  dot: { width:'11px', height:'11px', borderRadius:'50%' },
  cardFile: { color:'#64748b', fontSize:'12px', marginLeft:'8px', fontFamily:'monospace' },
  code: { padding:'20px', fontFamily:"'Fira Code',monospace", fontSize:'13px', lineHeight:'1.7', color:'#94a3b8' },
  kw: { color:'#c084fc' }, // purple
  fn: { color:'#60a5fa' }, // blue
  key: { color:'#34d399' }, // green
  str: { color:'#fbbf24' }, // yellow
  cursor: { color:'#818cf8', animation:'blink 1s infinite', marginLeft:'2px' },
  floatBadge: { position:'absolute', padding:'5px 12px', background:'rgba(10,10,25,0.8)', border:'1px solid rgba(192,132,252,0.3)', borderRadius:'20px', backdropFilter:'blur(10px)', animation:'float 3s ease-in-out infinite', boxShadow:'0 10px 20px rgba(0,0,0,0.3)' },

  // Sections
  section: { padding:'100px 4vw', maxWidth:'1600px', margin:'0 auto', position:'relative', zIndex:2 },
  sectionHead: { textAlign:'center', marginBottom:'50px' },
  sectionLabel: { fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.12em', color:'#8b5cf6', display:'block', marginBottom:'10px' },
  sectionTitle: { fontSize:'clamp(28px,4vw,42px)', fontWeight:'800', color:'#f1f5f9', margin:'0 0 12px', letterSpacing:'-0.02em' },
  sectionSub: { color:'#64748b', fontSize:'16px', margin:0 },

  // Projects
  projectGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'24px' },
  projCard: { background:'rgba(12,12,26,0.6)', border:'1px solid rgba(99,102,241,0.1)', borderRadius:'18px', overflow:'hidden', display:'flex', flexDirection:'column', backdropFilter:'blur(10px)' },
  projBanner: { height:'140px', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' },
  projInitial: { fontSize:'42px', fontWeight:'900', color:'rgba(255,255,255,0.9)', textShadow:'0 2px 10px rgba(0,0,0,0.3)', zIndex:1 },
  featBadge: { position:'absolute', top:'10px', right:'10px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', color:'#fbbf24', fontSize:'10px', fontWeight:'700', padding:'3px 9px', borderRadius:'20px', border:'1px solid rgba(251,191,36,0.4)', zIndex:2 },
  projBody: { padding:'18px', flex:1, display:'flex', flexDirection:'column', zIndex:1 },
  projTitle: { color:'#f1f5f9', fontSize:'16px', fontWeight:'700', margin:0, letterSpacing:'-0.01em' },
  projCat: { fontSize:'10px', fontWeight:'600', padding:'2px 9px', borderRadius:'20px', background:'rgba(99,102,241,0.12)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.2)', whiteSpace:'nowrap', flexShrink:0 },
  projDesc: { color:'#64748b', fontSize:'13px', lineHeight:'1.55', margin:'8px 0 0', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  projLink: { fontSize:'13px', fontWeight:'600', color:'#a78bfa', textDecoration:'none' },

  // Services
  serviceGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px' },
  svcCard: { background:'rgba(10,10,24,0.6)', border:'1px solid rgba(99,102,241,0.1)', borderRadius:'18px', padding:'24px', display:'flex', flexDirection:'column', gap:'10px', backdropFilter:'blur(10px)' },
  svcIcon: { width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'4px', boxShadow:'0 4px 15px rgba(0,0,0,0.2)' },
  svcTitle: { color:'#f1f5f9', fontSize:'17px', fontWeight:'700', margin:0 },
  svcDesc: { color:'#64748b', fontSize:'13px', lineHeight:'1.55', margin:0 },

  // View all
  viewAllBtn: { display:'inline-flex', alignItems:'center', gap:'6px', padding:'10px 24px', background:'transparent', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'10px', color:'#94a3b8', fontSize:'14px', fontWeight:'600', textDecoration:'none', transition:'all 0.2s' },

  // CTA
  ctaBanner: { position:'relative', textAlign:'center', padding:'100px 24px', overflow:'hidden', background:'linear-gradient(180deg,transparent,rgba(99,102,241,0.06),transparent)' },
  ctaOrb: { position:'absolute', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' },
  ctaTitle: { fontSize:'clamp(28px,4vw,48px)', fontWeight:'900', color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.02em', position:'relative', zIndex:1 },
  ctaSub: { color:'#94a3b8', fontSize:'17px', margin:'0 0 36px', position:'relative', zIndex:1 },
  ctaBtn: { display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 32px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:'14px', color:'white', fontWeight:'700', fontSize:'16px', textDecoration:'none', boxShadow:'0 4px 20px rgba(99,102,241,0.4)', transition:'all 0.25s', position:'relative', zIndex:1 },

};

export default Home;
