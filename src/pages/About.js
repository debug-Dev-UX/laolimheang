import React, { useState, useEffect, useContext, useRef } from 'react';
import { subscribeToCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

const TECH_COLORS = {
  React:'#61dafb',Vue:'#42b883',Angular:'#dd0031','Node.js':'#68a063',
  Python:'#3776ab',TypeScript:'#3178c6',JavaScript:'#f7df1e',
  Firebase:'#ffca28',MongoDB:'#47a248',TailwindCSS:'#38bdf8',
  'Next.js':'#ffffff',Docker:'#2496ed',GraphQL:'#e10098',
  HTML:'#e34f26',CSS:'#1572b6',PHP:'#777bb4',
};
const tc = (t) => TECH_COLORS[t] || '#6366f1';

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

// --- Sorting Algorithm Visualizer (Bubble Sort) ---
const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [compareIndex, setCompareIndex] = useState(-1);

  useEffect(() => {
    // Initialize random array
    const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 10);
    setArray(newArr);

    let arr = [...newArr];
    let i = 0;
    let j = 0;
    
    const interval = setInterval(() => {
      if (i < arr.length) {
        if (j < arr.length - i - 1) {
          setActiveIndex(j);
          setCompareIndex(j + 1);
          if (arr[j] > arr[j + 1]) {
            // Swap
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
          setArray([...arr]);
          j++;
        } else {
          j = 0;
          i++;
        }
      } else {
        // Reset and sort again
        i = 0;
        j = 0;
        arr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 80) + 10);
        setArray([...arr]);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '120px', gap: '4px', padding: '0 20px', marginTop: '20px' }}>
      {array.map((val, idx) => (
        <div 
          key={idx} 
          style={{ 
            flex: 1, 
            background: idx === activeIndex || idx === compareIndex ? '#f43f5e' : 'linear-gradient(to top, #6366f1, #8b5cf6)', 
            height: `${val}%`,
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.1s ease, background 0.1s ease',
            boxShadow: idx === activeIndex || idx === compareIndex ? '0 0 10px #f43f5e' : 'none'
          }}
        />
      ))}
    </div>
  );
};


const About = () => {
  const [mounted, setMounted] = useState(false);
  const [skills, setSkills] = useState([]);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = subscribeToCollection(COLLECTIONS.SKILLS, (data) => {
      setSkills(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });
    return () => unsubscribe();
  }, []);

  // Split dynamically provided aboutText into paragraphs
  const aboutParagraphs = settings?.aboutText 
    ? settings.aboutText.split('\\n').filter(p => p.trim() !== '')
    : [
        "I am a passionate Full-Stack Developer with years of experience building modern, responsive, and scalable web applications. I thrive at the intersection of design and engineering, crafting premium digital experiences.",
        "My goal is to solve complex problems with elegant, efficient code and intuitive user interfaces. Whether it's a sleek landing page, a complex dashboard, or a robust backend API, I bring dedication and excellence to every project."
      ];

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Header */}
      <section style={s.headerSec}>
        <div style={{...s.orb, width:'500px', height:'500px', background:'radial-gradient(circle,rgba(236,72,153,0.1),transparent 70%)', top:'-100px', right:'-100px'}} />
        <div style={{...s.headerContent, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)'}}>
          <h1 style={s.title}>About <span style={s.gradientText}>Me</span></h1>
        </div>
      </section>

      {/* Content */}
      <section style={{...s.contentSec, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '0.1s'}}>
        
        {/* Intro Grid */}
        <div style={s.introGrid} className="intro-grid">
          <div style={s.introTextWrap}>
            <h2 style={s.introTitle}>Hello, I'm {settings?.siteName || 'LaolimHeang'}.</h2>
            {aboutParagraphs.map((p, i) => (
              <p key={i} style={s.introText}>{p}</p>
            ))}
            <div style={{marginTop:'32px'}}>
              <Link to="/contact" style={s.ctaBtn} className="hover-lift">Let's work together →</Link>
            </div>
          </div>
          
          <div style={s.introVisual}>
            <TiltCard style={s.visualCard}>
              <div style={s.cardDotWrap}>
                <div style={{...s.dot, background:'#ff5f57'}} />
                <div style={{...s.dot, background:'#ffbd2e'}} />
                <div style={{...s.dot, background:'#28c840'}} />
                <span style={s.cardFile}>O(N log N) - QuickSort</span>
              </div>
              <div style={s.cardBody}>
                <div style={s.codeLine}><span style={s.codePink}>import</span> {'{'} <span style={s.codeBlue}>passion</span>, <span style={s.codeBlue}>dedication</span> {'}'} <span style={s.codePink}>from</span> <span style={s.codeGreen}>'developer'</span>;</div>
                <div style={s.codeLine}><span style={s.codePink}>const</span> <span style={s.codeYellow}>{settings?.siteName || 'LaolimHeang'}</span> <span style={s.codePink}>=</span> <span style={s.codeBlue}>new</span> <span style={s.codeYellow}>Developer</span>();</div>
                <div style={s.codeLine}>{settings?.siteName || 'LaolimHeang'}.<span style={s.codeBlue}>optimize</span>(<span style={s.codeGreen}>'Time Complexity'</span>);</div>
                
                {/* Visualizer */}
                <SortingVisualizer />
                
                <div style={{...s.codeLine, marginTop:'20px'}}><span style={s.codePink}>while</span> (true) {'{'}</div>
                <div style={{...s.codeLine, paddingLeft:'16px'}}>memory.<span style={s.codeBlue}>allocate</span>();</div>
                <div style={{...s.codeLine, paddingLeft:'16px'}}>logic.<span style={s.codeBlue}>execute</span>();</div>
                <div style={s.codeLine}>{'}'}</div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Skills Section */}
        <div style={s.skillsWrap}>
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <h2 style={s.skillsTitle}>My Arsenal</h2>
            <p style={s.skillsSub}>Technologies and data structures I use to engineer robust solutions.</p>
          </div>
          
          <div style={s.skillsGrid}>
            {skills.map((skillGroup, i) => (
              <TiltCard key={skillGroup.category} className="skill-card" style={{...s.skillGroup, animationDelay:`${0.2 + (i * 0.1)}s`}}>
                <h3 style={s.skillCatTitle}>{skillGroup.category}</h3>
                <div style={s.skillBadgeWrap}>
                  {(skillGroup.items || []).map(item => (
                    <span key={item} style={{
                      ...s.skillBadge,
                      background: `${tc(item)}15`,
                      color: tc(item),
                      border: `1px solid ${tc(item)}30`
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code&display=swap');
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .skill-card { opacity: 0; animation: fadeUp 0.6s ease forwards; }
  .skill-card:hover { border-color: rgba(236,72,153,0.3) !important; box-shadow: 0 16px 32px rgba(0,0,0,0.3) !important; }
  .hover-lift { transition: all 0.2s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(236,72,153,0.4); }
  @media (max-width: 900px) {
    .intro-grid { grid-template-columns: 1fr !important; }
  }
`;

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },
  headerSec: { position:'relative', padding:'120px 4vw 20px', textAlign:'center', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  headerContent: { position:'relative', zIndex:1, maxWidth:'640px', margin:'0 auto', transition:'all 0.8s ease' },
  title: { fontSize:'clamp(36px,5vw,56px)', fontWeight:'800', color:'#f1f5f9', margin:0, letterSpacing:'-0.02em' },
  gradientText: { background:'linear-gradient(135deg,#ec4899,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  
  contentSec: { maxWidth:'1600px', margin:'0 auto', padding:'40px 4vw 100px', transition:'all 0.8s ease' },
  
  introGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'center', marginBottom:'100px' },
  introTextWrap: { flex:1 },
  introTitle: { fontSize:'32px', fontWeight:'800', color:'#f1f5f9', margin:'0 0 24px' },
  introText: { fontSize:'16px', lineHeight:'1.75', color:'#94a3b8', margin:'0 0 20px', letterSpacing:'0.01em' },
  ctaBtn: { display:'inline-flex', padding:'14px 28px', background:'linear-gradient(135deg,#ec4899,#8b5cf6)', borderRadius:'12px', color:'white', fontSize:'15px', fontWeight:'700', textDecoration:'none', boxShadow:'0 8px 25px rgba(236,72,153,0.25)' },
  
  introVisual: { flex:1 },
  visualCard: { background:'rgba(12,12,26,0.6)', border:'1px solid rgba(236,72,153,0.15)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 24px 50px rgba(0,0,0,0.5)', backdropFilter:'blur(10px)' },
  cardDotWrap: { display:'flex', alignItems:'center', gap:'8px', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.02)' },
  dot: { width:'12px', height:'12px', borderRadius:'50%' },
  cardFile: { color:'#64748b', fontSize:'12px', marginLeft:'auto', fontFamily:'monospace', fontWeight:'600' },
  cardBody: { padding:'24px 20px', fontFamily:"'Fira Code', monospace", fontSize:'14px', lineHeight:'1.8', color:'#cbd5e1' },
  codeLine: { margin:0 },
  codePink: { color:'#ff79c6' },
  codeBlue: { color:'#8be9fd' },
  codeGreen: { color:'#50fa7b' },
  codeYellow: { color:'#f1fa8c' },
  
  skillsWrap: { position:'relative' },
  skillsTitle: { fontSize:'36px', fontWeight:'800', color:'#f1f5f9', margin:'0 0 12px', textShadow:'0 0 20px rgba(255,255,255,0.1)' },
  skillsSub: { color:'#64748b', fontSize:'16px', margin:0 },
  skillsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'24px' },
  skillGroup: { background:'rgba(12,12,26,0.5)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'20px', padding:'28px', transition:'all 0.3s', backdropFilter:'blur(8px)' },
  skillCatTitle: { color:'#f1f5f9', fontSize:'18px', fontWeight:'700', margin:'0 0 20px' },
  skillBadgeWrap: { display:'flex', flexWrap:'wrap', gap:'10px' },
  skillBadge: { padding:'6px 14px', borderRadius:'8px', fontSize:'13px', fontWeight:'600', backdropFilter:'blur(4px)' }
};

export default About;
