import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Cpu, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Microscope,
  BookOpen
} from 'lucide-react';

export default function OwnerPage() {
  const { settings, setActiveBookingModal } = useApp();
  const owner = settings?.owner || {};
  const store = settings?.store || {};

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const milestones = [
    {
      year: '2023 – Till Now Running',
      title: 'Started Shop at Sony Dharmshala, Chitrakoot Dham',
      desc: 'Chhaya Mobiles was established in 2023 at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham M.P. by Pushpendra Prajapati. Started from 2023 and continuously running till now, providing transparent on-the-spot mobile repairs, genuine accessories, and certified pre-owned gadgets to hundreds of satisfied local customers.'
    }
  ];

  return (
    <div className="space-y-12 pb-12 text-left">
      
      {/* Proprietor Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          
          {/* Avatar / Photo */}
          <div className="relative shrink-0">
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl ring-4 ring-cyan-400/30 bg-slate-800/80 flex items-center justify-center">
              {owner.avatar ? (
                <img 
                  src={owner.avatar} 
                  alt={owner.name || 'Pushpendra Prajapati'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-blue-600/40 mb-3 border border-blue-400/40">
                    {owner.name ? owner.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PP'}
                  </div>
                  <p className="text-sm font-extrabold text-white">{owner.name || 'Pushpendra Prajapati'}</p>
                  <span className="text-xs text-cyan-300 font-semibold">Proprietor &amp; Master Tech</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black shadow-lg flex items-center gap-1.5 border border-blue-400">
              <Award className="w-4 h-4 text-yellow-300" />
              <span>Started 2023 • Running Till Now</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/70 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Master Technician &amp; Store Proprietor
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {owner.name || 'Pushpendra Prajapati'}
            </h1>

            <p className="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wide">
              {owner.experience || 'Started from 2023 • Running Till Now at Sony Dharmshala'}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {owner.bio || 'Chhaya Mobiles was established in 2023 at Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham M.P. by Pushpendra Prajapati. Started from 2023 and running continuously till now, delivering fast, honest, on-the-counter smartphone repairs and certified gadget retail.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveBookingModal({})}
                className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-400/20 transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Book Diagnostic Bench Slot</span>
              </button>

              <a
                href={`https://wa.me/${(store.whatsapp || '+919301861874').replace(/[^0-9]/g, '')}?text=Hello%20Pushpendra%20bhai%2C%20I%20would%20like%20to%20consult%20you%20regarding%20my%20device.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* Workshop Lab & Inspection Standards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Level-4 Micro-soldering</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Equipped with 7X-45X trinocular zoom stereo microscopes and thermal cameras to identify micro short-circuits on logic board power lines without replacing the entire motherboard.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">45-Point Inspection Seal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every pre-owned device and post-repair unit undergoes strict multi-point stress testing including True Tone calibration, battery curve verification, and optical image stabilization checks.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Open-Counter Transparency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Customers at our Sony Dharmshala store can observe their screen and battery replacements happening live across the counter. Complete data privacy and no hidden part swaps.
          </p>
        </div>

      </section>

      {/* Workshop Journey Timeline */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Store Background</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Our Journey: Started 2023 Till Now Running
          </h2>
        </div>

        <div className="space-y-6 relative border-l-2 border-blue-100 pl-6 ml-3">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative space-y-1">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100"></span>
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">{m.year}</span>
              <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
