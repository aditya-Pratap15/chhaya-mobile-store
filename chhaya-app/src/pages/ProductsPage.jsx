import React, { useState, useMemo } from 'react';
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
  CheckCircle2
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Pre-Owned Phones', 
  'Batteries & Power', 
  'Screen Protection', 
  'Cases & Covers', 
  'Audio & Cables'
];

export default function ProductsPage() {
  const { products, settings, setActiveProductModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = useMemo(() => {
    const custom = settings?.productCategories && Array.isArray(settings.productCategories) && settings.productCategories.length > 0
      ? settings.productCategories
      : DEFAULT_CATEGORIES;
    return ['All', ...custom];
  }, [settings?.productCategories]);

  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((item) => {
        if (!item) return false;
        const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          (item.name || '').toLowerCase().includes(searchLower) ||
          (item.sku && item.sku.toLowerCase().includes(searchLower)) ||
          (item.category && item.category.toLowerCase().includes(searchLower)) ||
          (item.condition && item.condition.toLowerCase().includes(searchLower));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'stock') return (b.units || 0) - (a.units || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-12 text-left">
      
      {/* Filter and Search Bar (Page starts directly from here - No Header) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Top Controls: Search & Sort */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model (e.g. iPhone 13, Samsung S22, Fast Charger)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-all"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">In-Stock First</option>
              </select>
            </div>

            <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline-block">
              {filteredProducts.length} Items Available
            </span>
          </div>

        </div>

        {/* Category Filter Pills (Dynamic from Settings) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Products Grid — Flipkart & Amazon Square Tiles */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const hasDiscount = product.mrp && product.mrp > product.price;
            const discountPercent = hasDiscount 
              ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
              : 0;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full"
              >
                {/* Square Product Image Container (Flipkart / Amazon Style) */}
                <div className="relative aspect-square w-full bg-slate-50/80 p-3 sm:p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Condition Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                    {product.condition || 'Certified Grade A'}
                  </span>

                  {/* Stock Status Badge */}
                  <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    product.units > 0 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {product.units > 0 ? `${product.units} in Stock` : 'Out of Stock'}
                  </span>

                  {/* Discount Tag */}
                  {discountPercent > 0 && (
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Uniform Product Details */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <span className="truncate max-w-[130px]">{product.category}</span>
                      <span>SKU: {product.sku || 'CH-GEN'}</span>
                    </div>

                    {/* Fixed height 2-line title for uniform row height */}
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {product.specs && product.specs.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-slate-500 pt-1">
                        {product.specs.slice(0, 2).map((spec, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className="text-[11px] font-medium text-slate-400">
                      📍 {product.location || 'Chitrakoot Counter Shelf'}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{Number(product.price || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {product.mrp && (
                        <span className="block text-[10px] text-slate-400 line-through">
                          MRP ₹{Number(product.mrp).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveProductModal(product)}
                      className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
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
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No matching products found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or switching to another category.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
