// Dedicated ABA PAY & KHQR Supporter Portal - Redesigned High-Tech UI
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  QrCode,
  Check,
  ShieldCheck,
  Lock,
  Smartphone,
  Globe,
  Mail,
  Download,
  Copy,
  Landmark,
  CheckCircle2,
  Layers,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import CyberHUD, { playCyberTone } from '../components/common/CyberHUD';
import qrStandeeImage from '../asset/qr.png';

const MERCHANT_INFO = {
  name: 'LAO LIMHEANG',
  mid: '126090508411670',
  service: 'Professional Digital Services & Creative Engineering',
  network: 'ABA PAY • Bakong KHQR (National Bank of Cambodia)',
  currencies: 'USD & KHR (Any Amount)',
  fee: '0% Platform Fee',
};

const COMPATIBLE_BANKS = [
  'ABA Mobile',
  'Bakong App',
  'Wing Bank',
  'ACLEDA Mobile',
  'Canadia Bank',
  'Sathapana Bank',
  'Chip Mong Bank',
  'Prince Bank',
  'TrueMoney',
  'Vattanac Bank',
];

const SCAN_STEPS = [
  {
    step: '01',
    icon: Smartphone,
    iconColor: '#38bdf8',
    title: 'Open Banking App',
    desc: 'Launch ABA Mobile, Bakong, or any of the 10+ compatible Cambodian banking apps on your device.',
  },
  {
    step: '02',
    icon: QrCode,
    iconColor: '#818cf8',
    title: 'Scan Standee QR',
    desc: 'Tap the "Scan QR" button and point your camera at the standee code on screen, or select a saved screenshot from your photo gallery.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    iconColor: '#34d399',
    title: 'Enter Amount & Confirm',
    desc: 'Choose any custom contribution in USD or KHR directly in your app and confirm securely with your PIN.',
  },
];

const IMPACT_POINTS = [
  {
    icon: Globe,
    iconColor: '#38bdf8',
    title: 'Open-Source Blueprints',
    desc: 'Free access to Three.js shaders, reactive UI components, and Figma prototypes for developers worldwide.',
  },
  {
    icon: Zap,
    iconColor: '#818cf8',
    title: 'High-Speed Cloud Infra',
    desc: 'Ensures zero-latency 60 FPS spatial experiences and instantaneous media delivery across all devices.',
  },
  {
    icon: ShieldCheck,
    iconColor: '#34d399',
    title: '100% Ad-Free Experience',
    desc: 'Keeps the digital portfolio, live demos, and technical articles clean, focused, and free from intrusive trackers.',
  },
];

const FAQS = [
  {
    q: 'Can I contribute using mobile while browsing on the same device?',
    a: 'Yes! Simply click the "Download QR Standee" button below the standee to save the image to your phone. Then open ABA Mobile or any Bakong KHQR banking app, tap "Scan QR", select "Photo Gallery", and choose the saved QR image.',
  },
  {
    q: 'Does this accept both USD and Cambodian Riel (KHR)?',
    a: 'Yes. The National Bank of Cambodia Bakong KHQR standard natively accepts both United States Dollar (USD) and Cambodian Riel (KHR). You can select your preferred currency inside your banking app.',
  },
  {
    q: 'Are there any platform transaction fees?',
    a: 'Zero. Every transfer conducted through Bakong KHQR is direct and incurs 0% platform intermediary fees. 100% of your contribution reaches Lao Limheang directly.',
  },
];

const Donate = () => {
  const [copiedMid, setCopiedMid] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const fallbackCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      playCyberTone('click');
      setCopiedMid(true);
      setTimeout(() => setCopiedMid(false), 2400);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(el);
  };

  const copyMid = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(MERCHANT_INFO.mid)
          .then(() => {
            playCyberTone('click');
            setCopiedMid(true);
            setTimeout(() => setCopiedMid(false), 2400);
          })
          .catch(() => fallbackCopy(MERCHANT_INFO.mid));
      } else {
        fallbackCopy(MERCHANT_INFO.mid);
      }
    } catch {
      fallbackCopy(MERCHANT_INFO.mid);
    }
  };

  const toggleFaq = (idx) => {
    playCyberTone('click');
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div
      style={{
        background: '#03040c',
        minHeight: '100vh',
        color: '#e2e8f0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        paddingBottom: '120px',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 162, 232, 0.16) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 70%)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0, 162, 232, 0.08) 50%, transparent 70%)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: '-200px',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.06) 50%, transparent 70%)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 0', position: 'relative', zIndex: 1 }}>
        {/* Header HUD Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          {/* Exact Badge: Accepted via Payway KHQR */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 24px',
              background: 'rgba(12, 18, 38, 0.85)',
              backdropFilter: 'blur(16px)',
              borderRadius: '999px',
              border: '1px solid rgba(0, 162, 232, 0.35)',
              boxShadow: '0 8px 30px rgba(0, 162, 232, 0.2)',
              marginBottom: '20px',
            }}
          >
            <ShieldCheck size={16} color="#38bdf8" />
            <span
              style={{
                fontSize: '12.5px',
                color: '#38bdf8',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Accepted via Payway KHQR
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(36px, 5.5vw, 64px)',
              fontWeight: 900,
              color: '#f8fafc',
              margin: '0 0 16px',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            Fuel the <span style={{ background: 'linear-gradient(135deg, #00a2e8 0%, #6366f1 50%, #f43f5e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Creative Engine</span>
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '16.5px',
              maxWidth: '680px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            Support open-source 3D components, creative experiments, and independent software development in Cambodia.
          </p>

          {/* Quick Verified Credentials Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              maxWidth: '920px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(12, 16, 32, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
              }}
            >
              <CheckCircle2 size={15} color="#34d399" />
              <span style={{ color: '#94a3b8' }}>Merchant:</span>
              <strong style={{ color: '#f8fafc' }}>{MERCHANT_INFO.name}</strong>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(12, 16, 32, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
              }}
            >
              <Landmark size={15} color="#38bdf8" />
              <span style={{ color: '#94a3b8' }}>MID:</span>
              <code style={{ color: '#38bdf8', fontFamily: 'monospace', fontWeight: 700 }}>
                {MERCHANT_INFO.mid}
              </code>
              <button
                type="button"
                onClick={copyMid}
                title="Copy Merchant ID"
                style={{
                  background: copiedMid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 6px',
                  color: copiedMid ? '#34d399' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                }}
              >
                {copiedMid ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                <span>{copiedMid ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(12, 16, 32, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
              }}
            >
              <DollarSign size={15} color="#fbbf24" />
              <span style={{ color: '#94a3b8' }}>Currencies:</span>
              <strong style={{ color: '#f8fafc' }}>USD & KHR</strong>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(12, 16, 32, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
              }}
            >
              <Zap size={15} color="#818cf8" />
              <span style={{ color: '#94a3b8' }}>Platform Fee:</span>
              <strong style={{ color: '#34d399' }}>0% Free</strong>
            </div>
          </div>
        </motion.div>

        {/* ─── Main Balanced 2-Column Dashboard ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '32px',
            alignItems: 'start',
            marginBottom: '64px',
          }}
        >
          {/* ─── LEFT: Official Holographic Standee Podium ─── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: 'linear-gradient(165deg, rgba(14, 22, 48, 0.95) 0%, rgba(8, 12, 28, 0.98) 100%)',
              border: '1px solid rgba(0, 162, 232, 0.35)',
              borderRadius: '28px',
              padding: '32px',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.75), 0 0 50px rgba(0, 162, 232, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top ABA Header Accent */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #002d56, #00a2e8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '15px',
                    color: 'white',
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 16px rgba(0, 162, 232, 0.4)',
                  }}
                >
                  ABA
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '18px', fontWeight: 800 }}>
                    ABA PAY & KHQR
                  </h3>
                  <p style={{ margin: '2px 0 0', color: '#00a2e8', fontSize: '12px', fontWeight: 700 }}>
                    Official Merchant Standee
                  </p>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#34d399',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  letterSpacing: '0.05em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 6px #34d399',
                  }}
                />
                SCAN TO PAY
              </span>
            </div>

            {/* Official QR Standee Display from asset/qr.png */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  background: '#ffffff',
                  borderRadius: '20px',
                  boxShadow: '0 16px 45px rgba(0, 162, 232, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.25)',
                  maxWidth: '320px',
                  width: '100%',
                  margin: '0 auto',
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={qrStandeeImage}
                  alt="ABA PAY KHQR Code - Lao Limheang"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '14px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={qrStandeeImage}
                  download="ABA_PAY_KHQR_LaoLimheang.png"
                  onClick={() => playCyberTone('click')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: 700,
                    background: 'rgba(0, 162, 232, 0.1)',
                    border: '1px solid rgba(0, 162, 232, 0.25)',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    transition: 'all 0.2s',
                  }}
                >
                  <Download size={14} />
                  <span>Download QR Standee</span>
                </a>

                <Link
                  to={ROUTES.CONTACT}
                  onClick={() => playCyberTone('click')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12.5px',
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '9px 18px',
                    borderRadius: '10px',
                  }}
                >
                  <Mail size={14} />
                  <span>Contact Me</span>
                </Link>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '16px 0 0', lineHeight: 1.5 }}>
                Scan with <strong style={{ color: '#38bdf8' }}>ABA Mobile</strong> or any{' '}
                <strong style={{ color: '#f87171' }}>Bakong KHQR App</strong> to contribute instantly.
              </p>
            </div>

            {/* Security note */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: '#64748b',
                lineHeight: 1.4,
              }}
            >
              <Lock size={13} color="#64748b" />
              <span>Encrypted via official National Bank of Cambodia Bakong & ABA Payway infrastructure.</span>
            </div>
          </motion.div>

          {/* ─── RIGHT: Universal Banking Interoperability & Step Guide ─── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Step-by-Step Scan Flow Card */}
            <div
              style={{
                background: 'rgba(12, 16, 34, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <h3 style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={19} color="#38bdf8" />
                <span>How to Scan & Contribute</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {SCAN_STEPS.map((s) => {
                  const StepIcon = s.icon;
                  return (
                    <div
                      key={s.step}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: 'rgba(0, 162, 232, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <StepIcon size={20} color={s.iconColor} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              color: '#38bdf8',
                              background: 'rgba(0, 162, 232, 0.15)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontFamily: 'monospace',
                            }}
                          >
                            STEP {s.step}
                          </span>
                          <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '14.5px', fontWeight: 800 }}>
                            {s.title}
                          </h4>
                        </div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '12.5px', lineHeight: 1.5 }}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Universal Banking Interoperability Card */}
            <div
              style={{
                background: 'rgba(12, 16, 34, 0.8)',
                border: '1px solid rgba(0, 162, 232, 0.25)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '17px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <Layers size={18} color="#38bdf8" />
                  <span>Universal KHQR Interoperability</span>
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#34d399',
                    background: 'rgba(16, 185, 129, 0.12)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    letterSpacing: '0.04em',
                  }}
                >
                  NBC STANDARDIZED
                </span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.5 }}>
                Bakong KHQR enables seamless cross-institution payments. Scan using any registered Cambodian commercial bank or payment service:
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {COMPATIBLE_BANKS.map((bank) => (
                  <div
                    key={bank}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                      }}
                    />
                    <span>{bank}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Settlement Guarantee Notice */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 78, 59, 0.15) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '20px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={22} color="#34d399" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', color: '#f8fafc', fontSize: '14px', fontWeight: 800 }}>
                  100% Direct Settlement to Creator
                </h4>
                <p style={{ margin: 0, color: '#a7f3d0', fontSize: '12px', lineHeight: 1.45 }}>
                  Contributions settle instantly into Lao Limheang's merchant account via the National Bank of Cambodia payment network without middlemen.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Transparency & Impact Section ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '60px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
              Where Does Your Support Go?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '580px', margin: '0 auto' }}>
              Every contribution directly fuels creative digital experiments and keeps resources accessible to everyone.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {IMPACT_POINTS.map((pt) => {
              const IconComp = pt.icon;
              return (
                <div
                  key={pt.title}
                  style={{
                    padding: '24px',
                    background: 'rgba(12, 16, 34, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComp size={24} color={pt.iconColor} />
                  </div>
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', fontWeight: 800, margin: 0 }}>
                    {pt.title}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                    {pt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── FAQ Accordion Section ─── */}
        <div
          style={{
            padding: '32px',
            background: 'rgba(12, 16, 34, 0.75)',
            border: '1px solid rgba(0, 162, 232, 0.25)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="#00a2e8" />
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '18px', fontWeight: 800 }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'transparent',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} color="#38bdf8" /> : <ChevronDown size={16} color="#94a3b8" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p
                          style={{
                            margin: 0,
                            padding: '0 20px 16px',
                            color: '#94a3b8',
                            fontSize: '13px',
                            lineHeight: 1.6,
                          }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <CyberHUD />
    </div>
  );
};

export default Donate;
