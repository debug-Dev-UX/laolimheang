import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { subscribeToCollection } from '../services/firebase/firestore';
import { COLLECTIONS, ROUTES } from '../utils/constants';
import { SettingsContext } from '../context/SettingsContext';
import { useAuth } from '../hooks/useAuth';
import { Shield, Cpu, Layers, Code, Check, Briefcase, Plus, Edit3 } from 'lucide-react';

const About = () => {
  const { settings, loading: settingsLoading } = useContext(SettingsContext);
  const { isAdmin, user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const siteName = settings?.siteName || 'LAOLIMHEANG';

  useEffect(() => {
    const unsubscribe = subscribeToCollection(COLLECTIONS.SKILLS, (data) => {
      if (data && data.length > 0) {
        setSkills(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setSkills([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const aboutParagraphs = settings?.aboutText
    ? settings.aboutText.split('\n').filter((p) => p.trim() !== '')
    : [
        'I am a dedicated Full-Stack Software Engineer based in Phnom Penh, Cambodia, with a disciplined focus on architecting scalable digital platforms, performant web applications, and resilient cloud infrastructure.',
        'With deep technical roots in modern React, Next.js, TypeScript, and Node.js backend systems, my engineering philosophy prioritizes clean data structures, sub-second latency, zero downtime, and minimalist, high-contrast user interfaces that convert.',
        'Whether collaborating with early-stage venture founders to ship an MVP from scratch or refactoring enterprise microservices for scale, I deliver production code with speed, transparency, and architectural integrity.',
      ];

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header (Zando Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">ENGINEER PROFILE</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
                ABOUT {siteName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl mt-1">
                Software engineer, systems architect, and digital product craftsman based in Phnom Penh, Cambodia.
              </p>
            </div>

            {isAdmin && user && (
              <Link
                to={ROUTES.ADMIN_SETTINGS}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bio in Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Editorial Lookbook & Bio Section ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Zando Editorial ID Pass Card */}
          <div className="lg:col-span-5">
            <div className="border-2 border-black p-6 sm:p-8 bg-neutral-50 shadow-xl space-y-6 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  DEVELOPER CREDENTIAL ID
                </span>
                <span className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  #LH-2026
                </span>
              </div>

              {/* Monogram Brand Block */}
              <div className="bg-black text-white p-8 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-white text-black font-black text-2xl flex items-center justify-center">
                  LH
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest pt-2">{siteName}</h3>
                <p className="text-xs text-neutral-400 font-medium tracking-wider uppercase">
                  FULL-STACK SOFTWARE ENGINEER
                </p>
              </div>

              {/* Data Field Table */}
              <div className="divide-y divide-neutral-200 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">LOCATION:</span>
                  <span className="font-bold text-black">{settings?.location || 'Phnom Penh, Cambodia'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">EXPERIENCE:</span>
                  <span className="font-bold text-black">{settings?.stat1Value || '3+'} Years</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">FOCUS:</span>
                  <span className="font-bold text-black">React, Next.js, Node.js, Cloud</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">COMMUNICATION:</span>
                  <span className="font-bold text-black">English, Khmer</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="font-bold text-neutral-500 uppercase">STATUS:</span>
                  <span className="font-bold text-emerald-600 uppercase">Available for Hire</span>
                </div>
              </div>

              {/* Card CTA */}
              <div className="pt-2">
                <Link
                  to={ROUTES.CONTACT}
                  className="block text-center w-full py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-black tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  START SYSTEM INQUIRY &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Biography & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black tracking-widest uppercase text-neutral-500 block">
                ENGINEERING PHILOSOPHY & BACKGROUND
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                TURNING COMPLEX SYSTEM LOGIC INTO FAST, INTUITIVE EXPERIENCES
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed pt-2">
                {aboutParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Core Values Strip (Lucide Icons, No Emojis) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
              <div className="border border-neutral-300 p-4 bg-neutral-50 space-y-1.5 transition-all duration-200 hover:border-black">
                <Cpu className="w-5 h-5 text-black mb-1" />
                <span className="text-xs font-black uppercase tracking-wider text-black block">01 / PERFORMANCE</span>
                <p className="text-xs text-neutral-600">Sub-second page loads and lightweight payloads across slow mobile networks.</p>
              </div>

              <div className="border border-neutral-300 p-4 bg-neutral-50 space-y-1.5 transition-all duration-200 hover:border-black">
                <Layers className="w-5 h-5 text-black mb-1" />
                <span className="text-xs font-black uppercase tracking-wider text-black block">02 / MODULARITY</span>
                <p className="text-xs text-neutral-600">Reusable component design, strict TypeScript contracts, and clean file hierarchy.</p>
              </div>

              <div className="border border-neutral-300 p-4 bg-neutral-50 space-y-1.5 transition-all duration-200 hover:border-black">
                <Shield className="w-5 h-5 text-black mb-1" />
                <span className="text-xs font-black uppercase tracking-wider text-black block">03 / PRECISION</span>
                <p className="text-xs text-neutral-600">Pixel-perfect layouts, responsive design, and intuitive interaction architecture.</p>
              </div>
            </div>

            {/* Technical Skills Catalog */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-lg font-black uppercase tracking-wider text-black">
                  CORE TECHNICAL COMPETENCIES
                </h3>
                {isAdmin && user && (
                  <Link to={ROUTES.ADMIN_SKILLS} className="text-xs font-bold text-black hover:underline uppercase tracking-wider flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Manage Skills
                  </Link>
                )}
              </div>

              {loading ? (
                /* Skeleton Loading for Skills */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="border border-neutral-200 p-4 skeleton-shimmer h-28" />
                  ))}
                </div>
              ) : skills.length === 0 ? (
                <div className="border border-dashed border-neutral-300 p-6 text-center text-xs text-neutral-500 uppercase">
                  No skills listed yet. Add them in the Admin Skills panel.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((sk, idx) => (
                    <div key={sk.id || idx} className="border border-neutral-200 p-4 bg-white transition-all duration-200 hover:border-black">
                      <span className="text-xs font-black uppercase tracking-wider text-black block mb-2">
                        {sk.category}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(sk.items || []).map((item) => (
                          <span key={item} className="px-2 py-0.5 bg-neutral-100 text-black text-[10px] font-bold uppercase tracking-wider border border-neutral-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* ── Bottom CTA ── */}
      <section className="bg-black text-white py-14 px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
          READY TO WORK TOGETHER?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-medium">
          Let's discuss how my full-stack engineering skill set can add direct value to your team.
        </p>
        <div className="pt-2">
          <Link
            to={ROUTES.CONTACT}
            className="inline-block px-8 py-3.5 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            CONNECT WITH {siteName} &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
