import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../../context/SettingsContext';
import { FaTwitter, FaGithub, FaLinkedin, FaFacebook, FaDribbble, FaInstagram, FaTelegram } from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';

const ICONS = {
  twitter: <FaTwitter size={18} />,
  github: <FaGithub size={18} />,
  linkedin: <FaLinkedin size={18} />,
  facebook: <FaFacebook size={18} />,
  instagram: <FaInstagram size={18} />,
  dribbble: <FaDribbble size={18} />,
  telegram: <FaTelegram size={18} />,
};

const Footer = () => {
  const { settings } = useContext(SettingsContext);

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 4vw 40px', background: '#030305' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '24px', fontWeight: '900', background: 'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>
            {settings?.siteName || 'LaolimHeang'}
          </span>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0 0', maxWidth: '400px' }}>
            {settings?.description || 'Full-Stack Engineer · System Architect'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{label:'Home',to:'/'},{label:'About',to:'/about'},{label:'Portfolio',to:'/portfolio'},{label:'Services',to:'/services'},{label:'Blog',to:'/blog'},{label:'Contact',to:'/contact'}].map(l=>(
            <Link key={l.label} to={l.to} style={{ padding: '6px 16px', borderRadius: '10px', color: '#94a3b8', fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} className="footer-link">
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, url]) => {
            if (!url) return null;
            return (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" style={iconStyle} className="footer-icon" title={platform}>
                {ICONS[platform.toLowerCase()] || <span style={{fontSize:'12px',textTransform:'capitalize'}}>{platform[0]}</span>}
              </a>
            );
          })}
        </div>

        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '8px' }} />

        <p style={{ color: '#475569', fontSize: '13px', margin: 0, fontWeight: '500' }}>
          {settings?.footerText || `© ${new Date().getFullYear()} LaolimHeang. All rights reserved.`}
        </p>
      </div>
      <style>{`
        .footer-link:hover { background: rgba(99,102,241,0.1) !important; color: #818cf8 !important; border-color: rgba(99,102,241,0.3) !important; transform: translateY(-2px); }
        .footer-icon:hover { background: rgba(99,102,241,0.1) !important; color: #818cf8 !important; border-color: rgba(99,102,241,0.3) !important; transform: translateY(-2px); }
      `}</style>
    </footer>
  );
};

const iconStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px',
  borderRadius: '50%', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)',
  transition: 'all 0.2s', textDecoration: 'none'
};

export default Footer;
