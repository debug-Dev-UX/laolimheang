import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../../context/SettingsContext';
import { FaGithub, FaLinkedin, FaTelegram, FaTwitter } from 'react-icons/fa';
import { Zap, ShieldCheck, Smartphone, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const Footer = () => {
  const { settings } = useContext(SettingsContext);
  const year = new Date().getFullYear();
  const siteName = settings?.siteName || 'LAOLIMHEANG';
  const tagline = settings?.footerTagline || settings?.description || 'Full-Stack Software Engineer & Digital Solutions Architect.';
  const telegram = settings?.telegramUsername || 'laolimheang';

  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800">
      {/* ── Value Propositions Strip (Icons, No Emojis) ── */}
      <div className="border-b border-neutral-800 bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors duration-200">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">FAST DELIVERY</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Automated CI/CD deployment</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors duration-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">RELIABLE & SECURE</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Zero-trust, tested clean code</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors duration-200">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">100% RESPONSIVE</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Flawless on all mobile devices</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors duration-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">DIRECT COMMUNICATION</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Telegram, Email & WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-2xl font-black tracking-[0.25em] uppercase text-white block">
              {siteName}
            </span>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              {tagline}
            </p>

            {/* Newsletter Input */}
            <div className="pt-2 max-w-md">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-2">
                NEWSLETTER & AVAILABILITY ALERTS
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs px-3.5 py-2.5 flex-1 focus:outline-none focus:border-white transition-colors duration-200"
                />
                <button
                  type="button"
                  className="bg-white text-black text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-neutral-200 transition-colors duration-200 active:scale-95"
                >
                  JOIN
                </button>
              </div>
            </div>

            {/* Social Icons (No Emojis) */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={settings?.github || "https://github.com/laolimheang"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 flex items-center justify-center border border-neutral-800 transition-colors duration-200"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
              <a
                href={settings?.telegram || `https://t.me/${telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 flex items-center justify-center border border-neutral-800 transition-colors duration-200"
                aria-label="Telegram"
              >
                <FaTelegram size={16} />
              </a>
              <a
                href={settings?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 flex items-center justify-center border border-neutral-800 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href={settings?.twitter || "https://twitter.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 flex items-center justify-center border border-neutral-800 transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-2">
              SECTIONS
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li><Link to={ROUTES.HOME} className="hover:text-white transition-colors duration-150">Home Page</Link></li>
              <li><Link to={ROUTES.PORTFOLIO} className="hover:text-white transition-colors duration-150">Project Catalog</Link></li>
              <li><Link to={ROUTES.SERVICES} className="hover:text-white transition-colors duration-150">Engineering Services</Link></li>
              <li><Link to={ROUTES.PROJECT_IMAGES} className="hover:text-white transition-colors duration-150">Architecture Vault</Link></li>
              <li><Link to={ROUTES.GALLERY} className="hover:text-white transition-colors duration-150">Design Gallery</Link></li>
              <li><Link to={ROUTES.BLOG} className="hover:text-white transition-colors duration-150">Technical Blog</Link></li>
            </ul>
          </div>

          {/* Disciplines Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-2">
              DISCIPLINES
            </h4>
            <ul className="space-y-2 text-xs font-medium text-neutral-400">
              <li>Full-Stack Web Apps</li>
              <li>React & Next.js Systems</li>
              <li>Node.js & Express APIs</li>
              <li>PostgreSQL & MongoDB</li>
              <li>Docker Containerization</li>
              <li>Performance Tuning</li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-neutral-800 pb-2">
              CUSTOMER CARE
            </h4>
            <div className="text-xs text-neutral-400 space-y-2.5">
              <p><strong className="text-white">Location:</strong> {settings?.location || 'Phnom Penh, Cambodia'}</p>
              <p><strong className="text-white">Direct Telegram:</strong> @{telegram.replace('@', '')}</p>
              <p><strong className="text-white">Working Hours:</strong> Mon - Sat (8:00 AM - 6:00 PM)</p>
              <p><strong className="text-white">Response Time:</strong> Within 2 hours</p>
              <div className="pt-2">
                <Link
                  to={ROUTES.CONTACT}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold uppercase tracking-wider text-[11px] hover:bg-neutral-200 transition-colors duration-200 active:scale-95"
                >
                  <span>START INQUIRY NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-neutral-800 py-6 px-4 sm:px-6 lg:px-8 bg-black text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {year} {siteName}. All Rights Reserved. Managed via Admin Portal.</p>
          <div className="flex items-center gap-4 text-[11px] tracking-wider uppercase">
            <span>REACT 18</span>
            <span>•</span>
            <span>VITE</span>
            <span>•</span>
            <span>TAILWIND CSS</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
