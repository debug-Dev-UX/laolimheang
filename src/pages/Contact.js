import React, { useState, useEffect } from 'react';
import { addDocument } from '../services/firebase/firestore';
import { sendContactToTelegram } from '../services/api/telegramService';
import { validateContactForm } from '../services/validation/validators';
import { COLLECTIONS } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { FaTwitter, FaGithub, FaLinkedin, FaFacebook, FaDribbble, FaInstagram, FaTelegram } from 'react-icons/fa';

const ICONS = {
  twitter: <FaTwitter size={20} />,
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  facebook: <FaFacebook size={20} />,
  instagram: <FaInstagram size={20} />,
  dribbble: <FaDribbble size={20} />,
  telegram: <FaTelegram size={20} />,
};

const Contact = () => {
  const { settings } = React.useContext(SettingsContext);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const [telegramResult, firestoreResult] = await Promise.allSettled([
        sendContactToTelegram(formData),
        addDocument(COLLECTIONS.MESSAGES, formData),
      ]);

      const telegramOk = telegramResult.status === 'fulfilled' && telegramResult.value?.ok !== false;
      if (!telegramOk && firestoreResult.status === 'rejected') {
        throw new Error('Failed to send message. Please try again later.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Header */}
      <section style={s.headerSec}>
        <div style={{...s.orb, width:'600px', height:'600px', background:'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)', top:'-200px', left:'50%', transform:'translateX(-50%)'}} />
        <div style={{...s.headerContent, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)'}}>
          <h1 style={s.title}>Get In <span style={s.gradientText}>Touch</span></h1>
          <p style={s.subtitle}>Have a project in mind or just want to say hi? I'd love to hear from you.</p>
        </div>
      </section>

      {/* Content */}
      <section style={{...s.contentSec, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '0.1s'}}>
        
        <div style={s.grid} className="contact-grid">
          {/* Left Info */}
          <div style={s.infoCol}>
            <div style={s.infoCard}>
              <h3 style={s.infoTitle}>Contact Information</h3>
              <p style={s.infoText}>Fill out the form and I'll get back to you within 24 hours.</p>
              
              <div style={s.infoList}>
                <div style={s.infoItem}>
                  <div style={s.iconWrap}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <span style={s.itemLbl}>Phone</span>
                    <a href={`tel:${settings?.phone || ''}`} style={s.itemVal}>{settings?.phone || '+1 (234) 567-890'}</a>
                  </div>
                </div>
                
                <div style={s.infoItem}>
                  <div style={s.iconWrap}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <span style={s.itemLbl}>Email</span>
                    <a href={`mailto:${settings?.email || ''}`} style={s.itemVal}>{settings?.email || 'hello@laolimheang.com'}</a>
                  </div>
                </div>

                <div style={s.infoItem}>
                  <div style={s.iconWrap}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <span style={s.itemLbl}>Location</span>
                    <span style={s.itemVal}>{settings?.location || 'Phnom Penh, Cambodia'}</span>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div style={s.socials}>
                {settings?.socialLinks && Object.entries(settings.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="hover-lift" style={s.socialLink} title={platform}>
                      {ICONS[platform.toLowerCase()] || platform}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div style={s.formCol}>
            {success && (
              <div style={s.toast}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/></svg>
                Thank you! Your message has been sent successfully.
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formGrid} className="form-grid">
                <div style={s.field}>
                  <label style={s.lbl}>Your Name</label>
                  <input className="c-inp" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" style={s.inp} />
                  {errors.name && <span style={s.err}>{errors.name}</span>}
                </div>
                <div style={s.field}>
                  <label style={s.lbl}>Your Email</label>
                  <input className="c-inp" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" style={s.inp} />
                  {errors.email && <span style={s.err}>{errors.email}</span>}
                </div>
              </div>
              
              <div style={s.field}>
                <label style={s.lbl}>Subject</label>
                <input className="c-inp" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can I help you?" style={s.inp} />
                {errors.subject && <span style={s.err}>{errors.subject}</span>}
              </div>
              
              <div style={s.field}>
                <label style={s.lbl}>Message</label>
                <textarea className="c-inp" name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="Tell me about your project..." style={{...s.inp, resize:'vertical'}} />
                {errors.message && <span style={s.err}>{errors.message}</span>}
              </div>

              {errors.submit && <div style={{color:'#f87171',fontSize:'13px',marginBottom:'16px'}}>{errors.submit}</div>}

              <button type="submit" disabled={loading} style={{...s.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer'}} className="hover-lift">
                {loading ? <><span style={s.spinner}/> Sending...</> : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

      </section>
    </div>
  );
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .c-inp:focus { border-color: #3b82f6 !important; background: rgba(15,15,30,0.9) !important; }
  .hover-lift { transition: all 0.2s; }
  .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(59,130,246,0.3); }
  @media (max-width: 900px) {
    .contact-grid { grid-template-columns: 1fr !important; }
    .form-grid { grid-template-columns: 1fr !important; }
  }
`;

const s = {
  page: { background:'#05050A', minHeight:'100vh', fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:'#e2e8f0', overflowX:'hidden' },
  headerSec: { position:'relative', padding:'120px 4vw 20px', textAlign:'center', overflow:'hidden' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  headerContent: { position:'relative', zIndex:1, maxWidth:'640px', margin:'0 auto', transition:'all 0.8s ease' },
  title: { fontSize:'clamp(36px,5vw,56px)', fontWeight:'800', color:'#f1f5f9', margin:0, letterSpacing:'-0.02em' },
  gradientText: { background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  subtitle: { color:'#64748b', fontSize:'17px', lineHeight:'1.6', margin:'16px 0 0' },
  
  contentSec: { maxWidth:'1600px', margin:'0 auto', padding:'60px 4vw 100px', transition:'all 0.8s ease' },
  
  grid: { display:'grid', gridTemplateColumns:'400px 1fr', gap:'40px' },
  infoCol: { display:'flex', flexDirection:'column' },
  infoCard: { background:'linear-gradient(145deg,rgba(30,30,45,0.7),rgba(15,15,25,0.8))', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'24px', padding:'40px', display:'flex', flexDirection:'column', height:'100%', boxShadow:'0 20px 40px rgba(0,0,0,0.4)' },
  infoTitle: { color:'#f1f5f9', fontSize:'24px', fontWeight:'700', margin:'0 0 12px' },
  infoText: { color:'#94a3b8', fontSize:'15px', lineHeight:'1.6', margin:'0 0 40px' },
  infoList: { display:'flex', flexDirection:'column', gap:'24px', flex:1 },
  infoItem: { display:'flex', gap:'16px', alignItems:'center' },
  iconWrap: { width:'48px', height:'48px', borderRadius:'14px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  itemLbl: { display:'block', color:'#64748b', fontSize:'13px', fontWeight:'500', marginBottom:'2px' },
  itemVal: { display:'block', color:'#e2e8f0', fontSize:'15px', fontWeight:'600', textDecoration:'none' },
  socials: { display:'flex', gap:'10px', marginTop:'40px', flexWrap:'wrap' },
  socialLink: { display:'flex', alignItems:'center', justifyContent:'center', width:'42px', height:'42px', background:'rgba(255,255,255,0.05)', borderRadius:'50%', color:'#94a3b8', transition:'all 0.2s', textDecoration:'none' },

  formCol: { display:'flex', flexDirection:'column' },
  toast: { display:'flex', alignItems:'center', gap:'10px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', padding:'16px', borderRadius:'12px', color:'#34d399', fontSize:'14px', fontWeight:'500', marginBottom:'24px', animation:'fadeUp 0.3s ease' },
  form: { background:'rgba(12,12,26,0.6)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'24px', padding:'40px' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' },
  field: { display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px' },
  lbl: { color:'#94a3b8', fontSize:'13.5px', fontWeight:'500' },
  inp: { padding:'14px 16px', background:'rgba(15,15,30,0.6)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', color:'#f1f5f9', fontSize:'15px', outline:'none', fontFamily:'inherit', transition:'all 0.2s' },
  err: { color:'#f87171', fontSize:'12px', marginTop:'4px' },
  submitBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', width:'100%', padding:'16px', background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontSize:'16px', fontWeight:'700' },
  spinner: { display:'inline-block', width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 1s linear infinite' }
};

export default Contact;
