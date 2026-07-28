import React, { useState, useEffect } from 'react';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { Link } from 'react-router-dom';

const svcColors = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ec4899'];
const svcEmoji = ['⚡','🎨','📱','☁️','🛒','📊'];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getCollection(COLLECTIONS.SERVICES);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Header */}
      <section style={s.headerSec}>
        <div style={{...s.orb, width:'500px', height:'500px', background:'radial-gradient(circle,rgba(6,182,212,0.12),transparent 70%)', top:'-150px', left:'-100px'}} />
        <div style={{...s.headerContent, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)'}}>
          <h1 style={s.title}>Digital <span style={s.gradientText}>Services</span></h1>
          <p style={s.subtitle}>Comprehensive solutions tailored to elevate your business. From design to deployment, I've got you covered.</p>
        </div>
      </section>

      {/* Content */}
      <section style={s.contentSec}>
        {loading ? (
          <div style={s.loaderWrap}><div style={s.spinner} /></div>
        ) : services.length === 0 ? (
          <div style={s.emptyState}>No services available yet.</div>
        ) : (
          <div style={s.grid}>
            {services.map((svc, i) => {
              const col = svcColors[i % svcColors.length];
              const emo = svcEmoji[i % svcEmoji.length];
              return (
                <div key={svc.id} className="svc-card" style={{...s.card, animationDelay: `${i * 0.1}s`}}>
                  {svc.featured && <div style={s.featRibbon}>Popular</div>}
                  <div style={{...s.iconWrap, background: `${col}15`, border: `1px solid ${col}30`}}>
                    <span style={{color: col, fontSize: '28px'}}>{emo}</span>
                  </div>
                  <h3 style={s.cardTitle}>{svc.title}</h3>
                  <p style={s.cardDesc}>{svc.description}</p>
                  
                  <div style={s.priceWrap}>
                    <span style={s.priceVal}>
                      {svc.currency || '$'}{Number(svc.price || 0).toLocaleString()}
                    </span>
                    <span style={s.priceLbl}>starting at</span>
                  </div>

                  <ul style={s.featureList}>
                    {(svc.features || []).map((f, fi) => (
                      <li key={fi} style={s.featureItem}>
                        <span style={{color: col, fontSize:'14px', flexShrink:0}}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={s.actionWrap}>
                    <Link to="/contact" style={{...s.actionBtn, background: `linear-gradient(135deg, ${col}, ${col}dd)`, boxShadow: `0 4px 15px ${col}40`}} className="hover-lift">
                      Get Started
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .svc-card { opacity: 0; animation: fadeUp 0.6s ease forwards; position: relative; }
  .svc-card:hover { transform: translateY(-8px) !important; box-shadow: 0 24px 50px rgba(0,0,0,0.5) !important; border-color: rgba(99,102,241,0.2) !important; }
  .hover-lift { transition: all 0.2s; }
  .hover-lift:hover { transform: translateY(-2px); filter: brightness(1.1); }
`;

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },
  headerSec: { position:'relative', padding:'120px 4vw 60px', textAlign:'center', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  headerContent: { position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto', transition:'all 0.8s ease' },
  title: { fontSize:'clamp(36px,5vw,56px)', fontWeight:'800', color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.02em' },
  gradientText: { background:'linear-gradient(135deg,#06b6d4,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  subtitle: { color:'#64748b', fontSize:'17px', lineHeight:'1.6', margin:0 },
  
  contentSec: { maxWidth:'1600px', margin:'0 auto', padding:'0 4vw 100px' },
  loaderWrap: { display:'flex', justifyContent:'center', padding:'80px 0' },
  spinner: { width:'32px', height:'32px', border:'3px solid rgba(6,182,212,0.2)', borderTopColor:'#06b6d4', borderRadius:'50%', animation:'spin 1s linear infinite' },
  
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'30px' },
  card: { background:'rgba(12,12,26,0.7)', border:'1px solid rgba(99,102,241,0.08)', borderRadius:'24px', padding:'32px 24px', display:'flex', flexDirection:'column', transition:'all 0.3s' },
  featRibbon: { position:'absolute', top:'20px', right:'-8px', background:'linear-gradient(135deg,#f59e0b,#ef4444)', color:'white', fontSize:'11px', fontWeight:'700', padding:'4px 14px', borderRadius:'20px 0 0 20px', boxShadow:'0 4px 10px rgba(245,158,11,0.4)', zIndex:2 },
  
  iconWrap: { width:'64px', height:'64px', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' },
  cardTitle: { color:'#f1f5f9', fontSize:'22px', fontWeight:'700', margin:'0 0 12px' },
  cardDesc: { color:'#64748b', fontSize:'15px', lineHeight:'1.6', margin:'0 0 24px', flex:1 },
  
  priceWrap: { display:'flex', alignItems:'baseline', gap:'8px', paddingBottom:'24px', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:'24px' },
  priceVal: { fontSize:'32px', fontWeight:'800', color:'#f1f5f9', letterSpacing:'-0.02em' },
  priceLbl: { fontSize:'13px', color:'#475569', fontWeight:'500' },
  
  featureList: { listStyle:'none', padding:0, margin:'0 0 32px', display:'flex', flexDirection:'column', gap:'12px' },
  featureItem: { display:'flex', alignItems:'flex-start', gap:'12px', color:'#94a3b8', fontSize:'14px', lineHeight:'1.5' },
  
  actionWrap: { marginTop:'auto' },
  actionBtn: { display:'flex', justifyContent:'center', alignItems:'center', width:'100%', padding:'14px', borderRadius:'12px', color:'white', fontSize:'15px', fontWeight:'700', textDecoration:'none' },
  
  emptyState: { textAlign:'center', color:'#64748b', padding:'60px 0', fontSize:'16px' }
};

export default Services;
