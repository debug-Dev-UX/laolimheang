// 3D Spatial About Page with Holographic Dev Pass & 3D Skill Constellation
import React, { useState, useEffect, useContext } from 'react';
import { subscribeToCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { Link } from 'react-router-dom';
import { AboutPageSkeleton } from '../components/common/Skeleton';
import TechGalaxy3D from '../components/about/TechGalaxy3D';
import HoloDevPass3D from '../components/about/HoloDevPass3D';
import CyberHUD from '../components/common/CyberHUD';

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
  HTML: '#e34f26',
  CSS: '#1572b6',
  PHP: '#777bb4',
};

const tc = (t) => TECH_COLORS[t] || '#6366f1';

const About = () => {
  const [mounted, setMounted] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = subscribeToCollection(COLLECTIONS.SKILLS, (data) => {
      if (data && data.length > 0) {
        setSkills(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setSkills([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <AboutPageSkeleton />;

  const aboutParagraphs = settings?.aboutText
    ? settings.aboutText.split('\\n').filter((p) => p.trim() !== '')
    : [
        'I am a passionate Full-Stack Developer & Spatial Web Engineer with deep expertise building modern, responsive, and ultra-high performance applications.',
        'I specialize in the intersection of real-time 3D graphics (Three.js/WebGL), cloud architectures, and pixel-perfect user interfaces that convert and inspire.',
      ];

  return (
    <div
      style={{
        background: '#030308',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#e2e8f0',
        overflowX: 'hidden',
        position: 'relative',
        paddingBottom: '100px',
      }}
    >
      {/* Background radial ambient lights */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '-200px',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <section style={{ position: 'relative', padding: '120px 4vw 20px', textAlign: 'center', zIndex: 1 }}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#a78bfa',
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
                background: '#a78bfa',
                boxShadow: '0 0 8px #a78bfa',
              }}
            />
            <span>Verified Identity & Spatial Dossier</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 60px)',
              fontWeight: 900,
              color: '#f8fafc',
              margin: '0 0 16px',
              letterSpacing: '-0.03em',
            }}
          >
            About{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              The Architect
            </span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '17px', lineHeight: 1.6, margin: 0 }}>
            Bridging technical engineering rigour with fluid 3D spatial design.
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '40px 4vw 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Intro Grid: Left Biography, Right 3D Holo Developer Pass */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '60px',
            alignItems: 'center',
            marginBottom: '90px',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: 900,
                color: '#f8fafc',
                margin: '0 0 20px',
                letterSpacing: '-0.02em',
              }}
            >
              Hello, I'm <span style={{ color: '#818cf8' }}>{settings?.siteName || 'Lao Limheang'}</span>.
            </h2>
            {aboutParagraphs.map((p, i) => (
              <p key={i} style={{ fontSize: '16px', lineHeight: '1.75', color: '#94a3b8', margin: '0 0 18px' }}>
                {p}
              </p>
            ))}

            {/* Quick credentials bullet points */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                margin: '28px 0 36px',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(12, 14, 28, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#34d399', marginBottom: '4px' }}>3+ Years</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Professional Experience</div>
              </div>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(12, 14, 28, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#38bdf8', marginBottom: '4px' }}>25+ Projects</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Shipped into Production</div>
              </div>
            </div>

            <div>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                }}
              >
                <span>Initiate Project Consultation</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right: 3D Holographic Developer Pass */}
          <div>
            <HoloDevPass3D />
          </div>
        </div>

        {/* 3D Skill Constellation Section */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: 900,
                color: '#f8fafc',
                margin: '0 0 12px',
                letterSpacing: '-0.02em',
              }}
            >
              Interactive <span style={{ color: '#818cf8' }}>Tech Galaxy</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
              Rotate the 3D constellation sphere to explore core proficiencies in real-time space.
            </p>
          </div>

          <TechGalaxy3D />
        </div>

        {/* Skills Categorical Breakdown Grid */}
        {skills.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Arsenal by Domain
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                Specialized tools, frameworks, and architecture patterns.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {skills.map((skillGroup) => (
                <div
                  key={skillGroup.category}
                  style={{
                    background: 'rgba(12, 14, 28, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <h4
                    style={{
                      color: '#f8fafc',
                      fontSize: '17px',
                      fontWeight: 800,
                      margin: '0 0 16px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {skillGroup.category}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(skillGroup.items || []).map((item) => (
                      <span
                        key={item}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          background: `${tc(item)}18`,
                          color: tc(item),
                          border: `1px solid ${tc(item)}30`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Cyber HUD audio & controls */}
      <CyberHUD />
    </div>
  );
};

export default About;
