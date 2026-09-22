import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  MessageCircle,
  Tag,
  CheckCircle2,
  Star,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import ChhayaAssuredBadge from '../components/ChhayaAssuredBadge';

const DEFAULT_CATEGORIES = [
  'Pre-Owned Phones', 
  'Batteries & Power', 
  'Screen Protection', 
  'Cases & Covers', 
  'Audio & Cables'
];

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 - ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 - ₹30,000', min: 15000, max: 30000 },
  { label: 'Above ₹30,000', min: 30000, max: Infinity },
];

const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Vivo', 'Oppo', 'Realme', 'Xiaomi'];

export default function ProductsPage() {
  const { products, settings, setActiveProductModal } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || 'All';
  const initialDeal = searchParams.get('deal') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'discount' | 'newest'
  const [selectedPriceRange, setSelectedPriceRange] = useState(0); // index in PRICE_RANGES
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [assuredOnly, setAssuredOnly] = useState(false);
  const [dealOnly, setDealOnly] = useState(initialDeal);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync when searchParams change from navbar
  useEffect(() => {
    const s = searchParams.get('search');
    if (s !== null) setSearchQuery(s);
    const c = searchParams.get('category');
    if (c !== null) setSelectedCategory(c);
    const d = searchParams.get('deal');
    if (d === 'true') setDealOnly(true);
  }, [searchParams]);

  const categories = useMemo(() => {
    const custom = settings?.productCategories && Array.isArray(settings.productCategories) && settings.productCategories.length > 0
      ? settings.productCategories
      : DEFAULT_CATEGORIES;
    return ['All', ...custom];
  }, [settings?.productCategories]);

  // Compute category item counts
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    (products || []).forEach(p => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const range = PRICE_RANGES[selectedPriceRange] || PRICE_RANGES[0];

    return (products || [])
      .filter((item) => {
        if (!item) return false;
        
        // Category filter
        const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
        
        // Search filter
        const searchLower = searchQuery.toLowerCase().trim();
        const matchesSearch = !searchLower || 
          (item.name || '').toLowerCase().includes(searchLower) ||
          (item.sku && item.sku.toLowerCase().includes(searchLower)) ||
          (item.category && item.category.toLowerCase().includes(searchLower)) ||
          (item.condition && item.condition.toLowerCase().includes(searchLower));

        // Price range filter
        const price = item.price || 0;
        const matchesPrice = price >= range.min && price <= range.max;

        // Brand filter
        const matchesBrand = selectedBrand === 'All' || 
          (item.name || '').toLowerCase().includes(selectedBrand.toLowerCase());

        // In-Stock filter
        const matchesStock = !inStockOnly || (item.units > 0);

        // Assured filter (Grade A / Certified)
        const matchesAssured = !assuredOnly || (item.condition === 'Grade A' || item.featured);

        // Deals only
        const matchesDeal = !dealOnly || (item.mrp && item.mrp > item.price);

        return matchesCat && matchesSearch && matchesPrice && matchesBrand && matchesStock && matchesAssured && matchesDeal;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'discount') {
          const discA = a.mrp && a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0;
          const discB = b.mrp && b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0;
          return discB - discA;
        }
        if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
        // default: featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, selectedPriceRange, selectedBrand, inStockOnly, assuredOnly, dealOnly]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedPriceRange(0);
    setSelectedBrand('All');
    setInStockOnly(false);
    setAssuredOnly(false);
    setDealOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery !== '' || selectedPriceRange !== 0 || selectedBrand !== 'All' || inStockOnly || assuredOnly || dealOnly;

  return (
    <div className="space-y-4 pb-12 text-left">
      
      {/* ─── FLIPKART BREADCRUMB STRIP ─── */}
      <div className="flex items-center justify-between text-xs text-slate-500 py-1 px-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => setSelectedCategory('All')}>Home</span>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800">
            {selectedCategory === 'All' ? 'All Products & Gadgets' : selectedCategory}
          </span>
          <span className="text-slate-400">({filteredProducts.length} items found)</span>
        </div>

        {/* Mobile Filter Drawer Trigger Button */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-slate-300 font-bold text-xs text-slate-800 shadow-2xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          )}
        </button>
      </div>

      {/* ─── 2-COLUMN MARKETPLACE LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        {/* ─── LEFT COLUMN: FLIPKART FILTER SIDEBAR ─── */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-xs divide-y divide-slate-100 sticky top-28">
          
          {/* Filter Header */}
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h2>
            {hasActiveFilters && (
              <button 
                onClick={clearAllFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline uppercase cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Search Box in Sidebar */}
          <div className="p-4 space-y-2">
            <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Search Model
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone, Charger..."
                className="w-full pl-8 pr-3 py-1.5 rounded-sm bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Categories
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = categoryCounts[cat] || 0;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 font-black text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span className="text-[11px] text-slate-400">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Price Range
            </h3>
            <div className="space-y-1.5">
              {PRICE_RANGES.map((r, idx) => (
                <label 
                  key={r.label}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedPriceRange === idx}
                    onChange={() => setSelectedPriceRange(idx)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Popular Brands
            </h3>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                <input
                  type="radio"
                  name="brandFilter"
                  checked={selectedBrand === 'All'}
                  onChange={() => setSelectedBrand('All')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold">All Brands</span>
              </label>
              {BRANDS.map((brand) => (
                <label 
                  key={brand}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600"
                >
                  <input
                    type="radio"
                    name="brandFilter"
                    checked={selectedBrand === brand}
                    onChange={() => setSelectedBrand(brand)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trust & Availability Toggles */}
          <div className="p-4 space-y-2.5">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Assurance &amp; Stock
            </h3>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={assuredOnly}
                onChange={(e) => setAssuredOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <ChhayaAssuredBadge size="sm" />
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>In-Stock Only</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={dealOnly}
                onChange={(e) => setDealOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Special Discount Deals</span>
            </label>
          </div>

        </aside>

        {/* ─── RIGHT COLUMN: FLIPKART SORT TABS + PRODUCTS GRID ─── */}
        <main className="lg:col-span-9 space-y-4">
          
          {/* Flipkart Sort Tabs Bar */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <span className="font-extrabold text-slate-900 shrink-0 uppercase tracking-wider mr-1 text-[11px]">
                Sort By:
              </span>
              
              <button
                onClick={() => setSortBy('featured')}
                className={`px-3 py-1 rounded-sm whitespace-nowrap font-bold transition-colors cursor-pointer ${
                  sortBy === 'featured'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Relevance
              </button>

              <button
                onClick={() => setSortBy('price-low')}
                className={`px-3 py-1 rounded-sm whitespace-nowrap font-bold transition-colors cursor-pointer ${
                  sortBy === 'price-low'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Price -- Low to High
              </button>

              <button
                onClick={() => setSortBy('price-high')}
                className={`px-3 py-1 rounded-sm whitespace-nowrap font-bold transition-colors cursor-pointer ${
                  sortBy === 'price-high'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Price -- High to Low
              </button>

              <button
                onClick={() => setSortBy('discount')}
                className={`px-3 py-1 rounded-sm whitespace-nowrap font-bold transition-colors cursor-pointer ${
                  sortBy === 'discount'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Discount
              </button>

              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1 rounded-sm whitespace-nowrap font-bold transition-colors cursor-pointer ${
                  sortBy === 'newest'
                    ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Newest
              </button>
            </div>

            <span className="text-xs font-semibold text-slate-400 shrink-0">
              Showing {filteredProducts.length} items
            </span>
          </div>

          {/* Active Filters Pill Bar (if any active) */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-500 text-[11px]">Applied:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedPriceRange !== 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  <span>{PRICE_RANGES[selectedPriceRange]?.label}</span>
                  <button onClick={() => setSelectedPriceRange(0)}><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  <span>Brand: {selectedBrand}</span>
                  <button onClick={() => setSelectedBrand('All')}><X className="w-3 h-3" /></button>
                </span>
              )}

              {assuredOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                  <span>Chhaya Assured</span>
                  <button onClick={() => setAssuredOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                  <span>In-Stock Only</span>
                  <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}

              {dealOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">
                  <span>Special Deals</span>
                  <button onClick={() => setDealOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-blue-600 hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid — Flipkart & Amazon 2-Column Mobile & Multi-Column Desktop Square Tiles */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4">
              {filteredProducts.map((product) => {
                const hasDiscount = product.mrp && product.mrp > product.price;
                const discountPercent = hasDiscount 
                  ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
                  : 0;

                return (
                  <div 
                    key={product.id}
                    className="bg-white rounded-lg border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group h-full"
                  >
                    {/* Square Product Image Container */}
                    <div className="relative aspect-square w-full bg-slate-50/90 p-2 sm:p-3 flex items-center justify-center overflow-hidden border-b border-slate-100">
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
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 max-w-[calc(100%-16px)]">
                        {discountPercent > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black bg-[#388e3c] text-white shadow-2xs shrink-0">
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
                    <div className="p-2.5 sm:p-3.5 flex flex-col justify-between flex-1 gap-2">
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
                          📍 {product.location || 'Sony Dharmshala Counter'}
                        </p>
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm sm:text-base font-black text-slate-900">
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
                          className="w-full sm:w-auto px-3 py-1.5 sm:px-3 sm:py-2 rounded bg-[#fb641b] hover:bg-[#e65a16] text-white text-[11px] sm:text-xs font-black transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95 shrink-0 cursor-pointer uppercase tracking-wider"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Hold &amp; Book</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center border border-slate-200 space-y-3">
              <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No matching products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try adjusting your search query, price filter, or switching to another category.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </main>
      </div>

      {/* ─── MOBILE FILTER DRAWER MODAL ─── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white w-full max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col text-left shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filter Products</span>
              </h3>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1 divide-y divide-slate-100">
              
              {/* Category */}
              <div className="space-y-2 pt-2 first:pt-0">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Category</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1.5 rounded text-xs text-left truncate border ${
                        selectedCategory === cat
                          ? 'bg-blue-50 border-blue-400 font-bold text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2 pt-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Price Range</h4>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((r, idx) => (
                    <label key={r.label} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="mobilePriceRange"
                        checked={selectedPriceRange === idx}
                        onChange={() => setSelectedPriceRange(idx)}
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-2 pt-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Brand</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSelectedBrand('All')}
                    className={`px-2 py-1 rounded text-xs border ${
                      selectedBrand === 'All'
                        ? 'bg-blue-50 border-blue-400 font-bold text-blue-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-2 py-1 rounded text-xs border truncate ${
                        selectedBrand === b
                          ? 'bg-blue-50 border-blue-400 font-bold text-blue-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Options</h4>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={assuredOnly}
                    onChange={(e) => setAssuredOnly(e.target.checked)}
                  />
                  <span>Chhaya Assured Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In-Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={dealOnly}
                    onChange={(e) => setDealOnly(e.target.checked)}
                  />
                  <span>Special Deals Only</span>
                </label>
              </div>

            </div>

            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2 rounded bg-white border border-slate-300 font-bold text-xs text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2 rounded bg-[#2874f0] text-white font-bold text-xs shadow-xs"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
