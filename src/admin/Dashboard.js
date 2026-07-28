import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statCards = (summary) => [
  {
    label: 'Total Visits',
    value: summary?.totalVisits ?? 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.3)',
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Unique Visitors',
    value: summary?.uniqueVisitors ?? 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    glow: 'rgba(6,182,212,0.3)',
    trend: '+8%',
    trendUp: true,
  },
  {
    label: 'Messages',
    value: summary?.totalMessages ?? 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16,185,129,0.3)',
    trend: summary?.unreadMessages ? `${summary.unreadMessages} unread` : 'All read',
    trendUp: true,
  },
  {
    label: 'Projects',
    value: summary?.totalProjects ?? 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="2 17 12 22 22 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <polyline points="2 12 12 17 22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(245,158,11,0.3)',
    trend: `${summary?.totalBlogs ?? 0} blogs`,
    trendUp: true,
  },
];

const quickActions = [
  { to: ROUTES.ADMIN_SERVICES, label: 'Manage Services', desc: 'Add or edit service offerings', color: '#6366f1',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { to: ROUTES.ADMIN_PROJECTS, label: 'Manage Projects', desc: 'Showcase your portfolio work', color: '#06b6d4',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { to: ROUTES.ADMIN_BLOGS, label: 'Manage Blogs', desc: 'Write and publish blog posts', color: '#10b981',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { to: ROUTES.ADMIN_MESSAGES, label: 'View Messages', desc: 'Read incoming contact messages', color: '#f59e0b',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { to: ROUTES.ADMIN_ANALYTICS, label: 'Analytics', desc: 'View visitor insights & stats', color: '#8b5cf6',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { to: ROUTES.ADMIN_SETTINGS, label: 'Settings', desc: 'Configure site preferences', color: '#64748b',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8"/></svg> },
];

const Dashboard = () => {
  const { getAnalyticsSummary, loading } = useAnalytics();
  const [summary, setSummary] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalyticsSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>{greeting} 👋</h1>
          <p style={s.pageSubtitle}>
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to={ROUTES.ADMIN_ANALYTICS} style={s.viewAllBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          View Analytics
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        {statCards(summary).map((card, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statTop}>
              <div style={{...s.statIconWrap, background: card.gradient, boxShadow: `0 4px 15px ${card.glow}`}}>
                <span style={{color: 'white'}}>{card.icon}</span>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em',
                color: card.trendUp ? '#34d399' : '#f87171',
                background: card.trendUp ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                padding: '3px 8px', borderRadius: '20px',
              }}>{card.trend}</span>
            </div>
            <p style={s.statValue}>{card.value.toLocaleString()}</p>
            <p style={s.statLabel}>{card.label}</p>
            <div style={{...s.statBar, background: `linear-gradient(90deg, ${card.gradient.match(/#[\w]+/g)?.[0] || '#6366f1'} 0%, transparent 100%)`}} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Quick Actions</h2>
          <p style={s.sectionSub}>Jump to any management area</p>
        </div>
        <div style={s.actionsGrid}>
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              style={{
                ...s.actionCard,
                ...(hovered === i ? s.actionCardHover : {}),
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{...s.actionIconWrap, background: `${action.color}20`, border: `1px solid ${action.color}30`}}>
                <span style={{color: action.color}}>{action.icon}</span>
              </div>
              <div style={s.actionText}>
                <p style={s.actionLabel}>{action.label}</p>
                <p style={s.actionDesc}>{action.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{color: '#334155', marginLeft: 'auto', flexShrink: 0}}>
                <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={s.bottomRow}>
        {/* Mini stats */}
        <div style={s.miniCard}>
          <h3 style={s.miniTitle}>Site Overview</h3>
          {[
            { label: 'Total Blogs', value: summary?.totalBlogs ?? 0, color: '#6366f1' },
            { label: 'Total Services', value: summary?.totalServices ?? 0, color: '#06b6d4' },
            { label: "Today's Visits", value: summary?.todayVisits ?? 0, color: '#10b981' },
            { label: 'Unread Messages', value: summary?.unreadMessages ?? 0, color: '#f59e0b' },
          ].map((item, i) => (
            <div key={i} style={s.miniRow}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <div style={{width:'8px', height:'8px', borderRadius:'50%', background: item.color, flexShrink:0}} />
                <span style={s.miniLabel}>{item.label}</span>
              </div>
              <span style={{...s.miniValue, color: item.color}}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* System status */}
        <div style={s.miniCard}>
          <h3 style={s.miniTitle}>System Status</h3>
          {[
            { label: 'Firebase', status: 'Operational' },
            { label: 'Telegram Bot', status: 'Connected' },
            { label: 'Analytics', status: 'Active' },
            { label: 'Storage', status: 'Healthy' },
          ].map((item, i) => (
            <div key={i} style={s.miniRow}>
              <span style={s.miniLabel}>{item.label}</span>
              <span style={{fontSize:'12px', color:'#34d399', background:'rgba(52,211,153,0.1)', padding:'2px 10px', borderRadius:'20px', fontWeight:'600'}}>
                ● {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    color: '#f1f5f9',
    fontSize: '26px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    color: '#475569',
    fontSize: '14px',
    margin: 0,
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '8px',
    color: '#818cf8',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '16px',
  },
  statCard: {
    background: 'rgba(15,15,30,0.6)',
    border: '1px solid rgba(99,102,241,0.1)',
    borderRadius: '16px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
  },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  statIconWrap: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#f1f5f9',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    color: '#475569',
    fontSize: '13px',
    margin: 0,
    fontWeight: '500',
  },
  statBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    opacity: 0.4,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },
  sectionSub: {
    color: '#475569',
    fontSize: '13px',
    margin: 0,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '12px',
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 18px',
    background: 'rgba(15,15,30,0.5)',
    border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: '14px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  actionCardHover: {
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
    transform: 'translateY(-1px)',
  },
  actionIconWrap: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionText: {
    flex: 1,
    minWidth: 0,
  },
  actionLabel: {
    color: '#e2e8f0',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 2px 0',
  },
  actionDesc: {
    color: '#475569',
    fontSize: '12px',
    margin: 0,
  },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  miniCard: {
    background: 'rgba(15,15,30,0.6)',
    border: '1px solid rgba(99,102,241,0.1)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  miniTitle: {
    color: '#94a3b8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: 0,
  },
  miniRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniLabel: {
    color: '#64748b',
    fontSize: '13.5px',
  },
  miniValue: {
    fontSize: '16px',
    fontWeight: '700',
  },
};

export default Dashboard;
