import React, { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import { setDocument } from '../services/firebase/firestore';
import { COLLECTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const SettingsAdmin = () => {
  const { settings, loading } = useContext(SettingsContext);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await setDocument(COLLECTIONS.SETTINGS, formData.id || 'default', formData);
      showToast('System configuration saved successfully!', 'success');
    } catch (error) {
      showToast('Error saving settings: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const tabs = [
    { id: 'general', label: 'GENERAL INFO' },
    { id: 'home', label: 'HOME STATS' },
    { id: 'about', label: 'ABOUT BIO' },
    { id: 'seo', label: 'SEO & META' },
    { id: 'social', label: 'SOCIAL CHANNELS' },
    { id: 'footer', label: 'FOOTER & CTAS' },
  ];

  const Field = ({ label, name, type = 'text', placeholder = '', multiline = false, hint = '', uppercase = false }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-wider text-black">
          {label}
        </label>
        {hint && <span className="text-[10px] text-neutral-400 font-medium">{hint}</span>}
      </div>
      {multiline ? (
        <textarea
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium p-3 focus:outline-none focus:border-black tracking-normal transition-colors"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full bg-neutral-100 border border-neutral-300 text-black placeholder-neutral-400 text-xs font-medium px-3.5 py-3 focus:outline-none focus:border-black transition-colors ${uppercase ? 'uppercase tracking-wider' : ''}`}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 text-xs font-black tracking-wider uppercase border shadow-2xl flex items-center gap-2 animate-fade-in ${
            toastType === 'success'
              ? 'bg-black text-white border-neutral-700'
              : 'bg-rose-600 text-white border-rose-800'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Category Header (Zando Lookbook Style) ── */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>SYSTEM CONFIGURATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              GLOBAL SITE SETTINGS
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Manage your brand identity, home page metrics, bio narrative, SEO, and social connectivity.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
      </div>

      {/* ── Category Navigation Tabs (Zando Pill Bar) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-neutral-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-black border border-neutral-300 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Form Card ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-neutral-200 p-6 sm:p-10 shadow-xs space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  BRAND & CONTACT INFORMATION
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Site Name" name="siteName" placeholder="LAOLIMHEANG" uppercase />
                <Field label="Contact Email" name="email" type="email" placeholder="admin@laolimheang.space" />
                <Field label="Phone / Telegram" name="phone" placeholder="+855 97 542 4470" />
                <Field label="Telegram Username" name="telegramUsername" placeholder="laolimheang" />
                <Field label="Primary Location" name="location" placeholder="Phnom Penh, Cambodia" />
                <Field label="Copyright Statement" name="footerText" placeholder="© 2026 LAOLIMHEANG. ALL RIGHTS RESERVED." />
              </div>
              <Field
                label="Site Tagline / Description"
                name="description"
                multiline
                placeholder="Full-Stack Software Engineer & Digital Solutions Architect..."
                hint="Used across meta descriptions and hero summaries."
              />
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  FRONT-PAGE STATISTIC TELEMETRY
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <Field label="Metric 1 Value" name="stat1Value" placeholder="3+" uppercase />
                <Field label="Metric 1 Label" name="stat1Label" placeholder="Years of Experience" />
                <Field label="Metric 2 Value" name="stat2Value" placeholder="20+" uppercase />
                <Field label="Metric 2 Label" name="stat2Label" placeholder="Production Systems" />
                <Field label="Metric 3 Value" name="stat3Value" placeholder="100%" uppercase />
                <Field label="Metric 3 Label" name="stat3Label" placeholder="Client Satisfaction" />
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  ABOUT ME / ENGINEER NARRATIVE
                </h3>
              </div>
              <Field
                label="About Narrative"
                name="aboutText"
                multiline
                placeholder="Full-stack engineer dedicated to high-throughput architectures..."
                hint="Separate paragraphs with blank lines. Displayed on public About page."
              />
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  SEARCH ENGINE OPTIMIZATION (SEO)
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="SEO Title Tag" name="seoTitle" placeholder="LaolimHeang — Full-Stack Engineer" />
                <Field label="SEO Target Keywords" name="seoKeywords" placeholder="react, vite, tailwind, nodejs, postgresql" hint="Comma-separated" />
              </div>
              <Field
                label="Meta Description"
                name="seoDescription"
                multiline
                placeholder="High-performance distributed systems, modern web engineering, and cloud architecture..."
              />
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  SOCIAL & PROFESSIONAL CHANNELS
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: 'GitHub Repository URL', name: 'github', ph: 'https://github.com/heang-dev' },
                  { label: 'LinkedIn Profile URL', name: 'linkedin', ph: 'https://linkedin.com/in/laolimheang' },
                  { label: 'Twitter / X Profile', name: 'twitter', ph: 'https://x.com/laolimheang' },
                  { label: 'Telegram Direct Channel', name: 'telegram', ph: 'https://t.me/laolimheang' },
                  { label: 'Facebook Page URL', name: 'facebook', ph: 'https://facebook.com/laolimheang' },
                  { label: 'Instagram Profile', name: 'instagram', ph: 'https://instagram.com/laolimheang' },
                ].map(({ label, name, ph }) => (
                  <Field key={name} label={label} name={name} placeholder={ph} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-black">
                  FOOTER CONFIGURATION & CALL-TO-ACTION
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field
                  label="Footer Tagline"
                  name="footerTagline"
                  placeholder="Full-Stack Engineer & System Architect..."
                />
                <Field
                  label="Availability Badge Text"
                  name="footerAvailText"
                  placeholder="AVAILABLE FOR NEW COMMISSIONS"
                />
                <Field
                  label="CTA Button Text"
                  name="footerCtaText"
                  placeholder="START A PROJECT"
                />
                <Field
                  label="Contact Prompt Text"
                  name="footerContactDesc"
                  placeholder="Have an engineering project in mind? Let's build something great together."
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  AVAILABILITY BADGE STATUS
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { val: 'true', label: 'VISIBLE & ACTIVE' },
                    { val: 'false', label: 'HIDDEN' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          footerAvailable: opt.val === 'true',
                        }))
                      }
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                        String(formData.footerAvailable ?? true) === opt.val
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-600 border-neutral-300 hover:text-black hover:bg-neutral-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING CHANGES...' : 'SAVE ALL CONFIGURATIONS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
