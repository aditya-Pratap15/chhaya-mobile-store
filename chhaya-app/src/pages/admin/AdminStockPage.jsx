import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaDB } from '../../services/mediaDb';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Smartphone, 
  PlusCircle, 
  MinusCircle, 
  X, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Tag,
  Upload,
  Image as ImageIcon,
  FolderPlus,
  ArrowUp,
  ArrowDown,
  Layers
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  'Pre-Owned Phones',
  'Batteries & Power',
  'Screen Protection',
  'Cases & Covers',
  'Audio & Cables'
];

export default function AdminStockPage() {
  const { products, settings, updateSettings, saveProduct, deleteProduct, updateStock, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null); // null = closed, {} = new, { ...prod } = edit
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const productImageFileRef = useRef(null);

  const productCategories = useMemo(() => {
    return settings?.productCategories && Array.isArray(settings.productCategories) && settings.productCategories.length > 0
      ? settings.productCategories
      : DEFAULT_CATEGORIES;
  }, [settings?.productCategories]);

  const categories = useMemo(() => ['All', ...productCategories], [productCategories]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((p) => {
      if (!p) return false;
      const matchCat = selectedCat === 'All' || p.category === selectedCat;
      const nameStr = (p.name || '').toLowerCase();
      const skuStr = (p.sku || '').toLowerCase();
      const searchLower = (search || '').toLowerCase();
      const matchSearch = nameStr.includes(searchLower) || skuStr.includes(searchLower);
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, search]);

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) {
      showToast('Name and price are required.', 'error');
      return;
    }

    saveProduct({
      ...editingProduct,
      price: Number(editingProduct.price),
      mrp: Number(editingProduct.mrp) || Number(editingProduct.price),
      units: Number(editingProduct.units) || 0
    });

    setEditingProduct(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
    }
  };

  const handleProductLocalImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const dataUrl = await MediaDB.fileToDataURL(file, 800, 0.85);
      setEditingProduct(prev => ({ ...prev, image: dataUrl }));
      showToast('Gadget image loaded from device!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not process image file.', 'error');
    } finally {
      setUploadingImage(false);
      if (productImageFileRef.current) productImageFileRef.current.value = '';
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (productCategories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      showToast(`Category "${clean}" already exists.`, 'error');
      return;
    }
    const updated = [...productCategories, clean];
    updateSettings({
      ...settings,
      productCategories: updated
    });
    setNewCategoryName('');
    showToast(`Category "${clean}" created & saved!`, 'success');
  };

  const handleMoveCategory = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= productCategories.length) return;
    const updated = [...productCategories];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateSettings({
      ...settings,
      productCategories: updated
    });
    showToast('Category sequence updated!', 'success');
  };

  const handleDeleteCategory = (catName) => {
    if (productCategories.length <= 1) {
      showToast('You must keep at least one category.', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      const updated = productCategories.filter(c => c !== catName);
      updateSettings({
        ...settings,
        productCategories: updated
      });
      if (selectedCat === catName) setSelectedCat('All');
      showToast(`Category "${catName}" removed.`, 'info');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stock &amp; Gadgets Inventory
          </h1>
          <p className="text-xs text-slate-500">
            Manage showroom pre-owned devices, screen protectors, chargers, and stock counts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Manage Categories ({productCategories.length})</span>
          </button>

          <button
            onClick={() => setEditingProduct({
              name: '',
              category: productCategories[0] || 'Pre-Owned Phones',
              sku: 'CH-SKU-' + Math.floor(100 + Math.random() * 900),
              price: 999,
              mrp: 1499,
              location: 'Showcase #1',
              condition: 'Certified Grade A+',
              units: 5,
              image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
              featured: true
            })}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Gadget</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by product name, SKU, or condition..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
            />
          </div>

          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Mobile Cards (Phones & Small Tablets) */}
      <div className="block md:hidden space-y-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <img 
                src={p.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'} 
                alt={p.name} 
                className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    {p.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                    {p.condition}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">{p.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.sku}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Price / Shelf</span>
                <span className="font-black text-slate-900 text-sm">₹{p.price?.toLocaleString('en-IN')}</span>
                {p.mrp && <span className="ml-1.5 text-[10px] text-slate-400 line-through">₹{p.mrp?.toLocaleString('en-IN')}</span>}
                <span className="ml-2 text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded-md">
                  {p.location || 'Showcase'}
                </span>
              </div>

              {/* Touch Stepper for Quick Inventory Changes on Mobile */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => updateStock(p.id, -1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
                  aria-label="Decrease Units"
                >
                  <MinusCircle className="w-4 h-4 text-slate-600" />
                </button>
                <span className="font-black text-slate-900 w-7 text-center text-xs">
                  {p.units}
                </span>
                <button 
                  onClick={() => updateStock(p.id, 1)}
                  className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
                  aria-label="Increase Units"
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingProduct(p)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit SKU</span>
              </button>
              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Desktop Table (Hidden on Phones) */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4 text-center">Stock Units</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Product Details */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200'} 
                        alt={p.name} 
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 line-clamp-1">{p.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="font-mono">{p.sku}</span>
                          <span>•</span>
                          <span className="text-blue-600 font-bold">{p.condition}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                      {p.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">₹{p.price?.toLocaleString('en-IN')}</span>
                    {p.mrp && <span className="block text-[10px] text-slate-400 line-through">₹{p.mrp?.toLocaleString('en-IN')}</span>}
                  </td>

                  {/* Stock Quick +/- */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => updateStock(p.id, -1)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
                        title="Decrease Stock"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <span className="font-black text-slate-900 w-6 text-center text-xs">
                        {p.units}
                      </span>
                      <button 
                        onClick={() => updateStock(p.id, 1)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
                        title="Increase Stock"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {p.location || 'Showcase'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden transform scale-100 transition-all text-left">
            
            <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingProduct.id ? 'Edit Product / SKU' : 'Add New Gadget to Inventory'}
              </h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                <input 
                  type="text" 
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Apple iPhone 14 128GB Blue"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'Pre-Owned Phones'}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU Code</label>
                  <input 
                    type="text" 
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original MRP (₹)</label>
                  <input 
                    type="number" 
                    value={editingProduct.mrp || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Units</label>
                  <input 
                    type="number" 
                    required
                    value={editingProduct.units ?? ''}
                    onChange={e => setEditingProduct({ ...editingProduct, units: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Condition Tag</label>
                  <input 
                    type="text" 
                    value={editingProduct.condition || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, condition: e.target.value })}
                    placeholder="e.g. Mint 92% Battery • OEM Box"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Storage / Shelf Location</label>
                  <input 
                    type="text" 
                    value={editingProduct.location || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, location: e.target.value })}
                    placeholder="e.g. Showcase #1, Shelf A"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Product Image Section: Local Upload + URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Product Showcase Image</label>
                
                <input 
                  type="file" 
                  ref={productImageFileRef} 
                  accept="image/*" 
                  onChange={handleProductLocalImage} 
                  className="hidden" 
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Image Preview */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {editingProduct.image ? (
                      <img 
                        src={editingProduct.image} 
                        alt="Product preview" 
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingImage}
                        onClick={() => productImageFileRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Loading...' : 'Upload Image from Computer / Phone'}</span>
                      </button>

                      {editingProduct.image && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200 transition-all"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <input 
                      type="text" 
                      value={editingProduct.image || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="Or paste external image URL (https://...)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3 shrink-0">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Category Management & Reordering Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Manage Product Categories</h3>
                  <p className="text-[11px] text-slate-500">Create new categories and set their display order on the storefront.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Add New Category Form */}
              <form onSubmit={handleAddCategory} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Create New Category</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Smart Watches, Gaming Gadgets, Car Chargers..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-800"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </form>

              {/* Category Sequence & Ordering List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Current Categories &amp; Sequence</label>
                  <span className="text-[11px] text-slate-400 font-medium">Use arrows to reorder</span>
                </div>

                <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                  <span>💡 Categories appear on the customer storefront in the exact order shown below (top to bottom).</span>
                </div>

                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                  {productCategories.map((cat, index) => (
                    <div 
                      key={cat}
                      className="p-3 bg-white flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-[11px] flex items-center justify-center shrink-0 border border-slate-200">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {cat}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveCategory(index, -1)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={index === productCategories.length - 1}
                          onClick={() => handleMoveCategory(index, 1)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer ml-1"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Done / Save Sequence
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
