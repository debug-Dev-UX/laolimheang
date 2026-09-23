import React, { useState, useEffect, useRef, useContext, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Box } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { HomePageSkeleton } from '../components/common/Skeleton';
import CyberHUD from '../components/common/CyberHUD';
import { FloatingWireIcosahedron, FloatingGlowOctahedron, FloatingCyberRing } from '../components/three/FloatingShapes';

const TECH_COLORS = {
  React:'#61dafb',Vue:'#42b883',Angular:'#dd0031','Node.js':'#68a063',
  Python:'#3776ab',TypeScript:'#3178c6',JavaScript:'#f7df1e',
  Firebase:'#ffca28',MongoDB:'#47a248',TailwindCSS:'#38bdf8',
  'Next.js':'#ffffff',Docker:'#2496ed',GraphQL:'#e10098',
};
const tc = (t) => TECH_COLORS[t] || '#818cf8';

// Smooth Camera Parallax Rig
function HeroCameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 0.35 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Orbiting Data Satellite along a ring trajectory
const OrbitingSatellite = ({ radius, speed, color = '#38bdf8', size = 0.08, tilt = [0, 0, 0] }) => {
  const satRef = useRef();
  useFrame((state) => {
    if (satRef.current) {
      const t = state.clock.elapsedTime * speed;
      satRef.current.position.x = Math.cos(t) * radius;
      satRef.current.position.y = Math.sin(t) * radius;
      satRef.current.rotation.x = t * 2.2;
      satRef.current.rotation.y = t * 3.1;
    }
  });

  return (
    <group rotation={tilt}>
      <mesh ref={satRef}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
};

// 3D Holographic Cyber Torus Knot & Orbiting Data Rings
const HolographicCyberTorusKnot = () => {
  const knotRef = useRef();
  const wireKnotRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (knotRef.current) {
      knotRef.current.rotation.x = t * 0.22;
      knotRef.current.rotation.y = t * 0.32;
      knotRef.current.rotation.z = t * 0.12;
    }
    if (wireKnotRef.current) {
      wireKnotRef.current.rotation.x = t * -0.18;
      wireKnotRef.current.rotation.y = t * -0.28;
      wireKnotRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group position={[2.7, 0.15, -1.0]}>
      <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.85}>
        {/* Core Iridescent / Metallic Torus Knot */}
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[0.95, 0.28, 128, 32, 2, 3]} />
          <MeshDistortMaterial
            color="#4f46e5"
            attach="material"
            distort={0.22}
            speed={1.5}
            roughness={0.15}
            metalness={0.88}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Outer Counter-Rotating Holographic Cyber Wireframe Shell */}
        <mesh ref={wireKnotRef}>
          <torusKnotGeometry args={[1.05, 0.30, 96, 24, 2, 3]} />
          <meshStandardMaterial
            color="#06b6d4"
            wireframe
            transparent
            opacity={0.42}
            emissive="#06b6d4"
            emissiveIntensity={0.65}
          />
        </mesh>

        {/* Orbital Ring 1: Cyan Data Meridian + Satellites */}
        <FloatingCyberRing position={[0, 0, 0]} radius={2.1} tube={0.018} color="#06b6d4" speed={0.45} />
        <OrbitingSatellite radius={2.1} speed={0.9} color="#38bdf8" size={0.09} tilt={[Math.PI / 4, 0.2, 0]} />
        <OrbitingSatellite radius={2.1} speed={-0.65} color="#06b6d4" size={0.07} tilt={[Math.PI / 4, 0.2, 0]} />

        {/* Orbital Ring 2: Violet Celestial Meridian + Satellites */}
        <FloatingCyberRing position={[0, 0, 0]} radius={2.7} tube={0.015} color="#a855f7" speed={-0.35} />
        <OrbitingSatellite radius={2.7} speed={0.6} color="#c084fc" size={0.1} tilt={[-Math.PI / 3, 0.4, 0.3]} />
        <OrbitingSatellite radius={2.7} speed={-0.45} color="#818cf8" size={0.08} tilt={[-Math.PI / 3, 0.4, 0.3]} />

        {/* Orbital Ring 3: Deep Cyber Blue Outer Ring + Satellite */}
        <FloatingCyberRing position={[0, 0, 0]} radius={3.3} tube={0.012} color="#3b82f6" speed={0.25} />
        <OrbitingSatellite radius={3.3} speed={0.35} color="#60a5fa" size={0.09} tilt={[0.2, -Math.PI / 4, 0.5]} />
      </Float>
    </group>
  );
};

// 3D Hero Canvas Component
const Hero3DCanvas = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <HeroCameraRig />
        {/* Soft, balanced neon ambient & rim lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 4]} intensity={0.95} color="#818cf8" />
        <pointLight position={[-6, -4, -3]} intensity={0.55} color="#06b6d4" />
        <pointLight position={[5, -4, 2]} intensity={0.5} color="#a855f7" />
        <Stars radius={80} depth={40} count={3500} factor={3} saturation={0.6} fade speed={1.2} />

        {/* 3D Holographic Cyber Torus Knot & Orbiting Data Rings */}
        <HolographicCyberTorusKnot />

        {/* Peripheral Floating Geometric Blueprints */}
        <FloatingWireIcosahedron position={[-3.2, 1.5, -2]} scale={0.65} color="#38bdf8" speed={0.8} />
        <FloatingGlowOctahedron position={[-2.8, -1.8, -1.5]} scale={0.55} color="#10b981" speed={1.1} />
        <FloatingWireIcosahedron position={[3.8, -1.8, -2]} scale={0.7} color="#a855f7" speed={0.9} />
      </Suspense>
    </Canvas>
  );
};

// Parallax Card Component
const ParallaxCard = ({ children, className, style, delay = 0 }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 10}deg) translateZ(${mousePos.x !== 0 ? '20px' : '0'})`,
        transition: 'transform 0.2s ease-out',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

const Home3D = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { settings } = useContext(SettingsContext);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    setMounted(true);
    Promise.allSettled([
      getCollection(COLLECTIONS.PROJECTS),
      getCollection(COLLECTIONS.SERVICES),
    ]).then(([pr, sr]) => {
      if (pr.status === 'fulfilled' && pr.value && pr.value.length > 0) {
        const featured = pr.value.filter(p => p.featured);
        setProjects(featured.length > 0 ? featured.slice(0, 3) : pr.value.slice(0, 3));
      } else {
        setProjects([]);
      }
      if (sr.status === 'fulfilled' && sr.value) {
        setServices(sr.value.filter(s => s.featured).slice(0, 3));
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <HomePageSkeleton />;

  const stats = settings ? [
    { value: settings.stat1Value || '3+', label: settings.stat1Label || 'Years Experience' },
    { value: settings.stat2Value || '20+', label: settings.stat2Label || 'Projects Built' },
    { value: settings.stat3Value || '100%', label: settings.stat3Label || 'Client Satisfaction' },
  ] : [];

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── 3D HERO ── */}
      <motion.section
        style={{ ...s.hero, opacity: heroOpacity, scale: heroScale }}
      >
        {/* 3D Canvas Background */}
        <div style={{position:'absolute',inset:0,zIndex:0}}>
          <Hero3DCanvas />
        </div>

        {/* Glassmorphic Orbs */}
        <div className="glass-orb" style={{width:'600px',height:'600px',top:'-200px',left:'-200px',background:'radial-gradient(circle,rgba(99,102,241,0.3),transparent 70%)'}} />
        <div className="glass-orb" style={{width:'500px',height:'500px',bottom:'-150px',right:'-150px',background:'radial-gradient(circle,rgba(139,92,246,0.25),transparent 70%)'}} />

        <div style={s.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={s.heroBadge}
          >
            <span style={s.heroBadgeDot} />
            Available for Premium Projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={s.heroTitle}
          >
            Creative <span style={s.heroGradient}>Developer</span>
            <br />& Digital Architect
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={s.heroSub}
          >
            Crafting immersive digital experiences with cutting-edge 3D technology,
            elegant animations, and pixel-perfect interfaces that captivate and convert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={s.heroActions}
          >
            <Link to="/portfolio" className="hero-cta-3d">
              <span>Explore 3D Projects</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/project-images" className="hero-ghost-3d">
              Project Vault 🖼️
            </Link>
            <Link to="/contact" className="hero-ghost-3d">
              Let's Talk →
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={s.heroStats}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                className="stat-card"
              >
                <span style={s.statVal}>{stat.value}</span>
                <span style={s.statLbl}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── FEATURED PROJECTS ── */}
      {projects.length > 0 && (
        <section style={s.section}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={s.sectionHead}
          >
            <span style={s.sectionLabel}>Portfolio</span>
            <h2 style={s.sectionTitle}>Featured Work</h2>
            <p style={s.sectionSub}>Explore my latest creative projects</p>
          </motion.div>

          <div style={s.projectGrid}>
            {projects.map((proj, i) => {
              const techs = proj.technologies || [];
              const grad = gradients[i % gradients.length];
              return (
                <ParallaxCard key={proj.id} delay={i * 0.15} className="glass-card">
                  {proj.imageUrl ? (
                    <div style={{...s.projBanner, backgroundImage: `url(${proj.imageUrl})`}}>
                      <div className="proj-overlay" />
                      {proj.featured && <span className="feat-badge-3d">★ Featured</span>}
                    </div>
                  ) : (
                    <div style={{...s.projBanner, background: grad}}>
                      <span style={s.projInitial}>{proj.title?.[0]?.toUpperCase()}</span>
                      {proj.featured && <span className="feat-badge-3d">★ Featured</span>}
                    </div>
                  )}

                  <div style={s.projBody}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'8px'}}>
                      <h3 style={s.projTitle}>{proj.title}</h3>
                      {proj.category && <span className="proj-cat-3d">{proj.category}</span>}
                    </div>
                    <p style={s.projDesc}>{proj.description}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'12px'}}>
                      {techs.slice(0,4).map(t => (
                        <span key={t} className="tech-badge-3d" style={{'--tech-color':tc(t)}}>{t}</span>
                      ))}
                    </div>
                    <div style={{display:'flex',gap:'14px',marginTop:'16px'}}>
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="proj-link-3d">Live Demo →</a>}
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="proj-link-3d secondary">Source →</a>}
                    </div>
                  </div>
                </ParallaxCard>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{textAlign:'center',marginTop:'48px'}}
          >
            <Link to="/portfolio" className="view-all-3d">View All Projects</Link>
          </motion.div>
        </section>
      )}

      {/* ── SERVICES ── */}
      {services.length > 0 && (
        <section style={s.servicesSection}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={s.sectionHead}
          >
            <span style={s.sectionLabel}>Services</span>
            <h2 style={s.sectionTitle}>What I Offer</h2>
            <p style={s.sectionSub}>Comprehensive solutions for your digital needs</p>
          </motion.div>

          <div style={s.serviceGrid}>
            {services.map((svc, i) => (
              <ParallaxCard key={svc.id} delay={i * 0.15} className="glass-card service-card-3d">
                <div className="svc-icon-3d" style={{'--icon-color': svcColors[i % svcColors.length]}}>
                  <span style={{fontSize:'28px'}}>{svcEmoji[i % svcEmoji.length]}</span>
                </div>
                <h3 style={s.svcTitle}>{svc.title}</h3>
                <p style={s.svcDesc}>{svc.description}</p>

                <div style={{marginTop:'auto',paddingTop:'16px'}}>
                  {(svc.features || []).slice(0,3).map((f,fi) => (
                    <div key={fi} className="svc-feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={s.svcFooter}>
                  <div>
                    <span className="svc-price">${Number(svc.price||0).toLocaleString()}</span>
                    {svc.currency && svc.currency !== 'USD' && (
                      <span style={{color:'#475569',fontSize:'12px',marginLeft:'4px'}}>{svc.currency}</span>
                    )}
                  </div>
                  <Link to="/contact" className="svc-cta-3d">Get Started →</Link>
                </div>
              </ParallaxCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{textAlign:'center',marginTop:'48px'}}
          >
            <Link to="/services" className="view-all-3d">All Services</Link>
          </motion.div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        style={s.ctaBanner}
      >
        <div className="cta-orb-1" />
        <div className="cta-orb-2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card cta-card"
        >
          <h2 style={s.ctaTitle}>Ready to Start Your Project?</h2>
          <p style={s.ctaSub}>Let's collaborate and create something extraordinary together.</p>
          <Link to="/contact" className="hero-cta-3d">
            <span>Get In Touch</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>
      </motion.section>

      {/* Cyber HUD audio & controls */}
      <CyberHUD />
    </div>
  );
};

const gradients = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#10b981,#059669)',
];
const svcColors = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ec4899'];
const svcEmoji = ['⚡','🎨','🚀','💎','🔒','🌐'];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
  @keyframes rotate-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse-glow { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.92)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

  .glass-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    animation: float-slow 8s ease-in-out infinite;
    z-index: 0;
  }

  .glass-card {
    background: rgba(10, 10, 24, 0.4);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(99, 102, 241, 0.15);
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .glass-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .glass-card:hover::before { opacity: 1; }
  .glass-card:hover {
    border-color: rgba(99, 102, 241, 0.4);
    box-shadow: 0 30px 80px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1);
    transform: translateY(-8px) !important;
  }

  .hero-cta-3d {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 16px;
    color: white;
    font-weight: 700;
    font-size: 16px;
    text-decoration: none;
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .hero-cta-3d::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  .hero-cta-3d:hover::before { transform: translateX(100%); }
  .hero-cta-3d:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(99, 102, 241, 0.6), inset 0 1px 0 rgba(255,255,255,0.3);
  }
  .hero-cta-3d:active { transform: translateY(-2px); }

  .hero-ghost-3d {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1.5px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    color: #e2e8f0;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-ghost-3d:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
    color: #818cf8;
    transform: translateY(-2px);
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 20px 28px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 16px;
    transition: all 0.3s;
  }

  .stat-card:hover {
    background: rgba(99, 102, 241, 0.08);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-4px);
  }

  .proj-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent, rgba(10, 10, 24, 0.95));
    pointer-events: none;
  }

  .feat-badge-3d {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 6px 14px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(251, 191, 36, 0.5);
    border-radius: 999px;
    color: #fbbf24;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    z-index: 2;
  }

  .proj-cat-3d {
    padding: 4px 12px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 999px;
    color: #a5b4fc;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tech-badge-3d {
    padding: 6px 12px;
    background: color-mix(in srgb, var(--tech-color) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--tech-color) 25%, transparent);
    border-radius: 8px;
    color: var(--tech-color);
    font-size: 11px;
    font-weight: 700;
    transition: all 0.2s;
  }

  .tech-badge-3d:hover {
    background: color-mix(in srgb, var(--tech-color) 20%, transparent);
    transform: translateY(-2px);
  }

  .proj-link-3d {
    font-size: 14px;
    font-weight: 700;
    color: #a78bfa;
    text-decoration: none;
    transition: all 0.2s;
  }

  .proj-link-3d:hover { color: #c4b5fd; transform: translateX(4px); }
  .proj-link-3d.secondary { color: #64748b; }
  .proj-link-3d.secondary:hover { color: #94a3b8; }

  .view-all-3d {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 32px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 16px;
    color: #e2e8f0;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
  }

  .view-all-3d:hover {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.5);
    color: #818cf8;
    transform: translateY(-2px);
  }

  .service-card-3d { display: flex; flex-direction: column; padding: 32px; }

  .svc-icon-3d {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--icon-color) 12%, transparent);
    border: 1.5px solid color-mix(in srgb, var(--icon-color) 30%, transparent);
    border-radius: 18px;
    margin-bottom: 20px;
    transition: all 0.3s;
  }

  .service-card-3d:hover .svc-icon-3d {
    background: color-mix(in srgb, var(--icon-color) 20%, transparent);
    transform: scale(1.1) rotate(5deg);
  }

  .svc-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 13px;
  }

  .svc-feature svg { color: #4ade80; flex-shrink: 0; }

  .svc-price {
    color: #4ade80;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .svc-cta-3d {
    font-size: 14px;
    font-weight: 700;
    color: #a78bfa;
    text-decoration: none;
    transition: all 0.2s;
  }

  .svc-cta-3d:hover { color: #c4b5fd; transform: translateX(4px); }

  .cta-orb-1, .cta-orb-2 {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    animation: float-slow 10s ease-in-out infinite;
  }

  .cta-orb-1 {
    width: 700px;
    height: 700px;
    top: -300px;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(99, 102, 241, 0.25), transparent 70%);
  }

  .cta-orb-2 {
    width: 500px;
    height: 500px;
    bottom: -200px;
    right: -150px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
    animation-delay: -5s;
  }

  .cta-card {
    text-align: center;
    padding: 80px 48px;
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .cta-card { padding: 60px 32px; }
  }
`;

const s = {
  page: {
    background: '#030307',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#e2e8f0',
    overflowX: 'hidden',
    position: 'relative',
  },

  // Hero
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 5vw 80px',
    overflow: 'hidden',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '700px',
    textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 18px',
    background: 'rgba(16, 185, 129, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: 999,
    fontSize: 12.5,
    fontWeight: 700,
    color: '#34d399',
    marginBottom: 26,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  heroBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#34d399',
    boxShadow: '0 0 10px #34d399',
    animation: 'pulse-glow 2s infinite',
  },
  heroTitle: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 'clamp(38px, 6vw, 68px)',
    fontWeight: 900,
    lineHeight: 1.12,
    color: '#f8fafc',
    margin: '0 0 24px',
    letterSpacing: '-0.025em',
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 50%, #c084fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'inline-block',
  },
  heroSub: {
    color: '#94a3b8',
    fontSize: 17,
    lineHeight: 1.7,
    margin: '0 0 36px',
    maxWidth: 620,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroActions: {
    display: 'flex',
    gap: 14,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 52,
  },
  heroStats: {
    display: 'inline-flex',
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '16px 32px',
    background: 'rgba(12, 14, 28, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },
  statVal: {
    fontSize: 32,
    fontWeight: 800,
    color: '#f1f5f9',
    letterSpacing: '-0.02em',
  },
  statLbl: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  // Sections
  section: {
    padding: '120px 5vw',
    maxWidth: 1400,
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  servicesSection: {
    padding: '120px 5vw',
    maxWidth: 1400,
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
    background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.03), transparent)',
  },
  sectionHead: {
    textAlign: 'center',
    marginBottom: 64,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#8b5cf6',
    display: 'block',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: 900,
    color: '#f1f5f9',
    margin: '0 0 16px',
    letterSpacing: '-0.03em',
  },
  sectionSub: {
    color: '#64748b',
    fontSize: 17,
    margin: 0,
  },

  // Projects
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 32,
  },
  projBanner: {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  projInitial: {
    fontSize: 56,
    fontWeight: 900,
    color: 'rgba(255, 255, 255, 0.95)',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  projBody: {
    padding: 28,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  projTitle: {
    color: '#f1f5f9',
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  projDesc: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.65,
    margin: '8px 0 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // Services
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 28,
  },
  svcTitle: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 12px',
  },
  svcDesc: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 1.65,
    margin: 0,
  },
  svcFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    marginTop: 20,
    borderTop: '1px solid rgba(99, 102, 241, 0.1)',
  },

  // CTA
  ctaBanner: {
    position: 'relative',
    padding: '160px 5vw',
    overflow: 'hidden',
  },
  ctaTitle: {
    fontSize: 'clamp(32px, 5vw, 56px)',
    fontWeight: 900,
    color: '#f1f5f9',
    margin: '0 0 20px',
    letterSpacing: '-0.03em',
  },
  ctaSub: {
    color: '#94a3b8',
    fontSize: 18,
    margin: '0 0 40px',
    lineHeight: 1.6,
  },
};

export default Home3D;
