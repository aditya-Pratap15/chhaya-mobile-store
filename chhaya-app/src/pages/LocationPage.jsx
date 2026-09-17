import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  CreditCard, 
  Car, 
  CheckCircle2, 
  MessageCircle, 
  Store,
  Compass
} from 'lucide-react';

export default function LocationPage() {
  const { settings } = useApp();
  const store = settings?.store || {};

  return (
    <div className="space-y-10 pb-12 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
            <Store className="w-3.5 h-3.5" />
            Sony Dharmshala Workshop &amp; Showroom
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Store Location, Timings &amp; Route Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Located at Sony Dharmshala on Kamta Nath Mandir Road, Chitrakoot Dham. Walk in for same-day hardware diagnostics, screen replacements, and certified smartphone inspections.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <a
            href="https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m6!3m5!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!16s%2Fg%2F11h9zslwhs"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </a>

          <a
            href={`tel:${(store.phone || '+919301861874').replace(/[^0-9]/g, '')}`}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Store Desk</span>
          </a>
        </div>
      </div>

      {/* Grid: Map Embed + Address Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Map Embed */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm overflow-hidden space-y-3">
          <div className="aspect-16/10 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              title="Chhaya Mobiles Chitrakoot Sony Dharmshala Map"
              src={store.mapEmbed || 'https://maps.google.com/maps?q=25.1749388,80.8668289&t=&z=16&ie=UTF8&iwloc=&output=embed'}
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
          <div className="p-2 flex items-center justify-between text-xs text-slate-500">
            <span>Sony Dharmshala, Chitrakoot Dham - 485334</span>
            <a 
              href="https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m6!3m5!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!16s%2Fg%2F11h9zslwhs" 
              target="_blank" 
              rel="noreferrer"
              className="text-blue-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Fullscreen</span>
              <Compass className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Exact Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-blue-700">
              <MapPin className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Physical Address</h3>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {store.address || 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, Chitrakoot, Madhya Pradesh 485334'}
            </p>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 font-medium">
              📍 <strong>Prominent Landmark:</strong> {store.landmark || 'Near Kamta Nath Mandir, 5VF8+XPG Chitrakoot'}
            </div>
          </div>

          {/* Timings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-amber-600">
              <Clock className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Workshop Operational Hours</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Monday – Saturday</span>
                <span className="font-extrabold text-slate-900">{store.hoursWeek || '10:00 AM – 9:30 PM'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-600">Sunday</span>
                <span className="font-extrabold text-slate-900">{store.hoursSun || '11:00 AM – 6:00 PM'}</span>
              </div>
            </div>
          </div>

          {/* Payment & Parking */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-600">
              <CreditCard className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900">Settlements &amp; Parking</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {store.payments || 'In-store Counter: Cash, PhonePe, Google Pay, Paytm UPI, Debit/Credit Cards.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
              <Car className="w-4 h-4 text-slate-400" />
              <span>Two-wheeler parking outside plaza. Four-wheeler paid parking opposite Aurora Towers.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
