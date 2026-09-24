import React, { useState, useMemo } from 'react';
import {
  Store,
  ShieldCheck,
  Star,
  CheckCircle2,
  Share2,
  MessageCircle,
  Heart,
  Search,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Sparkles,
  Phone,
  Mail,
  X,
  Send,
  ExternalLink,
  Award,
  Truck,
  RotateCcw,
  Check,
  Eye,
  Zap,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Product, Seller, Order } from '../types';

interface PublicSellerStoreViewProps {
  seller?: Seller;
  sellerSlug?: string;
  sellers?: Seller[];
  products: Product[];
  orders?: Order[];
  onBackToShop: () => void;
  onAddToCart: (product: Product, quantity?: number, selectedSize?: string) => void;
  onQuickView: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenSellerCenter?: () => void;
  onSwitchStore?: (slug: string) => void;
  showToast?: (msg: string) => void;
}

export const PublicSellerStoreView: React.FC<PublicSellerStoreViewProps> = ({
  seller: propSeller,
  sellerSlug,
  sellers = [],
  products,
  orders = [],
  onBackToShop,
  onAddToCart,
  onQuickView,
  onBuyNow,
  wishlist,
  onToggleWishlist,
  onOpenSellerCenter,
  onSwitchStore,
  showToast = () => {},
}) => {
  // Resolve active seller from propSeller or sellerSlug + sellers
  const seller: Seller = useMemo(() => {
    if (propSeller) return propSeller;
    if (sellers.length > 0) {
      if (sellerSlug) {
        const clean = sellerSlug.toLowerCase().trim();
        const found = sellers.find(
          (s) =>
            s.slug.toLowerCase() === clean ||
            s.storeName.toLowerCase() === clean ||
            s.storeName.toLowerCase().replace(/\s+/g, '-').includes(clean)
        );
        if (found) return found;
      }
      return sellers[0];
    }
    return {
      id: 'seller-1',
      storeName: 'PerfumeVault BD',
      slug: 'perfume-vault-bd',
      ownerName: 'Tanvir Ahmed',
      phone: '01883418309',
      email: 'tanvir@perfumevault.com',
      category: 'Luxury Perfumes',
      nidOrTradeLicense: '19942691234567890',
      payoutMethod: 'bkash',
      payoutAccount: '01883418309',
      status: 'Approved',
      createdAt: '2026-09-01 10:30',
      description: 'Authorized importer of niche French and Arabian perfumes in Bangladesh.',
      rating: 4.9,
      reviewsCount: 342,
      totalSales: 1540,
      responseRate: '100%',
      followersCount: 1820,
      joinedDate: 'Sep 2026',
      verified: true
    };
  }, [propSeller, sellerSlug, sellers]);
  // Store follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(seller.followersCount || 1280);

  // In-store search & category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'popular'>('featured');

  // Contact seller modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Added-to-cart toast tracking per product
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Extract products specifically belonging to this seller
  const sellerProducts = useMemo(() => {
    return products.filter((p) => {
      const pStore = (p.storeName || p.sellerName || '').toLowerCase().trim();
      const sStore = (seller.storeName || '').toLowerCase().trim();
      const sSlug = (seller.slug || '').toLowerCase().trim();

      if (pStore && (pStore === sStore || pStore.includes(sStore) || sStore.includes(pStore))) {
        return true;
      }

      // Default fallback mapping for starter mock stores
      if (seller.id === 'seller-1' || sSlug === 'perfume-vault-bd') {
        return (
          pStore.includes('perfume') ||
          pStore.includes('vault') ||
          p.category.includes('Perfume') ||
          p.category === 'Attar Perfumes'
        );
      }
      if (seller.id === 'seller-2' || sSlug === 'apex-tech-bd') {
        return (
          pStore.includes('tech') ||
          pStore.includes('apex') ||
          p.category.includes('Gadgets') ||
          p.category === 'Glow Lights'
        );
      }

      return false;
    });
  }, [products, seller]);

  // Derive unique categories available in this store
  const storeCategories = useMemo(() => {
    const cats = new Set<string>();
    sellerProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [sellerProducts]);

  // Compute total sales metrics from orders
  const storeSalesCount = useMemo(() => {
    let count = seller.totalSales || 340;
    orders.forEach((ord) => {
      ord.items.forEach((item) => {
        const itemStore = (item.storeName || item.product.storeName || item.product.sellerName || '').toLowerCase();
        if (itemStore && itemStore.includes(seller.storeName.toLowerCase())) {
          count += item.quantity;
        }
      });
    });
    return count;
  }, [orders, seller]);

  // Filtered & sorted store catalog
  const filteredProducts = useMemo(() => {
    let result = [...sellerProducts];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case 'popular':
        result.sort((a, b) => (b.soldCount || 100) - (a.soldCount || 100));
        break;
      case 'featured':
      default:
        // Keep order or sort in-stock first
        result.sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0));
        break;
    }

    return result;
  }, [sellerProducts, searchQuery, selectedCategory, sortBy]);

  // Follow toggle handler
  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((prev) => Math.max(0, prev - 1));
      showToast(`Unfollowed ${seller.storeName}`);
    } else {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
      showToast(`✓ You are now following ${seller.storeName}!`);
    }
  };

  // Copy share URL handler
  const handleShareStore = () => {
    const url = `${window.location.origin}/store/${seller.slug || 'store'}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast(`🔗 Store link copied: /store/${seller.slug}`);
      }).catch(() => {
        showToast(`Store URL: /store/${seller.slug}`);
      });
    } else {
      showToast(`Store URL: /store/${seller.slug}`);
    }
  };

  // Contact form submit handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setIsContactModalOpen(false);
      setContactSubject('');
      setContactMessage('');
      showToast(`✓ Your inquiry was sent to ${seller.storeName}! Merchant will reply via phone/SMS.`);
    }, 1200);
  };

  const handleAddAndFeedback = (product: Product) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const defaultBanner =
    seller.bannerImage ||
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1600';

  const defaultLogo =
    seller.logoImage ||
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=300';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#171717] pb-16">
      {/* Top Breadcrumb & Quick Nav */}
      <div className="bg-white border-b border-[#E5E7EB] py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBackToShop}
              className="text-gray-500 hover:text-[#5B21B6] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">Stores</span>
            <span className="text-gray-300">/</span>
            <span className="font-extrabold text-[#5B21B6] flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>{seller.storeName}</span>
            </span>

            {sellers && sellers.length > 1 && onSwitchStore && (
              <div className="ml-2">
                <select
                  value={seller.slug}
                  onChange={(e) => onSwitchStore(e.target.value)}
                  className="bg-purple-50 hover:bg-purple-100 text-[#5B21B6] border border-purple-200 text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer transition-colors shadow-2xs"
                  title="Switch to another verified brand store"
                >
                  {sellers.map((s) => (
                    <option key={s.id} value={s.slug}>
                      Switch Store: {s.storeName} ({s.category})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareStore}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Copy store link"
            >
              <Share2 className="w-3.5 h-3.5 text-[#5B21B6]" />
              <span>Share Store</span>
            </button>

            {onOpenSellerCenter && (
              <button
                onClick={onOpenSellerCenter}
                className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-purple-200 border border-purple-300 text-xs font-bold text-[#5B21B6] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Seller Center</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          HERO BANNER & BRAND IDENTITY SECTION
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden border border-[#E5E7EB] bg-white shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-44 sm:h-64 w-full bg-slate-900 overflow-hidden">
            <img
              src={defaultBanner}
              alt={seller.storeName}
              className="w-full h-full object-cover object-center opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            
            {/* Store URL Badge on Top Right */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>primevault.zone/store/{seller.slug}</span>
            </div>
          </div>

          {/* Store Info & Meta Bar */}
          <div className="relative px-6 sm:px-8 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-4">
              {/* Store Avatar & Names */}
              <div className="flex items-end gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-white shadow-xl border-2 border-purple-200 overflow-hidden shrink-0">
                  <img
                    src={defaultLogo}
                    alt={seller.storeName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute bottom-1 right-1 bg-[#5B21B6] text-white p-1 rounded-full shadow-xs" title="Verified Merchant">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-3xl font-black text-[#171717] tracking-tight">
                      {seller.storeName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Merchant</span>
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Category: <strong className="text-[#5B21B6]">{seller.category}</strong> • Operated by {seller.ownerName}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Follow & Contact */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-start sm:self-end">
                <button
                  onClick={handleToggleFollow}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs ${
                    isFollowing
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-[#5B21B6] hover:bg-[#4C1D95] text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFollowing ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                  <span>{isFollowing ? 'Following' : 'Follow Store'}</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-black/10">
                    {followerCount.toLocaleString()}
                  </span>
                </button>

                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-purple-300 bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] text-[#5B21B6] text-xs font-extrabold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Contact Seller</span>
                </button>
              </div>
            </div>

            {/* Merchant Bio */}
            {seller.description && (
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed max-w-3xl pt-2">
                {seller.description}
              </p>
            )}

            {/* 4 Trust & Performance KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-gray-100">
              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="font-black text-sm text-[#171717]">
                    {seller.rating || 4.9} ★
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {seller.reviewsCount || 164} Verified Reviews
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B21B6] border border-purple-200 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-[#171717]">
                    {storeSalesCount}+
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Orders Fulfilled
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-[#171717]">
                    {seller.responseRate || '99%'}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Response within 1 Hr
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-[#171717]">
                    100% Authentic
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Genuine Guaranteed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          IN-STORE SEARCH & FILTER CONTROLS BAR
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* In-Store Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search products in ${seller.storeName}...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-[#171717] focus:bg-white focus:outline-none focus:border-[#5B21B6] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-[#171717] focus:outline-none focus:border-[#5B21B6] cursor-pointer"
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Best Sellers</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Sub-category Pills */}
          {storeCategories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
              <span className="text-xs text-gray-400 font-semibold mr-1 shrink-0">Categories:</span>
              {storeCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#5B21B6] text-white shadow-2xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Active Filter Summary */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
            <div>
              Showing <strong className="text-[#171717]">{filteredProducts.length}</strong> items from{' '}
              <strong className="text-[#5B21B6]">{seller.storeName}</strong>
            </div>

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-[#5B21B6] hover:underline font-bold cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          STORE PRODUCT GRID
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white border border-[#E5E7EB] space-y-4">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-[#171717]">No Products Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No products match your current search or category filter in this merchant's storefront.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-[#5B21B6] text-white text-xs font-bold cursor-pointer"
            >
              Reset Store Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const isJustAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => onQuickView(product)}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#C4B5FD] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                >
                  {/* Square Product Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Stock Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {product.inStock ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-900 text-white">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-[#5B21B6] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                          {product.discount}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className={`absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-gray-200 shadow-xs transition-opacity ${
                        isWishlisted ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] text-[#5B21B6] uppercase tracking-wider font-extrabold block">
                        {product.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h3>
                    </div>

                    {/* Rating & Sold count */}
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{(product.rating || 4.8).toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({product.reviewsCount || 42})</span>
                      </div>
                      <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                        {product.soldCount || 85} sold
                      </span>
                    </div>

                    {/* Price and Cart Action */}
                    <div className="pt-2 border-t border-[#E5E7EB] space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-sm sm:text-base font-extrabold text-[#5B21B6] font-mono">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-1 text-[11px] text-gray-400 line-through font-mono">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddAndFeedback(product);
                          }}
                          disabled={!product.inStock}
                          className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-[#EDE9FE] hover:bg-purple-200 text-[#5B21B6] border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyNow(product);
                          }}
                          disabled={!product.inStock}
                          className="py-1.5 px-2 rounded-lg font-bold text-xs bg-[#5B21B6] hover:bg-[#4C1D95] text-white flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================
          MERCHANT TRUST GUARANTEES
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center shrink-0 border border-purple-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#171717]">100% Authentic Guarantee</h4>
              <p className="text-[11px] text-[#525252] mt-0.5 leading-relaxed">
                Direct brand sourcing with zero tolerance for counterfeit or imitation items.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center shrink-0 border border-purple-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#171717]">Fast Courier Dispatch</h4>
              <p className="text-[11px] text-[#525252] mt-0.5 leading-relaxed">
                Parcels packed and handed over to Steadfast / Pathao courier within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center shrink-0 border border-purple-200">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#171717]">7-Day Easy Exchange</h4>
              <p className="text-[11px] text-[#525252] mt-0.5 leading-relaxed">
                Hassle-free return policy if damaged, defective, or incorrect item received.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B21B6] flex items-center justify-center shrink-0 border border-purple-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#171717]">Prime Vault Escrow Protection</h4>
              <p className="text-[11px] text-[#525252] mt-0.5 leading-relaxed">
                Your payment is held safely until you receive your product in satisfactory condition.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CONTACT SELLER MODAL
          ======================================================== */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#171717]">Contact {seller.storeName}</h3>
                  <p className="text-[11px] text-gray-500">Typical response time: Under 1 hour</p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {contactSent ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-[#171717]">Message Sent to Merchant!</h4>
                <p className="text-xs text-gray-500">
                  {seller.ownerName} has received your message and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Quick Inquiry Subject:
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {[
                      'Product Authenticity',
                      'Delivery Time',
                      'Bulk Order Discount',
                      'Gift Packaging'
                    ].map((topic) => (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => setContactSubject(topic)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          contactSubject === topic
                            ? 'bg-[#5B21B6] text-white border-[#5B21B6]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Inquiring about Nishane Hacivat batch"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#5B21B6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Message / Question:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Write your question or request here..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#5B21B6] resize-none"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />
                  <span>Merchant Helpline: <strong>{seller.phone}</strong> (bKash/WhatsApp)</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Store</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
