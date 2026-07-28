import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AnalyticsAdmin = () => {
  const { getAnalyticsSummary, getPageViews, getDeviceStats, loading } = useAnalytics();
  const [summary, setSummary] = useState(null);
  const [pageViews, setPageViews] = useState([]);
  const [deviceStats, setDeviceStats] = useState({});

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    try {
      const [s, p, d] = await Promise.all([getAnalyticsSummary(), getPageViews(), getDeviceStats()]);
      setSummary(s);
      setPageViews(p);
      setDeviceStats(d);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalDevices = (deviceStats.desktop || 0) + (deviceStats.mobile || 0) + (deviceStats.tablet || 0) || 1;
  const deviceBars = [
    { label: 'Desktop', value: deviceStats.desktop || 0, color: '#6366f1', icon: '🖥' },
    { label: 'Mobile', value: deviceStats.mobile || 0, color: '#06b6d4', icon: '📱' },
    { label: 'Tablet', value: deviceStats.tablet || 0, color: '#10b981', icon: '📟' },
  ];

  const stats = [
    { label: 'Total Visits', value: summary?.totalVisits ?? 0, color: '#6366f1', glow: 'rgba(99,102,241,0.3)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg> },
    { label: 'Unique Visitors', value: summary?.uniqueVisitors ?? 0, color: '#06b6d4', glow: 'rgba(6,182,212,0.3)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { label: "Today's Visits", value: summary?.todayVisits ?? 0, color: '#10b981', glow: 'rgba(16,185,129,0.3)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
    { label: 'Messages', value: summary?.totalMessages ?? 0, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  ];

  return (
    <div style={p.page}>
      <div style={p.header}>
        <div>
          <h1 style={p.title}>Analytics</h1>
          <p style={p.subtitle}>Visitor insights and traffic data</p>
        </div>
        <button style={p.refreshBtn} onClick={loadAnalytics}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div style={p.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} style={p.statCard}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{width:'38px',height:'38px',borderRadius:'10px',background:`${stat.color}20`,border:`1px solid ${stat.color}30`,display:'flex',alignItems:'center',justifyContent:'center',color:stat.color}}>
                {stat.icon}
              </div>
            </div>
            <p style={{color:'#f1f5f9',fontSize:'28px',fontWeight:'700',margin:'0 0 4px 0',letterSpacing:'-0.02em'}}>{stat.value.toLocaleString()}</p>
            <p style={{color:'#475569',fontSize:'13px',margin:0,fontWeight:'500'}}>{stat.label}</p>
            <div style={{height:'2px',background:`linear-gradient(90deg, ${stat.color}, transparent)`,marginTop:'14px',opacity:0.5,borderRadius:'1px'}} />
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={p.row}>
        {/* Top Pages */}
        <div style={p.card}>
          <h2 style={p.cardTitle}>Top Pages</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {pageViews.length === 0 ? (
              <p style={{color:'#334155',fontSize:'13px',margin:0}}>No page view data available</p>
            ) : pageViews.slice(0, 6).map((page, i) => {
              const max = pageViews[0]?.views || 1;
              const pct = Math.round((page.views / max) * 100);
              return (
                <div key={i}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                    <span style={{color:'#94a3b8',fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'70%'}}>{page.page}</span>
                    <span style={{color:'#e2e8f0',fontSize:'13px',fontWeight:'600',flexShrink:0}}>{page.views}</span>
                  </div>
                  <div style={{height:'4px',background:'rgba(99,102,241,0.1)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:'2px',transition:'width 0.8s ease'}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Types */}
        <div style={p.card}>
          <h2 style={p.cardTitle}>Device Types</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {deviceBars.map((d, i) => {
              const pct = Math.round((d.value / totalDevices) * 100);
              return (
                <div key={i}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',alignItems:'center'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={{fontSize:'16px'}}>{d.icon}</span>
                      <span style={{color:'#94a3b8',fontSize:'13.5px'}}>{d.label}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <span style={{color:'#e2e8f0',fontSize:'13px',fontWeight:'600'}}>{d.value}</span>
                      <span style={{color:'#334155',fontSize:'11px',fontWeight:'600',background:'rgba(30,41,59,0.6)',padding:'2px 7px',borderRadius:'10px'}}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{height:'6px',background:'rgba(99,102,241,0.08)',borderRadius:'3px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg, ${d.color}, ${d.color}88)`,borderRadius:'3px',transition:'width 0.8s ease'}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const p = {
  page: { display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '-0.02em' },
  subtitle: { color: '#475569', fontSize: '13px', margin: 0 },
  refreshBtn: {
    display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '10px', color: '#818cf8', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '16px' },
  statCard: {
    background: 'rgba(10,10,24,0.6)', border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: '16px', padding: '20px',
  },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '16px' },
  card: {
    background: 'rgba(10,10,24,0.6)', border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: '16px', padding: '22px',
  },
  cardTitle: { color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 18px 0' },
};

export default AnalyticsAdmin;
