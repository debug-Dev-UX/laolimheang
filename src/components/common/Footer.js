import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../../context/SettingsContext';
import { FaTwitter, FaGithub, FaLinkedin, FaFacebook, FaDribbble, FaInstagram, FaTelegram } from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';

const SOCIAL_META = {
  twitter:   { icon: <FaTwitter size={16} />,   label: 'Twitter',   color: '#1da1f2' },
  github:    { icon: <FaGithub size={16} />,    label: 'GitHub',    color: '#e2e8f0' },
  linkedin:  { icon: <FaLinkedin size={16} />,  label: 'LinkedIn',  color: '#0a66c2' },
  facebook:  { icon: <FaFacebook size={16} />,  label: 'Facebook',  color: '#1877f2' },
  instagram: { icon: <FaInstagram size={16} />, label: 'Instagram', color: '#e1306c' },
  dribbble:  { icon: <FaDribbble size={16} />,  label: 'Dribbble',  color: '#ea4c89' },
  telegram:  { icon: <FaTelegram size={16} />,  label: 'Telegram',  color: '#26a5e4' },
};

const NAV_LINKS = [
  { label: 'Home',      to: ROUTES.HOME },
  { label: 'Portfolio', to: ROUTES.PORTFOLIO },
  { label: 'Services',  to: ROUTES.SERVICES },
  { label: 'Blog',      to: ROUTES.BLOG },
  { label: 'About',     to: ROUTES.ABOUT },
  { label: 'Contact',   to: ROUTES.CONTACT },
  { label: 'Donate / Support', to: ROUTES.DONATE },
];

const DEFAULT_SKILLS = ['React', 'Node.js', 'Firebase', 'TypeScript', 'MongoDB', 'Python', 'Next.js', 'PostgreSQL'];

// Derive initials from a site name string
const getInitials = (name = '') => {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const Orb = ({ style }) => (
  <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', ...style }} />
);

const Footer = () => {
  const { settings } = useContext(SettingsContext);
  const year = new Date().getFullYear();
  const canvasRef = useRef(null);

  /* animated dot grid */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    let frame, t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 32;
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const dist = Math.sin(t * 0.5 + x * 0.3 + y * 0.4) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x * spacing, y * spacing, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99,102,241,${dist * 0.12})`;
          ctx.fill();
        }
      }
      t += 0.02;
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  // Social links are stored as flat fields on the settings object
  const SOCIAL_KEYS = ['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'dribbble', 'telegram'];
  const socialEntries = SOCIAL_KEYS
    .map(key => [key, settings?.[key]])
    .filter(([, url]) => !!url);

  const initials    = getInitials(settings?.siteName || 'LaolimHeang');
  const tagline     = settings?.footerTagline     || settings?.description || 'Full-Stack Engineer & System Architect crafting scalable digital experiences.';
  const isAvailable = settings?.footerAvailable !== false; // default true
  const availText   = settings?.footerAvailText  || 'Available for projects';
  const ctaText     = settings?.footerCtaText    || 'Start a Project';
  const contactDesc = settings?.footerContactDesc|| "Have a project in mind? Let's build something great together.";
  const skills      = settings?.footerSkills
    ? settings.footerSkills.split(',').map(s => s.trim()).filter(Boolean)
    : DEFAULT_SKILLS;

  return (
    <>
      <style>{FOOTER_CSS}</style>

      <footer className="footer-root">
        {/* Ambient orbs */}
        <Orb style={{ width: 420, height: 420, top: -120, left: '8%', background: 'radial-gradient(circle,rgba(99,102,241,0.16) 0%,transparent 70%)' }} />
        <Orb style={{ width: 320, height: 320, bottom: -40, right: '5%', background: 'radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)' }} />

        {/* Dot grid canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

        <div className="footer-inner">

          {/* ── TOP GRID ── */}
          <div className="footer-grid">

            {/* Brand column */}
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={s.logoIcon}>{initials}</div>
                <span style={s.logoText}>{settings?.siteName || 'LaolimHeang'}</span>
              </div>

              <p style={s.brandDesc}>{tagline}</p>

              {isAvailable && (
                <div style={s.statusPill}>
                  <span style={s.statusDot} />
                  {availText}
                </div>
              )}

              {socialEntries.length > 0 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                  {socialEntries.map(([platform, url]) => {
                    const meta = SOCIAL_META[platform.toLowerCase()];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={meta?.label || platform}
                        className="footer-social"
                        style={{ '--hover-color': meta?.color || '#818cf8' }}
                      >
                        {meta?.icon || <span style={{ fontSize: 12, textTransform: 'capitalize' }}>{platform[0]}</span>}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 style={s.colTitle}>
                <span style={s.colTitleAccent} />
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-nav-link">
                      <svg style={{ width: 12, height: 12, flexShrink: 0, opacity: 0.5 }} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6h8M6 2l4 4-4 4" />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="footer-col">
              <h4 style={s.colTitle}>
                <span style={s.colTitleAccent} />
                Technologies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map(skill => (
                  <span key={skill} className="footer-tag">{skill}</span>
                ))}
              </div>
            </div>

            {/* Get In Touch */}
            <div className="footer-col">
              <h4 style={s.colTitle}>
                <span style={s.colTitleAccent} />
                Get In Touch
              </h4>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 16, marginTop: 0 }}>
                {contactDesc}
              </p>

              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="footer-email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                  {settings.email}
                </a>
              )}

              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="footer-email" style={{ marginBottom: 16 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {settings.phone}
                </a>
              )}

              {settings?.location && (
                <a href={`https://maps.google.com/?q=${encodeURIComponent(settings.location)}`} target="_blank" rel="noopener noreferrer" className="footer-email" style={{ marginBottom: 20 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {settings.location}
                </a>
              )}

              <Link to={ROUTES.CONTACT} className="footer-cta">
                {ctaText}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                  <path d="M2 8h12M8 2l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={s.divider}>
            <div style={s.dividerLine} />
            <div style={s.dividerGem}>
              <div style={s.logoIcon}>{initials}</div>
            </div>
            <div style={s.dividerLine} />
          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="footer-bottom">
            <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
              {settings?.footerText || `© ${year} ${settings?.siteName || 'LaolimHeang'}. All rights reserved.`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13 }}>
              <span>Built with</span>
              <svg viewBox="0 0 24 24" fill="#ef4444" style={{ width: 13, height: 13 }}>
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
              </svg>
              <span>React &amp; Firebase</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

/* ─── inline styles ─── */
const s = {
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0,
    boxShadow: '0 0 16px rgba(99,102,241,0.4)',
  },
  logoText: {
    fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em',
    background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  brandDesc: {
    color: '#64748b', fontSize: 14, lineHeight: 1.75, margin: '0 0 20px', maxWidth: 300,
  },
  statusPill: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 14px', borderRadius: 999,
    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
    color: '#4ade80', fontSize: 13, fontWeight: 600,
  },
  statusDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
    boxShadow: '0 0 8px #4ade80', display: 'inline-block',
    animation: 'footer-pulse 2s ease-in-out infinite',
  },
  colTitle: {
    display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 18px',
    color: '#e2e8f0', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  colTitleAccent: {
    display: 'inline-block', width: 3, height: 14, borderRadius: 4,
    background: 'linear-gradient(180deg,#6366f1,#8b5cf6)', flexShrink: 0,
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 20, margin: '56px 0 36px',
  },
  dividerLine: {
    flex: 1, height: 1,
    background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.35),transparent)',
  },
  dividerGem: {
    padding: 2, borderRadius: 12,
    background: 'linear-gradient(135deg,rgba(99,102,241,0.45),rgba(139,92,246,0.45))',
    boxShadow: '0 0 24px rgba(99,102,241,0.3)',
  },
};

/* ─── CSS string ─── */
const FOOTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  @keyframes footer-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.45; transform: scale(0.82); }
  }

  .footer-root {
    position: relative;
    overflow: hidden;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: linear-gradient(180deg, #030307 0%, #050509 100%);
    font-family: 'Inter', sans-serif;
  }

  .footer-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 72px 5vw 48px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1.2fr 1.4fr;
    gap: 48px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
  }
  @media (max-width: 600px) {
    .footer-grid { grid-template-columns: 1fr; gap: 36px; }
    .footer-inner { padding: 56px 6vw 40px; }
  }

  .footer-social {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #64748b; text-decoration: none;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .footer-social:hover {
    background: rgba(99,102,241,0.12);
    border-color: rgba(99,102,241,0.35);
    color: var(--hover-color, #818cf8);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.2);
  }

  .footer-nav-link {
    display: inline-flex; align-items: center; gap: 8px;
    color: #64748b; font-size: 14px; font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  .footer-nav-link:hover { color: #818cf8; transform: translateX(4px); }

  .footer-tag {
    display: inline-block; padding: 4px 10px; border-radius: 6px;
    background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.15);
    color: #8b92c8; font-size: 12px; font-weight: 600; letter-spacing: 0.02em;
    transition: all 0.2s ease; cursor: default;
  }
  .footer-tag:hover {
    background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4);
    color: #a5b4fc; transform: translateY(-2px);
  }

  .footer-email {
    display: inline-flex; align-items: center; gap: 8px;
    color: #94a3b8; font-size: 13px; font-weight: 500; text-decoration: none;
    margin-bottom: 20px; padding: 8px 12px; border-radius: 8px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.2s; word-break: break-all;
  }
  .footer-email:hover {
    color: #818cf8; background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.25);
  }

  .footer-cta {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px;
    background: linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9));
    color: white; font-size: 14px; font-weight: 700; text-decoration: none;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 4px 15px rgba(99,102,241,0.3);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .footer-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.5);
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
  }
  .footer-cta:active { transform: translateY(0); }

  .footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  @media (max-width: 600px) {
    .footer-bottom { flex-direction: column; text-align: center; }
  }
`;

export default Footer;
