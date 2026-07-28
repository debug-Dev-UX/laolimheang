import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try { await logout(); } 
    catch (error) { console.error('Logout failed:', error); }
  };

  const links = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Portfolio', href: ROUTES.PORTFOLIO },
    { label: 'Services', href: ROUTES.SERVICES },
    { label: 'Blog', href: ROUTES.BLOG },
    { label: 'About', href: ROUTES.ABOUT },
    { label: 'Contact', href: ROUTES.CONTACT },
  ];

  return (
    <>
      <style>{css}</style>
      <header style={s.header}>
        <nav style={s.nav}>
          {/* Logo */}
          <Link to={ROUTES.HOME} style={s.logo}>
            <div style={s.logoIcon}>LH</div>
            <span>LaolimHeang</span>
          </Link>

          {/* Desktop Links */}
          <div style={s.desktopLinks} className="desktop-links">
            {links.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link key={link.label} to={link.href} style={{...s.link, color: active ? '#f1f5f9' : '#94a3b8'}} className="nav-link">
                  {link.label}
                  {active && <span style={s.activeIndicator} />}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div style={s.actions}>
            {isAdmin && user && (
              <div style={s.adminGroup} className="desktop-only">
                <Link to={ROUTES.ADMIN_DASHBOARD} style={s.dashBtn}>Dashboard</Link>
                <button onClick={handleLogout} style={s.outBtn}>Logout</button>
              </div>
            )}
            
            {/* Mobile Toggle */}
            <button style={s.mobileToggle} className="mobile-toggle" onClick={() => setOpen(!open)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div style={{...s.drawer, transform: open ? 'translateX(0)' : 'translateX(-100%)'}}>
        <div style={s.drawerContent}>
          {links.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link key={link.label} to={link.href} style={{...s.drawerLink, color: active ? '#f1f5f9' : '#94a3b8', background: active ? 'rgba(255,255,255,0.05)' : 'transparent'}} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            );
          })}
          
          {isAdmin && user && (
            <div style={{marginTop:'32px', display:'flex', flexDirection:'column', gap:'12px'}}>
              <Link to={ROUTES.ADMIN_DASHBOARD} style={s.dashBtn} onClick={() => setOpen(false)}>Admin Dashboard</Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} style={{...s.outBtn, width:'100%', justifyContent:'center'}}>Logout</button>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop */}
      {open && <div style={s.backdrop} onClick={() => setOpen(false)} />}
    </>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');
  .nav-link:hover { color: #f1f5f9 !important; }
  .mobile-toggle { display: none !important; }
  .desktop-only { display: flex; }
  @media (max-width: 860px) {
    .desktop-links { display: none !important; }
    .mobile-toggle { display: flex !important; }
    .desktop-only { display: none !important; }
  }
`;

const s = {
  header: { position:'sticky', top:0, zIndex:50, background:'rgba(5,5,10,0.7)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.05)', fontFamily:"'Inter',sans-serif" },
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', height:'72px', maxWidth:'1600px', margin:'0 auto', padding:'0 4vw' },
  
  logo: { display:'flex', alignItems:'center', gap:'10px', textDecoration:'none', color:'#f1f5f9', fontSize:'18px', fontWeight:'700', letterSpacing:'-0.02em' },
  logoIcon: { width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'800', color:'white' },
  
  desktopLinks: { display:'flex', alignItems:'center', gap:'8px' },
  link: { position:'relative', padding:'8px 16px', fontSize:'14px', fontWeight:'600', textDecoration:'none', transition:'color 0.2s' },
  activeIndicator: { position:'absolute', bottom:'0', left:'50%', transform:'translateX(-50%)', width:'20px', height:'3px', borderRadius:'3px 3px 0 0', background:'#6366f1' },
  
  actions: { display:'flex', alignItems:'center', gap:'16px' },
  adminGroup: { alignItems:'center', gap:'12px' },
  dashBtn: { display:'inline-flex', justifyContent:'center', padding:'8px 16px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#f1f5f9', fontSize:'13px', fontWeight:'600', textDecoration:'none' },
  outBtn: { display:'inline-flex', justifyContent:'center', padding:'8px 16px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#f87171', fontSize:'13px', fontWeight:'600', cursor:'pointer' },
  
  mobileToggle: { background:'transparent', border:'none', color:'#e2e8f0', cursor:'pointer', padding:'8px', alignItems:'center', justifyContent:'center' },
  
  drawer: { position:'fixed', top:0, left:0, bottom:0, width:'300px', background:'rgba(12,12,26,0.95)', backdropFilter:'blur(20px)', borderRight:'1px solid rgba(255,255,255,0.05)', zIndex:100, transition:'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  drawerContent: { padding:'80px 24px 24px', display:'flex', flexDirection:'column', gap:'8px' },
  drawerLink: { display:'block', padding:'12px 16px', borderRadius:'10px', fontSize:'16px', fontWeight:'600', textDecoration:'none' },
  backdrop: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:90, animation:'fade 0.3s ease' }
};

export default Navbar;
