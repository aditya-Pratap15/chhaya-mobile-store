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
  Lock,
  RotateCcw,
  Shield,
  Smartphone,
  Award,
  HelpCircle
} from 'lucide-react';
import ChhayaLogo from './ChhayaLogo';

export default function Footer() {
  const { settings } = useApp();
  const store = settings?.store || {};

  return (
    <footer className="bg-[#172337] text-slate-300 pt-12 pb-24 sm:pb-12 border-t-4 border-[#2874f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── 1. TOP TRUST HIGHLIGHT STRIP (Amazon / Flipkart Quality Guarantees) ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pb-10 border-b border-slate-700/60 text-left">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#2874f0]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">45-Point Check</h4>
              <p className="text-[11px] text-slate-400">Certified Hardware Quality</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5 text-[#ffe500]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">7-Day Replacement</h4>
              <p className="text-[11px] text-slate-400">Hassle-Free In-Store Swap</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">90-Day Warranty</h4>
              <p className="text-[11px] text-slate-400">Motherboard &amp; Screen Fixes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0">
              <CreditCard className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Counter Pickup</h4>
              <p className="text-[11px] text-slate-400">Hold Online • Pay at Desk</p>
            </div>
          </div>
        </div>

        {/* ─── 2. MULTI-COLUMN MARKETPLACE FOOTER ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 text-left border-b border-slate-700/60">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
                <ChhayaLogo className="w-full h-full" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-black tracking-tight text-white italic">
                  Chhaya <span className="text-[#ffe500]">Mobiles</span>
                </span>
                <span className="text-[10px] text-blue-300 font-bold tracking-wider uppercase mt-0.5">
                  Chitrakoot Dham Retail &amp; Lab
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Chitrakoot's premiere destination for certified pre-owned smartphones, original accessories, and component-level micro-soldering motherboard repairs.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-[#ffe500]" />
                Proprietor: {settings?.owner?.name || 'Pushpendra Prajapati'}
              </span>
            </div>
          </div>

          {/* Column 2: Customer Help & Policies */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Help &amp; Policies</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/products" className="text-slate-400 hover:text-white transition-colors">Catalog &amp; Stock</Link></li>
              <li><Link to="/products?deal=true" className="text-slate-400 hover:text-white transition-colors">Deals of the Day</Link></li>
              <li><Link to="/repairs" className="text-slate-400 hover:text-white transition-colors">Diagnostic Rates</Link></li>
              <li><Link to="/owner" className="text-slate-400 hover:text-white transition-colors">Master Technician</Link></li>
              <li><Link to="/reviews" className="text-slate-400 hover:text-white transition-colors">Customer Reviews</Link></li>
              <li><Link to="/location" className="text-slate-400 hover:text-white transition-colors">Store Map &amp; Hours</Link></li>
            </ul>
          </div>

          {/* Column 3: Hardware Services */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Hardware Repair Lab</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• iPhone &amp; Android OLED Screen Fix</li>
              <li>• Battery Health Calibration (Cycle 0)</li>
              <li>• Motherboard IC Micro-soldering</li>
              <li>• Ultrasonic Water Damage Rescue</li>
              <li>• Charging Port &amp; Audio IC Service</li>
              <li>• Camera Glass &amp; Sensor QA</li>
            </ul>
          </div>

          {/* Column 4: Chitrakoot Workshop Contact */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Chitrakoot Workshop</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2874f0] shrink-0 mt-0.5" />
                <span>{store.address || 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, M.P. - 485334'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${(store.phone || '+919301861874').replace(/[^0-9]/g, '')}`} className="hover:text-white text-slate-300 font-semibold">
                  {store.phone || '+91 93018 61874'}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-0.5">
                <Clock className="w-4 h-4 text-[#ffe500] shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-semibold">{store.hoursWeek || 'Mon – Sat: 10:00 AM – 9:30 PM'}</p>
                  <p className="text-slate-400 text-[11px]">{store.hoursSun || 'Sunday: 11:00 AM – 6:00 PM'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── 3. ACCEPTED PAYMENTS & ASSURANCE BADGES (Flipkart / Amazon Style) ─── */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700/60 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-400 uppercase mr-1">Accepted at Counter:</span>
            
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1">
              <span className="text-emerald-400">⚡</span> UPI / QR Code
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              PhonePe
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              Google Pay
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              Paytm
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              RuPay / Cards
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700">
              Cash on Pickup
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Genuine Spares</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Verified Store</span>
            </span>
          </div>
        </div>

        {/* ─── 4. BOTTOM COPYRIGHT & ADMIN PORTAL ─── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Chhaya Mobiles &amp; Repairs. All in-store settlements processed offline at Chitrakoot Dham showroom.</p>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors font-semibold px-3 py-1 rounded-sm bg-slate-800 border border-slate-700"
            >
              <Lock className="w-3.5 h-3.5 text-[#2874f0]" />
              <span>Admin Staff Login</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
