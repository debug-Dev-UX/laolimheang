import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';

/* ─── shared styles ─── */
const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .admin-table { width:100%; border-collapse:collapse; min-width:700px; }
  .admin-table thead tr { border-bottom:1px solid rgba(99,102,241,0.1); }
  .admin-table th { padding:12px 16px; color:#334155; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; text-align:left; }
  .admin-table tbody tr { border-bottom:1px solid rgba(99,102,241,0.05); transition:background 0.15s; }
  .admin-table tbody tr:hover { background:rgba(99,102,241,0.04); }
  .admin-table td { padding:14px 16px; }
  .s-edit-btn { padding:5px 14px; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2); border-radius:7px; color:#818cf8; font-size:12px; font-weight:500; cursor:pointer; transition:background 0.15s; }
  .s-edit-btn:hover { background:rgba(99,102,241,0.22); }
  .s-del-btn { padding:5px 14px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); border-radius:7px; color:#f87171; font-size:12px; font-weight:500; cursor:pointer; transition:background 0.15s; }
  .s-del-btn:hover { background:rgba(239,68,68,0.18); }
  .s-input:focus { border-color:#6366f1 !important; }
  .s-cancel:hover { background:rgba(99,102,241,0.08) !important; color:#818cf8 !important; }
  @media (max-width: 600px) { .modal-grid { grid-template-columns: 1fr !important; } }
`;

const emptyForm = { title:'', description:'', price:'', currency:'USD', period:'project', category:'', features:'', featured:false };
const CATEGORIES = ['Design','Development','Marketing','Consulting','E-Commerce','Support','Other'];

/* ─── Modal ─── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial
      ? { ...emptyForm, ...initial, features: (initial.features||[]).join(', '), price: initial.price ?? '' }
      : emptyForm
    );
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price) || 0,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    };
    await onSave(payload);
    setSaving(false);
    onClose();
  };

  const inp = { padding:'9px 13px', background:'rgba(15,15,30,0.8)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'9px', color:'#e2e8f0', fontSize:'13.5px', outline:'none', boxSizing:'border-box', width:'100%', fontFamily:'inherit', transition:'border-color 0.2s' };

  return (
    <div style={md.backdrop} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={md.box}>
        <div style={md.head}>
          <h2 style={md.title}>{initial ? 'Edit Service' : 'Add New Service'}</h2>
          <button style={md.xBtn} onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <form onSubmit={submit} style={md.form}>
          {/* Row 1 */}
          <div style={md.grid2} className="modal-grid">
            <div style={md.field}>
              <label style={md.lbl}>Service Title *</label>
              <input className="s-input" name="title" value={form.title} onChange={handle} required placeholder="Web Design" style={inp} />
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Category</label>
              <select name="category" value={form.category} onChange={handle} style={{...inp, cursor:'pointer'}}>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          {/* Row 2 */}
          <div style={md.grid3} className="modal-grid">
            <div style={md.field}>
              <label style={md.lbl}>Price</label>
              <input className="s-input" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handle} placeholder="99" style={inp} />
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Currency</label>
              <select name="currency" value={form.currency} onChange={handle} style={{...inp, cursor:'pointer'}}>
                {['USD','EUR','GBP','JPY','KHR','THB'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Billing Period</label>
              <select name="period" value={form.period} onChange={handle} style={{...inp, cursor:'pointer'}}>
                <option value="project">Per Project</option>
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>
          </div>
          {/* Description */}
          <div style={md.field}>
            <label style={md.lbl}>Description</label>
            <textarea className="s-input" name="description" value={form.description} onChange={handle} rows={3}
              placeholder="What does this service include?" style={{...inp, resize:'vertical', lineHeight:'1.55'}} />
          </div>
          {/* Features */}
          <div style={md.field}>
            <label style={md.lbl}>Features <span style={{color:'#334155',fontWeight:'400'}}>(comma-separated)</span></label>
            <input className="s-input" name="features" value={form.features} onChange={handle}
              placeholder="Logo design, 3 revisions, Source files" style={inp} />
            {form.features && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'8px'}}>
                {form.features.split(',').map(f=>f.trim()).filter(Boolean).map((f,i) => (
                  <span key={i} style={{fontSize:'11px',padding:'3px 10px',borderRadius:'20px',background:'rgba(99,102,241,0.1)',color:'#818cf8',border:'1px solid rgba(99,102,241,0.2)'}}>✓ {f}</span>
                ))}
              </div>
            )}
          </div>
          {/* Featured toggle */}
          <label style={{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer',userSelect:'none'}}>
            <div style={{position:'relative',width:'36px',height:'20px',flexShrink:0}} onClick={() => setForm(p=>({...p,featured:!p.featured}))}>
              <div style={{position:'absolute',inset:0,borderRadius:'10px',background:form.featured?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(30,41,59,0.8)',transition:'background 0.2s',border:'1px solid rgba(99,102,241,0.2)'}} />
              <div style={{position:'absolute',top:'2px',left:form.featured?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}} />
            </div>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>Mark as Featured service</span>
          </label>
          {/* Actions */}
          <div style={{display:'flex',gap:'10px',justifyContent:'flex-end',paddingTop:'4px'}}>
            <button type="button" className="s-cancel" onClick={onClose}
              style={{padding:'9px 20px',background:'transparent',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'9px',color:'#475569',fontSize:'13.5px',fontWeight:'500',cursor:'pointer',transition:'all 0.15s'}}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 22px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'9px',color:'white',fontSize:'13.5px',fontWeight:'600',cursor:saving?'not-allowed':'pointer',opacity:saving?0.7:1,boxShadow:'0 4px 14px rgba(99,102,241,0.35)'}}>
              {saving ? <><span style={spin}/> Saving...</> : (initial ? 'Update Service' : 'Add Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main ─── */
const ServicesAdmin = () => {
  const { data: services, loading, getCollection, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.SERVICES);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { getCollection(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = services.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (data) => {
    if (editItem) { await updateDoc(editItem.id, data); showToast('Service updated!'); }
    else { await addDoc(data); showToast('Service added!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await deleteDoc(id);
    showToast('Service deleted.');
  };

  return (
    <div style={pg.page}>
      <style>{css}</style>

      {/* Toast */}
      {toast && (
        <div style={pg.toast}>✓ {toast}</div>
      )}

      {/* Header */}
      <div style={pg.header}>
        <div>
          <h1 style={pg.title}>Services</h1>
          <p style={pg.sub}><span style={{color:'#818cf8',fontWeight:'600'}}>{services.length}</span> total · <span style={{color:'#f59e0b',fontWeight:'600'}}>{services.filter(s=>s.featured).length}</span> featured</p>
        </div>
        <button style={pg.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Add Service
        </button>
      </div>

      {/* Search */}
      <div style={{position:'relative',maxWidth:'360px'}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#475569',pointerEvents:'none'}}>
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input placeholder="Search services..." value={search} onChange={e=>setSearch(e.target.value)} style={pg.sInput} />
      </div>

      {/* Table */}
      <div style={pg.tableWrap}>
        {loading ? (
          <div style={pg.center}><div style={spin} /></div>
        ) : filtered.length === 0 ? (
          <div style={pg.center}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{color:'#1e293b',marginBottom:'12px'}}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{color:'#334155',margin:'0 0 16px',fontSize:'14px'}}>{search ? 'No services match your search' : 'No services yet'}</p>
            {!search && <button style={pg.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>Add First Service</button>}
          </div>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Service</th><th>Price</th><th>Category</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(svc => (
                <tr key={svc.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <div style={{width:'34px',height:'34px',borderRadius:'9px',background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#818cf8',fontWeight:'700',fontSize:'14px',flexShrink:0}}>
                        {svc.title?.[0]?.toUpperCase()||'S'}
                      </div>
                      <div>
                        <p style={{color:'#e2e8f0',fontWeight:'600',fontSize:'13.5px',margin:'0 0 2px'}}>{svc.title}</p>
                        {svc.description && <p style={{color:'#334155',fontSize:'11.5px',margin:0,maxWidth:'260px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{svc.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{color:'#34d399',fontWeight:'700',fontSize:'14px'}}>{svc.currency||'$'}{svc.price!=null?Number(svc.price).toLocaleString():'—'}</span>
                  </td>
                  <td><span style={{color:'#64748b',fontSize:'13px'}}>{svc.category||'—'}</span></td>
                  <td>
                    <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 10px',borderRadius:'20px',
                      background:svc.featured?'rgba(99,102,241,0.14)':'rgba(30,41,59,0.6)',
                      color:svc.featured?'#818cf8':'#334155',
                      border:svc.featured?'1px solid rgba(99,102,241,0.25)':'1px solid rgba(30,41,59,0.8)'}}>
                      {svc.featured?'★ Featured':'Standard'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button className="s-edit-btn" onClick={() => { setEditItem(svc); setModalOpen(true); }}>Edit</button>
                      <button className="s-del-btn" onClick={() => handleDelete(svc.id)}>Delete</button>
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

const spin = { display:'inline-block', width:'14px', height:'14px', border:'2px solid rgba(99,102,241,0.25)', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0 };

const pg = {
  page: { display:'flex', flexDirection:'column', gap:'20px', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" },
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' },
  title: { color:'#f1f5f9', fontSize:'24px', fontWeight:'700', margin:'0 0 5px', letterSpacing:'-0.02em' },
  sub: { color:'#475569', fontSize:'13px', margin:0 },
  addBtn: { display:'flex', alignItems:'center', gap:'7px', padding:'10px 18px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', border:'none', borderRadius:'10px', color:'white', fontSize:'13.5px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 15px rgba(99,102,241,0.35)' },
  sInput: { width:'100%', paddingLeft:'36px', paddingRight:'14px', paddingTop:'10px', paddingBottom:'10px', background:'rgba(15,15,30,0.7)', border:'1px solid rgba(99,102,241,0.15)', borderRadius:'10px', color:'#e2e8f0', fontSize:'13.5px', outline:'none', boxSizing:'border-box' },
  tableWrap: { background:'rgba(10,10,24,0.6)', border:'1px solid rgba(99,102,241,0.08)', borderRadius:'16px', overflowX:'auto' },
  center: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 20px' },
  toast: { position:'fixed', top:'20px', right:'24px', zIndex:200, padding:'12px 18px', borderRadius:'10px', background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', color:'#34d399', fontSize:'13.5px', fontWeight:'500', animation:'fadeIn 0.2s ease', boxShadow:'0 8px 30px rgba(0,0,0,0.4)' },
};

const md = {
  backdrop: { position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  box: { background:'#0d0d20', border:'1px solid rgba(99,102,241,0.15)', borderRadius:'20px', width:'100%', maxWidth:'580px', maxHeight:'90vh', overflow:'auto', boxShadow:'0 30px 60px rgba(0,0,0,0.6)' },
  head: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 24px 0' },
  title: { color:'#f1f5f9', fontSize:'18px', fontWeight:'700', margin:0, letterSpacing:'-0.01em' },
  xBtn: { width:'32px', height:'32px', borderRadius:'8px', background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.12)', color:'#64748b', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' },
  form: { padding:'20px 24px 24px', display:'flex', flexDirection:'column', gap:'16px' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  grid3: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'14px' },
  field: { display:'flex', flexDirection:'column', gap:'6px' },
  lbl: { color:'#64748b', fontSize:'12.5px', fontWeight:'500' },
};

export default ServicesAdmin;
