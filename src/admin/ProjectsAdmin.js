import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';

/* ─── Helpers ─────────────────────────────────────────────── */
const TECH_COLORS = {
  React: '#61dafb', Vue: '#42b883', Angular: '#dd0031',
  'Node.js': '#68a063', Python: '#3776ab', TypeScript: '#3178c6',
  JavaScript: '#f7df1e', Firebase: '#ffca28', MongoDB: '#47a248',
  PostgreSQL: '#336791', TailwindCSS: '#38bdf8', Next: '#ffffff',
  Docker: '#2496ed', GraphQL: '#e10098',
};
const techColor = (t) => TECH_COLORS[t] || '#818cf8';

const CATEGORY_OPTIONS = ['Web App', 'Mobile App', 'E-Commerce', 'Portfolio', 'Dashboard', 'API', 'Other'];

const emptyForm = { title: '', description: '', category: '', liveUrl: '', githubUrl: '', imageUrl: '', technologies: '', featured: false };

/* ─── Modal ───────────────────────────────────────────────── */
const Modal = ({ open, onClose, onSave, initial }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initial ? { ...emptyForm, ...initial, technologies: (initial.technologies || []).join(', ') } : emptyForm);
  }, [open, initial]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean) };
    await onSave(payload);
    setSaving(false);
    onClose();
  };

  return (
    <div style={m.backdrop} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={m.modal}>
        <div style={m.header}>
          <h2 style={m.title}>{initial ? 'Edit Project' : 'Add New Project'}</h2>
          <button style={m.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={submit} style={m.form}>
          <div style={m.grid2}>
            {[
              { label: 'Project Title *', name: 'title', placeholder: 'My Awesome Project', required: true },
              { label: 'Category', name: 'category', placeholder: '', type: 'select' },
              { label: 'Live URL', name: 'liveUrl', placeholder: 'https://myproject.com' },
              { label: 'GitHub URL', name: 'githubUrl', placeholder: 'https://github.com/...' },
              { label: 'Cover Image URL', name: 'imageUrl', placeholder: 'https://example.com/image.jpg' },
            ].map(({ label, name, placeholder, type, required }) => (
              <div key={name} style={m.field}>
                <label style={m.label}>{label}</label>
                {type === 'select' ? (
                  <select name={name} value={form[name]} onChange={handle} style={m.select}>
                    <option value="">Select category...</option>
                    {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input name={name} value={form[name]} onChange={handle} placeholder={placeholder}
                    required={required} style={m.input}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.2)'}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={m.field}>
            <label style={m.label}>Description</label>
            <textarea name="description" value={form.description} onChange={handle} rows={3}
              placeholder="Brief description of the project..." style={m.textarea} />
          </div>

          <div style={m.field}>
            <label style={m.label}>Technologies <span style={{color:'#334155',fontSize:'11px'}}>(comma-separated)</span></label>
            <input name="technologies" value={form.technologies} onChange={handle}
              placeholder="React, Node.js, Firebase, TailwindCSS" style={m.input}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.2)'}
            />
            {/* Tech preview */}
            {form.technologies && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'8px'}}>
                {form.technologies.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} style={{fontSize:'11px',padding:'2px 9px',borderRadius:'20px',background:`${techColor(t)}18`,color:techColor(t),border:`1px solid ${techColor(t)}30`,fontWeight:'600'}}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <label style={{...m.label, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
            <div style={{position:'relative',width:'36px',height:'20px',flexShrink:0}} onClick={() => setForm(p => ({...p, featured: !p.featured}))}>
              <div style={{position:'absolute',inset:0,borderRadius:'10px',background:form.featured?'linear-gradient(135deg,#6366f1,#8b5cf6)':'rgba(30,41,59,0.8)',transition:'background 0.2s',border:'1px solid rgba(99,102,241,0.2)'}} />
              <div style={{position:'absolute',top:'2px',left:form.featured?'18px':'2px',width:'16px',height:'16px',borderRadius:'50%',background:'white',transition:'left 0.2s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}} />
            </div>
            <span style={{color:'#94a3b8',fontSize:'13px'}}>Mark as Featured project</span>
          </label>

          <div style={m.footer}>
            <button type="button" onClick={onClose} style={m.cancelBtn}>Cancel</button>
            <button type="submit" disabled={saving} style={{...m.saveBtn,...(saving?{opacity:0.7,cursor:'not-allowed'}:{})}}>
              {saving ? <><span style={spinnerStyle} /> Saving...</> : <>{initial ? 'Update Project' : 'Add Project'}</>}
            </button>
          </div>
        </form>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
};

/* ─── Project Card ────────────────────────────────────────── */
const ProjectCard = ({ project, onEdit, onDelete }) => {
  const techs = project.technologies || [];
  const initials = project.title?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'PR';
  const gradients = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#ec4899,#8b5cf6)',
  ];
  const grad = gradients[project.title?.charCodeAt(0) % gradients.length] || gradients[0];

  return (
    <div style={c.card}>
      {/* Header banner */}
      <div style={{...c.banner, background: project.imageUrl ? `url(${project.imageUrl}) center/cover` : grad}}>
        {!project.imageUrl && <div style={c.bannerInitials}>{initials}</div>}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent,rgba(12,12,26,0.9))',pointerEvents:'none'}} />
        {project.featured && (
          <span style={c.featuredBadge}>★ Featured</span>
        )}
      </div>

      {/* Body */}
      <div style={c.body}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'8px',marginBottom:'6px'}}>
          <h3 style={c.projectTitle}>{project.title}</h3>
          {project.category && (
            <span style={c.categoryBadge}>{project.category}</span>
          )}
        </div>

        <p style={c.desc}>{project.description || 'No description provided.'}</p>

        {/* Tech stack */}
        {techs.length > 0 && (
          <div style={c.techRow}>
            {techs.slice(0, 4).map(t => (
              <span key={t} style={{fontSize:'10.5px',padding:'2px 8px',borderRadius:'20px',background:`${techColor(t)}15`,color:techColor(t),border:`1px solid ${techColor(t)}25`,fontWeight:'600',whiteSpace:'nowrap'}}>
                {t}
              </span>
            ))}
            {techs.length > 4 && <span style={{fontSize:'10.5px',color:'#334155'}}>+{techs.length - 4}</span>}
          </div>
        )}

        {/* Links */}
        <div style={c.linkRow}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" style={c.liveLink}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" style={c.githubLink}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div style={c.cardFooter}>
        <button onClick={() => onEdit(project)} style={c.editBtn}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Edit
        </button>
        <button onClick={() => onDelete(project.id)} style={c.deleteBtn}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────── */
const ProjectsAdmin = () => {
  const { data: projects, loading, getCollection, addDoc, updateDoc, deleteDoc } = useFirestore(COLLECTIONS.PROJECTS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { getCollection(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = projects.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const usedCategories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  const handleSave = async (data) => {
    if (editProject) {
      await updateDoc(editProject.id, data);
      showToast('Project updated successfully!');
    } else {
      await addDoc(data);
      showToast('Project added successfully!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    await deleteDoc(id);
    showToast('Project deleted.');
  };

  const openAdd = () => { setEditProject(null); setModalOpen(true); };
  const openEdit = (p) => { setEditProject(p); setModalOpen(true); };

  return (
    <div style={pg.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .proj-card:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important; border-color: rgba(99,102,241,0.2) !important; }
        .proj-edit-btn:hover { background: rgba(99,102,241,0.2) !important; }
        .proj-del-btn:hover { background: rgba(239,68,68,0.18) !important; }
        .proj-add-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.5) !important; }
        .admin-table { width:100%; border-collapse:collapse; }
        .admin-table th { padding:12px 16px; color:#334155; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.08em; text-align:left; border-bottom:1px solid rgba(99,102,241,0.1); }
        .admin-table td { padding:14px 16px; border-bottom:1px solid rgba(99,102,241,0.05); }
        .admin-table tr:hover td { background:rgba(99,102,241,0.04); }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{position:'fixed',top:'20px',right:'24px',zIndex:200,padding:'12px 18px',borderRadius:'10px',background:'rgba(16,185,129,0.15)',border:'1px solid rgba(16,185,129,0.3)',color:'#34d399',fontSize:'13.5px',fontWeight:'500',display:'flex',alignItems:'center',gap:'8px',boxShadow:'0 8px 30px rgba(0,0,0,0.4)',animation:'fadeIn 0.2s ease'}}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={pg.header}>
        <div>
          <h1 style={pg.title}>Projects</h1>
          <p style={pg.subtitle}>
            <span style={{color:'#818cf8',fontWeight:'600'}}>{projects.length}</span> total ·
            <span style={{color:'#f59e0b',fontWeight:'600'}}> {projects.filter(p=>p.featured).length}</span> featured
          </p>
        </div>
        <button className="proj-add-btn" style={pg.addBtn} onClick={openAdd}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          New Project
        </button>
      </div>

      {/* Toolbar */}
      <div style={pg.toolbar}>
        {/* Search */}
        <div style={{position:'relative',flex:'1',minWidth:'200px',maxWidth:'340px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:'#475569',pointerEvents:'none'}}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input placeholder="Search projects..." value={search} onChange={e=>setSearch(e.target.value)} style={pg.searchInput} />
        </div>

        {/* Category filter */}
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
          {usedCategories.map(cat => (
            <button key={cat} onClick={()=>setFilterCat(cat)} style={{
              padding:'6px 14px',borderRadius:'8px',border:'1px solid',fontSize:'12px',fontWeight:'500',cursor:'pointer',
              background: filterCat===cat ? 'rgba(99,102,241,0.18)' : 'transparent',
              borderColor: filterCat===cat ? 'rgba(99,102,241,0.35)' : 'rgba(99,102,241,0.1)',
              color: filterCat===cat ? '#818cf8' : '#475569',
              transition:'all 0.15s',
            }}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{display:'flex',background:'rgba(15,15,30,0.7)',border:'1px solid rgba(99,102,241,0.1)',borderRadius:'8px',padding:'3px',marginLeft:'auto'}}>
          {[
            { mode:'grid', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg> },
            { mode:'list', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
          ].map(({mode, icon}) => (
            <button key={mode} onClick={()=>setViewMode(mode)} style={{
              width:'32px',height:'32px',borderRadius:'6px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
              background: viewMode===mode ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: viewMode===mode ? '#818cf8' : '#475569',
              transition:'all 0.15s',
            }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'80px',gap:'12px'}}>
          <div style={spinnerStyle} />
          <span style={{color:'#334155',fontSize:'14px'}}>Loading projects...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={pg.empty}>
          <div style={pg.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="2 17 12 22 22 17" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="2 12 12 17 22 12" stroke="#334155" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{color:'#475569',fontSize:'15px',fontWeight:'600',margin:'0 0 6px 0'}}>
            {search ? 'No projects match your search' : 'No projects yet'}
          </p>
          <p style={{color:'#334155',fontSize:'13px',margin:'0 0 20px 0'}}>
            {search ? 'Try a different search term.' : 'Add your first project to showcase your work.'}
          </p>
          {!search && (
            <button style={pg.addBtn} onClick={openAdd}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Add First Project
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div style={pg.grid}>
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} onEdit={openEdit} onDelete={handleDelete} />
          ))}
          {/* Add card */}
          <button style={pg.addCard} onClick={openAdd}>
            <div style={pg.addCardIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{color:'#475569',fontSize:'13px',fontWeight:'500',margin:0}}>Add Project</p>
          </button>
        </div>
      ) : (
        /* List view */
        <div style={pg.tableWrap}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Tech Stack</th>
                <th>Links</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(project => (
                <tr key={project.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'12px',fontWeight:'700',flexShrink:0}}>
                        {project.title?.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'PR'}
                      </div>
                      <div>
                        <p style={{color:'#e2e8f0',fontWeight:'600',fontSize:'13.5px',margin:'0 0 2px'}}>{project.title}</p>
                        <p style={{color:'#334155',fontSize:'11.5px',margin:0,maxWidth:'220px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td><span style={{color:'#64748b',fontSize:'13px'}}>{project.category || '—'}</span></td>
                  <td>
                    <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                      {(project.technologies||[]).slice(0,3).map(t=>(
                        <span key={t} style={{fontSize:'10px',padding:'2px 7px',borderRadius:'20px',background:`${techColor(t)}15`,color:techColor(t),border:`1px solid ${techColor(t)}25`,fontWeight:'600'}}>{t}</span>
                      ))}
                      {(project.technologies||[]).length > 3 && <span style={{color:'#334155',fontSize:'11px'}}>+{project.technologies.length-3}</span>}
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{color:'#818cf8',fontSize:'12px',textDecoration:'none'}}>↗ Live</a>}
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{color:'#475569',fontSize:'12px',textDecoration:'none'}}>GitHub</a>}
                    </div>
                  </td>
                  <td>
                    <span style={{fontSize:'11px',fontWeight:'600',padding:'3px 10px',borderRadius:'20px',
                      background:project.featured?'rgba(245,158,11,0.12)':'rgba(30,41,59,0.5)',
                      color:project.featured?'#f59e0b':'#334155',
                      border:project.featured?'1px solid rgba(245,158,11,0.25)':'1px solid rgba(30,41,59,0.8)',
                    }}>
                      {project.featured ? '★ Yes' : '—'}
                    </span>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'8px'}}>
                      <button className="proj-edit-btn" style={c.editBtn} onClick={() => openEdit(project)}>Edit</button>
                      <button className="proj-del-btn" style={c.deleteBtn} onClick={() => handleDelete(project.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editProject} />
    </div>
  );
};

/* ─── Styles ──────────────────────────────────────────────── */
const spinnerStyle = {
  display: 'inline-block', width: '14px', height: '14px',
  border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1',
  borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0,
};

const pg = {
  page: { display:'flex',flexDirection:'column',gap:'22px',fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" },
  header: { display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px' },
  title: { color:'#f1f5f9',fontSize:'24px',fontWeight:'700',margin:'0 0 5px 0',letterSpacing:'-0.02em' },
  subtitle: { color:'#475569',fontSize:'13px',margin:0 },
  addBtn: { display:'flex',alignItems:'center',gap:'7px',padding:'10px 18px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'10px',color:'white',fontSize:'13.5px',fontWeight:'600',cursor:'pointer',boxShadow:'0 4px 18px rgba(99,102,241,0.35)',transition:'transform 0.2s,box-shadow 0.2s' },
  toolbar: { display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap' },
  searchInput: { width:'100%',paddingLeft:'36px',paddingRight:'14px',paddingTop:'9px',paddingBottom:'9px',background:'rgba(15,15,30,0.7)',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'10px',color:'#e2e8f0',fontSize:'13.5px',outline:'none',boxSizing:'border-box' },
  grid: { display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px' },
  addCard: { display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'12px',padding:'28px',background:'rgba(15,15,30,0.3)',border:'2px dashed rgba(99,102,241,0.18)',borderRadius:'16px',cursor:'pointer',transition:'all 0.2s',minHeight:'200px' },
  addCardIcon: { width:'48px',height:'48px',borderRadius:'12px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',display:'flex',alignItems:'center',justifyContent:'center' },
  tableWrap: { background:'rgba(10,10,24,0.6)',border:'1px solid rgba(99,102,241,0.08)',borderRadius:'16px',overflow:'hidden' },
  empty: { display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 20px',gap:'0' },
  emptyIcon: { width:'70px',height:'70px',borderRadius:'20px',background:'rgba(15,15,30,0.8)',border:'1px solid rgba(99,102,241,0.08)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px' },
};

const c = {
  card: { background:'rgba(12,12,26,0.8)',border:'1px solid rgba(99,102,241,0.08)',borderRadius:'16px',overflow:'hidden',transition:'all 0.25s',display:'flex',flexDirection:'column' },
  banner: { height:'90px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative' },
  bannerInitials: { fontSize:'28px',fontWeight:'800',color:'rgba(255,255,255,0.9)',letterSpacing:'-0.02em',textShadow:'0 2px 8px rgba(0,0,0,0.3)' },
  featuredBadge: { position:'absolute',top:'10px',right:'10px',background:'rgba(0,0,0,0.35)',backdropFilter:'blur(8px)',color:'#fbbf24',fontSize:'10px',fontWeight:'700',padding:'3px 9px',borderRadius:'20px',border:'1px solid rgba(251,191,36,0.3)' },
  body: { padding:'16px',flex:1,display:'flex',flexDirection:'column',gap:'8px' },
  projectTitle: { color:'#f1f5f9',fontSize:'15px',fontWeight:'700',margin:0,letterSpacing:'-0.01em' },
  categoryBadge: { fontSize:'10px',fontWeight:'600',padding:'2px 8px',borderRadius:'20px',background:'rgba(99,102,241,0.12)',color:'#818cf8',border:'1px solid rgba(99,102,241,0.2)',whiteSpace:'nowrap',flexShrink:0 },
  desc: { color:'#475569',fontSize:'12.5px',lineHeight:'1.55',margin:0,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' },
  techRow: { display:'flex',flexWrap:'wrap',gap:'5px',marginTop:'2px' },
  linkRow: { display:'flex',gap:'8px',marginTop:'4px' },
  liveLink: { display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#818cf8',textDecoration:'none',fontWeight:'500' },
  githubLink: { display:'flex',alignItems:'center',gap:'4px',fontSize:'12px',color:'#475569',textDecoration:'none',fontWeight:'500' },
  cardFooter: { display:'flex',gap:'8px',padding:'12px 16px',borderTop:'1px solid rgba(99,102,241,0.07)' },
  editBtn: { flex:1,padding:'7px',background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.18)',borderRadius:'8px',color:'#818cf8',fontSize:'12px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',transition:'background 0.15s' },
  deleteBtn: { flex:1,padding:'7px',background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:'8px',color:'#f87171',fontSize:'12px',fontWeight:'600',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px',transition:'background 0.15s' },
};

const m = {
  backdrop: { position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(6px)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' },
  modal: { background:'#0d0d20',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'20px',width:'100%',maxWidth:'600px',maxHeight:'90vh',overflow:'auto',boxShadow:'0 30px 60px rgba(0,0,0,0.6)' },
  header: { display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 24px 0' },
  title: { color:'#f1f5f9',fontSize:'18px',fontWeight:'700',margin:0,letterSpacing:'-0.01em' },
  closeBtn: { width:'32px',height:'32px',borderRadius:'8px',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.12)',color:'#64748b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' },
  form: { padding:'20px 24px 24px',display:'flex',flexDirection:'column',gap:'16px' },
  grid2: { display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' },
  field: { display:'flex',flexDirection:'column',gap:'6px' },
  label: { color:'#64748b',fontSize:'12.5px',fontWeight:'500' },
  input: { padding:'9px 13px',background:'rgba(15,15,30,0.8)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'9px',color:'#e2e8f0',fontSize:'13.5px',outline:'none',transition:'border-color 0.2s',boxSizing:'border-box',width:'100%',fontFamily:'inherit' },
  textarea: { padding:'9px 13px',background:'rgba(15,15,30,0.8)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'9px',color:'#e2e8f0',fontSize:'13.5px',outline:'none',resize:'vertical',boxSizing:'border-box',width:'100%',fontFamily:'inherit',lineHeight:'1.5' },
  select: { padding:'9px 13px',background:'rgba(15,15,30,0.8)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'9px',color:'#e2e8f0',fontSize:'13.5px',outline:'none',boxSizing:'border-box',width:'100%',fontFamily:'inherit',cursor:'pointer' },
  footer: { display:'flex',gap:'10px',justifyContent:'flex-end',paddingTop:'4px' },
  cancelBtn: { padding:'9px 20px',background:'transparent',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'9px',color:'#475569',fontSize:'13.5px',fontWeight:'500',cursor:'pointer' },
  saveBtn: { display:'flex',alignItems:'center',gap:'8px',padding:'9px 22px',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',border:'none',borderRadius:'9px',color:'white',fontSize:'13.5px',fontWeight:'600',cursor:'pointer',boxShadow:'0 4px 14px rgba(99,102,241,0.35)' },
};

export default ProjectsAdmin;
