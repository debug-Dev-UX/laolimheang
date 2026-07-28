import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';

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

const CATEGORIES = ['Technology','Design','Business','Tutorial','Personal','Photography','Travel','Other'];
const emptyForm = { title:'', slug:'', content:'', category:'', tags:'', author:'', thumbnail:'', published:false };

const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial
      ? { ...emptyForm, ...initial, tags:(initial.tags||[]).join(', ') }
      : emptyForm
    );
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => {
      const next = { ...p, [name]: type==='checkbox' ? checked : value };
      if (name === 'title' && !initial) next.slug = toSlug(value);
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
    await onSave(payload);
    setSaving(false);
    onClose();
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

        <form onSubmit={submit} style={md.form}>
          {/* Title */}
          <div style={md.field}>
            <label style={md.lbl}>Post Title *</label>
            <input className="b-inp" name="title" value={form.title} onChange={handle} required placeholder="My Awesome Blog Post" style={inp} />
          </div>

          {/* Slug */}
          <div style={md.field}>
            <label style={md.lbl}>URL Slug</label>
            <div style={{position:'relative'}}>
              <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#334155',fontSize:'13px',pointerEvents:'none'}}>/blog/</span>
              <input className="b-inp" name="slug" value={form.slug} onChange={handle} placeholder="my-awesome-post"
                style={{...inp, paddingLeft:'52px'}} />
            </div>
          </div>

          {/* Row */}
          <div style={md.grid2} className="modal-grid">
            <div style={md.field}>
              <label style={md.lbl}>Category</label>
              <select name="category" value={form.category} onChange={handle} style={{...inp, cursor:'pointer'}}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Author</label>
              <input className="b-inp" name="author" value={form.author} onChange={handle} placeholder="Your name" style={inp} />
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Thumbnail URL</label>
              <input className="b-inp" name="thumbnail" value={form.thumbnail || ''} onChange={handle} placeholder="https://example.com/image.jpg" style={inp} />
            </div>
          </div>

          {/* Tags */}
          <div style={md.field}>
            <label style={md.lbl}>Tags <span style={{color:'#334155',fontWeight:'400'}}>(comma-separated)</span></label>
            <input className="b-inp" name="tags" value={form.tags} onChange={handle}
              placeholder="React, Tutorial, JavaScript" style={inp} />
            {form.tags && (
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
            <textarea className="b-inp" name="content" value={form.content} onChange={handle} rows={5}
              placeholder="Write your blog post content here..." style={{...inp, resize:'vertical', lineHeight:'1.6'}} />
          </div>

          {/* Publish toggle */}
          <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',userSelect:'none'}}>
            <div style={{position:'relative',width:'36px',height:'20px',flexShrink:0}} onClick={() => setForm(p=>({...p,published:!p.published}))}>
              <div style={{position:'absolute',inset:0,borderRadius:'10px',background:form.published?'linear-gradient(135deg,#10b981,#059669)':'rgba(30,41,59,0.8)',transition:'background 0.2s',border:'1px solid rgba(16,185,129,0.2)'}} />
              <div style={{position:'absolute',top:'2px',left:form.published?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}} />
            </div>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>
              {form.published ? <span style={{color:'#34d399'}}>● Published</span> : <span>○ Save as Draft</span>}
            </span>
          </label>

          {/* Actions */}
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',paddingTop:'4px'}}>
            <button type="button" onClick={onClose}
              style={{padding:'9px 20px',background:'transparent',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'9px',color:'#475569',fontSize:'13.5px',fontWeight:'500',cursor:'pointer'}}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 22px',background:'linear-gradient(135deg,#10b981,#059669)',border:'none',borderRadius:'9px',color:'white',fontSize:'13.5px',fontWeight:'600',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,boxShadow:'0 4px 14px rgba(16,185,129,0.35)'}}>
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
  const { data: blogs, loading, getCollection, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.BLOGS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { getCollection(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = blogs.filter(b => {
    const matchSearch = b.title?.toLowerCase().includes(search.toLowerCase()) || b.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus==='all' || (filterStatus==='published'&&b.published) || (filterStatus==='draft'&&!b.published);
    return matchSearch && matchStatus;
  });

  const handleSave = async (data) => {
    if (editItem) { await updateDoc(editItem.id, data); showToast('Post updated!'); }
    else { await addDoc(data); showToast('Post created!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    await deleteDoc(id);
    showToast('Post deleted.');
  };

  const published = blogs.filter(b=>b.published).length;
  const drafts = blogs.length - published;

  return (
    <div style={pg.page}>
      <style>{css}</style>

      {toast && <div style={pg.toast}>✓ {toast}</div>}

      {/* Header */}
      <div style={pg.header}>
        <div>
          <h1 style={pg.title}>Blog Posts</h1>
          <p style={pg.sub}>
            <span style={{color:'#818cf8',fontWeight:'600'}}>{blogs.length}</span> total ·
            <span style={{color:'#34d399',fontWeight:'600'}}> {published} published</span> ·
            <span style={{color:'#475569',fontWeight:'600'}}> {drafts} drafts</span>
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
            color: filterStatus===s ? '#818cf8' : '#475569',
          }}>
            {s==='all'?'All':s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={pg.tableWrap}>
        {loading ? (
          <div style={pg.center}><div style={spinEl} /></div>
        ) : filtered.length === 0 ? (
          <div style={pg.center}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{color:'#1e293b',marginBottom:'12px'}}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{color:'#334155',margin:'0 0 16px',fontSize:'14px'}}>{search?'No posts match your search':'No blog posts yet'}</p>
            {!search && <button style={pg.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>Write First Post</button>}
          </div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Tags</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(blog => (
                <tr key={blog.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'8px',background:blog.thumbnail?`url(${blog.thumbnail}) center/cover`:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#34d399',flexShrink:0}}>
                        {!blog.thumbnail && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                      </div>
                      <div>
                        <p style={{color:'#e2e8f0',fontWeight:'600',fontSize:'13.5px',margin:'0 0 1px'}}>{blog.title}</p>
                        {blog.slug && <p style={{color:'#1e293b',fontSize:'11px',margin:0}}>/blog/{blog.slug}</p>}
                      </div>
                    </div>
                  </td>
                  <td><span style={{color:'#64748b',fontSize:'13px'}}>{blog.category||'—'}</span></td>
                  <td><span style={{color:'#64748b',fontSize:'13px'}}>{blog.author||'—'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                      {(blog.tags||[]).slice(0,2).map(t=>(
                        <span key={t} style={{fontSize:'10px',padding:'2px 7px',borderRadius:'20px',background:'rgba(16,185,129,0.08)',color:'#34d399',border:'1px solid rgba(16,185,129,0.15)',fontWeight:'600'}}>#{t}</span>
                      ))}
                      {(blog.tags||[]).length>2 && <span style={{color:'#334155',fontSize:'11px'}}>+{blog.tags.length-2}</span>}
                    </div>
                  </td>
                  <td>
                    <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 10px',borderRadius:'20px',
                      background:blog.published?'rgba(16,185,129,0.12)':'rgba(30,41,59,0.6)',
                      color:blog.published?'#34d399':'#475569',
                      border:blog.published?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(30,41,59,0.8)'}}>
                      {blog.published?'● Published':'○ Draft'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button className="b-edit-btn" onClick={() => { setEditItem(blog); setModalOpen(true); }}>Edit</button>
                      <button className="b-del-btn" onClick={() => handleDelete(blog.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editItem} />
    </div>
  );
};

const spinEl = { display:'inline-block', width:'14px', height:'14px', border:'2px solid rgba(255,255,255,0.25)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0 };

const pg = {
  page: { display:'flex', flexDirection:'column', gap:'20px', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' },
  title: { color:'#f1f5f9', fontSize:'24px', fontWeight:'700', margin:'0 0 5px', letterSpacing:'-0.02em' },
  sub: { color:'#475569', fontSize:'13px', margin:0 },
  addBtn: { display:'flex', alignItems:'center', gap:'7px', padding:'10px 18px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'10px', color:'white', fontSize:'13.5px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 15px rgba(16,185,129,0.35)' },
  sInput: { width:'100%', paddingLeft:'36px', paddingRight:'14px', paddingTop:'10px', paddingBottom:'10px', background:'rgba(15,15,30,0.7)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:'10px', color:'#e2e8f0', fontSize:'13.5px', outline:'none', boxSizing:'border-box' },
  tableWrap: { background:'rgba(10,10,24,0.6)', border:'1px solid rgba(99,102,241,0.08)', borderRadius:'16px', overflowX:'auto' },
  center: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px' },
  toast: { position:'fixed', top:'20px', right:'24px', zIndex:200, padding:'12px 18px', borderRadius:'10px', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', color:'#34d399', fontSize:'13.5px', fontWeight:'500', animation:'fadeIn 0.2s ease', boxShadow:'0 8px 30px rgba(0,0,0,0.4)' },
};

const md = {
  backdrop: { position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  box: { background:'#0d0d20', border:'1px solid rgba(99,102,241,0.15)', borderRadius:'20px', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflow:'auto', boxShadow:'0 30px 60px rgba(0,0,0,0.6)' },
  head: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 24px 0' },
  title: { color:'#f1f5f9', fontSize:'18px', fontWeight:'700', margin:0 },
  xBtn: { width:'32px', height:'32px', borderRadius:'8px', background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.12)', color:'#64748b', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' },
  form: { padding:'20px 24px 24px', display:'flex', flexDirection:'column', gap:'16px' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  field: { display:'flex', flexDirection:'column', gap:'6px' },
  lbl: { color:'#64748b', fontSize:'12.5px', fontWeight:'500' },
};

export default BlogsAdmin;
