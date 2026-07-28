import React, { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { setDocument } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SettingsAdmin = () => {
  const { settings, loading } = useContext(SettingsContext);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => { if (settings) setFormData(settings); }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDocument(COLLECTIONS.SETTINGS, formData.id || 'default', formData);
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      showToast('Error saving settings: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'home', label: 'Home Stats' },
    { id: 'about', label: 'About Me' },
    { id: 'seo', label: 'SEO' },
    { id: 'social', label: 'Social' },
  ];

  const Field = ({ label, name, type = 'text', placeholder = '', multiline = false, hint = '' }) => (
    <div style={f.fieldGroup}>
      <label style={f.label}>{label}</label>
      {hint && <p style={f.hint}>{hint}</p>}
      {multiline ? (
        <textarea
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          rows={4}
          style={f.textarea}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          style={f.input}
          placeholder={placeholder}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = 'rgba(99,102,241,0.2)'}
        />
      )}
    </div>
  );

  return (
    <div style={p.page}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 100,
          padding: '12px 18px', borderRadius: '10px',
          background: toastType === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${toastType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          color: toastType === 'success' ? '#34d399' : '#f87171',
          fontSize: '13.5px', fontWeight: '500',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          {toastType === 'success' ? '✓' : '✕'} {toastMsg}
        </div>
      )}

      <div style={p.header}>
        <div>
          <h1 style={p.title}>Settings</h1>
          <p style={p.subtitle}>Manage your site configuration</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={p.tabsRow}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              ...p.tab,
              ...(activeTab === tab.id ? p.tabActive : {}),
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        <div style={p.formCard}>
          {activeTab === 'general' && (
            <>
              <p style={f.section}>Site Information</p>
              <div style={f.grid}>
                <Field label="Site Name" name="siteName" placeholder="LaolimHeang" />
                <Field label="Contact Email" name="email" type="email" placeholder="hello@example.com" />
                <Field label="Phone Number" name="phone" placeholder="+1 234 567 8900" />
                <Field label="Telegram Username" name="telegramUsername" placeholder="@yourusername" />
              </div>
              <Field label="Site Description" name="description" multiline placeholder="A brief description of your site..." hint="Used in email footers and about sections." />
              <Field label="Footer Text" name="footerText" placeholder="© 2025 LaolimHeang. All rights reserved." />
            </>
          )}

          {activeTab === 'home' && (
            <>
              <p style={f.section}>Home Page Stats</p>
              <div style={f.grid}>
                <Field label="Stat 1 Value" name="stat1Value" placeholder="3+" />
                <Field label="Stat 1 Label" name="stat1Label" placeholder="Years Experience" />
                <Field label="Stat 2 Value" name="stat2Value" placeholder="20+" />
                <Field label="Stat 2 Label" name="stat2Label" placeholder="Projects Built" />
                <Field label="Stat 3 Value" name="stat3Value" placeholder="100%" />
                <Field label="Stat 3 Label" name="stat3Label" placeholder="Client Satisfaction" />
              </div>
            </>
          )}

          {activeTab === 'about' && (
            <>
              <p style={f.section}>About Me Section</p>
              <Field label="About Me Text" name="aboutText" multiline placeholder="I am a passionate Full-Stack Developer..." hint="This text will be displayed on the public About page." />
            </>
          )}

          {activeTab === 'seo' && (
            <>
              <p style={f.section}>SEO Configuration</p>
              <div style={f.grid}>
                <Field label="SEO Title" name="seoTitle" placeholder="LaolimHeang — Portfolio" />
                <Field label="SEO Keywords" name="seoKeywords" placeholder="portfolio, developer, design" hint="Comma-separated keywords" />
              </div>
              <Field label="Meta Description" name="seoDescription" multiline placeholder="Enter your meta description (recommended 150–160 characters)..." />
            </>
          )}

          {activeTab === 'social' && (
            <>
              <p style={f.section}>Social Media Links</p>
              <div style={f.grid}>
                {[
                  { label: 'GitHub', name: 'github', ph: 'https://github.com/yourname' },
                  { label: 'LinkedIn', name: 'linkedin', ph: 'https://linkedin.com/in/yourname' },
                  { label: 'Twitter / X', name: 'twitter', ph: 'https://x.com/yourhandle' },
                  { label: 'Facebook', name: 'facebook', ph: 'https://facebook.com/yourpage' },
                ].map(({ label, name, ph }) => (
                  <Field key={name} label={label} name={name} placeholder={ph} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Save button */}
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:'16px'}}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...p.saveBtn,
              ...(saving ? { opacity: 0.7, cursor: 'not-allowed' } : {}),
            }}
          >
            {saving ? (
              <><span style={p.spinner} /> Saving...</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="white" strokeWidth="2"/><polyline points="17 21 17 13 7 13 7 21" stroke="white" strokeWidth="2" strokeLinecap="round"/><polyline points="7 3 7 8 15 8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>Save Changes</>
            )}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const p = {
  page: { display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", maxWidth: '800px' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '-0.02em' },
  subtitle: { color: '#475569', fontSize: '13px', margin: 0 },
  tabsRow: { display: 'flex', gap: '4px', background: 'rgba(10,10,24,0.6)', border: '1px solid rgba(99,102,241,0.08)', borderRadius: '12px', padding: '5px' },
  tab: {
    padding: '8px 20px', borderRadius: '9px', border: 'none',
    background: 'transparent', color: '#475569', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'rgba(99,102,241,0.15)', color: '#818cf8',
    border: '1px solid rgba(99,102,241,0.2)',
  },
  formCard: {
    background: 'rgba(10,10,24,0.6)', border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px',
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', borderRadius: '10px', color: 'white',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
  },
  spinner: {
    display: 'inline-block', width: '13px', height: '13px',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
};

const f = {
  section: { color: '#475569', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#64748b', fontSize: '12.5px', fontWeight: '500' },
  hint: { color: '#334155', fontSize: '11.5px', margin: 0 },
  input: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '9px', color: '#e2e8f0', fontSize: '13.5px', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(15,15,30,0.7)', border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '9px', color: '#e2e8f0', fontSize: '13.5px', outline: 'none',
    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
  },
};

export default SettingsAdmin;
