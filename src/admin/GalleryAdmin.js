import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS, STORAGE_FOLDERS } from '../utils/constants';
import { validateImageFile } from '../services/storageService';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';
import { Base64UploadZone } from '../components/admin/Base64UploadZone';

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const CATEGORIES = ['Photography', 'Design', 'Web Development', 'Branding', 'Art', 'UI/UX', 'Other'];
const emptyForm  = { title: '', category: '', description: '', imageUrl: '', featured: false, order: 0 };



/* ═══════════════════════════════════════
   MODAL — ADD / EDIT
═══════════════════════════════════════ */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form,   setForm]   = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial ? { ...emptyForm, ...initial } : emptyForm);
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return;
    setSaving(true);
    await onSave({ ...form, order: Number(form.order) || 0 });
    setSaving(false);
    onClose();
  };

  const inp = {
    padding: '9px 13px',
    background: 'rgba(15,15,30,0.8)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 9,
    color: '#e2e8f0',
    fontSize: 13.5,
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={md.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={md.box}>
        <div style={md.head}>
          <h2 style={md.title}>{initial ? '✏️ Edit Gallery Item' : '✦ Add Gallery Item'}</h2>
          <button style={md.xBtn} onClick={onClose}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={submit} style={md.form}>
          {/* Image Upload */}
          <div style={md.field}>
            <label style={md.lbl}>Gallery Image *</label>
            <Base64UploadZone
              currentUrl={form.imageUrl}
              onUploaded={url => setForm(p => ({ ...p, imageUrl: url }))}
            />
            <input
              className="gal-inp"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handle}
              placeholder="Or paste image URL directly…"
              style={{ ...inp, marginTop: 8, fontSize: 12 }}
            />
          </div>

          {/* Title + Category */}
          <div style={md.grid2} className="gal-modal-grid">
            <div style={md.field}>
              <label style={md.lbl}>Title *</label>
              <input className="gal-inp" name="title" value={form.title} onChange={handle} required placeholder="Project Cygnus" style={inp} />
            </div>
            <div style={md.field}>
              <label style={md.lbl}>Category</label>
              <select name="category" value={form.category} onChange={handle} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={md.field}>
            <label style={md.lbl}>Description</label>
            <textarea
              className="gal-inp"
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="Brief description of this work…"
              rows={3}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Order + Featured */}
          <div style={md.grid2} className="gal-modal-grid">
            <div style={md.field}>
              <label style={md.lbl}>Display Order</label>
              <input className="gal-inp" name="order" type="number" value={form.order} onChange={handle} placeholder="0" style={inp} />
            </div>
            <div style={{ ...md.field, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#94a3b8', fontSize: 13.5, paddingBottom: 2 }}>
                <div
                  style={{
                    width: 40, height: 22,
                    background: form.featured ? 'linear-gradient(135deg,#a855f7,#6366f1)' : 'rgba(30,41,59,0.8)',
                    border: `1px solid ${form.featured ? 'rgba(168,85,247,0.4)' : 'rgba(99,102,241,0.2)'}`,
                    borderRadius: 11, position: 'relative', transition: 'all 0.25s', flexShrink: 0,
                    cursor: 'pointer',
                    boxShadow: form.featured ? '0 0 14px rgba(168,85,247,0.35)' : 'none',
                  }}
                  onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
                >
                  <div style={{
                    position: 'absolute', top: 3,
                    left: form.featured ? 20 : 3,
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'white',
                    transition: 'left 0.25s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }} />
                </div>
                Featured item
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={md.actions}>
            <button type="button" style={md.cancel} onClick={onClose}>Cancel</button>
            <button
              type="submit"
              disabled={saving || !form.imageUrl}
              style={{ ...md.save, opacity: (saving || !form.imageUrl) ? 0.5 : 1, cursor: (saving || !form.imageUrl) ? 'not-allowed' : 'pointer' }}
            >
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'gal-spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                  Saving…
                </span>
              ) : (initial ? 'Save Changes' : '✦ Add to Gallery')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   DELETE CONFIRM
═══════════════════════════════════════ */
const DeleteConfirm = ({ item, onConfirm, onCancel }) => {
  if (!item) return null;
  return (
    <div style={md.backdrop} onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div style={{ ...md.box, maxWidth: 420 }}>
        <div style={{ textAlign: 'center', padding: '32px 28px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </div>
          <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 800, margin: '0 0 8px' }}>Delete Gallery Item</h3>
          <p style={{ color: '#64748b', fontSize: 13.5, lineHeight: 1.55, margin: '0 0 24px' }}>
            "<strong style={{ color: '#94a3b8' }}>{item.title}</strong>" will be permanently removed.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onCancel} style={{ ...md.cancel, flex: 1 }}>Cancel</button>
            <button onClick={() => onConfirm(item)} style={{ flex: 1, padding: '10px 0', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#f87171', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
const Toast = ({ message, type = 'success', onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  const isErr = type === 'error';
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '11px 20px',
      background: 'rgba(10,10,24,0.97)',
      border: `1px solid ${isErr ? 'rgba(239,68,68,0.3)' : 'rgba(52,211,153,0.3)'}`,
      borderRadius: 12,
      color: '#e2e8f0',
      fontSize: 13, fontWeight: 600,
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      backdropFilter: 'blur(12px)',
      animation: 'gal-slideIn 0.3s ease',
    }}>
      {isErr
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      }
      {message}
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN — GALLERY ADMIN
═══════════════════════════════════════ */
const GalleryAdmin = () => {
  const { data: items, loading, getCollection, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.GALLERY);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [deleteItem,  setDeleteItem]  = useState(null);
  const [toast,       setToast]       = useState(null);
  const [search,      setSearch]      = useState('');

  useEffect(() => { getCollection(); }, [getCollection]); // eslint-disable-line

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleSave = async (payload) => {
    try {
      if (editItem) { await updateDoc(editItem.id, payload); showToast('Gallery item updated!'); }
      else          { await addDoc(payload);                  showToast('Item added to gallery!'); }
    } catch { showToast('Failed to save item.', 'error'); }
  };

  const handleDelete = async (item) => {
    try {
      await deleteDoc(item.id);
      if (item.imageUrl && item.imageUrl.includes('firebasestorage')) {
        try { await deleteObject(ref(storage, item.imageUrl)); } catch (_) { /* already gone */ }
      }
      showToast('Item deleted from gallery.');
    } catch { showToast('Failed to delete item.', 'error'); }
    setDeleteItem(null);
  };

  const filtered = (items || []).filter(item =>
    !search ||
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={p.wrap}>
      <style>{adminCss}</style>

      {/* Header */}
      <div style={p.head}>
        <div>
          <h1 style={p.title}>Gallery</h1>
          <p style={p.sub}>{(items || []).length} item{(items || []).length !== 1 ? 's' : ''} in your gallery</p>
        </div>
        <button style={p.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Item
        </button>
      </div>

      {/* Search */}
      <div style={p.searchWrap}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input className="gal-inp" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or category…" style={p.searchInput} />
      </div>

      {/* Content */}
      {loading ? (
        <div style={p.loadWrap}>
          <div style={p.spinner} />
          <p style={{ color: '#475569', fontSize: 13, margin: '12px 0 0' }}>Loading gallery…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={p.empty}>
          <div style={p.emptyIcon}>🖼️</div>
          <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 16, margin: '0 0 6px' }}>
            {search ? 'No items match your search' : 'Your gallery is empty'}
          </p>
          <p style={{ color: '#475569', fontSize: 13, margin: '0 0 20px' }}>
            {search ? 'Try a different search term.' : 'Click "Add Item" to upload your first gallery image.'}
          </p>
          {!search && <button style={p.addBtn} onClick={() => { setEditItem(null); setModalOpen(true); }}>+ Add First Item</button>}
        </div>
      ) : (
        <div style={p.grid}>
          {filtered.map((item) => (
            <div key={item.id} className="gal-admin-card" style={p.card}>
              <div style={p.cardImg}>
                <img
                  src={item.imageUrl} alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  className="gal-card-img"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x280/0a0a1a/6366f1?text=No+Image'; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
                {item.featured && (
                  <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fbbf24', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(251,191,36,0.3)' }}>★ Featured</span>
                )}
              </div>
              <div style={p.cardBody}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <h3 style={p.cardTitle}>{item.title || 'Untitled'}</h3>
                  {item.category && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {item.category}
                    </span>
                  )}
                </div>
                {item.description && <p style={p.cardDesc}>{item.description}</p>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 12 }}>
                  <button className="gal-admin-btn-edit" style={p.editBtn} onClick={() => { setEditItem(item); setModalOpen(true); }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button className="gal-admin-btn-del" style={p.delBtn} onClick={() => setDeleteItem(item)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    Delete
                  </button>
                  <span style={{ marginLeft: 'auto', color: '#334155', fontSize: 11 }}>Order: {item.order ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditItem(null); }} onSave={handleSave} initial={editItem} />
      <DeleteConfirm item={deleteItem} onConfirm={handleDelete} onCancel={() => setDeleteItem(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
};

/* ═══════════════════════════════════════
   CSS
═══════════════════════════════════════ */
const adminCss = `
  @keyframes gal-spin     { to { transform: rotate(360deg); } }
  @keyframes gal-slideIn  { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
  .gal-inp:focus { border-color: #a855f7 !important; box-shadow: 0 0 0 3px rgba(168,85,247,0.12); outline: none; }
  .gal-admin-card { transition: transform 0.25s, box-shadow 0.25s; }
  .gal-admin-card:hover { box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.15) !important; transform: translateY(-3px); }
  .gal-admin-card:hover .gal-card-img { transform: scale(1.05); }
  .gal-admin-btn-edit:hover { background: rgba(99,102,241,0.2) !important; }
  .gal-admin-btn-del:hover  { background: rgba(239,68,68,0.18) !important; }
  @media (max-width: 600px) { .gal-modal-grid { grid-template-columns: 1fr !important; } }
`;

/* ═══════════════════════════════════════
   STYLE OBJECTS
═══════════════════════════════════════ */

const md = {
  backdrop: { position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, overflowY: 'auto' },
  box:      { background: 'rgba(10,10,24,0.97)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 18, width: '100%', maxWidth: 580, boxShadow: '0 40px 100px rgba(0,0,0,0.7)', maxHeight: '92vh', overflowY: 'auto' },
  head:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0' },
  title:    { color: '#f1f5f9', fontSize: 17, fontWeight: 800, margin: 0 },
  xBtn:     { width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 },
  form:     { padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 },
  grid2:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field:    { display: 'flex', flexDirection: 'column', gap: 6 },
  lbl:      { color: '#64748b', fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' },
  actions:  { display: 'flex', gap: 10, paddingTop: 4 },
  cancel:   { flex: 1, padding: '10px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#64748b', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  save:     { flex: 2, padding: '10px 0', background: 'linear-gradient(135deg,#a855f7,#6366f1)', border: 'none', borderRadius: 10, color: 'white', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 16px rgba(168,85,247,0.4)', transition: 'opacity 0.2s' },
};

const p = {
  wrap:        { fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color: '#e2e8f0' },
  head:        { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title:       { color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' },
  sub:         { color: '#475569', fontSize: 13, margin: 0 },
  addBtn:      { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: 'linear-gradient(135deg,#a855f7,#6366f1)', border: 'none', borderRadius: 10, color: 'white', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(168,85,247,0.4)', transition: 'filter 0.2s' },
  searchWrap:  { position: 'relative', maxWidth: 340, marginBottom: 24 },
  searchInput: { width: '100%', padding: '9px 12px 9px 34px', background: 'rgba(15,15,30,0.8)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, color: '#e2e8f0', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 },
  card:        { background: 'rgba(12,12,26,0.6)', border: '1px solid rgba(99,102,241,0.08)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImg:     { height: 160, position: 'relative', overflow: 'hidden', flexShrink: 0 },
  cardBody:    { padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 },
  cardTitle:   { color: '#f1f5f9', fontSize: 15, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.01em' },
  cardDesc:    { color: '#64748b', fontSize: 12.5, lineHeight: 1.55, margin: '4px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  editBtn:     { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 7, color: '#818cf8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' },
  delBtn:      { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' },
  loadWrap:    { textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  spinner:     { width: 32, height: 32, border: '3px solid rgba(168,85,247,0.15)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'gal-spin 0.8s linear infinite' },
  empty:       { textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  emptyIcon:   { fontSize: 44, marginBottom: 16 },
};

export default GalleryAdmin;
