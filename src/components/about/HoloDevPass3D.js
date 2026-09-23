// Interactive 3D Holographic Developer Pass with Specular Rainbow Sheen
import React, { useRef, useState } from 'react';

const HoloDevPass3D = () => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setCoords({ x: px, y: py });

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -16;
    const ry = ((x - cx) / cx) * 16;
    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => setHovered(true);

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setCoords({ x: 50, y: 50 });
  };

  return (
    <div style={{ perspective: 1200, display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '320px',
          height: '480px',
          borderRadius: '26px',
          background: 'rgba(11, 14, 28, 0.85)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: hovered
            ? '1.5px solid rgba(99, 102, 241, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: hovered
            ? '0 30px 70px -10px rgba(99, 102, 241, 0.4), 0 0 40px rgba(6, 182, 212, 0.25)'
            : '0 15px 40px rgba(0, 0, 0, 0.7)',
          transform: hovered
            ? `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(30px) scale(1.03)`
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          userSelect: 'none',
          cursor: 'grab',
        }}
      >
        {/* Holographic Rainbow Foil Reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: hovered
              ? `radial-gradient(circle 350px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.2), rgba(99, 102, 241, 0.15) 30%, rgba(6, 182, 212, 0.15) 60%, transparent 80%)`
              : 'transparent',
            pointerEvents: 'none',
            zIndex: 10,
            transition: 'background 0.15s ease',
          }}
        />

        {/* Lanyard Clip Slot */}
        <div
          style={{
            width: '44px',
            height: '8px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            margin: '0 auto 16px',
          }}
        />

        {/* Header HUD info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px #10b981',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
              SECURITY: LEVEL 5
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>LH-SYS-2026</span>
        </div>

        {/* Holographic Avatar Graphic */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '38px',
            fontWeight: 900,
            color: '#ffffff',
            boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            position: 'relative',
          }}
        >
          LH
        </div>

        {/* Name and Designation */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <h4
            style={{
              fontSize: '22px',
              fontWeight: 900,
              color: '#f8fafc',
              margin: '0 0 4px',
              letterSpacing: '-0.02em',
            }}
          >
            Lao Limheang
          </h4>
          <p style={{ fontSize: '12px', color: '#818cf8', fontWeight: 700, margin: 0 }}>
            Full-Stack & Spatial Engineer
          </p>
        </div>

        {/* Micro Specs Table */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: 'auto',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>STATUS</div>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 800 }}>Available</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>LOCATION</div>
            <div style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 700 }}>Phnom Penh, KH</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>CORE FOCUS</div>
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700 }}>3D & Full-Stack</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>EXPERIENCE</div>
            <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>3+ Years</div>
          </div>
        </div>

        {/* Holographic Barcode Graphic */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div
            style={{
              height: '24px',
              background:
                'repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 2px, transparent 2px, transparent 4px, #94a3b8 4px, #94a3b8 7px, transparent 7px, transparent 9px)',
              opacity: 0.6,
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: '#64748b',
              marginTop: '4px',
              fontFamily: 'monospace',
            }}
          >
            <span>PASSPORT #LH-88219</span>
            <span>VERIFIED KEY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoloDevPass3D;
