import React from 'react';
import { Link } from 'react-router-dom';
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
  Phone, 
  MessageCircle,
  Cpu,
  BadgePercent,
  Flame,
  Award
} from 'lucide-react';
import HeroMediaShowcase from '../components/HeroMediaShowcase';

export default function HomePage() {
  const { products, repairs, reviews, settings, setActiveProductModal, setActiveBookingModal, setActiveReviewModal } = useApp();

  const featuredProducts = products.filter(p => p.featured || p.category === 'Pre-Owned Phones').slice(0, 4);
  const popularRepairs = repairs.slice(0, 4);
  const featuredReviews = reviews.slice(0, 3);
  const store = settings?.store || {};
  const owner = settings?.owner || {};

  return (
    <div className="space-y-16 pb-12">
      
      {/* ─── HERO MEDIA SHOWCASE SECTION ─── */}
      <section className="space-y-6">
        
        {/* The Autoplaying Video and Image Slider Showcase */}
        <HeroMediaShowcase />

        {/* Action Bar & Trust Strip */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">
                {store.name || 'Chhaya Mobiles & Repairs'} • Sony Dharmshala, Chitrakoot
              </span>
              <span className="text-[11px] text-slate-500">
                Level-4 Micro-soldering • 30-Min Screen Replacement • Certified Pre-Owned Phones
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => setActiveBookingModal({})}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Book Repair Slot</span>
            </button>
            <Link
              to="/products"
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>View Stock</span>
            </Link>
          </div>
        </div>

        {/* Key Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-900">12,500+</span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Board Repairs Done</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-blue-600">30 Mins</span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Average Fix Time</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-amber-500">4.9 ★</span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">500+ Google Reviews</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">90 Days</span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">In-Store Warranty</p>
          </div>
        </div>

      </section>

      {/* ─── FEATURED GADGETS & CERTIFIED PHONES ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>Available in Chitrakoot Showroom</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Top Certified Pre-Owned Smartphones
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Passed 45-point hardware diagnostic test • 100% Genuine Display &amp; Battery
            </p>
          </div>

          <Link 
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-800 hover:underline"
          >
            <span>View All Stock ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 p-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                  {product.condition || 'Certified'}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {product.units} in Stock
                </span>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500">{product.location || 'Showcase Shelf'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">₹{product.price?.toLocaleString('en-IN')}</span>
                    {product.mrp && (
                      <span className="block text-[10px] text-slate-400 line-through">MRP ₹{product.mrp?.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveProductModal(product)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HARDWARE REPAIR CLINIC SHOWCASE ─── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-400">
              <Cpu className="w-4 h-4" />
              Level-4 Micro-soldering Workshop
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hardware Repair Services &amp; Diagnostic Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Don't replace your phone when you can repair it. We fix dead motherboards, green lines, shattered OLEDs, and water-damaged boards with live bench transparency.
            </p>
          </div>

          <Link
            to="/repairs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all shrink-0"
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
              className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-4 text-left group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                    {srv.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {srv.duration}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {srv.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Starting from</span>
                  <span className="text-lg font-extrabold text-cyan-400">₹{srv.price?.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => setActiveBookingModal({})}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Book Diagnostic</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ─── MEET THE OWNER SNAPSHOT ─── */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-8 text-left">
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-blue-50 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
              {owner.avatar ? (
                <img 
                  src={owner.avatar} 
                  alt={owner.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-blue-600/30 mb-2">
                    {owner.name ? owner.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'PP'}
                  </div>
                  <p className="text-xs font-bold text-slate-800">{owner.name || 'Pushpendra Prajapati'}</p>
                  <span className="text-[10px] font-semibold text-blue-600">Store Proprietor</span>
                </div>
              )}
            </div>
            <span className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-bold shadow-lg flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              8+ Yrs Exp
            </span>
          </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-4">
          <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">Meet the Master Technician</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
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
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center gap-1.5"
            >
              <span>Read Full Workshop Story</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${(store.whatsapp || '+919301861874').replace(/[^0-9]/g, '')}?text=Hello%20Pushpendra%20bhai%2C%20I%20need%20expert%20advice%20on%20my%20phone.`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp to Pushpendra</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── CUSTOMER REVIEWS CAROUSEL ─── */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Trusted by 500+ Customers across Chitrakoot
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveReviewModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between gap-4 text-left"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400">{rev.device} • {rev.service}</p>
                </div>
                <span className="p-1 rounded-full bg-emerald-50 text-emerald-600" title="Verified Customer">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── LOCATION & QUICK MAP BANNER ─── */}
      <section className="bg-blue-50/70 rounded-3xl p-6 sm:p-8 border border-blue-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Walk-In Store Location</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Visit Workshop at Sony Dharmshala, Chitrakoot Dham
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {store.address || 'Sony Dharmshala, Kamta Nath Mandir Road, Chitrakoot Dham, Chitrakoot, Madhya Pradesh 485334'}. Open 7 days a week.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href="https://www.google.com/maps/place/Sony+Dharmshala+Chitarkoot+Dham+M.P./@25.1755836,80.8652137,857m/data=!3m1!1e3!4m6!3m5!1s0x3984a63a69f3c01d:0x66ba352b5bd3deab!8m2!3d25.1749388!4d80.8668289!16s%2Fg%2F11h9zslwhs"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Get Directions on Google Maps</span>
          </a>

          <a
            href={`tel:${(store.phone || '+919301861874').replace(/[^0-9]/g, '')}`}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>Call Desk</span>
          </a>
        </div>
      </section>

    </div>
  );
}
