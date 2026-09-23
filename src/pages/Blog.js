import React, { useState, useEffect, useRef } from 'react';
import { getCollection } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { Link } from 'react-router-dom';
import { BlogPageSkeleton } from '../components/common/Skeleton';

// --- Tilt Component ---
const TiltContainer = ({ children, style, className, to }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <Link 
      to={to}
      ref={cardRef} 
      className={className}
      style={{ ...style, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Link>
  );
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const data = await getCollection(COLLECTIONS.BLOGS);
      const published = (data || []).filter(b => b.published);
      if (published.length > 0) {
        setBlogs(published.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.warn('Could not load blogs from database:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Header */}
      <section style={s.headerSec}>
        <div style={{...s.orb, width:'600px', height:'600px', background:'radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)', top:'-200px', left:'50%', transform:'translateX(-50%)'}} />
        <div style={{...s.headerContent, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)'}}>
          <h1 style={s.title}>Knowledge <span style={s.gradientText}>Graph</span></h1>
          <p style={s.subtitle}>Research, tutorials, and deep-dives into software architecture, algorithms, and engineering best practices.</p>
        </div>
      </section>

      {/* Content */}
      <section style={s.contentSec}>
        {loading ? (
          <BlogPageSkeleton />
        ) : blogs.length === 0 ? (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
            </div>
            <p>No nodes found in the knowledge graph.</p>
          </div>
        ) : (
          <div style={s.grid}>
            {blogs.map((blog, i) => (
              <TiltContainer key={blog.id} to={`/blog/${blog.slug}`} className="blog-card" style={{...s.card, animationDelay: `${i * 0.1}s`}}>
                {blog.thumbnail ? (
                  <div style={s.thumbWrap}>
                    <img src={blog.thumbnail} alt={blog.title} style={s.thumbImg} className="thumb-img" />
                    <div style={s.thumbOverlay} />
                    {blog.category && <span style={s.catBadge}>{blog.category}</span>}
                  </div>
                ) : (
                  <div style={{...s.thumbWrap, background:'linear-gradient(135deg,#0d1117,#1e293b)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'rgba(255,255,255,0.05)',fontSize:'64px'}}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    {blog.category && <span style={s.catBadge}>{blog.category}</span>}
                  </div>
                )}
                
                <div style={s.cardBody}>
                  <div style={s.metaData}>
                    {blog.createdAt && (
                      <span style={s.date}>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                      </span>
                    )}
                    {blog.author && (
                      <>
                        <span style={s.dot}>·</span>
                        <span style={s.author}>{blog.author}</span>
                      </>
                    )}
                  </div>
                  
                  <h3 style={s.cardTitle} className="card-title">{blog.title}</h3>
                  <p style={s.cardExcerpt}>{blog.content}</p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div style={s.tagWrap}>
                      {blog.tags.slice(0,4).map(tag => (
                        <span key={tag} style={s.tag}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div style={s.readMore} className="read-more">
                    Traverse Node <span className="arrow">→</span>
                  </div>
                </div>
              </TiltContainer>
            ))}
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
  .blog-card { opacity: 0; animation: fadeUp 0.6s ease forwards; text-decoration: none; display: block; }
  .blog-card:hover { border-color: rgba(16,185,129,0.4) !important; box-shadow: 0 30px 60px rgba(0,0,0,0.5) !important; }
  .blog-card:hover .thumb-img { transform: scale(1.08); }
  .blog-card:hover .card-title { color: #34d399 !important; }
  .blog-card:hover .read-more { color: #34d399 !important; }
  .blog-card:hover .arrow { transform: translateX(5px); }
  .arrow { display: inline-block; transition: transform 0.2s; }
`;

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },
  headerSec: { position:'relative', padding:'120px 4vw 60px', textAlign:'center', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  headerContent: { position:'relative', zIndex:1, maxWidth:'700px', margin:'0 auto', transition:'all 0.8s ease' },
  title: { fontSize:'clamp(36px,5vw,56px)', fontWeight:'900', color:'#f1f5f9', margin:'0 0 16px', letterSpacing:'-0.03em' },
  gradientText: { background:'linear-gradient(135deg,#10b981,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  subtitle: { color:'#64748b', fontSize:'17px', lineHeight:'1.6', margin:0 },
  
  contentSec: { maxWidth:'1600px', margin:'0 auto', padding:'0 4vw 100px' },
  loaderWrap: { display:'flex', justifyContent:'center', padding:'80px 0' },
  spinner: { width:'32px', height:'32px', border:'3px solid rgba(16,185,129,0.2)', borderTopColor:'#10b981', borderRadius:'50%', animation:'spin 1s linear infinite' },
  
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'32px' },
  card: { background:'rgba(12,12,26,0.5)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'24px', overflow:'hidden', display:'flex', flexDirection:'column', backdropFilter:'blur(10px)' },
  
  thumbWrap: { position:'relative', height:'240px', overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,0.05)' },
  thumbImg: { width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' },
  thumbOverlay: { position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,5,10,1) 0%, transparent 100%)' },
  catBadge: { position:'absolute', top:'16px', left:'16px', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', color:'#f1f5f9', fontSize:'11px', fontWeight:'700', padding:'6px 14px', borderRadius:'20px', textTransform:'uppercase', letterSpacing:'0.05em', zIndex:2 },
  
  cardBody: { padding:'28px', display:'flex', flexDirection:'column', flex:1, zIndex:1 },
  metaData: { display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px', color:'#64748b', fontSize:'13px', fontWeight:'500' },
  dot: { fontSize:'16px', lineHeight:0 },
  
  cardTitle: { color:'#f1f5f9', fontSize:'22px', fontWeight:'800', margin:'0 0 12px', lineHeight:'1.4', transition:'color 0.2s', letterSpacing:'-0.01em' },
  cardExcerpt: { color:'#94a3b8', fontSize:'14.5px', lineHeight:'1.65', margin:'0 0 24px', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 },
  
  tagWrap: { display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' },
  tag: { fontSize:'11.5px', fontWeight:'600', color:'#475569', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', padding:'4px 12px', borderRadius:'8px' },
  
  readMore: { display:'inline-flex', alignItems:'center', gap:'6px', color:'#e2e8f0', fontSize:'14.5px', fontWeight:'700', transition:'color 0.2s', marginTop:'auto' },
  
  emptyState: { textAlign:'center', color:'#64748b', padding:'80px 0', fontSize:'16px' },
  emptyIcon: { color:'rgba(255,255,255,0.1)', marginBottom:'16px' }
};

export default Blog;
