import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  MessageCircle, 
  Phone, 
  ArrowRight,
  ChevronRight,
  Layers,
  Activity,
  Zap
} from 'lucide-react';

export default function RepairsPage() {
  const { repairs, settings, setActiveBookingModal } = useApp();
  const store = settings?.store || {};

  // Interactive Diagnostic Estimator State
  const [calcBrand, setCalcBrand] = useState('Apple iPhone');
  const [calcIssue, setCalcIssue] = useState('Screen & Display');

  const selectedService = repairs.find(r => r.category === calcIssue) || repairs[0] || {
    name: 'Hardware Diagnostic Check',
    category: 'Diagnostics & Recovery',
    price: 499,
    duration: '20–30 Mins',
    description: 'Complete board and component testing under microscope.'
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Free Walk-in Diagnosis',
      desc: 'Bring your device to our Sony Dharmshala shop in Chitrakoot. We test voltage lines, battery cycles, and digitizer under microscope in 5 mins.'
    },
    {
      num: '02',
      title: 'Transparent Quotation',
      desc: 'No surprise costs. We quote genuine OEM part rates before opening any screws. You only pay if issue is solved.'
    },
    {
      num: '03',
      title: 'Precision Bench Repair',
      desc: 'Master technician Pushpendra performs micro-soldering, OLED fitting, or ultrasonic bath with anti-static protection.'
    },
    {
      num: '04',
      title: '45-Point Quality Check',
      desc: 'Camera focus, True Tone, 120Hz refresh, mic acoustic, sensors, and water seals verified before final delivery with 90-day warranty.'
    }
  ];

  return (
    <div className="space-y-12 pb-12 text-left">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
            <Cpu className="w-3.5 h-3.5" />
            Chitrakoot Hardware Clinic
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Smartphone Hardware Repair Services &amp; Rate Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Component-level micro-soldering, OEM display laminations, and cycle-0 certified battery replacements with guaranteed 90-day in-store warranty.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveBookingModal({})}
            className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Book Priority Bench Slot</span>
          </button>

          <a
            href={`https://wa.me/${(store.whatsapp || '+919301861874').replace(/[^0-9]/g, '')}?text=Hello%20Pushpendra%20bhai%2C%20I%20need%20a%20repair%20quote%20for%20my%20phone.`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Get WhatsApp Estimate</span>
          </a>
        </div>
      </div>

      {/* ─── INTERACTIVE ESTIMATOR & DIAGNOSTIC PICKER ─── */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Instant Diagnostic Tool</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive Hardware Repair Cost Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Smartphone Brand</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Apple iPhone', 'Samsung Galaxy', 'OnePlus', 'Xiaomi / Poco', 'Vivo / iQOO', 'Oppo / Realme', 'Google Pixel', 'Other Brand'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setCalcBrand(b)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      calcBrand === b
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Hardware Failure Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { cat: 'Screen & Display', label: 'Broken OLED / Lines / Glass' },
                  { cat: 'Battery & Charging', label: 'Battery Drain / Swelling' },
                  { cat: 'Motherboard & Micro-soldering', label: 'Dead / IC Short / No Power' },
                  { cat: 'Diagnostics & Recovery', label: 'Water Damage Rescue' }
                ].map((item) => (
                  <button
                    key={item.cat}
                    onClick={() => setCalcIssue(item.cat)}
                    className={`p-3 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                      calcIssue === item.cat
                        ? 'bg-blue-50 text-blue-700 border-blue-400 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card Preview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 border border-blue-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300">
                {calcBrand} Estimate
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                In-Stock Parts
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{selectedService.name}</h3>
              <p className="text-xs text-slate-300 mt-1">{selectedService.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-300 uppercase font-semibold">Estimated Fix Time</span>
                <p className="text-sm font-extrabold text-cyan-300 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedService.duration || '30–45 Mins'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-300 uppercase font-semibold">Starting From</span>
                <p className="text-xl font-black text-white">₹{selectedService.price?.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveBookingModal({})}
              className="w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Book Priority Bench for {calcBrand}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ─── FULL REPAIR RATE CARDS LISTING ─── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Service Catalog</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            All In-Store Hardware Repair Rate Cards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repairs.map((srv) => (
            <div 
              key={srv.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {srv.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-bold">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    {srv.duration}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {srv.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.description}
                </p>

                {srv.includes && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included in Service:</span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {srv.includes.map((inc, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Starting Price</span>
                  <span className="text-lg font-black text-slate-900">₹{srv.price?.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setActiveBookingModal({})}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 active:scale-95"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book Repair</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 45-POINT INSPECTION WORKFLOW ─── */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Quality Assurance</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Our 4-Step Precision Repair Workflow
          </h2>
          <p className="text-xs text-slate-400">
            Every smartphone repaired at Chhaya Mobiles follows a strict diagnostic protocol to protect your personal data and internal circuits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step) => (
            <div key={step.num} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="text-2xl font-black text-cyan-400">{step.num}</span>
              <h3 className="text-sm font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
