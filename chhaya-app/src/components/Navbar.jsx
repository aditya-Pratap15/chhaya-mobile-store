import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MapPin, 
  Wrench, 
  Smartphone, 
  UserCheck, 
  Star, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  Clock,
  ShoppingBag,
  MessageCircle,
  Award
} from 'lucide-react';

export default function Navbar() {
  const { settings, setActiveBookingModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const announcement = settings?.announcement || {
    text: '🔥 Festival Special: Free 9D Tempered Glass with any Screen Replacement! Walk-ins welcome.',
    visible: true,
    tone: 'blue'
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Smartphone },
    { to: '/products', label: 'Phones & Gadgets', icon: ShoppingBag },
    { to: '/repairs', label: 'Repair Services', icon: Wrench },
    { to: '/owner', label: 'Meet the Owner', icon: Award },
    { to: '/location', label: 'Store & Map', icon: MapPin },
    { to: '/reviews', label: 'Reviews', icon: Star },
  ];

  const storePhone = settings?.store?.phone || '+91 93018 61874';
  const cleanPhone = storePhone.replace(/[^0-9]/g, '');
  const whatsappNum = (settings?.store?.whatsapp || '+919301861874').replace(/[^0-9]/g, '');

  return (
    <>
      {/* ─── Top Micro Announcement Bar ─── */}
      {announcement.visible && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center font-medium flex items-center justify-between shadow-xs border-b border-blue-800/40">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            
            <div className="flex items-center gap-2 mx-auto sm:mx-0 truncate">
              <span className="inline-flex items-center justify-center p-1 rounded-full bg-amber-400/20 text-amber-300">
                <Sparkles className="w-3 h-3 animate-pulse" />
              </span>
              <span className="font-semibold text-slate-100 truncate">{announcement.text}</span>
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-300 text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Mon–Sat: 10 AM – 9:30 PM</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-200 font-bold">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>Sony Dharmshala, Chitrakoot</span>
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ─── Main Glassmorphism Navigation Bar ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            
            {/* Brand Logo & Store Identity */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1 sm:p-1.5 overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" 
                    alt="Chhaya Mobiles Brand Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                    Chhaya Mobiles
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="hidden xs:inline">OPEN</span>
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate max-w-[170px] sm:max-w-none">
                  Sony Dharmshala • Chitrakoot Dham
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1 rounded-2xl border border-slate-200/60">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-white text-blue-700 font-extrabold shadow-sm shadow-slate-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`
                  }
                >
                  <link.icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Desktop Right CTA Actions */}
            <div className="hidden sm:flex items-center gap-2.5">
              <a 
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                title="Call Chitrakoot Workshop Counter"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden xl:inline">Call Workshop</span>
              </a>

              <a
                href={`https://wa.me/${whatsappNum}?text=Namaste%20Chhaya%20Mobiles%2C%20I%20have%20an%20inquiry%20regarding%20repairs%20%26%20gadgets.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Chat with Pushpendra Prajapati on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>

              <button
                onClick={() => setActiveBookingModal({})}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-extrabold shadow-md shadow-blue-600/25 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Book Instant Repair</span>
              </button>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                onClick={() => setActiveBookingModal({})}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Book Repair</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* ─── Mobile Slide-down Navigation Drawer ─── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn text-left shadow-2xl">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon className="w-4 h-4 opacity-80" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Drawer Quick Contacts */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Store</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNum}?text=Namaste%20Chhaya%20Mobiles%2C%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-1">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Staff &amp; Workshop Console</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Floating Bottom Mobile Navigation Bar for Thumb Ergonomics ─── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-2xl">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/products" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Gadgets</span>
        </NavLink>
        <button
          onClick={() => setActiveBookingModal({})}
          className="flex flex-col items-center justify-center w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-700/40 border-2 border-white active:scale-95 transition-transform cursor-pointer"
        >
          <Wrench className="w-4 h-4" />
        </button>
        <NavLink 
          to="/repairs" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
        >
          <Wrench className="w-4 h-4" />
          <span>Repairs</span>
        </NavLink>
        <NavLink 
          to="/location" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Store</span>
        </NavLink>
      </div>
    </>
  );
}
