import React, { useState, useEffect, useContext } from 'react';
import { getCollection, addDocument, updateDocument, deleteDocument } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import { ToastContext } from '../context/ToastContext';

const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    category: '',
    items: '',
    order: 0
  });

  const { showSuccess, showError } = useContext(ToastContext);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await getCollection(COLLECTIONS.SKILLS);
      setSkills(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      showError('Error loading skills');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingId(skill.id);
      setFormData({
        category: skill.category || '',
        items: (skill.items || []).join(', '),
        order: skill.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({ category: '', items: '', order: skills.length });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const itemsArray = formData.items.split(',').map(s => s.trim()).filter(Boolean);
      const dataToSave = {
        category: formData.category,
        items: itemsArray,
        order: Number(formData.order)
      };

      if (editingId) {
        await updateDocument(COLLECTIONS.SKILLS, editingId, dataToSave);
        showSuccess('Skill group updated');
      } else {
        await addDocument(COLLECTIONS.SKILLS, dataToSave);
        showSuccess('Skill group added');
      }
      handleCloseModal();
      loadSkills();
    } catch (err) {
      showError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill group?')) return;
    try {
      await deleteDocument(COLLECTIONS.SKILLS, id);
      showSuccess('Skill group deleted');
      loadSkills();
    } catch (err) {
      showError(err.message);
    }
  };

  // Seed default if empty
  const handleSeed = async () => {
    const defaults = [
      { category: 'Frontend', items: ['React', 'Vue', 'Angular', 'Next.js', 'TailwindCSS'], order: 1 },
      { category: 'Backend', items: ['Node.js', 'Python', 'PHP', 'GraphQL'], order: 2 },
      { category: 'Database', items: ['MongoDB', 'Firebase', 'PostgreSQL'], order: 3 },
      { category: 'DevOps', items: ['Docker', 'AWS', 'Git'], order: 4 },
    ];
    setIsSubmitting(true);
    for (const d of defaults) {
      await addDocument(COLLECTIONS.SKILLS, d);
    }
    setIsSubmitting(false);
    loadSkills();
    showSuccess('Default skills added');
  };

  return (
    <div style={s.page}>
      <style>{css}</style>
      
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Arsenal (Skills)</h1>
          <p style={s.sub}>Manage technologies and skill categories</p>
        </div>
        <div style={{display:'flex', gap:'12px'}}>
          {skills.length === 0 && (
            <button onClick={handleSeed} disabled={isSubmitting} style={s.ghostBtn} className="hover-lift">
              Seed Defaults
            </button>
          )}
          <button onClick={() => handleOpenModal()} style={s.addBtn} className="hover-lift">
            + Add Category
          </button>
        </div>
      </div>

      <div style={s.card}>
        {loading ? (
          <div style={s.empty}>Loading...</div>
        ) : skills.length === 0 ? (
          <div style={s.empty}>No skills found. Click "Add Category" or "Seed Defaults" to start.</div>
        ) : (
          <div style={s.grid}>
            {skills.map((skill) => (
              <div key={skill.id} style={s.skillCard}>
                <div style={s.skillHead}>
                  <h3 style={s.skillTitle}>{skill.category}</h3>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button onClick={() => handleOpenModal(skill)} style={s.actionBtn}>Edit</button>
                    <button onClick={() => handleDelete(skill.id)} style={{...s.actionBtn, color:'#f87171'}}>Del</button>
                  </div>
                </div>
                <div style={s.tags}>
                  {(skill.items || []).map(item => (
                    <span key={item} style={s.tag}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <h2 style={s.modalTitle}>{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={handleCloseModal} style={s.closeBtn}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.field}>
                <label style={s.lbl}>Category Name</label>
                <input
                  type="text"
                  required
                  style={s.inp}
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g. Frontend"
                />
              </div>
              <div style={s.field}>
                <label style={s.lbl}>Skills (comma separated)</label>
                <textarea
                  required
                  rows="3"
                  style={{...s.inp, resize:'vertical'}}
                  value={formData.items}
                  onChange={e => setFormData({...formData, items: e.target.value})}
                  placeholder="React, Vue, Tailwind CSS"
                />
              </div>
              <div style={s.field}>
                <label style={s.lbl}>Order</label>
                <input
                  type="number"
                  style={s.inp}
                  value={formData.order}
                  onChange={e => setFormData({...formData, order: e.target.value})}
                />
              </div>
              <div style={s.modalActions}>
                <button type="button" onClick={handleCloseModal} style={s.cancelBtn}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={s.submitBtn}>
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const css = `
  .hover-lift { transition: transform 0.2s; }
  .hover-lift:hover { transform: translateY(-2px); }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

const s = {
  page: { color: '#e2e8f0', minHeight: '100%', paddingBottom:'40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px', color: '#f1f5f9' },
  sub: { fontSize: '14px', color: '#64748b', margin: 0 },
  addBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
  ghostBtn: { padding: '10px 20px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#818cf8', fontWeight: '600', cursor: 'pointer' },
  
  card: { background: 'rgba(12,12,26,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '32px' },
  empty: { textAlign: 'center', color: '#64748b', padding: '40px 0' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  skillCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' },
  skillHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  skillTitle: { fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: 0 },
  actionBtn: { background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' },
  
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { padding: '4px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', color: '#818cf8', fontSize: '12px', fontWeight: '600' },
  
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'fade 0.2s ease' },
  modal: { width: '100%', maxWidth: '500px', background: '#0a0a18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden', animation: 'slide 0.3s ease', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  modalTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#f1f5f9' },
  closeBtn: { background: 'transparent', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer' },
  form: { padding: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  lbl: { fontSize: '13px', color: '#94a3b8', fontWeight: '500' },
  inp: { padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' },
  cancelBtn: { padding: '10px 20px', background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: '600', cursor: 'pointer' },
  submitBtn: { padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: 'pointer' }
};

export default SkillsAdmin;
