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

export default function ProductsPage() {
  const { products, settings, setActiveProductModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Pre-Owned Phones', 'Batteries & Power', 'Screen Protection', 'Cases & Covers', 'Audio & Cables'];

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
                              (item.condition && item.condition.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'stock') return b.units - a.units;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-12 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Chitrakoot Verified Stock
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pre-Owned Phones &amp; Gadgets Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All devices inspected through a 45-point hardware lab test. Free in-store demonstration, data transfer, and 6-month workshop warranty.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1.5 shrink-0">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% In-Store Inspection</span>
          </div>
          <p className="text-slate-300">Reserve online for in-store pickup &amp; test before paying.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        
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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            >
              <option value="featured">Sort by: Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Highest Stock</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{cat}</span>
              {cat === 'All' && <span className="opacity-80">({products.length})</span>}
            </button>
          ))}
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 p-4">
                <img 
                  src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'} 
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                  {product.condition || 'Certified Grade A'}
                </span>

                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  product.units > 0 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {product.units > 0 ? `${product.units} in Stock` : 'Out of Stock'}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>{product.category}</span>
                    <span>SKU: {product.sku || 'CH-GEN'}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {product.specs && (
                    <ul className="space-y-1 text-[11px] text-slate-500 pt-1">
                      {product.specs.slice(0, 3).map((spec, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="text-[11px] font-medium text-slate-400">
                    📍 {product.location || 'Showcase Shelf Unit #1'}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    {product.mrp && (
                      <span className="block text-[10px] text-slate-400 line-through">
                        MRP ₹{product.mrp?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveProductModal(product)}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Reserve &amp; Hold</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
