import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import qrStandeeImage from '../asset/qr.png';
import { Smartphone, QrCode, CheckCircle2, Copy, Check, ShieldCheck } from 'lucide-react';

const MERCHANT_INFO = {
  name: 'LAO LIMHEANG',
  accountNumber: '001 260 905',
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
    title: 'OPEN YOUR BANKING APP',
    desc: 'Launch ABA Mobile, Bakong, or any of the 10+ compatible Cambodian banking apps on your device.',
  },
  {
    step: '02',
    icon: QrCode,
    title: 'TAP SCAN KHQR',
    desc: 'Select the Scan QR function in your banking application to scan the code displayed on this screen.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'ENTER AMOUNT & CONFIRM',
    desc: 'Enter your preferred contribution amount in either USD or KHR. Verify recipient as LAO LIMHEANG.',
  },
];

const Donate = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(MERCHANT_INFO.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-black selection:text-white">
      {/* ── Category Header (Zando Style) ── */}
      <div className="border-b border-neutral-200 bg-[#f9fafb] py-8 sm:py-12 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-neutral-500">
            <Link to={ROUTES.HOME} className="hover:text-black">HOME</Link>
            <span>/</span>
            <span className="text-black">SUPPORTER & DONATIONS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase text-black">
            ABA PAY & BAKONG KHQR SUPPORTER PORTAL
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl">
            Support open-source development, educational programming articles, and cloud hosting infrastructure directly.
          </p>
        </div>
      </div>

      {/* ── Main Donation Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: QR Card */}
          <div className="lg:col-span-5">
            <div className="border-2 border-black p-6 sm:p-8 bg-neutral-50 shadow-xl space-y-6 text-center transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  NATIONAL BANK OF CAMBODIA
                </span>
                <span className="bg-black text-white px-2 py-0.5">KHQR INSTANT</span>
              </div>

              {/* QR Image Container */}
              <div className="bg-white border-2 border-black p-4 inline-block mx-auto max-w-xs shadow-md">
                <img
                  src={qrStandeeImage}
                  alt="ABA KHQR Lao Limheang"
                  className="w-full h-auto object-contain max-h-[380px]"
                />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-wider text-black">
                  {MERCHANT_INFO.name}
                </h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
                  {MERCHANT_INFO.network}
                </p>
              </div>

              {/* Account Details with Copy */}
              <div className="bg-white border border-neutral-300 p-4 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                      ABA ACCOUNT NUMBER
                    </span>
                    <span className="text-sm font-mono font-bold text-black">
                      {MERCHANT_INFO.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex justify-between text-xs text-neutral-600">
                  <span className="font-bold">FEE:</span>
                  <span className="text-emerald-600 font-bold">0% PLATFORM FEE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: How to Pay & Bank Support */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black tracking-widest uppercase text-neutral-500 block">
                SIMPLE & ZERO-FEE CONTRIBUTION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                HOW TO SUPPORT VIA BAKONG KHQR
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Scan using any authorized Cambodian banking application. All contributions directly support server hosting, domain renewals, and open-source software libraries.
              </p>
            </div>

            {/* Steps (Clean Lucide Icons, No Emojis) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SCAN_STEPS.map((s) => {
                const IconComp = s.icon;
                return (
                  <div key={s.step} className="border border-neutral-300 p-5 bg-neutral-50 space-y-2 transition-all duration-200 hover:border-black">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white bg-black px-2 py-0.5 inline-block">
                        {s.step}
                      </span>
                      <IconComp className="w-5 h-5 text-black" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-black pt-1">
                      {s.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Compatible Banks List */}
            <div className="border border-neutral-200 p-6 bg-white space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-black block">
                COMPATIBLE BANKING APPS:
              </span>
              <div className="flex flex-wrap gap-2">
                {COMPATIBLE_BANKS.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider border border-neutral-300 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Sincere Note */}
            <div className="border-l-4 border-black p-4 bg-neutral-50 space-y-1">
              <h4 className="text-xs font-black uppercase text-black">A SINCERE THANK YOU</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every contribution fuels ongoing independent software development and technical tutorials for the developer community.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Donate;
