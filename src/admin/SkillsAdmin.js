import React, { useState, useEffect } from 'react';
import { getCollection, addDocument, updateDocument, deleteDocument } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import {
  Cpu,
  Plus,
  Edit3,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const SkillsAdmin = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState('');

  const [formData, setFormData] = useState({
    category: '',
    items: '',
    order: 0,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await getCollection(COLLECTIONS.SKILLS);
      setSkills((data || []).sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch (err) {
      showToast('Error loading skills: ' + err.message);
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
        order: skill.order || 0,
      });
    } else {
      setEditingId(null);
      setFormData({ category: '', items: '', order: skills.length + 1 });
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
      const itemsArray = formData.items.split(',').map((s) => s.trim()).filter(Boolean);
      const dataToSave = {
        category: formData.category,
        items: itemsArray,
        order: Number(formData.order) || 0,
      };

      if (editingId) {
        await updateDocument(COLLECTIONS.SKILLS, editingId, dataToSave);
        showToast('Skill group updated.');
      } else {
        await addDocument(COLLECTIONS.SKILLS, dataToSave);
        showToast('Skill group created.');
      }
      handleCloseModal();
      loadSkills();
    } catch (err) {
      showToast('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill group?')) return;
    try {
      await deleteDocument(COLLECTIONS.SKILLS, id);
      showToast('Skill group deleted.');
      loadSkills();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleSeed = async () => {
    const defaults = [
      { category: 'Frontend', items: ['React', 'Vue', 'Next.js', 'TailwindCSS', 'TypeScript'], order: 1 },
      { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL'], order: 2 },
      { category: 'Database', items: ['PostgreSQL', 'Firebase', 'MongoDB', 'Redis'], order: 3 },
      { category: 'DevOps', items: ['Docker', 'AWS', 'Git CI/CD', 'Linux'], order: 4 },
    ];
    try {
      for (const d of defaults) {
        await addDocument(COLLECTIONS.SKILLS, d);
      }
      showToast('Standard skill categories initialized.');
      loadSkills();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 text-xs font-black tracking-wider uppercase border border-neutral-700 shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>TECHNICAL CAPABILITIES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              ENGINEERING SKILLS & COMPETENCIES
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Manage technical skill groups, framework proficiencies, and capability matrices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {skills.length === 0 && (
              <button
                onClick={handleSeed}
                className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
              >
                INITIALIZE DEFAULTS
              </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>ADD SKILL GROUP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border border-neutral-200 bg-white p-6 space-y-4">
              <div className="h-5 w-1/2 skeleton-shimmer" />
              <div className="h-10 w-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 p-16 text-center space-y-3 bg-white">
          <Cpu className="w-12 h-12 text-neutral-400 mx-auto stroke-[1.5]" />
          <p className="text-base font-black uppercase text-black">NO SKILL GROUPS CONFIGURED</p>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            Add your engineering competencies or initialize default groupings.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleSeed}
              className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300"
            >
              Load Defaults
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Group</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div
              key={skill.id}
              className="bg-white border border-neutral-200 hover:border-black p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    CATEGORY 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    ORDER: {skill.order ?? idx}
                  </span>
                </div>

                <h3 className="text-lg font-black uppercase tracking-tight text-black group-hover:underline">
                  {skill.category}
                </h3>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(skill.items || []).map((item, i) => (
                    <span
                      key={i}
                      className="bg-neutral-100 text-neutral-800 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 border border-neutral-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenModal(skill)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDIT</span>
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-2 text-neutral-400 hover:text-rose-600 border border-neutral-200 hover:border-rose-300 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={handleCloseModal} />
          <div className="relative bg-white border-2 border-black max-w-lg w-full p-6 sm:p-8 z-10 space-y-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  SKILLS INVENTORY
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                  {editingId ? 'EDIT SKILL GROUP' : 'ADD SKILL GROUP'}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-1 text-black hover:text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  CATEGORY NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="FRONTEND ENGINEERING"
                  className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  TECHNOLOGIES (COMMA-SEPARATED) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  placeholder="React 18, Next.js, TypeScript, TailwindCSS, Vite"
                  className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black uppercase tracking-wider"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  DISPLAY ORDER
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full bg-neutral-100 border border-neutral-300 text-black text-xs font-medium p-3 focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-neutral-300 text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'SAVING...' : 'SAVE CATEGORY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsAdmin;
