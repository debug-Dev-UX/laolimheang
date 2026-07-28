// src/components/layout/AdminLayout.jsx
import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAdmin } from "../../services/authservice";
import { useAuth } from "../../hooks/useAuth";

const NAV = [
  {
    to: "/admin", end: true, label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    to: "/admin/services", label: "Services",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/admin/projects", label: "Projects",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/admin/blogs", label: "Blogs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/admin/messages", label: "Messages",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/admin/analytics", label: "Analytics",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/admin/settings", label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    to: "/admin/skills", label: "Skills",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  // Get current page title
  const currentNav = NAV.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  const SidebarContent = () => (
    <div style={s.sidebarInner}>
      {/* Logo */}
      <div style={s.logo}>
        <div style={s.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={s.logoName}>LaolimHeang</p>
          <p style={s.logoSub}>Admin Panel</p>
        </div>
      </div>

      {/* Navigation label */}
      <p style={s.navGroup}>Navigation</p>

      {/* Nav links */}
      <nav style={s.nav}>
        {NAV.map(({ to, icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              ...s.navLink,
              ...(isActive ? s.navLinkActive : {}),
            })}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User */}
      <div style={s.userSection}>
        <div style={s.userRow}>
          <div style={s.userAvatar}>
            {user?.email?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={s.userInfo}>
            <p style={s.userName}>{user?.displayName || "Admin"}</p>
            <p style={s.userEmail}>{user?.email || "admin@site.com"}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={s.logoutBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.root}>
      {/* Desktop sidebar */}
      <aside style={s.sidebar}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={s.overlay}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ ...s.sidebar, position: 'fixed', zIndex: 50 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div style={s.main}>
        {/* Top bar */}
        <header style={s.topbar}>
          <div style={s.topbarLeft}>
            <button style={s.menuBtn} onClick={() => setSidebarOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div style={s.breadcrumb}>
              <span style={s.breadcrumbRoot}>Admin</span>
              <span style={s.breadcrumbSep}>/</span>
              <span style={s.breadcrumbCurrent}>{currentNav?.label || 'Dashboard'}</span>
            </div>
          </div>
          <div style={s.topbarRight}>
            <div style={s.topbarUserChip}>
              <div style={s.topbarAvatar}>
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <span style={s.topbarName}>{user?.displayName || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={s.content}>
          {children}
        </main>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); }
        a { text-decoration: none; }
        input, textarea, select { font-family: inherit; }
        button { font-family: inherit; }
      `}</style>
    </div>
  );
};

const s = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#080812',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#e2e8f0',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: 'rgba(10,10,24,0.95)',
    borderRight: '1px solid rgba(99,102,241,0.1)',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 30,
    display: 'none',
    flexDirection: 'column',
    '@media (min-width: 1024px)': { display: 'flex' },
  },
  sidebarInner: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '0',
    overflowY: 'auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(99,102,241,0.08)',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
  },
  logoName: {
    color: '#f1f5f9',
    fontWeight: '700',
    fontSize: '14px',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  logoSub: {
    color: '#334155',
    fontSize: '11px',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  navGroup: {
    color: '#1e293b',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: '20px 20px 8px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0 12px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 12px',
    borderRadius: '9px',
    color: '#475569',
    fontSize: '13.5px',
    fontWeight: '500',
    transition: 'all 0.15s',
    textDecoration: 'none',
  },
  navLinkActive: {
    background: 'rgba(99,102,241,0.12)',
    color: '#818cf8',
    borderLeft: '2px solid #6366f1',
    paddingLeft: '10px',
  },
  userSection: {
    padding: '12px',
    borderTop: '1px solid rgba(99,102,241,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    borderRadius: '10px',
    background: 'rgba(99,102,241,0.05)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userEmail: {
    color: '#334155',
    fontSize: '11px',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: '9px',
    color: '#f87171',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.15s',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 40,
    backdropFilter: 'blur(4px)',
  },
  main: {
    flex: 1,
    marginLeft: '0',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    // desktop: marginLeft: 240px handled via media query workaround below
  },
  topbar: {
    height: '60px',
    background: 'rgba(10,10,24,0.9)',
    borderBottom: '1px solid rgba(99,102,241,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    backdropFilter: 'blur(12px)',
  },
  topbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '9px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.12)',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  breadcrumbRoot: {
    color: '#334155',
    fontSize: '13px',
  },
  breadcrumbSep: {
    color: '#1e293b',
    fontSize: '13px',
  },
  breadcrumbCurrent: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  topbarUserChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 12px 5px 6px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.12)',
    borderRadius: '20px',
  },
  topbarAvatar: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
  },
  topbarName: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: '28px 24px',
    marginLeft: '240px',
    maxWidth: '100%',
  },
};

// Apply desktop sidebar display via a style injection
const LayoutWithSidebarFix = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logoutAdmin(); navigate("/admin/login"); };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @media (max-width: 1023px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-main-content { margin-left: 0 !important; }
          .admin-menu-btn { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-menu-btn { display: none !important; }
        }
      `}</style>
      {children}
    </>
  );
};

const AdminLayoutWrapper = ({ children }) => (
  <LayoutWithSidebarFix>
    <AdminLayoutInner>{children}</AdminLayoutInner>
  </LayoutWithSidebarFix>
);

// Rename main component to inner
const AdminLayoutInner = AdminLayout;

// Export wrapper
export default function AdminLayoutExport({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  const currentNav = NAV.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );

  const SidebarContent = () => (
    <div style={s.sidebarInner}>
      <div style={s.logo}>
        <div style={s.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p style={s.logoName}>LaolimHeang</p>
          <p style={s.logoSub}>Admin Panel</p>
        </div>
      </div>
      <p style={s.navGroup}>Navigation</p>
      <nav style={s.nav}>
        {NAV.map(({ to, icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              ...s.navLink,
              ...(isActive ? s.navLinkActive : {}),
            })}
          >
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={s.userSection}>
        <div style={s.userRow}>
          <div style={s.userAvatar}>{user?.email?.[0]?.toUpperCase() || "A"}</div>
          <div style={s.userInfo}>
            <p style={s.userName}>{user?.displayName || "Admin"}</p>
            <p style={s.userEmail}>{user?.email || ""}</p>
          </div>
        </div>
        <button onClick={handleLogout} style={s.logoutBtn}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .admin-sidebar-desktop { display: flex; flex-direction: column; }
        .admin-menu-btn { display: none; }
        @media (max-width: 1023px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-menu-btn { display: flex !important; }
          .admin-main-content { margin-left: 0 !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        a { text-decoration: none; }
        input, textarea, select, button { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .admin-nav-link:hover { background: rgba(99,102,241,0.06) !important; color: #94a3b8 !important; }
        .admin-logout-btn:hover { background: rgba(239,68,68,0.15) !important; }
        .admin-topbar-btn:hover { background: rgba(99,102,241,0.15) !important; }
      `}</style>

      {/* Desktop Sidebar */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: '240px', flexShrink: 0,
          background: 'rgba(10,10,24,0.98)',
          borderRight: '1px solid rgba(99,102,241,0.1)',
          position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 30,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={s.overlay}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                width: '240px', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
                background: 'rgba(10,10,24,0.98)',
                borderRight: '1px solid rgba(99,102,241,0.1)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        {/* Topbar */}
        <header style={s.topbar}>
          <div style={s.topbarLeft}>
            <button
              className="admin-menu-btn admin-topbar-btn"
              style={{ ...s.menuBtn }}
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div style={s.breadcrumb}>
              <span style={s.breadcrumbRoot}>Admin</span>
              <span style={s.breadcrumbSep}> / </span>
              <span style={s.breadcrumbCurrent}>{currentNav?.label || 'Dashboard'}</span>
            </div>
          </div>
          <div style={s.topbarRight}>
            <div style={s.topbarUserChip}>
              <div style={s.topbarAvatar}>{user?.email?.[0]?.toUpperCase() || "A"}</div>
              <span style={s.topbarName}>{user?.displayName || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          className="admin-main-content"
          style={{ flex: 1, padding: '28px 24px', marginLeft: '240px', overflowX: 'hidden' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}