/**
 * Skeleton.js — Reusable animated skeleton loading components
 * Matches the dark glassmorphism design of the LaolimHeang portfolio.
 *
 * Exports:
 *   Skeleton          — Base rectangular shimmer block
 *   SkeletonCircle    — Round shimmer block
 *   SkeletonText      — Multi-line text shimmer
 *   HomePageSkeleton
 *   PortfolioPageSkeleton
 *   BlogPageSkeleton
 *   AboutPageSkeleton
 *   ServicesPageSkeleton
 */

import React from 'react';

/* ─────────────────────────────────────────────────
   CSS injected once — shimmer keyframe + base class
───────────────────────────────────────────────── */
const SKELETON_CSS = `
  @keyframes sk-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .sk-base {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.04) 0px,
      rgba(255,255,255,0.09) 150px,
      rgba(255,255,255,0.04) 300px
    );
    background-size: 600px 100%;
    animation: sk-shimmer 1.6s ease-in-out infinite;
    border-radius: 8px;
    flex-shrink: 0;
  }
  @keyframes sk-pulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1;   }
  }
  .sk-pulse { animation: sk-pulse 2s ease-in-out infinite; }
`;

/* ─── Inject style once ─── */
let styleInjected = false;
function injectStyle() {
  if (styleInjected) return;
  const el = document.createElement('style');
  el.textContent = SKELETON_CSS;
  document.head.appendChild(el);
  styleInjected = true;
}

/* ═══════════════════════════════════════════════
   BASE PRIMITIVES
═══════════════════════════════════════════════ */

/** Generic rectangular shimmer block */
export const Skeleton = ({ width = '100%', height = 16, radius = 8, style = {} }) => {
  injectStyle();
  return (
    <div
      className="sk-base"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
};

/** Circular shimmer */
export const SkeletonCircle = ({ size = 40, style = {} }) => {
  injectStyle();
  return (
    <div
      className="sk-base"
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, ...style }}
    />
  );
};

/** Multiple lines of text shimmer */
export const SkeletonText = ({ lines = 3, lastWidth = '60%', gap = 10, style = {} }) => {
  injectStyle();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="sk-base"
          style={{
            height: 14,
            width: i === lines - 1 ? lastWidth : '100%',
            borderRadius: 6,
          }}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PAGE-SPECIFIC SKELETONS
═══════════════════════════════════════════════ */

/* ─── shared wrapper ─── */
const Page = ({ children }) => (
  <div style={{
    background: '#05050A',
    minHeight: '100vh',
    fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
    color: '#e2e8f0',
    overflowX: 'hidden',
  }}>
    {children}
  </div>
);

/* ─── Section header ─── */
const SectionHead = () => (
  <div style={{ textAlign: 'center', marginBottom: 48 }}>
    <div className="sk-base" style={{ height: 12, width: 100, borderRadius: 6, margin: '0 auto 12px' }} />
    <div className="sk-base" style={{ height: 32, width: 280, borderRadius: 8, margin: '0 auto 12px' }} />
    <div className="sk-base" style={{ height: 14, width: 220, borderRadius: 6, margin: '0 auto' }} />
  </div>
);

/* ─── Project card skeleton ─── */
const ProjectCardSkeleton = () => (
  <div style={{
    background: 'rgba(12,12,26,0.6)',
    border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: 18,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }}>
    {/* Banner */}
    <div className="sk-base" style={{ height: 140, borderRadius: 0 }} />
    {/* Body */}
    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div className="sk-base" style={{ height: 18, width: '55%', borderRadius: 6 }} />
        <div className="sk-base" style={{ height: 18, width: 70, borderRadius: 20 }} />
      </div>
      <SkeletonText lines={2} lastWidth="70%" />
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        {[60, 70, 55].map((w, i) => (
          <div key={i} className="sk-base" style={{ height: 20, width: w, borderRadius: 20 }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <div className="sk-base" style={{ height: 14, width: 90, borderRadius: 6 }} />
        <div className="sk-base" style={{ height: 14, width: 80, borderRadius: 6 }} />
      </div>
    </div>
  </div>
);

/* ─── Blog card skeleton ─── */
const BlogCardSkeleton = () => (
  <div style={{
    background: 'rgba(12,12,26,0.6)',
    border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: 18,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div className="sk-base" style={{ height: 200, borderRadius: 0 }} />
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="sk-base" style={{ height: 20, width: 70, borderRadius: 20 }} />
        <div className="sk-base" style={{ height: 20, width: 80, borderRadius: 20 }} />
      </div>
      <div className="sk-base" style={{ height: 22, width: '80%', borderRadius: 6 }} />
      <SkeletonText lines={2} lastWidth="60%" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SkeletonCircle size={28} />
          <div className="sk-base" style={{ height: 12, width: 80, borderRadius: 6 }} />
        </div>
        <div className="sk-base" style={{ height: 12, width: 60, borderRadius: 6 }} />
      </div>
    </div>
  </div>
);

/* ─── Service card skeleton ─── */
const ServiceCardSkeleton = () => (
  <div style={{
    background: 'rgba(12,12,26,0.7)',
    border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: 24,
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }}>
    <div className="sk-base" style={{ width: 64, height: 64, borderRadius: 18 }} />
    <div className="sk-base" style={{ height: 22, width: '60%', borderRadius: 6 }} />
    <SkeletonText lines={3} lastWidth="50%" />
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="sk-base" style={{ height: 34, width: 90, borderRadius: 6 }} />
      <div className="sk-base" style={{ height: 14, width: 50, borderRadius: 6 }} />
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="sk-base" style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0 }} />
        <div className="sk-base" style={{ height: 13, width: `${55 + i * 10}%`, borderRadius: 6 }} />
      </div>
    ))}
    <div className="sk-base" style={{ height: 46, width: '100%', borderRadius: 12, marginTop: 8 }} />
  </div>
);

/* ─── Skill card skeleton ─── */
const SkillRowSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div className="sk-base" style={{ height: 13, width: '40%', borderRadius: 6 }} />
      <div className="sk-base" style={{ height: 13, width: 30, borderRadius: 6 }} />
    </div>
    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }}>
      <div className="sk-base" style={{ height: 6, width: '70%', borderRadius: 6 }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════
   HOME PAGE SKELETON
═══════════════════════════════════════════════ */
export const HomePageSkeleton = () => {
  injectStyle();
  return (
    <Page>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        padding: '80px 4vw',
        maxWidth: 1600,
        margin: '0 auto',
        flexWrap: 'wrap',
      }}>
        {/* Left — text */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="sk-base" style={{ height: 32, width: 240, borderRadius: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="sk-base" style={{ height: 56, width: '90%', borderRadius: 10 }} />
            <div className="sk-base" style={{ height: 56, width: '70%', borderRadius: 10 }} />
          </div>
          <SkeletonText lines={3} lastWidth="60%" gap={12} />
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <div className="sk-base" style={{ height: 48, width: 190, borderRadius: 12 }} />
            <div className="sk-base" style={{ height: 48, width: 180, borderRadius: 12 }} />
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginTop: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="sk-base" style={{ height: 28, width: 60, borderRadius: 6 }} />
                <div className="sk-base" style={{ height: 11, width: 90, borderRadius: 6 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right — code card */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 460 }}>
          <div style={{
            background: 'rgba(10,10,25,0.75)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 16px',
              background: 'rgba(99,102,241,0.08)',
              borderBottom: '1px solid rgba(99,102,241,0.1)',
            }}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.5 }} />
              ))}
              <div className="sk-base" style={{ height: 12, width: 120, borderRadius: 6, marginLeft: 8 }} />
            </div>
            {/* Code lines */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[85, 65, 90, 78, 40, 0, 70, 55, 35, 50].map((w, i) => (
                w === 0
                  ? <div key={i} style={{ height: 10 }} />
                  : <div key={i} className="sk-base" style={{ height: 13, width: `${w}%`, borderRadius: 5, marginLeft: i > 0 && i < 5 ? 16 : 0 }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects section */}
      <section style={{ padding: '80px 4vw', maxWidth: 1600, margin: '0 auto' }}>
        <SectionHead />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
          {[1, 2, 3].map(i => <ProjectCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Services section */}
      <section style={{
        padding: '80px 4vw',
        background: 'rgba(99,102,241,0.03)',
        borderTop: '1px solid rgba(99,102,241,0.06)',
        borderBottom: '1px solid rgba(99,102,241,0.06)',
      }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <SectionHead />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                background: 'rgba(10,10,24,0.6)',
                border: '1px solid rgba(99,102,241,0.08)',
                borderRadius: 18,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div className="sk-base" style={{ width: 48, height: 48, borderRadius: 14 }} />
                <div className="sk-base" style={{ height: 18, width: '60%', borderRadius: 6 }} />
                <SkeletonText lines={2} lastWidth="75%" gap={8} />
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[1, 2, 3].map(j => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="sk-base" style={{ width: 26, height: 13, borderRadius: 4, flexShrink: 0 }} />
                      <div className="sk-base" style={{ height: 12, width: '65%', borderRadius: 5 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
};

/* ═══════════════════════════════════════════════
   PORTFOLIO PAGE SKELETON
═══════════════════════════════════════════════ */
export const PortfolioPageSkeleton = () => {
  injectStyle();
  return (
    <Page>
      {/* Header */}
      <section style={{ padding: '120px 4vw 60px', textAlign: 'center' }}>
        <div className="sk-base" style={{ height: 52, width: 320, borderRadius: 10, margin: '0 auto 16px' }} />
        <div className="sk-base" style={{ height: 16, width: 380, borderRadius: 6, margin: '0 auto' }} />
      </section>

      {/* Filter pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, padding: '0 4vw 40px', flexWrap: 'wrap' }}>
        {[60, 80, 100, 90, 70, 85].map((w, i) => (
          <div key={i} className="sk-base" style={{ height: 36, width: w, borderRadius: 20 }} />
        ))}
      </div>

      {/* Grid */}
      <section style={{ padding: '0 4vw 100px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
          {[1, 2, 3, 4, 5, 6].map(i => <ProjectCardSkeleton key={i} />)}
        </div>
      </section>
    </Page>
  );
};

/* ═══════════════════════════════════════════════
   BLOG PAGE SKELETON
═══════════════════════════════════════════════ */
export const BlogPageSkeleton = () => {
  injectStyle();
  return (
    <Page>
      {/* Header */}
      <section style={{ padding: '120px 4vw 60px', textAlign: 'center' }}>
        <div className="sk-base" style={{ height: 52, width: 240, borderRadius: 10, margin: '0 auto 16px' }} />
        <div className="sk-base" style={{ height: 16, width: 340, borderRadius: 6, margin: '0 auto' }} />
      </section>

      {/* Featured hero post */}
      <section style={{ padding: '0 4vw 60px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(12,12,26,0.6)',
          border: '1px solid rgba(99,102,241,0.08)',
          borderRadius: 24,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))',
        }}>
          <div className="sk-base" style={{ minHeight: 280, borderRadius: 0 }} />
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="sk-base" style={{ height: 22, width: 80, borderRadius: 20 }} />
              <div className="sk-base" style={{ height: 22, width: 90, borderRadius: 20 }} />
            </div>
            <div className="sk-base" style={{ height: 32, width: '80%', borderRadius: 8 }} />
            <SkeletonText lines={3} lastWidth="55%" gap={10} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <SkeletonCircle size={36} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="sk-base" style={{ height: 12, width: 100, borderRadius: 5 }} />
                <div className="sk-base" style={{ height: 11, width: 80, borderRadius: 5 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '0 4vw 100px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
          {[1, 2, 3, 4, 5].map(i => <BlogCardSkeleton key={i} />)}
        </div>
      </section>
    </Page>
  );
};

/* ═══════════════════════════════════════════════
   ABOUT PAGE SKELETON
═══════════════════════════════════════════════ */
export const AboutPageSkeleton = () => {
  injectStyle();
  return (
    <Page>
      {/* Hero */}
      <section style={{
        padding: '120px 4vw 80px',
        maxWidth: 1600,
        margin: '0 auto',
        display: 'flex',
        gap: 60,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Text */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="sk-base" style={{ height: 14, width: 120, borderRadius: 20 }} />
          <div className="sk-base" style={{ height: 52, width: '80%', borderRadius: 10 }} />
          <SkeletonText lines={4} lastWidth="60%" gap={12} />
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            <div className="sk-base" style={{ height: 46, width: 160, borderRadius: 12 }} />
            <div className="sk-base" style={{ height: 46, width: 150, borderRadius: 12 }} />
          </div>
        </div>
        {/* Visualizer box */}
        <div style={{ flex: 1, minWidth: 280, maxWidth: 420 }}>
          <div style={{
            background: 'rgba(12,12,26,0.7)',
            border: '1px solid rgba(99,102,241,0.12)',
            borderRadius: 20,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            {/* Bar visualizer mock */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 100 }}>
              {[60,80,45,90,70,55,85,65,75,50,90,80,60,70,65].map((h, i) => (
                <div key={i} className="sk-base" style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
            <div className="sk-base" style={{ height: 12, width: '50%', borderRadius: 6, margin: '0 auto' }} />
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section style={{ padding: '60px 4vw', maxWidth: 1600, margin: '0 auto' }}>
        <SectionHead />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              background: 'rgba(12,12,26,0.7)',
              border: '1px solid rgba(99,102,241,0.08)',
              borderRadius: 20,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="sk-base" style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0 }} />
                <div className="sk-base" style={{ height: 16, width: '55%', borderRadius: 6 }} />
              </div>
              {[1, 2, 3, 4].map(j => <SkillRowSkeleton key={j} />)}
            </div>
          ))}
        </div>
      </section>

      {/* Experience timeline skeleton */}
      <section style={{ padding: '60px 4vw 100px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHead />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              display: 'flex',
              gap: 20,
              background: 'rgba(12,12,26,0.6)',
              border: '1px solid rgba(99,102,241,0.08)',
              borderRadius: 16,
              padding: '24px',
            }}>
              <div className="sk-base" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="sk-base" style={{ height: 18, width: '50%', borderRadius: 6 }} />
                <div className="sk-base" style={{ height: 14, width: '35%', borderRadius: 6 }} />
                <SkeletonText lines={2} lastWidth="65%" gap={8} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
};

/* ═══════════════════════════════════════════════
   SERVICES PAGE SKELETON
═══════════════════════════════════════════════ */
export const ServicesPageSkeleton = () => {
  injectStyle();
  return (
    <Page>
      {/* Header */}
      <section style={{ padding: '120px 4vw 60px', textAlign: 'center' }}>
        <div className="sk-base" style={{ height: 52, width: 280, borderRadius: 10, margin: '0 auto 16px' }} />
        <div className="sk-base" style={{ height: 16, width: 420, borderRadius: 6, margin: '0 auto' }} />
      </section>

      {/* Cards grid */}
      <section style={{ padding: '0 4vw 100px', maxWidth: 1600, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 30 }}>
          {[1, 2, 3, 4].map(i => <ServiceCardSkeleton key={i} />)}
        </div>
      </section>
    </Page>
  );
};
