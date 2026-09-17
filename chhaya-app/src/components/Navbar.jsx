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
  Clock
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
    { to: '/products', label: 'Products & Gadgets', icon: Smartphone },
    { to: '/repairs', label: 'Repair Services', icon: Wrench },
    { to: '/owner', label: 'Meet the Owner', icon: UserCheck },
    { to: '/location', label: 'Store & Map', icon: MapPin },
    { to: '/reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <>
      {/* Top Notification Announcement Banner */}
      {announcement.visible && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0 animate-pulse" />
          <span>{announcement.text}</span>
          <span className="hidden sm:inline-block text-blue-200">|</span>
          <span className="hidden sm:inline-block text-blue-100 font-normal">Sony Dharmshala, Chitrakoot Dham</span>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo & Tagline */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden">
                  <img 
                    src="https://lh3.googleusercontent.com/aida/AEtjO1UpXC3bWtjZK90kB9gRDgBX5b0lU0MNEJtAY8UfnAKgBSgellOngJqV7o_W00IhbOLv65ldU_13LbxqXcGcfKwpPaFemF82eAfi92NA9TCB-D9j4UlHAc11DjucIOaNYRaJZ77kRCmX8vQhYOTDoEHIPTmzyHp4BOG00eGghrpQq4dcRvUd_LFXRRhxLTDn5mnTO1wDlQdvjpiBDUjm1n9PeXHowQKV595Qm5qbpZ4aD4BkAVgypapv-p8" 
                    alt="Chhaya Mobiles Brand Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                    Chhaya Mobiles
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    OPEN
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  Sony Dharmshala • Chitrakoot Dham
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-extrabold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4 opacity-70" />
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Right CTA Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <a 
                href={`tel:${(settings?.store?.phone || '+919301861874').replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                title="Call Chitrakoot Workshop"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Call Workshop</span>
              </a>

              <button
                onClick={() => setActiveBookingModal({})}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Book Instant Repair</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setActiveBookingModal({})}
                className="p-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1 border border-blue-200"
              >
                <Wrench className="w-4 h-4" />
                <span className="hidden xs:inline">Book Fix</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 animate-fadeIn">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5 opacity-80" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </NavLink>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${(settings?.store?.phone || '+919301861874').replace(/[^0-9]/g, '')}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Store</span>
              </a>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Staff Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Navigation Bar for Mobile Thumb Ergonomics */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-2xl">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}
        >
          <Smartphone className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/products" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Gadgets</span>
        </NavLink>
        <button
          onClick={() => setActiveBookingModal({})}
          className="flex flex-col items-center justify-center w-12 h-12 -mt-5 rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/40 border-4 border-white active:scale-95 transition-transform"
        >
          <Wrench className="w-5 h-5" />
        </button>
        <NavLink 
          to="/repairs" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}
        >
          <Wrench className="w-5 h-5" />
          <span>Repairs</span>
        </NavLink>
        <NavLink 
          to="/location" 
          className={({ isActive }) => `flex flex-col items-center gap-0.5 text-[10px] font-bold ${isActive ? 'text-blue-700' : 'text-slate-500'}`}
        >
          <MapPin className="w-5 h-5" />
          <span>Store</span>
        </NavLink>
      </div>
    </>
  );
}
