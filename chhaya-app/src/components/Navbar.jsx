import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MapPin, 
  Wrench, 
  Smartphone, 
  Star, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles,
  ShieldCheck, 
  ShoppingBag, 
  MessageCircle, 
  Award, 
  Zap, 
  Search, 
  Gift, 
  Headphones, 
  Shield, 
  BatteryCharging, 
  Tag, 
  Flame,
  ChevronDown
} from 'lucide-react';
import ChhayaLogo from './ChhayaLogo';

export default function Navbar() {
  const { settings, setActiveBookingModal, setActiveSpinnerModal, bookings, products } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const rawAnnouncement = settings?.announcement || {};
  const announcement = {
    text: rawAnnouncement.text || '🔥 Festival Special: Free 9D Tempered Glass with any Screen Replacement! Walk-ins welcome.',
    visible: rawAnnouncement.visible !== false,
    tone: rawAnnouncement.tone || 'blue',
    blinking: rawAnnouncement.blinking !== false,
    slider: rawAnnouncement.slider !== false
  };

  const storePhone = settings?.store?.phone || '+91 93018 61874';
  const cleanPhone = storePhone.replace(/[^0-9]/g, '');
  const whatsappNum = (settings?.store?.whatsapp || '+919301861874').replace(/[^0-9]/g, '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  // Flipkart style horizontal category strip dynamically synchronized with admin category settings
  const adminCategories = settings?.productCategories && Array.isArray(settings.productCategories) && settings.productCategories.length > 0
    ? settings.productCategories
    : ['Pre-Owned Phones', 'Screen Protection', 'Batteries & Power', 'Cases & Covers', 'Audio & Cables'];

  const categoryColorMap = {
    'Pre-Owned Phones': { icon: Sparkles, color: 'bg-amber-50 text-amber-600' },
    'Screen Protection': { icon: Shield, color: 'bg-emerald-50 text-emerald-600' },
    'Batteries & Power': { icon: BatteryCharging, color: 'bg-cyan-50 text-cyan-600' },
    'Cases & Covers': { icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-600' },
    'Audio & Cables': { icon: Headphones, color: 'bg-rose-50 text-rose-600' },
  };

  const flipkartCategories = [
    { label: 'All Gadgets', icon: Smartphone, to: '/products', color: 'bg-blue-50 text-blue-600' },
    ...adminCategories.map(cat => ({
      label: cat,
      icon: categoryColorMap[cat]?.icon || Tag,
      to: `/products?category=${encodeURIComponent(cat)}`,
      color: categoryColorMap[cat]?.color || 'bg-blue-50 text-blue-700'
    })),
    { label: 'Hardware Lab', icon: Wrench, to: '/repairs', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Deals of the Day', icon: Flame, to: '/products?deal=true', color: 'bg-orange-50 text-orange-600' },
    { label: 'Spin & Win', icon: Gift, isAction: 'spin', color: 'bg-purple-50 text-purple-600' },
  ];

  const pendingHoldsCount = bookings?.filter(b => b?.status === 'pending' || b?.status === 'confirmed')?.length || 0;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      
      {/* ─── 1. TOP BROADCAST ANNOUNCEMENT BAR (With Marquee & Blinking Options) ─── */}
      {announcement.visible && (
        <div className={`bg-slate-950 text-white text-[11px] py-1 px-3 sm:px-6 overflow-hidden border-b border-slate-800 ${announcement.blinking ? 'animate-pulse ring-1 ring-amber-400' : ''}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            
            {/* Announcement Message Container */}
            <div className={`flex items-center gap-2 overflow-hidden ${announcement.slider ? 'w-full flex-1' : 'truncate'}`}>
              <span className="inline-flex items-center justify-center p-0.5 rounded-full bg-amber-400/20 text-amber-300 shrink-0">
                <Sparkles className="w-3 h-3" />
              </span>

              {announcement.slider ? (
                <div className="overflow-hidden w-full relative flex items-center">
                  <div 
                    className="animate-marquee whitespace-nowrap"
                    style={{ animation: 'marqueeSlider 18s linear infinite', width: 'max-content', display: 'flex' }}
                  >
                    <div className="flex items-center shrink-0 pr-8">
                      <span className="font-semibold text-slate-100">{announcement.text}</span>
                      <span className="mx-6 text-amber-400 font-bold">✦</span>
                      <span className="font-semibold text-slate-100">{announcement.text}</span>
                      <span className="mx-6 text-amber-400 font-bold">✦</span>
                    </div>
                    <div className="flex items-center shrink-0 pr-8" aria-hidden="true">
                      <span className="font-semibold text-slate-100">{announcement.text}</span>
                      <span className="mx-6 text-amber-400 font-bold">✦</span>
                      <span className="font-semibold text-slate-100">{announcement.text}</span>
                      <span className="mx-6 text-amber-400 font-bold">✦</span>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="font-semibold text-slate-100 truncate">
                  {announcement.text}
                </span>
              )}
            </div>

            {/* Quick Timing & Location */}
            <div className="hidden md:flex items-center gap-3 shrink-0 text-[10px] font-bold text-slate-300 pl-3 border-l border-slate-800">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>OPEN: Mon–Sat 10AM–9:30PM</span>
              </span>
              <span className="text-slate-600">•</span>
              <a href={`tel:${cleanPhone}`} className="hover:text-white flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-400" />
                <span>+91 93018 61874</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. PRIMARY FLIPKART BLUE NAVBAR ─── */}
      <div className="bg-[#2874f0] text-white py-2.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo & Flipkart "Explore Plus" Subtitle */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
              <ChhayaLogo className="w-full h-full" />
            </div>
            
            <div className="flex flex-col text-left leading-none">
              <span className="text-base sm:text-lg font-black tracking-tight text-white italic">
                Chhaya <span className="text-[#ffe500]">Mobiles</span>
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-slate-100 font-bold mt-0.5">
                <span className="italic font-normal text-slate-200">Explore</span>
                <span className="text-[#ffe500] font-black italic">Plus</span>
                <Sparkles className="w-2.5 h-2.5 text-[#ffe500] fill-[#ffe500]" />
              </span>
            </div>
          </Link>

          {/* Location Delivery Pin (Amazon / Flipkart Style) */}
          <div className="hidden xl:flex items-center gap-1 text-left text-xs shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
            <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div className="leading-tight">
              <span className="block text-[10px] text-blue-100 font-medium">Deliver to</span>
              <span className="font-extrabold text-white">Chitrakoot 485334</span>
            </div>
          </div>

          {/* Central Flipkart Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-2xl relative"
          >
            <div className="relative flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Pre-Owned iPhones, Screen Replacements, Gadgets & more..."
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-sm py-2 pl-3.5 pr-10 focus:outline-none shadow-xs font-medium"
              />
              <button 
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 bottom-0 px-3 bg-white text-[#2874f0] hover:text-blue-800 rounded-r-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Right Action Icons (Flipkart Style) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Flipkart White "Login" Button */}
            <Link 
              to="/admin/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-6 py-1.5 bg-white text-[#2874f0] hover:bg-slate-50 font-extrabold text-xs sm:text-sm rounded-xs shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2874f0]" />
              <span>Login</span>
            </Link>

            {/* Hardware Lab Repair Quick CTA */}
            <button
              onClick={() => setActiveBookingModal({})}
              className="hidden lg:flex items-center gap-1 text-white hover:text-blue-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>Repair Lab</span>
            </button>

            {/* Spin & Win Wheel Launcher */}
            <button
              onClick={() => setActiveSpinnerModal(true)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-blue-700/60 hover:bg-blue-800/80 text-[#ffe500] text-xs font-black border border-blue-400/40 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Spin the Wheel to win prizes"
            >
              <Gift className="w-3.5 h-3.5 animate-bounce" />
              <span>Spin &amp; Win</span>
            </button>

            {/* In-Store Hold / Bookings Counter (Cart Style) */}
            <Link 
              to="/products"
              className="flex items-center gap-1.5 text-white hover:text-blue-100 font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
              title="View Catalog & Bookings"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {pendingHoldsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#ff6161] text-white text-[9px] font-black flex items-center justify-center border-2 border-[#2874f0]">
                    {pendingHoldsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Hold List</span>
            </Link>

            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-sm hover:bg-blue-600 lg:hidden text-white transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* ─── 3. ICONIC FLIPKART 8-CATEGORY HORIZONTAL STRIP ─── */}
      <div className="bg-white border-b border-slate-200 shadow-2xs overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 flex items-center justify-between sm:justify-center gap-4 sm:gap-8 min-w-max">
          {flipkartCategories.map((cat, idx) => {
            if (cat.isAction === 'spin') {
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSpinnerModal(true)}
                  className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-0.5"
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${cat.color} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                    <cat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-[#2874f0] transition-colors whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={idx}
                to={cat.to}
                className="flex flex-col items-center gap-1 group cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${cat.color} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                  <cat.icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-[#2874f0] transition-colors whitespace-nowrap">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── 4. MOBILE HAMBURGER SLIDE-OUT DRAWER ─── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-slate-950/60 backdrop-blur-xs z-50 flex flex-col text-left animate-fadeIn">
          <div className="bg-white p-4 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2874f0] p-1 flex items-center justify-center">
                  <ChhayaLogo className="w-full h-full" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Chhaya Mobiles</h4>
                  <p className="text-[10px] text-slate-500">Sony Dharmshala, Chitrakoot</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Navigation */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-[#2874f0]"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-[#2874f0]" />
                  <span>Home Storefront</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-[#2874f0]"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#2874f0]" />
                  <span>All Gadgets &amp; Phones</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/repairs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-[#2874f0]"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-[#2874f0]" />
                  <span>Hardware Repair Lab</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/location"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-[#2874f0]"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#2874f0]" />
                  <span>Store Counter &amp; Map</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <button
                onClick={() => { setMobileMenuOpen(false); setActiveSpinnerModal(true); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <span>Spin &amp; Win Lucky Wheel</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 font-extrabold">Win Prizes</span>
              </button>
            </div>

            {/* Contact Strip */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-[#2874f0]" />
                <span>Call Store</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNum}?text=Namaste%20Chhaya%20Mobiles%2C%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Admin Console Link */}
            <div>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Staff &amp; Proprietor Portal</span>
              </Link>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
