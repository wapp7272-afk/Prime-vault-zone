import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  X,
  Image as ImageIcon,
  Upload,
  Sparkles,
  AlertCircle,
  Tag,
  ToggleLeft,
  ToggleRight,
  Eye,
  Video,
  Layers,
  Flame,
  Film,
  Star
} from 'lucide-react';
import { Product } from '../../types';

interface AdminProductsManagerProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const CATEGORIES = [
  'Glow Lights',
  'Attar Perfumes',
  'Notebooks',
  'Bricks Toys',
  'Accessories'
];

export const AdminProductsManager: React.FC<AdminProductsManagerProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [inStock, setInStock] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImagesText, setGalleryImagesText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPoster, setVideoPoster] = useState('');
  const [fragranceTop, setFragranceTop] = useState('');
  const [fragranceHeart, setFragranceHeart] = useState('');
  const [fragranceBase, setFragranceBase] = useState('');
  const [tag, setTag] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategory(CATEGORIES[0]);
    setInStock(true);
    setImageUrl('https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800');
    setGalleryImagesText('https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800\nhttps://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800');
    setVideoUrl('');
    setVideoPoster('');
    setFragranceTop('Sea Water, Mint, Green Notes, Lavender');
    setFragranceHeart('Sandalwood, Jasmine, Neroli, Geranium');
    setFragranceBase('Musk, Oakmoss, Cedar, Tobacco, Amber');
    setTag('Trending');
    setIsFeatured(false);
    setFeaturesText('Premium Luxury Quality, 100% Authentic, Long Lasting');
    setImagePreviewError(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setCategory(product.category || CATEGORIES[0]);
    setInStock(product.inStock ?? true);
    setImageUrl(product.image);
    setGalleryImagesText(
      product.images && product.images.length > 0
        ? product.images.filter((img) => img !== product.image).join('\n')
        : ''
    );
    setVideoUrl(product.videoUrl || '');
    setVideoPoster(product.videoPoster || '');
    setFragranceTop(product.fragranceNotes?.top || '');
    setFragranceHeart(product.fragranceNotes?.heart || '');
    setFragranceBase(product.fragranceNotes?.base || '');
    setTag(product.tag || '');
    setIsFeatured(product.isFeatured ?? (product.tag === 'Featured' || product.tag === 'Hot Deal'));
    setFeaturesText(product.features ? product.features.join(', ') : '');
    setImagePreviewError(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle local image file upload converting to DataURL
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFormError('File is larger than 2MB. Please select a smaller image or use an image URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
      setImagePreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedPrice = parseFloat(price);
    if (!title.trim()) {
      setFormError('Product title is required.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please provide a valid price (greater than 0).');
      return;
    }
    if (!imageUrl.trim()) {
      setFormError('Please enter an image URL or upload an image file.');
      return;
    }

    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const featuresArray = featuresText
      .split(/,|\n/)
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const galleryLines = galleryImagesText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const finalImages = [imageUrl.trim(), ...galleryLines.filter((url) => url !== imageUrl.trim())];

    const fragranceNotes =
      fragranceTop.trim() || fragranceHeart.trim() || fragranceBase.trim()
        ? {
            top: fragranceTop.trim(),
            heart: fragranceHeart.trim(),
            base: fragranceBase.trim(),
          }
        : undefined;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        category,
        inStock,
        image: imageUrl.trim(),
        images: finalImages,
        videoUrl: videoUrl.trim() || undefined,
        videoPoster: videoPoster.trim() || undefined,
        fragranceNotes,
        tag: tag.trim() || undefined,
        isFeatured,
        features: featuresArray.length > 0 ? featuresArray : ['High quality material', 'Original product'],
      };
      onUpdateProduct(updated);
    } else {
      // Add
      onAddProduct({
        title: title.trim(),
        description: description.trim(),
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        category,
        rating: 4.9,
        reviewsCount: 1,
        inStock,
        image: imageUrl.trim(),
        images: finalImages,
        videoUrl: videoUrl.trim() || undefined,
        videoPoster: videoPoster.trim() || undefined,
        fragranceNotes,
        tag: tag.trim() || undefined,
        isFeatured,
        features: featuresArray.length > 0 ? featuresArray : ['High quality material', 'Original product'],
      });
    }

    setIsModalOpen(false);
  };

  // Toggle Featured status quickly
  const handleToggleFeatured = (product: Product) => {
    onUpdateProduct({
      ...product,
      isFeatured: !product.isFeatured,
    });
  };

  // Toggle stock quickly
  const handleQuickToggleStock = (product: Product) => {
    onUpdateProduct({
      ...product,
      inStock: !product.inStock,
    });
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Action and Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-white/5">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="admin-search-products-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title, category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Category Filter */}
          <select
            id="admin-category-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Categories ({products.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          id="admin-add-product-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Stats Pill */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong>{filteredProducts.length}</strong> of {products.length} products</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            In Stock: {products.filter((p) => p.inStock).length}
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Out of Stock: {products.filter((p) => !p.inStock).length}
          </span>
        </div>
      </div>

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs text-slate-500 mt-1">Try changing your search keywords or click "Add New Product".</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition-all flex gap-3 items-start justify-between group"
            >
              {/* Product Thumbnail */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-white/5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter text-center px-1">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {product.category}
                  </span>
                  {product.tag && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-pink-950/60 text-pink-300 border border-pink-500/30">
                      {product.tag}
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-1">
                  {product.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {product.description}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="text-xs font-mono font-bold text-cyan-400">
                    ৳{product.price}
                    {product.originalPrice && (
                      <span className="text-[10px] line-through text-slate-500 ml-1 font-normal">
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock quick switch */}
                  <button
                    onClick={() => handleQuickToggleStock(product)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors flex items-center gap-1 ${
                      product.inStock
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/80'
                        : 'bg-rose-950/80 text-rose-400 border border-rose-500/30 hover:bg-rose-900/80'
                    }`}
                    title="Click to toggle stock status"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </button>

                  {/* Featured toggle switch */}
                  <button
                    onClick={() => handleToggleFeatured(product)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors flex items-center gap-1 ${
                      product.isFeatured
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-900/80'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200'
                    }`}
                    title="Toggle Homepage Featured Spotlight"
                  >
                    <Star className={`w-3 h-3 ${product.isFeatured ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                    <span>{product.isFeatured ? 'Featured' : 'Normal'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  id={`edit-product-${product.id}`}
                  onClick={() => handleOpenEditModal(product)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 transition-all"
                  title="Edit Product"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`delete-product-${product.id}`}
                  onClick={() => setDeleteConfirmId(product.id)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/30 transition-all"
                  title="Delete Product"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Alert Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-white">Confirm Product Deletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this product? It will be removed from the store catalog immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d1020] rounded-2xl border border-cyan-500/40 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Title*</label>
                <input
                  id="product-form-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lumina Crystal Galaxy Lamp"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Category & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category*</label>
                  <select
                    id="product-form-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tag / Badge (Optional)</label>
                  <input
                    id="product-form-tag"
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. Bestseller, New, 20% OFF"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Selling Price (৳)*</label>
                  <input
                    id="product-form-price"
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 950"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Original Price (৳) (Optional)</label>
                  <input
                    id="product-form-original-price"
                    type="number"
                    min="1"
                    step="any"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Stock Status Selector */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Stock Availability Status*</span>
                  <span className="text-[11px] text-slate-400">
                    {inStock ? 'Item will be displayed as available for purchase' : 'Item will display "Out of Stock" and purchase disabled'}
                  </span>
                </div>
                <button
                  type="button"
                  id="product-form-stock-toggle"
                  onClick={() => setInStock(!inStock)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    inStock
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {inStock ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-rose-400" />}
                  <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
                </button>
              </div>

              {/* Homepage Featured Spotlight Selector */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Featured on Homepage Spotlight</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Promote this item in Hero Highlights and Flash Sale showcase
                  </span>
                </div>
                <button
                  type="button"
                  id="product-form-featured-toggle"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    isFeatured
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isFeatured ? <ToggleRight className="w-5 h-5 text-amber-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
                  <span>{isFeatured ? '★ Featured' : 'Standard'}</span>
                </button>
              </div>

              {/* Image URL & File Upload */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Image (URL or Upload)*</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      id="product-form-image-url"
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreviewError(false);
                      }}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Live Image Preview */}
                  {imageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        onError={() => setImagePreviewError(true)}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-[11px]">
                        <span className="text-slate-300 font-medium block">Live Image Preview</span>
                        <span className="text-slate-500 truncate block">
                          {imagePreviewError ? '⚠️ Image could not be loaded, check URL' : '✓ Image ready to render'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Multiple Photos Gallery (Daraz-style) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Daraz-Style Multiple Gallery Photos (One URL per line)</span>
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">Multiple Angle Shots</span>
                </div>
                <textarea
                  id="product-form-gallery-images"
                  rows={2}
                  value={galleryImagesText}
                  onChange={(e) => setGalleryImagesText(e.target.value)}
                  placeholder="https://example.com/photo2.jpg&#10;https://example.com/photo3.jpg"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* AI Review Video URL */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Film className="w-4 h-4 text-purple-400" />
                  <span>AI Review Video Showcase (MP4 / YouTube Embed Link)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Video Stream URL</label>
                    <input
                      id="product-form-video-url"
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://example.com/video.mp4 or YouTube embed"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Video Thumbnail Poster (Optional)</label>
                    <input
                      id="product-form-video-poster"
                      type="url"
                      value={videoPoster}
                      onChange={(e) => setVideoPoster(e.target.value)}
                      placeholder="https://example.com/poster.jpg"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Fragrance Notes (Top, Heart, Base) */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Flame className="w-4 h-4 text-[#fbbf24]" />
                  <span>Fragrance Olfactory Pyramid (Top, Heart & Base Notes)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Top Notes (0-15m)</label>
                    <input
                      id="product-form-fragrance-top"
                      type="text"
                      value={fragranceTop}
                      onChange={(e) => setFragranceTop(e.target.value)}
                      placeholder="e.g. Sea Water, Mint, Lavender"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] placeholder-slate-600 focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Heart Notes (2-4h)</label>
                    <input
                      id="product-form-fragrance-heart"
                      type="text"
                      value={fragranceHeart}
                      onChange={(e) => setFragranceHeart(e.target.value)}
                      placeholder="e.g. Sandalwood, Jasmine, Neroli"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] placeholder-slate-600 focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Base Notes (6-16h)</label>
                    <input
                      id="product-form-fragrance-base"
                      type="text"
                      value={fragranceBase}
                      onChange={(e) => setFragranceBase(e.target.value)}
                      placeholder="e.g. Musk, Cedar, Amber, Tobacco"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] placeholder-slate-600 focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description*</label>
                <textarea
                  id="product-form-description"
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed aesthetic description of the product..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* Features (Comma separated) */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Key Features (Comma separated)</label>
                <input
                  id="product-form-features"
                  type="text"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="e.g. Touch Dimmer, USB Rechargeable, 12h Battery"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Submit / Cancel buttons */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="save-product-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
