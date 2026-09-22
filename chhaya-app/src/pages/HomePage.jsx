import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Star, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Phone, 
  MessageCircle,
  Cpu,
  BadgePercent,
  Flame,
  Award,
  ShoppingBag,
  Zap,
  Tag,
  Shield,
  Video as VideoIcon,
  RotateCcw,
  Gift
} from 'lucide-react';
import HeroMediaShowcase from '../components/HeroMediaShowcase';
import ChhayaAssuredBadge from '../components/ChhayaAssuredBadge';

export default function HomePage() {
  const { products, repairs, reviews, settings, setActiveProductModal, setActiveBookingModal, setActiveReviewModal, setActiveSpinnerModal } = useApp();
  const navigate = useNavigate();

  // Mode for Hero Section: 'banners' (Flipkart/Amazon Carousel) | 'video' (Store Tour Showcase)
  const [heroMode, setHeroMode] = useState('banners');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Live countdown timer for "Deals of the Day" (ticking down)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 5, minutes: 45, seconds: 0 }; // reset cycle
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flipkart & Amazon Mega Promotional Banners
  const promotionalBanners = [
    {
      id: 'banner-1',
      tag: '🔥 BIG CHITRAKOOT GADGET FESTIVAL',
      title: 'Certified Pre-Owned Flagship iPhones & Androids',
      subtitle: '45-Point Tested • 100% Genuine Display • Up to 50% Off vs New MRP',
      bgGradient: 'from-[#002f6c] via-[#0b4d9c] to-[#2874f0]',
      accentColor: '#ffe500',
      badge: 'Chhaya Assured ✓',
      ctaText: 'Shop Flagship Deals',
      ctaLink: '/products?category=Pre-Owned+Phones',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'banner-2',
      tag: '⚡ EXPRESS HARDWARE REPAIR LAB',
      title: '30-Minute Screen & Battery Replacement',
      subtitle: 'Live Diagnostic Bench • Original IC Micro-soldering • 90-Day In-Store Warranty',
      bgGradient: 'from-slate-900 via-indigo-950 to-blue-900',
      accentColor: '#38bdf8',
      badge: 'Sony Dharmshala Lab',
      ctaText: 'Book Repair Slot',
      isAction: 'repair',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'banner-3',
      tag: '🎁 SPIN & WIN LUCKY CONTEST',
      title: 'Spin the Wheel to Win Up to ₹500 Off & Free 9D Glass',
      subtitle: 'Guaranteed discounts and accessory vouchers with every store counter booking!',
      bgGradient: 'from-[#4a0e4e] via-[#6a1b9a] to-[#8e24aa]',
      accentColor: '#ffd54f',
      badge: 'Daily Winner Bonus',
      ctaText: 'Spin Wheel Now',
      isAction: 'spin',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    }
  ];

  // Auto-advance promotional banners
  useEffect(() => {
    if (heroMode !== 'banners') return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % promotionalBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [heroMode, promotionalBanners.length]);

  // Deal products (filtered or sorted by largest discount)
  const dealProducts = [...(products || [])]
    .filter(p => p.mrp && p.mrp > p.price)
    .sort((a, b) => ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp))
    .slice(0, 5);

  const displayDeals = dealProducts.length > 0 ? dealProducts : (products || []).slice(0, 5);

  const featuredProducts = (products.filter(p => p.featured || p.category === 'Pre-Owned Phones').length > 0
    ? products.filter(p => p.featured || p.category === 'Pre-Owned Phones')
    : products).slice(0, 8);

  const popularRepairs = repairs.slice(0, 4);
  const featuredReviews = reviews.slice(0, 3);
  const store = settings?.store || {};
  const owner = settings?.owner || {};

  // Top Brands rail
  const popularBrands = [
    { name: 'Apple', logo: '🍎', query: 'iPhone' },
    { name: 'Samsung', logo: '📱', query: 'Samsung' },
    { name: 'OnePlus', logo: '⚡', query: 'OnePlus' },
    { name: 'Vivo', logo: '📸', query: 'Vivo' },
    { name: 'Oppo', logo: '💎', query: 'Oppo' },
    { name: 'Realme', logo: '🚀', query: 'Realme' },
    { name: 'Xiaomi', logo: '🔋', query: 'Redmi' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* ─── 1. HERO PROMOTIONAL BANNER CAROUSEL (Amazon & Flipkart Style) ─── */}
      <section className="relative rounded-2xl overflow-hidden shadow-md">
        
        {/* Top Switcher: Flipkart Deals Carousel vs Store Tour Video */}
        <div className="bg-[#172337] px-4 py-2 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#ffe500] tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              CHHAYA FESTIVE DEALS
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300 text-[11px]">Sony Dharmshala, Chitrakoot</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setHeroMode('banners')}
              className={`px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer ${
                heroMode === 'banners'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Mega Banners
            </button>
            <button
              onClick={() => setHeroMode('video')}
              className={`px-3 py-1 rounded-md font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                heroMode === 'video'
                  ? 'bg-[#2874f0] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <VideoIcon className="w-3 h-3 text-[#ffe500]" />
              <span>Store Tour Video</span>
            </button>
          </div>
        </div>

        {/* Mode A: Flipkart Promotional Slider */}
        {heroMode === 'banners' ? (
          <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[400px] w-full overflow-hidden">
            {promotionalBanners.map((banner, idx) => {
              const isActive = idx === currentBannerIndex;
              return (
                <div
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  } bg-gradient-to-r ${banner.bgGradient} text-white flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-12 gap-6`}
                >
                  {/* Left Content Area */}
                  <div className="space-y-3 sm:space-y-4 max-w-xl text-left z-10">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-white border border-white/20">
                      <span>{banner.tag}</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                      {banner.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
                      {banner.subtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      {banner.isAction === 'repair' ? (
                        <button
                          onClick={() => setActiveBookingModal({})}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-md bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                          <Wrench className="w-4 h-4" />
                          <span>{banner.ctaText}</span>
                        </button>
                      ) : banner.isAction === 'spin' ? (
                        <button
                          onClick={() => setActiveSpinnerModal(true)}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-md bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                          <Gift className="w-4 h-4" />
                          <span>{banner.ctaText}</span>
                        </button>
                      ) : (
                        <Link
                          to={banner.ctaLink || '/products'}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-md bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{banner.ctaText}</span>
                        </Link>
                      )}

                      <button
                        onClick={() => setHeroMode('video')}
                        className="px-4 py-2.5 sm:py-3 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                      >
                        <VideoIcon className="w-4 h-4 text-cyan-300" />
                        <span>Watch Tour Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Banner Image Showcase */}
                  <div className="hidden md:flex relative w-64 lg:w-80 aspect-square shrink-0 items-center justify-center">
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/20">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    {/* Badge Overlay */}
                    <div className="absolute -bottom-3 -left-3 bg-white text-slate-900 px-3 py-1.5 rounded-lg shadow-lg text-xs font-black flex items-center gap-1.5 border border-slate-200">
                      <ChhayaAssuredBadge size="sm" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Banner Left/Right Navigation Arrows */}
            <button
              onClick={() => setCurrentBannerIndex(prev => (prev - 1 + promotionalBanners.length) % promotionalBanners.length)}
              aria-label="Previous Banner"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-14 bg-white/80 hover:bg-white text-slate-800 rounded-r-md shadow-md flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentBannerIndex(prev => (prev + 1) % promotionalBanners.length)}
              aria-label="Next Banner"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-14 bg-white/80 hover:bg-white text-slate-800 rounded-l-md shadow-md flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {promotionalBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`transition-all rounded-full ${
                    idx === currentBannerIndex 
                      ? 'w-6 h-2 bg-[#ffe500]' 
                      : 'w-2 h-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Mode B: Full Store Video & Lab Tour Showcase */
          <div className="p-3 sm:p-4 bg-slate-900">
            <HeroMediaShowcase />
          </div>
        )}
      </section>

      {/* ─── 2. DEALS OF THE DAY RAIL (Flipkart Iconic Feature) ─── */}
      <section className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Deals Header with Live Countdown Timer */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 via-white to-orange-50/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-5 h-5 fill-white animate-pulse" />
              </div>
              <div className="text-left">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Deals of the Day</span>
                  <span className="hidden md:inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-700">
                    Flash Sale
                  </span>
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ends in: </span>
                  <span className="font-extrabold text-blue-700 tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/products?deal=true"
            className="self-start sm:self-auto px-4 py-1.5 bg-[#2874f0] hover:bg-blue-700 text-white font-extrabold text-xs rounded-sm shadow-xs transition-all uppercase tracking-wider flex items-center gap-1"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Deals Product Grid (Flipkart Card Design) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-100 p-2 sm:p-3">
          {displayDeals.map((product) => {
            const hasDiscount = product.mrp && product.mrp > product.price;
            const discountPercent = hasDiscount 
              ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
              : 25;

            return (
              <div 
                key={product.id}
                className="p-2 sm:p-3 flex flex-col justify-between group hover:shadow-md transition-shadow bg-white rounded-lg"
              >
                <div>
                  {/* Square Image Box */}
                  <div className="relative aspect-square w-full bg-slate-50 rounded-md p-2 flex items-center justify-center overflow-hidden mb-2">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Condition Pill */}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-600 text-white shadow-2xs">
                      {product.condition || 'Grade A'}
                    </span>

                    {/* Stock & Discount strip */}
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 max-w-[calc(100%-12px)]">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#388e3c] text-white shadow-2xs shrink-0">
                        {discountPercent}% OFF
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shadow-2xs shrink-0 ${
                        product.units > 0 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {product.units > 0 ? `${product.units} Left` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Title & Assured Badge */}
                  <div className="text-left space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <ChhayaAssuredBadge size="sm" />
                      <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#388e3c] text-white text-[9px] font-bold">
                        <span>4.8</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[2rem] group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="pt-2 mt-1 border-t border-slate-100 text-left space-y-1.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      ₹{Number(product.price || 0).toLocaleString('en-IN')}
                    </span>
                    {product.mrp && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ₹{Number(product.mrp).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    📍 Free Chitrakoot Counter Pickup
                  </p>

                  <button
                    onClick={() => setActiveProductModal(product)}
                    className="w-full py-1.5 bg-[#fb641b] hover:bg-[#e65a16] text-white text-xs font-black rounded-xs shadow-xs transition-all uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Hold &amp; Book</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 3. CHHAYA ASSURED TRUST STRIP (Amazon / Flipkart Trust Pillars) ─── */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs text-left">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">45-Point Tested</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Strict hardware diagnostic passed for display, battery, Wi-Fi &amp; camera.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">7-Day Replacement</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Hassle-free walk-in replacement guarantee at Sony Dharmshala counter.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">100% Genuine Parts</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Original OLED panels and certified batteries with true cycle counts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 border border-cyan-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Counter Pickup</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Hold online with 0 advance. Inspect in hand at store before paying.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. SHOP BY BRAND RAIL (E-Commerce Standard) ─── */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs text-left">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Shop by Brand</h2>
            <p className="text-[11px] text-slate-500">Find pre-owned phones and verified spares by your favorite brand</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-blue-600 hover:underline">
            View All Brands →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
          {popularBrands.map((b) => (
            <Link
              key={b.name}
              to={`/products?search=${encodeURIComponent(b.query)}`}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 transition-all text-center group cursor-pointer"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{b.logo}</span>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 5. TOP CERTIFIED PRE-OWNED PHONES & GADGETS (Catalog Showcase) ─── */}
      <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>In-Stock Showroom Inventory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Top Certified Pre-Owned Smartphones
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Passed 45-point hardware diagnostic • Instant In-Store Demonstration
            </p>
          </div>

          <Link 
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2874f0] hover:underline"
          >
            <span>View All Products ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid (Flipkart / Amazon Square Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {featuredProducts.map((product) => {
            const hasDiscount = product.mrp && product.mrp > product.price;
            const discountPercent = hasDiscount 
              ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
              : 0;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full"
              >
                {/* Square Product Image Container */}
                <div className="relative aspect-square w-full bg-slate-50/80 p-2 sm:p-3 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Condition Badge */}
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-[#2874f0] text-white shadow-2xs">
                    {product.condition || 'Grade A'}
                  </span>

                  {/* Bottom Strip: Discount Tag & Stock Status right next to it */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 max-w-[calc(100%-16px)]">
                    {discountPercent > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-[#388e3c] text-white shadow-2xs shrink-0">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* Stock Status Badge (at the right side of % OFF) */}
                    <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold shadow-2xs shrink-0 ${
                      product.units > 0 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {product.units > 0 ? `${product.units} In Stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Uniform Product Details */}
                <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <ChhayaAssuredBadge size="sm" />
                      <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#388e3c] text-white text-[9px] font-bold">
                        <span>4.8</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </div>
                    </div>

                    {/* Fixed height 2-line title for uniform row height */}
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {product.specs && product.specs.length > 0 && (
                      <ul className="hidden sm:block space-y-0.5 text-[11px] text-slate-500 pt-0.5">
                        {product.specs.slice(0, 2).map((spec, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 truncate">
                      📍 {product.location || 'Counter Shelf'}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {product.mrp && (
                        <span className="block text-[9px] sm:text-[10px] text-slate-400 line-through">
                          MRP ₹{Number(product.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveProductModal(product)}
                      className="w-full sm:w-auto px-3 py-1.5 sm:px-3.5 sm:py-2 rounded bg-[#fb641b] hover:bg-[#e65a16] text-white text-[11px] sm:text-xs font-black transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95 shrink-0 cursor-pointer uppercase tracking-wider"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Hold &amp; Book</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 6. HARDWARE REPAIR CLINIC & DIAGNOSTIC LAB ─── */}
      <section className="bg-gradient-to-br from-[#0c1a30] via-[#102a4e] to-[#0c1a30] text-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl space-y-6 text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-400">
              <Cpu className="w-4 h-4" />
              Level-4 Micro-soldering Workshop
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hardware Repair Services &amp; Diagnostic Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Don't replace your phone when you can repair it. We fix dead motherboards, green lines, shattered OLEDs, and water-damaged boards with live bench transparency at Sony Dharmshala.
            </p>
          </div>

          <Link
            to="/repairs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#ffe500] hover:bg-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all shrink-0"
          >
            <span>Explore All Repairs ({repairs.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Popular Repair Services Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularRepairs.map((srv) => (
            <div 
              key={srv.id}
              className="p-4 sm:p-5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-400/50 transition-all flex flex-col justify-between gap-4 text-left group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                    {srv.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {srv.duration}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Starting from</span>
                  <span className="text-lg font-black text-cyan-400">₹{srv.price?.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setActiveBookingModal({})}
                  className="px-4 py-2 rounded-md bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book Diagnostic</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. MEET THE OWNER SNAPSHOT ─── */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center gap-8 text-left">
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="relative">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-4 ring-blue-50 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
              {owner.avatar ? (
                <img 
                  src={owner.avatar} 
                  alt={owner.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-[#2874f0] text-white font-black text-2xl flex items-center justify-center shadow-md mb-2">
                    {owner.name ? owner.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PP'}
                  </div>
                  <p className="text-xs font-bold text-slate-800">{owner.name || 'Pushpendra Prajapati'}</p>
                  <span className="text-[10px] font-semibold text-blue-600">Store Proprietor</span>
                </div>
              )}
            </div>
            <span className="absolute -bottom-2.5 -right-2.5 px-3 py-1 rounded-full bg-[#2874f0] text-white text-xs font-bold shadow-lg flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              8+ Yrs Exp
            </span>
          </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-3">
          <span className="text-xs font-black text-blue-700 uppercase tracking-wider">Meet the Master Technician</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {owner.name || 'Pushpendra Prajapati'}
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase">
            {owner.title || 'Master Micro-soldering Specialist & Store Proprietor'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {owner.bio || 'Pioneering precision component-level board repairs and pre-certified gadget trading at Sony Dharmshala, Chitrakoot Dham. Focused on rapid same-day fixes, transparent diagnostics, and hardware reliability with 45-point inspection seals.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/owner"
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                if (document.documentElement) document.documentElement.scrollTop = 0;
                if (document.body) document.body.scrollTop = 0;
              }}
              className="px-5 py-2.5 rounded-md bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Read Full Workshop Story</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${(store.whatsapp || '+919301861874').replace(/[^0-9]/g, '')}?text=Hello%20Pushpendra%20bhai%2C%20I%20need%20expert%20advice%20on%20my%20phone.`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp to Pushpendra</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 8. CUSTOMER REVIEWS ─── */}
      <section className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Trusted by 500+ Customers across Chitrakoot
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveReviewModal(true)}
              className="px-3.5 py-1.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              + Write a Review
            </button>
            <Link 
              to="/reviews"
              className="text-xs font-extrabold text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>All Reviews</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between gap-3 text-left"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400">{rev.device} • {rev.service}</p>
                </div>
                <span className="p-1 rounded-full bg-emerald-50 text-emerald-600" title="Verified Customer">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 9. LOCATION & QUICK MAP BANNER ─── */}
      <section className="bg-blue-50/70 rounded-2xl p-6 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Walk-In Store Location</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">
            Visit Workshop at Sony Dharmshala, Chitrakoot Dham
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {store.address || 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, Chitrakoot, Madhya Pradesh 485334'}. Open 7 days a week.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full md:w-auto">
          <a
            href="https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m6!3m5!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!16s%2Fg%2F11h9zslwhs"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps Directions</span>
          </a>

          <a
            href={`tel:${(store.phone || '+919301861874').replace(/[^0-9]/g, '')}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Call Desk</span>
          </a>
        </div>
      </section>

    </div>
  );
}
