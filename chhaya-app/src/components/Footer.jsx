import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  CheckCircle2, 
  CreditCard, 
  Sparkles,
  Lock
} from 'lucide-react';
import ChhayaLogo from './ChhayaLogo';

export default function Footer() {
  const { settings } = useApp();
  const store = settings?.store || {};

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Highlight Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">45-Point Check</h4>
              <p className="text-[11px] text-slate-400">Certified Hardware Quality</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Same-Day Fix</h4>
              <p className="text-[11px] text-slate-400">30–45 Mins Screen/Battery</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">90-Day Warranty</h4>
              <p className="text-[11px] text-slate-400">In-Store Service Guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">In-Store Counter</h4>
              <p className="text-[11px] text-slate-400">UPI, Cash, Cards Accepted</p>
            </div>
          </div>
        </div>

        {/* Middle Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-0.5 overflow-hidden">
                  <ChhayaLogo className="w-full h-full" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">Chhaya Mobiles</h3>
                <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">Chitrakoot Dham Lab</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Chitrakoot's trusted destination for genuine certified pre-owned smartphones, high-efficiency accessories, and component-level micro-soldering motherboard repairs.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Proprietor: {settings?.owner?.name || 'Pushpendra Prajapati'}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Storefront</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-white transition-colors">Pre-Owned Phones</Link></li>
              <li><Link to="/repairs" className="text-slate-400 hover:text-white transition-colors">Repair Rate Cards</Link></li>
              <li><Link to="/owner" className="text-slate-400 hover:text-white transition-colors">Meet the Owner</Link></li>
              <li><Link to="/location" className="text-slate-400 hover:text-white transition-colors">Store Location &amp; Map</Link></li>
              <li><Link to="/reviews" className="text-slate-400 hover:text-white transition-colors">Customer Reviews</Link></li>
            </ul>
          </div>

          {/* Hardware Services */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hardware Repairs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• iPhone &amp; Android OLED Screen Fix</li>
              <li>• Battery Degradation &amp; Cycle 0 Swaps</li>
              <li>• Motherboard IC Micro-soldering</li>
              <li>• Ultrasonic Water Damage Rescue</li>
              <li>• Charging Port &amp; Audio IC Service</li>
              <li>• Camera Glass &amp; Optical Sensor QA</li>
            </ul>
          </div>

          {/* Workshop Contact & Hours */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Chitrakoot Workshop</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{store.address || 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. - 485334'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${(store.phone || '+919301861874').replace(/[^0-9]/g, '')}`} className="hover:text-white text-slate-300 font-semibold">
                  {store.phone || '+91 93018 61874'}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-semibold">{store.hoursWeek || 'Mon – Sat: 10:00 AM – 9:30 PM'}</p>
                  <p className="text-slate-400 text-[11px]">{store.hoursSun || 'Sunday: 11:00 AM – 6:00 PM'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Admin Portal Link */}
        <div className="pt-8 mt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Chhaya Mobiles &amp; Repairs. All in-store settlements processed offline at Chitrakoot Dham counter.</p>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors font-medium px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Staff Login CMS</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
