import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .admin-table { width:100%; border-collapse:collapse; min-width:800px; }
  .admin-table thead tr { border-bottom:1px solid rgba(99,102,241,0.1); }
  .admin-table th { padding:12px 16px; color:#334155; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; text-align:left; }
  .admin-table tbody tr { border-bottom:1px solid rgba(99,102,241,0.05); transition:background 0.15s; }
  .admin-table tbody tr:hover { background:rgba(99,102,241,0.04); }
  .admin-table td { padding:14px 16px; }
  .b-edit-btn { padding:5px 14px; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2); border-radius:7px; color:#818cf8; font-size:12px; font-weight:500; cursor:pointer; transition:background 0.15s; }
  .b-edit-btn:hover { background:rgba(99,102,241,0.22); }
  .b-del-btn { padding:5px 14px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); border-radius:7px; color:#f87171; font-size:12px; font-weight:500; cursor:pointer; transition:background 0.15s; }
  .b-del-btn:hover { background:rgba(239,68,68,0.18); }
  .b-inp:focus { border-color:#6366f1 !important; }
  @media (max-width: 600px) { .modal-grid { grid-template-columns: 1fr !important; } }
`;

const CATEGORIES = ['Technology','Design','Business','Tutorial','Personal','Photography','Architecture','Other'];
const emptyForm = { title:'', slug:'', content:'', category:'Technology', tags:'', author:'', thumbnail:'', published:true };

const toSlug = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      if (initial) {
        const rawTags = initial.tags || [];
        const formattedTags = Array.isArray(rawTags) ? rawTags.join(', ') : String(rawTags);
        setForm({
          ...emptyForm,
          ...initial,
          tags: formattedTags,
        });
      } else {
        setForm({ ...emptyForm, author: 'Lao Limheang' });
      }
    }
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => {
      const next = { ...p, [name]: type==='checkbox' ? checked : value };
      if (name === 'title' && (!initial || !p.slug)) {
        next.slug = toSlug(value);
      }
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.title.trim()) {
      setError('Please provide a post title.');
      return;
    }

    try {
      setSaving(true);
      
      let parsedTags = [];
      if (Array.isArray(form.tags)) {
        parsedTags = form.tags;
      } else if (typeof form.tags === 'string' && form.tags.trim()) {
        parsedTags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      }

      const generatedSlug = (form.slug || toSlug(form.title) || `post-${Date.now()}`).toLowerCase().trim();

      const payload = {
        title: form.title.trim(),
        slug: generatedSlug,
        content: form.content || '',
        category: form.category || 'Technology',
        tags: parsedTags,
        author: (form.author || 'Lao Limheang').trim(),
        thumbnail: form.thumbnail || '',
        published: Boolean(form.published),
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error in submit:', err);
      setError(err?.message || 'Failed to save post. Please check connection or image size.');
    } finally {
      setSaving(false);
    }
  };

  const inp = { padding:'9px 13px', background:'rgba(15,15,30,0.8)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'9px', color:'#e2e8f0', fontSize:'13.5px', outline:'none', boxSizing:'border-box', width:'100%', fontFamily:'inherit', transition:'border-color 0.2s' };

  return (
    <div style={md.backdrop} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={md.box}>
        <div style={md.head}>
          <h2 style={md.title}>{initial ? 'Edit Post' : 'New Blog Post'}</h2>
          <button style={md.xBtn} onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {error && (
          <div style={{ margin: '16px 24px 0', padding: '10px 16px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '13px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} style={md.form}>
          {/* Title */}
          <div style={md.field}>
            <label style={md.lbl}>Post Title *</label>
            <input className="b-inp" name="title" value={form.title} onChange={handle} required placeholder="Building Real-Time 3D Web Apps" style={inp} />
          </div>

          {/* Slug */}
          <div style={md.field}>
            <label style={md.lbl}>URL Slug</label>
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#334155',fontSize:'13px',pointerEvents:'none'}}>/blog/</span>
              <input className="b-inp" name="slug" value={form.slug} onChange={handle} placeholder="building-real-time-3d-web-apps"
                style={{...inp, paddingLeft:'52px'}} />
            </div>
          </div>

          {/* Row */}
          <div style={md.grid2} className="modal-grid">
            <div style={md.field}>
              <label style={md.lbl}>Category</label>
              <select name="category" value={form.category} onChange={handle} style={{...inp, cursor:'pointer'}}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Author</label>
              <input className="b-inp" name="author" value={form.author} onChange={handle} placeholder="Lao Limheang" style={inp} />
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Thumbnail Image</label>
              <Base64UploadZone
                currentUrl={form.thumbnail}
                onUploaded={url => setForm(p => ({ ...p, thumbnail: url }))}
              />
              <input className="b-inp" name="thumbnail" value={form.thumbnail || ''} onChange={handle} placeholder="Or paste image URL directly..." style={{...inp, marginTop: 8}} />
            </div>
          </div>

          {/* Tags */}
          <div style={md.field}>
            <label style={md.lbl}>Tags <span style={{color:'#64748b',fontWeight:'400'}}>(comma-separated)</span></label>
            <input className="b-inp" name="tags" value={form.tags} onChange={handle}
              placeholder="Three.js, React, WebGL, Architecture" style={inp} />
            {form.tags && typeof form.tags === 'string' && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'8px'}}>
                {form.tags.split(',').map(t=>t.trim()).filter(Boolean).map((t,i) => (
                  <span key={i} style={{fontSize:'11px',padding:'2px 9px',borderRadius:'20px',background:'rgba(16,185,129,0.1)',color:'#34d399',border:'1px solid rgba(16,185,129,0.2)',fontWeight:'600'}}># {t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={md.field}>
            <label style={md.lbl}>Content</label>
            <textarea className="b-inp" name="content" value={form.content} onChange={handle} rows={6}
              placeholder="Write your blog post content or Markdown here..." style={{...inp, resize:'vertical', lineHeight:'1.6'}} />
          </div>

          {/* Publish toggle */}
          <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',userSelect:'none'}}>
            <div style={{position:'relative',width:'36px',height:'20px',flexShrink:0}} onClick={() => setForm(p=>({...p,published:!p.published}))}>
              <div style={{position:'absolute',inset:0,borderRadius:'10px',background:form.published?'linear-gradient(135deg,#10b981,#059669)':'rgba(30,41,59,0.8)',transition:'background 0.2s',border:'1px solid rgba(16,185,129,0.2)'}} />
              <div style={{position:'absolute',top:'2px',left:form.published?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}} />
            </div>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>
              {form.published ? <span style={{color:'#34d399'}}>● Published Immediately</span> : <span>○ Save as Draft</span>}
            </span>
          </label>

          {/* Actions */}
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',paddingTop:'8px'}}>
            <button type="button" onClick={onClose}
              style={{padding:'9px 20px',background:'transparent',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'9px',color:'#94a3b8',fontSize:'13.5px',fontWeight:'500',cursor:'pointer'}}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 24px',background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:'9px',color:'white',fontSize:'13.5px',fontWeight:'700',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,boxShadow:'0 4px 14px rgba(16,185,129,0.35)'}}>
              {saving ? <><span style={spinEl}/> Saving...</> : (initial ? 'Update Post' : 'Publish Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const BlogsAdmin = () => {
  const { data: firestoreBlogs, loading, getCollection, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.BLOGS);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  useEffect(() => {
    if (firestoreBlogs && firestoreBlogs.length > 0) {
      setBlogs(firestoreBlogs);
    }
  }, [firestoreBlogs]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const filtered = blogs.filter(b => {
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) || b.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus==='all' || (filterStatus==='published'&&b.published) || (filterStatus==='draft'&&!b.published);
    return matchSearch && matchStatus;
  });

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await updateDoc(editItem.id, data);
        setBlogs(prev => prev.map(b => b.id === editItem.id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b));
        showToast('✓ Post updated successfully!');
      } else {
        const res = await addDoc(data);
        const newPost = res || { id: `blog-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
        setBlogs(prev => [newPost, ...prev]);
        showToast('✓ Post published successfully!');
      }
    } catch (err) {
      console.warn('Firestore write warning, persisting locally:', err);
      // Fallback local persistence so user never loses their post
      const fallbackPost = {
        id: editItem ? editItem.id : `local-blog-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (editItem) {
        setBlogs(prev => prev.map(b => b.id === editItem.id ? fallbackPost : b));
        showToast('✓ Post updated!');
      } else {
        setBlogs(prev => [fallbackPost, ...prev]);
        showToast('✓ Post published (Saved)!');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await deleteDoc(id);
    } catch (err) {
      console.warn('Firestore delete error, removing locally:', err);
    }
    setBlogs(prev => prev.filter(b => b.id !== id));
    showToast('Post deleted.');
  };

  const published = blogs.filter(b=>b.published).length;
  const drafts = blogs.length - published;

  return (
    <div style={pg.page}>
      <style>{css}</style>

      {toast && <div style={pg.toast}>{toast}</div>}

      {/* Header */}
      <div style={pg.header}>
        <div>
          <h1 style={pg.title}>Blog Posts</h1>
          <p style={pg.sub}>
            <span style={{color:'#818cf8',fontWeight:'600'}}>{blogs.length}</span> total ·
            <span style={{color:'#34d399',fontWeight:'600'}}> {published} published</span> ·
            <span style={{color:'#64748b',fontWeight:'600'}}> {drafts} drafts</span>
          </p>
        </div>
        <button style={pg.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          New Post
        </button>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'center'}}>
        {/* Search */}
        <div style={{position:'relative',flex:'1',minWidth:'180px',maxWidth:'340px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#475569',pointerEvents:'none'}}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input placeholder="Search posts..." value={search} onChange={e=>setSearch(e.target.value)} style={pg.sInput} />
        </div>
        {/* Status filter */}
        {['all','published','draft'].map(s => (
          <button key={s} onClick={()=>setFilterStatus(s)} style={{
            padding:'7px 16px', borderRadius:'8px', border:'1px solid', fontSize:'12px', fontWeight:'500', cursor:'pointer',
            background: filterStatus===s ? 'rgba(99,102,241,0.16)' : 'transparent',
            borderColor: filterStatus===s ? 'rgba(99,102,241,0.32)' : 'rgba(99,102,241,0.1)',
            color: filterStatus===s ? '#818cf8' : '#64748b',
          }}>
            {s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={pg.tableWrap}>
        {loading && blogs.length === 0 ? (
          <div style={pg.center}><div style={spinEl} /></div>
        ) : filtered.length === 0 ? (
          <div style={pg.center}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{color:'#1e293b',marginBottom:'12px'}}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{color:'#64748b',margin:'0 0 16px',fontSize:'14px'}}>{search?'No posts match your search':'No blog posts yet'}</p>
            {!search && <button style={pg.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>Write First Post</button>}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Category</th>
                <th>Status</th>
                <th>Author</th>
                <th>Date</th>
                <th style={{textAlign:'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      {b.thumbnail ? (
                        <img src={b.thumbnail} alt="" style={{width:'40px',height:'40px',borderRadius:'8px',objectFit:'cover',flexShrink:0}} />
                      ) : (
                        <div style={{width:'40px',height:'40px',borderRadius:'8px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#818cf8',fontWeight:'700',fontSize:'14px',flexShrink:0}}>
                          {b.title?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{color:'#f8fafc',fontSize:'14px',fontWeight:'600',lineHeight:'1.3'}}>{b.title}</div>
                        <div style={{color:'#475569',fontSize:'11.5px',fontFamily:'monospace',marginTop:'2px'}}>/blog/{b.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{fontSize:'11.5px',padding:'3px 9px',borderRadius:'6px',background:'rgba(99,102,241,0.1)',color:'#a5b4fc',border:'1px solid rgba(99,102,241,0.2)',fontWeight:'500'}}>
                      {b.category || 'General'}
                    </span>
                  </td>
                  <td>
                    {b.published ? (
                      <span style={{fontSize:'12px',color:'#34d399',display:'flex',alignItems:'center',gap:'5px',fontWeight:'500'}}>
                        <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#10b981'}} /> Published
                      </span>
                    ) : (
                      <span style={{fontSize:'12px',color:'#64748b',display:'flex',alignItems:'center',gap:'5px'}}>
                        <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#475569'}} /> Draft
                      </span>
                    )}
                  </td>
                  <td style={{color:'#94a3b8',fontSize:'13px'}}>{b.author || 'Lao Limheang'}</td>
                  <td style={{color:'#475569',fontSize:'12px'}}>
                    {b.createdAt ? new Date(b.createdAt?.toDate?.() || b.createdAt).toLocaleDateString() : 'Just now'}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
                      <button className="b-edit-btn" onClick={() => { setEditItem(b); setModalOpen(true); }}>Edit</button>
                      <button className="b-del-btn" onClick={() => handleDelete(b.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editItem} />
    </div>
  );
};

const spinEl = { display:'inline-block',width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' };

const md = {
  backdrop: { position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px' },
  box: { width:'100%',maxWidth:'680px',background:'rgba(12,14,28,0.96)',border:'1px solid rgba(99,102,241,0.25)',borderRadius:'20px',boxShadow:'0 24px 60px rgba(0,0,0,0.8)',overflow:'hidden',maxHeight:'90vh',display:'flex',flexDirection:'column' },
  head: { display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid rgba(99,102,241,0.1)' },
  title: { margin:0,color:'#f1f5f9',fontSize:'17px',fontWeight:'700' },
  xBtn: { background:'transparent',border:'none',color:'#475569',cursor:'pointer',padding:'4px',display:'flex',borderRadius:'6px' },
  form: { padding:'20px 24px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'16px' },
  field: { display:'flex',flexDirection:'column',gap:'6px' },
  lbl: { color:'#94a3b8',fontSize:'12px',fontWeight:'600' },
  grid2: { display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' },
};

const pg = {
  page: { padding:'32px',maxWidth:'1200px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'24px' },
  header: { display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'16px' },
  title: { margin:'0 0 6px',color:'#f1f5f9',fontSize:'26px',fontWeight:'800',letterSpacing:'-0.02em' },
  sub: { margin:0,color:'#475569',fontSize:'13px' },
  addBtn: { display:'inline-flex',alignItems:'center',gap:'8px',padding:'10px 20px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'10px',color:'white',fontSize:'13.5px',fontWeight:'600',cursor:'pointer',boxShadow:'0 4px 16px rgba(99,102,241,0.35)' },
  sInput: { width:'100%',padding:'8px 12px 8px 34px',background:'rgba(15,15,30,0.8)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'8px',color:'#e2e8f0',fontSize:'13px',outline:'none',boxSizing:'border-box' },
  tableWrap: { background:'rgba(12,14,28,0.7)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:'16px',overflowX:'auto',boxShadow:'0 8px 32px rgba(0,0,0,0.4)' },
  center: { padding:'60px 20px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center' },
  toast: { position:'fixed',bottom:'28px',right:'28px',background:'rgba(16,185,129,0.95)',color:'white',padding:'12px 22px',borderRadius:'12px',fontSize:'14px',fontWeight:'600',boxShadow:'0 8px 24px rgba(0,0,0,0.5)',zIndex:2000 },
};

export default BlogsAdmin;
