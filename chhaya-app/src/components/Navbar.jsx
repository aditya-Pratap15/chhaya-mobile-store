import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
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
  Award,
  Zap
} from 'lucide-react';

export default function Navbar() {
  const { settings, setActiveBookingModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const announcement = settings?.announcement || {
    text: '🔥 Festival Special: Free 9D Tempered Glass with any Screen Replacement! Walk-ins welcome.',
    visible: true,
    tone: 'blue'
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Smartphone },
    { to: '/products', label: 'Gadgets & Phones', icon: ShoppingBag },
    { to: '/repairs', label: 'Hardware Lab', icon: Wrench },
    { to: '/owner', label: 'Technician Bio', icon: Award },
    { to: '/location', label: 'Store & Map', icon: MapPin },
    { to: '/reviews', label: 'Reviews', icon: Star },
  ];

  const storePhone = settings?.store?.phone || '+91 93018 61874';
  const cleanPhone = storePhone.replace(/[^0-9]/g, '');
  const whatsappNum = (settings?.store?.whatsapp || '+919301861874').replace(/[^0-9]/g, '');

  return (
    <>
      {/* ─── Ultra-Slim Floating Announcement Capsule ─── */}
      {announcement.visible && (
        <div className="pt-2 px-3 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-full py-1.5 px-3 sm:px-5 shadow-sm border border-slate-800 flex items-center justify-between text-[11px] gap-2 overflow-hidden">
            
            {/* Announcement Message Container */}
            <div className={`flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden ${announcement.slider ? 'w-full flex-1' : 'truncate'}`}>
              <span className={`inline-flex items-center justify-center p-0.5 rounded-full bg-amber-400/20 text-amber-300 shrink-0 ${announcement.blinking ? 'animate-blink' : ''}`}>
                <Sparkles className="w-3 h-3" />
              </span>

              {announcement.slider ? (
                <div className="overflow-hidden w-full relative flex items-center">
                  <div className={`animate-marquee whitespace-nowrap font-semibold text-slate-100 ${announcement.blinking ? 'animate-blink' : ''}`}>
                    <span className="mr-8">{announcement.text}</span>
                    <span className="mr-8 text-amber-400 font-bold">✦</span>
                    <span className="mr-8">{announcement.text}</span>
                    <span className="mr-8 text-amber-400 font-bold">✦</span>
                    <span className="mr-8">{announcement.text}</span>
                  </div>
                </div>
              ) : (
                <span className={`font-semibold text-slate-100 truncate ${announcement.blinking ? 'animate-blink' : ''}`}>
                  {announcement.text}
                </span>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3 shrink-0 text-[10px] font-bold text-slate-300 pl-3 border-l border-slate-800/80">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>OPEN NOW: Mon–Sat 10AM–9:30PM</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>Sony Dharmshala, Chitrakoot</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modern Floating Island Navigation Capsule ─── */}
      <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto w-full transition-all duration-300">
        <div className={`w-full rounded-2xl sm:rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/92 backdrop-blur-2xl border border-slate-200 shadow-xl shadow-slate-900/10' 
            : 'bg-white/85 backdrop-blur-xl border border-slate-200/90 shadow-md shadow-slate-900/5'
        }`}>
          <div className="flex items-center justify-between h-16 sm:h-18 px-3.5 sm:px-5">
            
            {/* 1. Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden">
                    <img 
                      src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" 
                      alt="Chhaya Mobiles Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {/* Live Status Beacon */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-lg font-black text-slate-950 tracking-tight group-hover:text-blue-700 transition-colors">
                    Chhaya Mobiles
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                  <span className="font-extrabold text-blue-700">Chitrakoot Dham</span>
                  <span>•</span>
                  <span className="truncate max-w-[110px] sm:max-w-none">Sony Dharmshala</span>
                </div>
              </div>
            </Link>

            {/* 2. Modern Segmented Capsule Nav Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-0.5 bg-slate-100/90 p-1 rounded-full border border-slate-200/70 shadow-inner">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-md font-extrabold scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`
                  }
                >
                  <link.icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* 3. Action Wing: Quick Contact & Instant Booking (Desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              {/* WhatsApp Quick Button */}
              <a
                href={`https://wa.me/${whatsappNum}?text=Namaste%20Chhaya%20Mobiles%2C%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 rounded-full text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>

              {/* Call Button */}
              <a 
                href={`tel:${cleanPhone}`}
                className="p-2 sm:px-3 sm:py-2 rounded-full text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors border border-slate-200 text-xs font-bold flex items-center gap-1.5"
                title="Call Store Workshop"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden xl:inline">Call Store</span>
              </a>

              {/* Primary Call-to-Action Capsule Button */}
              <button
                onClick={() => setActiveBookingModal({})}
                className="group relative inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs font-black shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/30 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span>Book Repair</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5"></span>
              </button>
            </div>

            {/* Mobile Header Buttons */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                onClick={() => setActiveBookingModal({})}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black shadow-sm active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <Wrench className="w-3 h-3" />
                <span>Book</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ─── Mobile Floating Drawer Card ─── */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl p-4 space-y-3 animate-fadeIn text-left">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-md font-extrabold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 opacity-80" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Drawer Quick Contacts */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Store</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNum}?text=Namaste%20Chhaya%20Mobiles%2C%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Staff &amp; Workshop Console</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Floating Island Bottom Navigation Bar for Mobile Phones ─── */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40">
        <div className="bg-white/92 backdrop-blur-2xl border border-slate-200/90 shadow-2xl rounded-full px-3 py-1.5 flex items-center justify-around">
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex flex-col items-center py-1 px-2 rounded-full transition-all ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[9px] font-bold">Home</span>
          </NavLink>

          <NavLink 
            to="/products" 
            className={({ isActive }) => `flex flex-col items-center py-1 px-2 rounded-full transition-all ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[9px] font-bold">Gadgets</span>
          </NavLink>

          {/* Elevated Center Action */}
          <button
            onClick={() => setActiveBookingModal({})}
            className="flex flex-col items-center justify-center w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-700/40 border-2 border-white active:scale-95 transition-transform cursor-pointer"
            title="Book Repair"
          >
            <Wrench className="w-4 h-4" />
          </button>

          <NavLink 
            to="/repairs" 
            className={({ isActive }) => `flex flex-col items-center py-1 px-2 rounded-full transition-all ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
          >
            <Wrench className="w-4 h-4" />
            <span className="text-[9px] font-bold">Repairs</span>
          </NavLink>

          <NavLink 
            to="/location" 
            className={({ isActive }) => `flex flex-col items-center py-1 px-2 rounded-full transition-all ${isActive ? 'text-blue-700 font-black' : 'text-slate-500'}`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-[9px] font-bold">Store</span>
          </NavLink>
        </div>
      </div>
    </>
  );
}
