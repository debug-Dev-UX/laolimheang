import React, { useState, useEffect, useCallback } from 'react';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { Link } from 'react-router-dom';
import { ServicesPageSkeleton } from '../components/common/Skeleton';

/* ─── Share helpers ─── */
const shareService = async (title, desc, onToast) => {
  const url = `${window.location.origin}/services`;
  if (navigator.share) {
    try { await navigator.share({ title, text: desc || title, url }); } catch (_) {}
  } else {
    await navigator.clipboard.writeText(url);
    onToast('Link copied to clipboard!');
  }
};

const ShareBtn = ({ title, desc, onToast, style: extStyle }) => (
  <button
    className="svc-share-btn"
    title="Share"
    style={{ ...shareBtn, ...extStyle }}
    onClick={e => { e.preventDefault(); e.stopPropagation(); shareService(title, desc, onToast); }}
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
    Share
  </button>
);

const SvcToast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={toastS}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      {message}
    </div>
  );
};


/* ─── accent colours ─── */
const svcColors = ['#6366f1','#06b6d4','#10b981','#f59e0b','#ec4899'];
const svcEmoji  = ['⚡','🎨','📱','☁️','🛒','📊'];
const col = (i) => svcColors[i % svcColors.length];
const emo = (i) => svcEmoji[i  % svcEmoji.length];

const periodLabel = (p) => {
  if (p === 'year')  return '/ yr';
  if (p === 'hour')  return '/ hr';
  if (p === 'month') return '/ mo';
  return '/ project';
};

/* ══════════════════════════════════════════════════════
   PROJECT CARD  (one-time pricing)
══════════════════════════════════════════════════════ */
const ProjectCard = ({ svc, idx, delay, onToast }) => {
  const c = col(idx);
  return (
    <div className="svc-card" style={{ ...shell, animationDelay: `${delay}s`, position: 'relative' }}>
      {svc.featured && <div style={ribbon}>🔥 Popular</div>}
      {/* Share btn */}
      <ShareBtn title={svc.title} desc={svc.description} onToast={onToast} style={{ position:'absolute', top:18, left:18, zIndex:3 }} />
      <div style={{ ...iconBox, background: `${c}18`, border: `1px solid ${c}35`, marginTop:10 }}>
        <span style={{ color: c, fontSize: 26 }}>{emo(idx)}</span>
      </div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:10 }}>
        <h3 style={cTitle}>{svc.title}</h3>
        {svc.category && <span style={{ ...catTag, background:`${c}15`, color:c, border:`1px solid ${c}30` }}>{svc.category}</span>}
      </div>
      <p style={cDesc}>{svc.description}</p>
      <div style={pRow}>
        <span style={pVal}>{svc.currency||'$'}{Number(svc.price||0).toLocaleString()}</span>
        <span style={pPer}>{periodLabel(svc.period)}</span>
      </div>
      <ul style={fList}>
        {(svc.features||[]).map((f,fi)=>(
          <li key={fi} style={fItem}>
            <span style={{color:c,fontSize:13,flexShrink:0,marginTop:1}}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div style={{marginTop:'auto'}}>
        <Link to="/contact" className="svc-btn"
          style={{...actBtn, background:`linear-gradient(135deg,${c},${c}cc)`, boxShadow:`0 4px 18px ${c}45`}}>
          Get Started →
        </Link>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MONTHLY PRICING CARDS  (like the reference image)
══════════════════════════════════════════════════════ */
const MonthlyPricing = ({ plans, onToast }) => {
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'annually'
  const ANNUAL_DISCOUNT = 0.25; // 25% off

  const displayPrice = (price) => {
    if (billing === 'annually') return Math.round(price * (1 - ANNUAL_DISCOUNT));
    return price;
  };

  return (
    <div>
      {/* ── Billing Toggle ── */}
      <div style={tog.wrap}>
        <span style={{ ...tog.label, color: billing === 'monthly' ? '#f1f5f9' : '#64748b' }}>Monthly</span>
        <button
          onClick={() => setBilling(b => b === 'monthly' ? 'annually' : 'monthly')}
          style={tog.track}
          aria-label="Toggle billing period"
        >
          <div style={{
            ...tog.thumb,
            left: billing === 'annually' ? 22 : 3,
            background: billing === 'annually'
              ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              : 'rgba(148,163,184,0.6)',
          }} />
        </button>
        <span style={{ ...tog.label, color: billing === 'annually' ? '#f1f5f9' : '#64748b' }}>
          Annually
          <span style={tog.saveBadge}>Save 25%</span>
        </span>
      </div>

      {/* ── Plan Cards ── */}
      <div style={pc.grid}>
        {plans.map((plan, pi) => {
          const c          = col(pi);
          const origPrice  = Number(plan.price || 0);
          const shownPrice = displayPrice(origPrice);
          const isAnnual   = billing === 'annually';
          const isFeatured = plan.featured;

          return (
            <div
              key={plan.id}
              className="svc-card"
              style={{
                ...pc.card,
                animationDelay: `${pi * 0.1}s`,
                border: isFeatured ? `2px solid ${c}` : '1px solid rgba(99,102,241,0.1)',
                boxShadow: isFeatured ? `0 0 60px ${c}25, 0 20px 50px rgba(0,0,0,0.5)` : '0 8px 30px rgba(0,0,0,0.3)',
                transform: isFeatured ? 'scale(1.03)' : 'scale(1)',
                position: 'relative',
                zIndex: isFeatured ? 2 : 1,
              }}
            >
              {/* Per-plan share button */}
              <div style={{ position:'absolute', top:12, right:12, zIndex:5 }}>
                <ShareBtn title={plan.title} desc={plan.description} onToast={onToast} />
              </div>

              {/* Popular / New badge */}
              {isFeatured && (
                <div style={{ ...pc.badge, background: `linear-gradient(135deg,${c},${c}bb)` }}>
                  MOST POPULAR
                </div>
              )}
              {plan.category === 'New' && !isFeatured && (
                <div style={{ ...pc.badge, background: 'rgba(16,185,129,0.9)', color: 'white' }}>
                  ✦ NEW PLAN
                </div>
              )}

              {/* Plan name */}
              <p style={{ ...pc.planName, color: isFeatured ? c : '#94a3b8' }}>{plan.title}</p>

              {/* Price block */}
              <div style={pc.priceBlock}>
                {isAnnual && origPrice > 0 && (
                  <span style={pc.origPrice}>
                    {plan.currency || '$'}{origPrice.toLocaleString()}
                  </span>
                )}
                <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                  <span style={{ ...pc.price, color: isFeatured ? '#f1f5f9' : '#e2e8f0' }}>
                    {plan.currency || '$'}{shownPrice.toLocaleString()}
                  </span>
                  <span style={pc.priceSub}>/mo</span>
                </div>
                {plan.description && (
                  <p style={pc.planMeta}>{plan.description}</p>
                )}
              </div>

              {/* CTA button */}
              <Link
                to="/contact"
                className="svc-btn"
                style={{
                  ...pc.ctaBtn,
                  background: isFeatured
                    ? `linear-gradient(135deg,${c},${c}cc)`
                    : `${c}18`,
                  border: `1.5px solid ${c}`,
                  color: isFeatured ? 'white' : c,
                  boxShadow: isFeatured ? `0 4px 20px ${c}50` : 'none',
                }}
              >
                {isFeatured ? '🚀 Get Started' : 'Subscribe'}
              </Link>

              {/* Try link */}
              <a href="/contact" style={pc.tryLink}>Try it free →</a>

              {/* Divider */}
              <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'20px 0' }} />

              {/* Feature list */}
              <p style={pc.featHead}>What's included:</p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
                {(plan.features || []).map((f, fi) => (
                  <li key={fi} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <span style={{
                      width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:1,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      background: `${c}20`, color: c, fontSize:11, fontWeight:800,
                    }}>✓</span>
                    <span style={{ color:'#94a3b8', fontSize:13.5, lineHeight:1.55 }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Annual savings note */}
      {billing === 'annually' && (
        <p style={{ textAlign:'center', color:'#34d399', fontSize:13, marginTop:24, fontWeight:600 }}>
          🎉 You're saving 25% with annual billing — billed as one payment per year
        </p>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [mounted, setMounted]   = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = useCallback((msg) => setToast(msg), []);

  useEffect(() => {
    setMounted(true);
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getCollection(COLLECTIONS.SERVICES);
      setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ServicesPageSkeleton />;

  const projectPlans = services.filter(s => !s.period || s.period === 'project' || s.period === 'hour');
  const monthlyPlans = services.filter(s => s.period === 'month' || s.period === 'year');

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── HERO ── */}
      <section style={s.headerSec}>
        <div style={{ ...s.orb, width:'560px', height:'560px', background:'radial-gradient(circle,rgba(6,182,212,0.13),transparent 70%)', top:'-180px', left:'-140px' }} />
        <div style={{ ...s.orb, width:'420px', height:'420px', background:'radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)', bottom:'-100px', right:'-80px' }} />
        <div style={{ ...s.headerContent, opacity: mounted?1:0, transform: mounted?'translateY(0)':'translateY(20px)' }}>
          <span style={s.heroBadge}>✦ Premium Offerings</span>
          <h1 style={s.title}>Choose the best plan<br /><span style={s.gradientText}>for your business</span></h1>
          <p style={s.subtitle}>Flexible pricing for every stage — one-time projects or ongoing monthly partnerships.</p>
        </div>
      </section>

      {/* ════════════ SECTION 1 — PER PROJECT ════════════ */}
      {projectPlans.length > 0 && (
        <section style={s.section}>
          <div style={s.divider}>
            <div style={s.divLine} />
            <div style={s.divBadge}>
              <span>🎯</span><span>One-Time Project</span>
            </div>
            <div style={s.divLine} />
          </div>
          <p style={s.secDesc}>Pay once, own it forever. Perfect for launching your idea.</p>
          <div style={s.projectGrid}>
            {projectPlans.map((svc,i) => (
              <ProjectCard key={svc.id} svc={svc} idx={i} delay={i*0.1} onToast={showToast} />
            ))}
          </div>
        </section>
      )}

      {/* ════════════ SECTION 2 — PER MONTH ════════════ */}
      {monthlyPlans.length > 0 && (
        <section style={{ ...s.section, paddingTop: projectPlans.length > 0 ? 80 : 0 }}>
          <div style={s.divider}>
            <div style={s.divLine} />
            <div style={{ ...s.divBadge, background:'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))', borderColor:'rgba(99,102,241,0.35)', color:'#818cf8' }}>
              <span>🔄</span><span>Monthly Subscription</span>
            </div>
            <div style={s.divLine} />
          </div>
          <p style={s.secDesc}>Ongoing partnership — scale your plan anytime, cancel anytime.</p>
          <MonthlyPricing plans={monthlyPlans} onToast={showToast} />
        </section>
      )}

      {services.length === 0 && (
        <div style={s.emptyState}>No services available yet.</div>
      )}

      {/* ── CTA ── */}
      <section style={s.ctaBanner}>
        <div style={s.ctaOrb} />
        <h2 style={s.ctaTitle}>Not sure which plan fits?</h2>
        <p style={s.ctaSub}>Let's talk — I'll recommend the best option for your goals.</p>
        <Link to="/contact" style={s.ctaBtn} className="svc-btn">Start a Conversation →</Link>
      </section>

      {/* ── Floating Share Button ── */}
      <button
        className="svc-share-btn"
        style={s.floatShare}
        onClick={() => shareService('Services — LaolimHeang', 'Check out premium digital services', showToast)}
        title="Share this page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Share Page
      </button>

      {/* Toast */}
      {toast && <SvcToast message={toast} onDone={() => setToast('')} />}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SHARED PRIMITIVES
══════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes svcToastIn { from{opacity:0;transform:translateY(14px) translateX(-50%)} to{opacity:1;transform:translateY(0) translateX(-50%)} }
  .svc-card{opacity:0;animation:fadeUp 0.55s ease forwards;}
  .svc-card:hover{transform:translateY(-6px) !important;box-shadow:0 28px 55px rgba(0,0,0,0.55) !important;}
  .svc-btn:hover{filter:brightness(1.12);transform:translateY(-1px);}
  .svc-share-btn:hover{background:rgba(99,102,241,0.22) !important;border-color:rgba(99,102,241,0.45) !important;color:#c7d2fe !important;}
`;

const shell = { background:'rgba(12,12,26,0.7)', border:'1px solid rgba(99,102,241,0.08)', borderRadius:24, padding:'32px 24px', display:'flex', flexDirection:'column', backdropFilter:'blur(12px)', transition:'all 0.3s' };
const ribbon = { position:'absolute', top:18, right:-8, background:'linear-gradient(135deg,#f59e0b,#ef4444)', color:'white', fontSize:11, fontWeight:700, padding:'5px 16px', borderRadius:'20px 0 0 20px', boxShadow:'0 4px 12px rgba(245,158,11,0.45)', zIndex:2 };
const iconBox = { width:58, height:58, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 };
const catTag  = { fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, whiteSpace:'nowrap', flexShrink:0 };
const cTitle  = { color:'#f1f5f9', fontSize:20, fontWeight:800, margin:'0 0 10px', letterSpacing:'-0.01em' };
const cDesc   = { color:'#64748b', fontSize:14.5, lineHeight:1.6, margin:'0 0 20px', flex:1 };
const pRow    = { display:'flex', alignItems:'baseline', gap:6, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:20 };
const pVal    = { fontSize:34, fontWeight:900, color:'#f1f5f9', letterSpacing:'-0.03em' };
const pPer    = { fontSize:13, color:'#475569', fontWeight:500 };
const fList   = { listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:10 };
const fItem   = { display:'flex', alignItems:'flex-start', gap:10, color:'#94a3b8', fontSize:13.5, lineHeight:1.5 };
const actBtn  = { display:'flex', justifyContent:'center', alignItems:'center', width:'100%', padding:14, borderRadius:12, color:'white', fontSize:15, fontWeight:700, textDecoration:'none', transition:'all 0.2s' };

/* share */
const shareBtn = { display:'inline-flex', alignItems:'center', gap:5, padding:'5px 11px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.22)', borderRadius:20, color:'#818cf8', fontSize:11, fontWeight:600, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' };
const toastS   = { position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', zIndex:9999, display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', background:'rgba(10,10,24,0.97)', border:'1px solid rgba(52,211,153,0.3)', borderRadius:50, color:'#e2e8f0', fontSize:13, fontWeight:600, boxShadow:'0 12px 40px rgba(0,0,0,0.6)', backdropFilter:'blur(12px)', animation:'svcToastIn 0.3s ease', whiteSpace:'nowrap' };

/* toggle */
const tog = {
  wrap:      { display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:48 },
  label:     { fontSize:14, fontWeight:600, transition:'color 0.2s', display:'flex', alignItems:'center', gap:8 },
  track:     { position:'relative', width:44, height:24, background:'rgba(30,41,59,0.8)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:12, cursor:'pointer', flexShrink:0 },
  thumb:     { position:'absolute', top:3, width:18, height:18, borderRadius:'50%', transition:'left 0.25s ease, background 0.25s ease', boxShadow:'0 2px 6px rgba(0,0,0,0.4)' },
  saveBadge: { display:'inline-flex', alignItems:'center', padding:'2px 9px', background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.3)', borderRadius:20, color:'#34d399', fontSize:11, fontWeight:700, letterSpacing:'0.04em' },
};

/* monthly plan cards */
const pc = {
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:24, alignItems:'start' },
  card: { background:'rgba(10,10,22,0.8)', borderRadius:20, padding:'32px 24px 28px', display:'flex', flexDirection:'column', backdropFilter:'blur(16px)', transition:'all 0.3s' },
  badge: { display:'inline-flex', alignSelf:'center', marginBottom:16, padding:'5px 16px', borderRadius:20, color:'white', fontSize:10, fontWeight:900, letterSpacing:'0.1em', textTransform:'uppercase', boxShadow:'0 4px 14px rgba(0,0,0,0.4)' },
  planName: { fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 14px', textAlign:'center' },
  priceBlock: { textAlign:'center', marginBottom:20 },
  origPrice: { fontSize:18, color:'#475569', textDecoration:'line-through', fontWeight:600, display:'block', marginBottom:2 },
  price: { fontSize:42, fontWeight:900, letterSpacing:'-0.04em' },
  priceSub: { fontSize:14, color:'#475569', fontWeight:500 },
  planMeta: { color:'#64748b', fontSize:12.5, lineHeight:1.5, margin:'8px 0 0' },
  ctaBtn: { display:'flex', justifyContent:'center', alignItems:'center', width:'100%', padding:'13px', borderRadius:12, fontSize:14, fontWeight:700, textDecoration:'none', transition:'all 0.2s', marginBottom:8 },
  tryLink: { display:'block', textAlign:'center', color:'#475569', fontSize:12.5, fontWeight:500, textDecoration:'none', paddingBottom:2, transition:'color 0.2s' },
  featHead: { color:'#334155', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' },
};

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },
  headerSec: { position:'relative', padding:'120px 4vw 70px', textAlign:'center', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  headerContent: { position:'relative', zIndex:1, maxWidth:680, margin:'0 auto', transition:'all 0.8s ease' },
  heroBadge: { display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:20, fontSize:11, fontWeight:700, color:'#818cf8', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:18 },
  title: { fontSize:'clamp(32px,5vw,56px)', fontWeight:900, color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.03em', lineHeight:1.15 },
  gradientText: { background:'linear-gradient(135deg,#06b6d4,#6366f1)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  subtitle: { color:'#64748b', fontSize:17, lineHeight:1.65, margin:0 },

  section: { maxWidth:1600, margin:'0 auto', padding:'0 4vw 80px' },
  divider: { display:'flex', alignItems:'center', gap:16, marginBottom:12 },
  divLine: { flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.15),transparent)' },
  divBadge: { display:'flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:20, background:'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(59,130,246,0.15))', border:'1px solid rgba(6,182,212,0.3)', color:'#06b6d4', fontSize:14, fontWeight:700, whiteSpace:'nowrap' },
  secDesc: { textAlign:'center', color:'#475569', fontSize:14, marginBottom:40 },
  projectGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:28 },

  ctaBanner: { position:'relative', textAlign:'center', padding:'100px 24px', overflow:'hidden' },
  ctaOrb: { position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12),transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' },
  ctaTitle: { fontSize:'clamp(26px,4vw,44px)', fontWeight:900, color:'#f1f5f9', margin:'0 0 14px', letterSpacing:'-0.02em', position:'relative', zIndex:1 },
  ctaSub: { color:'#94a3b8', fontSize:16, margin:'0 0 32px', position:'relative', zIndex:1 },
  ctaBtn: { display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:14, color:'white', fontWeight:700, fontSize:16, textDecoration:'none', boxShadow:'0 4px 20px rgba(99,102,241,0.45)', transition:'all 0.25s', position:'relative', zIndex:1 },
  emptyState: { textAlign:'center', color:'#64748b', padding:'60px 0', fontSize:16 },
  floatShare: { position:'fixed', bottom:28, right:28, zIndex:100, display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', background:'rgba(10,10,24,0.92)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:50, color:'#818cf8', fontSize:13, fontWeight:700, cursor:'pointer', backdropFilter:'blur(14px)', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', transition:'all 0.2s', fontFamily:"'Inter',sans-serif" },
};

export default Services;
