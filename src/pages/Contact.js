import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { addDocument } from '../services/firebase/firestore';
import { sendContactToTelegram } from '../services/api/telegramService';
import { validateContactForm } from '../services/validation/validators';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { FaTelegram, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  const { settings } = React.useContext(SettingsContext);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Read query parameter if prefilled from services page
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, subject: `Inquiry regarding: ${serviceParam}` }));
    }
  }, []);

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
        addDocument(COLLECTIONS.MESSAGES, {
          ...formData,
          createdAt: new Date().toISOString(),
          status: 'unread',
        }),
      ]);

      const telegramOk = telegramResult.status === 'fulfilled' && telegramResult.value?.ok !== false;
      if (!telegramOk && firestoreResult.status === 'rejected') {
        throw new Error('Failed to deliver message. Please try Telegram direct.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit inquiry. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const FAQS = [
    {
      q: 'WHAT IS YOUR TYPICAL PROJECT TURNAROUND TIME?',
      a: 'Small to medium web applications are typically delivered in 2 - 4 weeks. Consulting and code audits take 3 - 5 business days.',
    },
    {
      q: 'HOW DO WE COMMUNICATE DURING DEVELOPMENT?',
      a: 'We establish a direct Telegram or Slack channel with regular demo environment deployments, weekly milestone checks, and continuous updates.',
    },
    {
      q: 'DO YOU SIGN NON-DISCLOSURE AGREEMENTS (NDAS)?',
      a: 'Yes. I strictly respect client intellectual property and confidentiality, signing NDAs before reviewing sensitive business requirements.',
    },
    {
      q: 'WHAT PAYMENT METHODS DO YOU ACCEPT?',
      a: 'I accept ABA Bank / Bakong KHQR for Cambodia-based clients, as well as international wire transfers, Stripe, and Crypto (USDT/USDC).',
    },
  ];

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header (Zando Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">CUSTOMER CARE & CONCIERGE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
            CONTACT & PROJECT INQUIRIES
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl">
            Have a project in mind, need technical advisory, or looking for a full-stack engineer? Submit your inquiry or connect directly via Telegram.
          </p>
        </div>
      </div>

      {/* ── Main Contact Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="border-2 border-black p-6 sm:p-10 bg-white">
              <div className="border-b border-neutral-200 pb-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  INQUIRY SUBMISSION FORM
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black mt-1">
                  START A CONVERSATION
                </h2>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-black text-white border-l-4 border-emerald-500 text-xs font-bold uppercase tracking-wider space-y-1 animate-fade-in">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>INQUIRY DELIVERED SUCCESSFULLY!</span>
                  </p>
                  <p className="text-neutral-400 font-medium text-[11px] pl-6">Thank you for reaching out. I will respond to your email and Telegram within 2 hours.</p>
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold uppercase tracking-wider flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.G. JOHN SMITH"
                    className="w-full bg-neutral-50 border border-neutral-300 text-black text-xs font-medium px-4 py-3 focus:outline-none focus:border-black uppercase tracking-wider"
                  />
                  {errors.name && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="NAME@COMPANY.COM"
                    className="w-full bg-neutral-50 border border-neutral-300 text-black text-xs font-medium px-4 py-3 focus:outline-none focus:border-black uppercase tracking-wider"
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    SUBJECT / PROJECT TYPE
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="E.G. FULL-STACK WEB APPLICATION"
                    className="w-full bg-neutral-50 border border-neutral-300 text-black text-xs font-medium px-4 py-3 focus:outline-none focus:border-black uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    PROJECT DETAILS & SCOPE *
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="DESCRIBE YOUR TIMELINE, TECHNICAL REQUIREMENTS, AND GOALS..."
                    className="w-full bg-neutral-50 border border-neutral-300 text-black text-xs font-medium px-4 py-3 focus:outline-none focus:border-black uppercase tracking-wider leading-relaxed"
                  />
                  {errors.message && <p className="text-xs text-rose-600 mt-1 font-bold">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs font-black tracking-[0.2em] uppercase transition-colors"
                >
                  {loading ? 'SUBMITTING INQUIRY...' : 'TRANSMIT INQUIRY &rarr;'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Customer Desk & Quick Connect */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Connect Box */}
            <div className="border-2 border-black p-6 sm:p-8 bg-neutral-50 space-y-6">
              <div className="border-b border-neutral-200 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  DIRECT CHANNELS
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-black mt-0.5">
                  INSTANT COMMUNICATION
                </h3>
              </div>

              {/* Telegram Direct (Prominent Zando Style) */}
              <a
                href="https://t.me/laolimheang"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaTelegram size={24} className="text-sky-400" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider block">TELEGRAM DIRECT</span>
                    <span className="text-[11px] text-neutral-300">@laolimheang (Fastest Response)</span>
                  </div>
                </div>
                <span className="text-xs font-bold">&rarr;</span>
              </a>

              {/* Contact Information List */}
              <div className="divide-y divide-neutral-200 text-xs">
                <div className="py-3 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">OFFICE BASE:</span>
                  <span className="font-bold text-black">Phnom Penh, Cambodia</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">TYPICAL RESPONSE:</span>
                  <span className="font-bold text-emerald-600 uppercase">Within 2 Hours</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">WORKING HOURS:</span>
                  <span className="font-bold text-black">Mon - Sat (8:00 AM - 6:00 PM)</span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">DIRECT EMAIL:</span>
                  <a href="mailto:contact@laolimheang.space" className="font-bold text-black hover:underline">
                    contact@laolimheang.space
                  </a>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-3">
                  SOCIAL NETWORKS:
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/laolimheang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-neutral-300 hover:bg-black hover:text-white transition-colors"
                  >
                    <FaGithub size={16} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-neutral-300 hover:bg-black hover:text-white transition-colors"
                  >
                    <FaLinkedin size={16} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-neutral-300 hover:bg-black hover:text-white transition-colors"
                  >
                    <FaTwitter size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="border border-neutral-300 p-6 bg-white space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                CUSTOMER SERVICE COMMITMENT
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                All inquiries receive a prompt reply. Standard non-disclosure agreements can be executed immediately for confidential scopes.
              </p>
            </div>
          </div>

        </div>

        {/* ── FAQ Section (Zando Style Accordion Cards) ── */}
        <div className="mt-20 border-t-2 border-black pt-12">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-neutral-500">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
              COMMON INQUIRIES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-neutral-300 p-6 bg-neutral-50 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-black">
                  {faq.q}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
