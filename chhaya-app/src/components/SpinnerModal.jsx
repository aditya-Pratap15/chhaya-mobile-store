import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Gift, 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Copy, 
  MessageCircle, 
  AlertTriangle,
  RotateCcw,
  Smartphone,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const DEFAULT_SLICES = [
  { id: 's1', label: '₹150 OFF Repair', prize: '₹150 Flat Discount on Screen or Motherboard Repair', code: 'CHHAYA-REP150', color: '#2563eb', textColor: '#ffffff' },
  { id: 's2', label: 'Free 9D Glass', prize: 'Free 9D Tempered Glass Installation on Any Phone', code: 'CHHAYA-9DGLASS', color: '#059669', textColor: '#ffffff' },
  { id: 's3', label: '10% Gadget OFF', prize: '10% Instant OFF on Any Audio or Power Gadget', code: 'CHHAYA-GADGET10', color: '#d97706', textColor: '#ffffff' },
  { id: 's4', label: '₹50 OFF Cover', prize: '₹50 Flat OFF on Any Mobile Cover or Case', code: 'CHHAYA-COVER50', color: '#7c3aed', textColor: '#ffffff' },
  { id: 's5', label: 'Free Cable Guard', prize: 'Free Spiral Cable Protector Set (Pack of 4)', code: 'CHHAYA-FREEPROT', color: '#db2777', textColor: '#ffffff' },
  { id: 's6', label: '₹200 OFF Combo', prize: '₹200 Instant OFF on Combo (Screen + Battery)', code: 'CHHAYA-COMBO200', color: '#0891b2', textColor: '#ffffff' }
];

export default function SpinnerModal() {
  const { settings, claimSpinnerPrize, showToast, activeSpinnerModal, setActiveSpinnerModal } = useApp();

  const spinnerConfig = settings?.spinner || {
    enabled: true,
    title: 'Chitrakoot Lucky Spin & Win',
    subtitle: 'Spin the wheel to win instant counter discounts & gifts!',
    expiryMinutes: 120,
    slices: DEFAULT_SLICES
  };

  const slices = useMemo(() => {
    return (spinnerConfig.slices && spinnerConfig.slices.length >= 2)
      ? spinnerConfig.slices
      : DEFAULT_SLICES;
  }, [spinnerConfig.slices]);

  // Local storage for current active prize won on this device
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonSlice, setWonSlice] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Load existing voucher from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chhaya_active_voucher_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.expiresAt) {
          setActiveVoucher(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!activeVoucher || !activeVoucher.expiresAt) return;

    const interval = setInterval(() => {
      const remainingMs = activeVoucher.expiresAt - Date.now();
      if (remainingMs <= 0) {
        setTimeLeftStr('00:00:00 (Expired)');
        setIsExpired(true);
        clearInterval(interval);
      } else {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remainingMs % (1000 * 60)) / 1000);
        setTimeLeftStr(
          `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVoucher]);

  if (spinnerConfig.enabled === false) return null;

  // Spin Wheel Logic
  const handleSpin = () => {
    if (isSpinning) return;

    if (activeVoucher && !isExpired && activeVoucher.status !== 'redeemed') {
      showToast('You already have an active voucher! Present it at store or wait for it to expire.', 'info');
      return;
    }

    setIsSpinning(true);
    setWonSlice(null);

    // Random winner slice
    const winningIndex = Math.floor(Math.random() * slices.length);
    const sliceAngle = 360 / slices.length;

    // Minimum 5 full rotations (1800 deg) + offset to align pointer at 270 deg (top)
    const extraSpins = 360 * 5;
    // The pointer is at top (270 deg or 90 deg depending on coordinate)
    // Slice center angle: winningIndex * sliceAngle + (sliceAngle / 2)
    const targetSliceCenter = (winningIndex * sliceAngle) + (sliceAngle / 2);
    // Align with top pointer (270 deg)
    const targetAngle = 360 * 6 + (360 - targetSliceCenter + 270) % 360;

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const selected = slices[winningIndex];
      setWonSlice(selected);
      showToast(`🎉 You landed on: ${selected.label}! Enter details to claim.`, 'success');
    }, 4200);
  };

  // Claim Prize form submission
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      showToast('Please provide your name and phone number.', 'error');
      return;
    }

    const expiryDurationMs = (spinnerConfig.expiryMinutes || 120) * 60 * 1000;
    const expiresAt = Date.now() + expiryDurationMs;
    const voucherCode = `SPIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const claimData = {
      voucherCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      prize: wonSlice.prize,
      couponCode: wonSlice.code,
      label: wonSlice.label,
      expiresAt,
      status: 'active'
    };

    const saved = claimSpinnerPrize(claimData);
    setActiveVoucher(saved);
    localStorage.setItem('chhaya_active_voucher_v1', JSON.stringify(saved));
    setWonSlice(null);
  };

  const handleCopyCode = () => {
    if (activeVoucher?.voucherCode) {
      navigator.clipboard.writeText(activeVoucher.voucherCode);
      showToast('Voucher code copied to clipboard!', 'success');
    }
  };

  const handleWhatsAppClaim = () => {
    if (!activeVoucher) return;
    const phone = settings?.store?.whatsapp || '919301861874';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = `*Namaste Chhaya Mobiles Chitrakoot!* 🎁%0A%0AI won a lucky prize on your website spinner!%0A%0A*Voucher Code:* ${activeVoucher.voucherCode}%0A*Prize:* ${activeVoucher.prize}%0A*Coupon Code:* ${activeVoucher.couponCode}%0A*Name:* ${activeVoucher.customerName}%0A*Mobile:* ${activeVoucher.customerPhone}%0A%0AI would like to redeem this voucher at your Sony Dharmshala store.`;
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleSpinAgain = () => {
    setActiveVoucher(null);
    localStorage.removeItem('chhaya_active_voucher_v1');
    setWonSlice(null);
    setRotation(0);
  };

  // Helper to calculate SVG Pie Slice Paths
  const sliceAngle = 360 / slices.length;
  const radius = 140;
  const center = 150;

  const createSlicePath = (index) => {
    const startAngle = (index * sliceAngle) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <>
      {/* ─── Floating Launcher Widget on Middle Right Side ─── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end">
        <button
          onClick={() => setActiveSpinnerModal(true)}
          className="group relative flex items-center gap-2 pl-3.5 pr-2.5 py-2.5 sm:pl-4 sm:pr-3 sm:py-3 rounded-l-2xl bg-gradient-to-l from-amber-500 via-rose-500 to-indigo-600 text-white font-extrabold text-xs shadow-2xl hover:translate-x-[-4px] active:scale-95 transition-all duration-300 border-y-2 border-l-2 border-white/90 cursor-pointer"
          title="Click to Spin & Win Prizes!"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-spin">
            <Gift className="w-4 h-4 text-amber-200" />
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-200">Lucky Draw</span>
            <span className="tracking-wide drop-shadow-xs font-black text-xs">
              {activeVoucher && !isExpired ? '🎟️ My Voucher' : '🎁 Spin & Win!'}
            </span>
          </div>
          <span className="absolute -top-2.5 left-2 px-1.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-black text-[8px] uppercase tracking-wider shadow-sm animate-bounce">
            FREE
          </span>
        </button>
      </div>

      {/* ─── Main Spin & Win Modal ─── */}
      {activeSpinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto flex flex-col relative text-left">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 relative">
              <button 
                onClick={() => setActiveSpinnerModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Chitrakoot Dham Lucky Draw</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {spinnerConfig.title || 'Spin & Win Exclusive Prizes'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {spinnerConfig.subtitle || 'Every spin wins an authentic hardware repair discount or showroom gift!'}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto max-h-[78vh] space-y-6">

              {/* ─── SCENARIO 1: Active Voucher Display with Countdown ─── */}
              {activeVoucher ? (
                <div className="space-y-5">
                  <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-blue-500/10 to-indigo-500/15 border-2 border-amber-300/80 shadow-md space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xs">
                        Official Store Voucher
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold ${
                        isExpired 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {isExpired ? 'EXPIRED' : 'ACTIVE OFFER'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-500 block">Prize Unlocked</span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                        {activeVoucher.prize}
                      </h3>
                    </div>

                    {/* Voucher Code Box */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                          Verified Voucher Code
                        </span>
                        <span className="text-base sm:text-lg font-black font-mono text-blue-700 tracking-wider">
                          {activeVoucher.voucherCode}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>

                    {/* Live Expiration Countdown Clock */}
                    <div className="p-3 rounded-2xl bg-slate-950 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">
                            Offer Expiration Timer
                          </span>
                          <span className="text-sm font-black font-mono text-amber-400">
                            {timeLeftStr || 'Calculating...'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 text-right max-w-[140px] leading-tight">
                        Counter claim only at Sony Dharmshala store
                      </span>
                    </div>

                    {/* Customer details registered */}
                    <div className="text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-500">Registered Name:</span>
                        <span className="font-bold text-slate-900">{activeVoucher.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-500">Mobile Number:</span>
                        <span className="font-bold text-slate-900">{activeVoucher.customerPhone}</span>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5">
                    <button
                      onClick={handleWhatsAppClaim}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Voucher on WhatsApp to Lock It</span>
                    </button>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Logged in Store Admin Database</span>
                      </p>

                      {isExpired && (
                        <button
                          onClick={handleSpinAgain}
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Spin Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              ) : wonSlice ? (

                /* ─── SCENARIO 2: Won Prize → Customer Details Registration ─── */
                <form onSubmit={handleClaimSubmit} className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <span className="text-2xl">🎉</span>
                    <h3 className="text-base font-black text-slate-900">
                      You Won: {wonSlice.label}!
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {wonSlice.prize}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{spinnerConfig.expiryMinutes || 120} Minutes Expiration Window</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      To lock in this prize and prevent false claims, please enter your details. An official voucher will be generated for in-store redemption.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="text"
                          required
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">10-Digit Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input 
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">Used by store staff to verify your walk-in discount claim.</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Generate Official Voucher Code</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>

              ) : (

                /* ─── SCENARIO 3: Interactive Spinner Wheel ─── */
                <div className="space-y-5 sm:space-y-6 flex flex-col items-center">
                  
                  {/* Wheel Outer Container (Responsive sizing for mobile) */}
                  <div className="relative w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] flex items-center justify-center">
                    
                    {/* Top Pointer Indicator */}
                    <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-500 drop-shadow-md"></div>

                    {/* Rotating SVG Wheel */}
                    <div 
                      className="w-full h-full rounded-full shadow-2xl border-4 border-white overflow-hidden"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? 'transform 4.2s cubic-bezier(0.12, 0.8, 0.25, 1)' : 'none'
                      }}
                    >
                      <svg viewBox="0 0 300 300" className="w-full h-full">
                        {slices.map((slice, index) => {
                          const angle = (index * sliceAngle) + (sliceAngle / 2);
                          // Calculate text position
                          const textRadius = 90;
                          const textX = center + textRadius * Math.cos(angle * (Math.PI / 180));
                          const textY = center + textRadius * Math.sin(angle * (Math.PI / 180));

                          return (
                            <g key={slice.id || index}>
                              <path 
                                d={createSlicePath(index)} 
                                fill={slice.color || '#2563eb'}
                                stroke="#ffffff"
                                strokeWidth="2"
                              />
                              <text
                                x={textX}
                                y={textY}
                                fill={slice.textColor || '#ffffff'}
                                fontSize="11"
                                fontWeight="800"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${angle + 90}, ${textX}, ${textY})`}
                                className="select-none pointer-events-none drop-shadow-xs"
                              >
                                {slice.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Center Button */}
                    <button
                      onClick={handleSpin}
                      disabled={isSpinning}
                      className="absolute z-10 w-16 h-16 rounded-full bg-slate-900 border-4 border-amber-400 text-amber-300 font-black text-xs uppercase tracking-wider shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-80 transition-all cursor-pointer"
                    >
                      {isSpinning ? '...' : 'SPIN'}
                    </button>

                  </div>

                  {/* Instructions & Disclaimer */}
                  <div className="text-center space-y-1 max-w-sm">
                    <p className="text-xs font-bold text-slate-700">
                      Tap SPIN to test your luck!
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Prizes won are valid for {spinnerConfig.expiryMinutes || 120} minutes and can be redeemed in-person at Chhaya Mobiles Chitrakoot store counter.
                    </p>
                  </div>

                </div>

              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>📍 Sony Dharmshala, Chitrakoot Dham</span>
              <span>100% Guaranteed Prizes</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
