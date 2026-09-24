import React, { useState, useMemo } from 'react';
import {
  Store,
  TrendingUp,
  ShieldCheck,
  Truck,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Package,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Check,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Search,
  Eye,
  Video,
  Layers,
  ArrowLeft,
  X,
  ToggleLeft,
  ToggleRight,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Flame,
  BadgeAlert
} from 'lucide-react';
import { Product, Order, Seller } from '../types';

interface SellerCenterViewProps {
  onBackToShop: () => void;
  products: Product[];
  orders: Order[];
  sellers: Seller[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onRegisterSeller: (seller: Omit<Seller, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  currentSellerId?: string;
  onSwitchSeller?: (sellerId: string) => void;
  commissionRate?: number;
  onViewPublicStore?: (slugOrStoreName: string) => void;
}

const CATEGORIES = [
  'Luxury Perfumes',
  'Organic Attar',
  'Electronic Gadgets',
  'Glow Lights',
  'Fashion & Apparel',
  'Watches & Jewelry',
  'Lifestyle & Home'
];

export const SellerCenterView: React.FC<SellerCenterViewProps> = ({
  onBackToShop,
  products,
  orders,
  sellers,
  onAddProduct,
  onUpdateProduct,
  onRegisterSeller,
  onUpdateOrderStatus,
  currentSellerId,
  onSwitchSeller,
  commissionRate = 8,
  onViewPublicStore,
}) => {
  // Navigation tabs: 'overview' | 'registration' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'register'>('dashboard');

  // Active seller state
  const activeSeller = useMemo(() => {
    if (currentSellerId) {
      return sellers.find(s => s.id === currentSellerId) || sellers[0];
    }
    return sellers[0] || null;
  }, [sellers, currentSellerId]);

  // Registration Form State
  const [regStoreName, setRegStoreName] = useState('');
  const [regSlug, setRegSlug] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCategory, setRegCategory] = useState(CATEGORIES[0]);
  const [regNid, setRegNid] = useState('');
  const [regPayoutMethod, setRegPayoutMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [regPayoutAccount, setRegPayoutAccount] = useState('');
  const [regBankName, setRegBankName] = useState('');
  const [regDescription, setRegDescription] = useState('');
  const [regSubmitted, setRegSubmitted] = useState(false);

  // Auto-generate slug from store name
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRegStoreName(val);
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setRegSlug(slugified);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSeller({
      storeName: regStoreName.trim(),
      slug: regSlug.trim() || 'store-' + Date.now(),
      ownerName: regOwnerName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim(),
      category: regCategory,
      nidOrTradeLicense: regNid.trim(),
      payoutMethod: regPayoutMethod,
      payoutAccount: regPayoutAccount.trim(),
      bankName: regPayoutMethod === 'bank' ? regBankName.trim() : undefined,
      description: regDescription.trim(),
    });
    setRegSubmitted(true);
  };

  // Filter products for this seller
  const sellerProducts = useMemo(() => {
    if (!activeSeller) return [];
    return products.filter(p => {
      const pStore = (p.storeName || p.sellerName || '').toLowerCase().trim();
      const sStore = (activeSeller.storeName || '').toLowerCase().trim();
      return pStore === sStore || (activeSeller.id === 'seller-1' && (pStore.includes('perfume') || pStore.includes('prime')));
    });
  }, [products, activeSeller]);

  // Filter orders containing products from this seller
  const sellerOrders = useMemo(() => {
    if (!activeSeller) return [];
    return orders.filter(order => {
      return order.items.some(item => {
        const itemStore = (item.storeName || item.product.storeName || item.product.sellerName || '').toLowerCase().trim();
        const sStore = (activeSeller.storeName || '').toLowerCase().trim();
        return itemStore === sStore || (activeSeller.id === 'seller-1' && (itemStore.includes('perfume') || itemStore.includes('prime')));
      });
    });
  }, [orders, activeSeller]);

  // Financial KPIs
  const sellerFinancials = useMemo(() => {
    let revenue = 0;
    sellerOrders.forEach(order => {
      order.items.forEach(item => {
        const itemStore = (item.storeName || item.product.storeName || item.product.sellerName || '').toLowerCase().trim();
        const sStore = (activeSeller?.storeName || '').toLowerCase().trim();
        if (itemStore === sStore || (activeSeller?.id === 'seller-1' && (itemStore.includes('perfume') || itemStore.includes('prime')))) {
          revenue += item.product.price * item.quantity;
        }
      });
    });

    // Dynamic platform commission calculation
    const effectiveCommissionRate = commissionRate || 8;
    const platformCommission = Math.round(revenue * (effectiveCommissionRate / 100));
    const availableBalance = Math.max(0, revenue - platformCommission);

    return {
      revenue,
      totalOrders: sellerOrders.length,
      activeProducts: sellerProducts.filter(p => p.inStock).length,
      totalProducts: sellerProducts.length,
      availableBalance,
      platformCommission,
      commissionRate: effectiveCommissionRate
    };
  }, [sellerOrders, sellerProducts, activeSeller, commissionRate]);

  // Product Management Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategory, setProdCategory] = useState(CATEGORIES[0]);
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodImage, setProdImage] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodVideoUrl, setProdVideoUrl] = useState('');
  const [prodFeatures, setProdFeatures] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdCategory(CATEGORIES[0]);
    setProdPrice('');
    setProdOriginalPrice('');
    setProdInStock(true);
    setProdImage('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80');
    setProdDescription('');
    setProdVideoUrl('');
    setProdFeatures('100% Genuine, Long Lasting, Original Packaging');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdCategory(product.category || CATEGORIES[0]);
    setProdPrice(product.price.toString());
    setProdOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setProdInStock(product.inStock);
    setProdImage(product.image);
    setProdDescription(product.description || '');
    setProdVideoUrl(product.videoUrl || '');
    setProdFeatures(product.features ? product.features.join(', ') : '');
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice) return;

    const priceNum = parseFloat(prodPrice) || 0;
    const origPriceNum = prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined;
    const feats = prodFeatures ? prodFeatures.split(',').map(f => f.trim()).filter(Boolean) : ['Original Guarantee'];

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        title: prodTitle.trim(),
        category: prodCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        inStock: prodInStock,
        image: prodImage.trim() || editingProduct.image,
        description: prodDescription.trim(),
        videoUrl: prodVideoUrl.trim() || undefined,
        features: feats,
        storeName: activeSeller?.storeName || editingProduct.storeName,
      });
    } else {
      onAddProduct({
        title: prodTitle.trim(),
        category: prodCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        rating: 4.9,
        reviewsCount: 1,
        image: prodImage.trim() || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
        description: prodDescription.trim(),
        videoUrl: prodVideoUrl.trim() || undefined,
        inStock: prodInStock,
        features: feats,
        storeName: activeSeller?.storeName || 'Prime Vault Official',
        sellerName: activeSeller?.storeName || 'Prime Vault Official',
        sizes: ['50ml', '100ml'],
      });
    }

    setIsProductModalOpen(false);
  };

  // Toggle stock quickly
  const handleToggleStock = (product: Product) => {
    onUpdateProduct({
      ...product,
      inStock: !product.inStock,
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-gray-50 border-b border-[#E5E7EB] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onBackToShop}
              className="text-gray-500 hover:text-[#5B21B6] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </button>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-extrabold text-[#5B21B6]">Multi-Vendor Seller Center</span>
          </div>

          <div className="flex items-center gap-2">
            {sellers.length > 1 && onSwitchSeller && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-500 text-[11px] hidden sm:inline">Active Store:</span>
                <select
                  value={activeSeller?.id}
                  onChange={(e) => onSwitchSeller(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-purple-200 bg-white text-[#5B21B6] font-bold text-xs focus:outline-none"
                >
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.storeName} ({s.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => {
                setActiveTab('register');
                setRegSubmitted(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Become a Seller (নতুন স্টোর খুলুন)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-[#E5E7EB] bg-white sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-[#EDE9FE] text-[#5B21B6] border border-purple-300 font-black'
                  : 'text-[#525252] hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Merchant Dashboard (KPIs & Sales)</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#EDE9FE] text-[#5B21B6] border border-purple-300 font-black'
                  : 'text-[#525252] hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Product Manager ({sellerProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#EDE9FE] text-[#5B21B6] border border-purple-300 font-black'
                  : 'text-[#525252] hover:bg-gray-50'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Fulfillment & Orders ({sellerOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-[#EDE9FE] text-[#5B21B6] border border-purple-300 font-black'
                  : 'text-[#525252] hover:bg-gray-50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Seller Registration & Onboarding</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Content based on Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* =========================================================
            TAB 1: MERCHANT DASHBOARD OVERVIEW & KPIS
           ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Store Status Greeting Banner */}
            <div className="p-6 rounded-3xl bg-[#EDE9FE]/50 border border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#5B21B6] text-white flex items-center justify-center font-black text-xl shadow-xs">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-[#171717]">
                      {activeSeller?.storeName || 'PerfumeVault BD'}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      activeSeller?.status === 'Approved'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : activeSeller?.status === 'Pending'
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : 'bg-red-100 border-red-300 text-red-800'
                    }`}>
                      {activeSeller?.status || 'Approved'} Merchant
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      (Slug: /store/{activeSeller?.slug || 'perfume-vault-bd'})
                    </span>
                  </div>
                  <p className="text-xs text-[#525252] mt-1">
                    Owner: <strong>{activeSeller?.ownerName || 'Tanvir Ahmed'}</strong> • Phone: {activeSeller?.phone || '01883418309'} • Payout: {activeSeller?.payoutMethod.toUpperCase()} ({activeSeller?.payoutAccount || '01883418309'})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {onViewPublicStore && (
                  <button
                    onClick={() => onViewPublicStore(activeSeller?.slug || activeSeller?.storeName || 'store')}
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-[#5B21B6] border border-purple-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Public Brand Store</span>
                  </button>
                )}

                <button
                  onClick={openAddProductModal}
                  className="px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* 4 Core Financial & Fulfillment KPI Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Total Revenue */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] hover:border-purple-300 transition-all shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-wider">Gross Sales</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-[#5B21B6]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-[#171717]">
                  ৳{sellerFinancials.revenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span>Total product orders placed</span>
                </div>
              </div>

              {/* Card 2: Total Orders Received */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] hover:border-purple-300 transition-all shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-wider">Orders Received</span>
                  <div className="p-2 rounded-xl bg-purple-50 text-[#5B21B6]">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-[#5B21B6]">
                  {sellerFinancials.totalOrders}
                </div>
                <div className="text-[11px] text-[#525252]">
                  <span>Customer orders needing fulfillment</span>
                </div>
              </div>

              {/* Card 3: Platform Commission Deducted */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] hover:border-purple-300 transition-all shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-wider">Platform Fee ({sellerFinancials.commissionRate}%)</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-amber-600">
                  -৳{sellerFinancials.platformCommission.toLocaleString()}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  <span>Dynamic {sellerFinancials.commissionRate}% platform rate</span>
                </div>
              </div>

              {/* Card 4: Net Payable Balance */}
              <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] hover:border-purple-300 transition-all shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-wider">Net Payable Settlement</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-600">
                  ৳{sellerFinancials.availableBalance.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  <span>Available for direct disbursement</span>
                </div>
              </div>
            </div>

            {/* Dynamic Settlement Breakdown Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-purple-50/50 border border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5B21B6]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#171717]">
                    Dynamic Platform Commission Engine (লাইভ কমিশন ও সেটেলমেন্ট রিপোর্ট)
                  </h4>
                </div>
                <p className="text-xs text-[#525252]">
                  Gross Sales (<strong>৳{sellerFinancials.revenue.toLocaleString()}</strong>) – Platform Fee {sellerFinancials.commissionRate}% (<strong>৳{sellerFinancials.platformCommission.toLocaleString()}</strong>) = Net Merchant Payout (<strong>৳{sellerFinancials.availableBalance.toLocaleString()}</strong>).
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs bg-white px-4 py-2.5 rounded-2xl border border-purple-200 shrink-0">
                <span className="text-gray-500">Disbursement Channel:</span>
                <span className="font-bold text-[#5B21B6] uppercase">{activeSeller?.payoutMethod}</span>
                <span className="font-mono text-gray-700">({activeSeller?.payoutAccount})</span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Fast Fulfillment Notice */}
              <div className="p-6 rounded-3xl bg-gray-50 border border-[#E5E7EB] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#171717]">
                  <Truck className="w-4 h-4 text-[#5B21B6]" />
                  <span>Steadfast & Pathao Courier Integration</span>
                </div>
                <p className="text-xs text-[#525252] leading-relaxed">
                  When you pack an order and click <strong>"Ready for Pickup"</strong>, our automated courier API assigns a rider for pickup within 4 hours. No manual consignment booking required.
                </p>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#5B21B6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Go to Orders Fulfillment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card 2: 7-Day Settlement Guarantee */}
              <div className="p-6 rounded-3xl bg-gray-50 border border-[#E5E7EB] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#171717]">
                  <CreditCard className="w-4 h-4 text-[#5B21B6]" />
                  <span>Weekly Direct bKash / Bank Payouts</span>
                </div>
                <p className="text-xs text-[#525252] leading-relaxed">
                  Payouts are settled every Sunday directly into your registered payout channel (<strong>{activeSeller?.payoutMethod.toUpperCase()}</strong>: {activeSeller?.payoutAccount}). Payout minimum threshold: ৳500.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-gray-500 font-semibold">Next Scheduled Settlement:</span>
                  <span className="text-xs font-mono font-bold text-[#5B21B6]">Sunday 12:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: PRODUCT MANAGER (LIST, ADD, EDIT, STOCK TOGGLE)
           ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#171717]">
                  Manage Your Catalog ({sellerProducts.length} Items)
                </h3>
                <p className="text-xs text-[#525252]">
                  Add, update prices, manage stock availability, and attach AI showcase video URLs.
                </p>
              </div>

              <button
                onClick={openAddProductModal}
                className="px-4 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table / Cards */}
            {sellerProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-gray-50 border border-[#E5E7EB] space-y-4">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-[#171717]">No Products Listed Yet</h4>
                <p className="text-xs text-[#525252] max-w-sm mx-auto">
                  Click the button below to add your first fragrance or lifestyle product to start receiving customer orders.
                </p>
                <button
                  onClick={openAddProductModal}
                  className="px-5 py-2.5 rounded-xl bg-[#5B21B6] text-white text-xs font-bold cursor-pointer"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[#171717]">
                        <th className="py-3 px-4 font-extrabold">Product Details</th>
                        <th className="py-3 px-4 font-extrabold">Category</th>
                        <th className="py-3 px-4 font-extrabold text-right">Price</th>
                        <th className="py-3 px-4 font-extrabold text-center">Stock Status</th>
                        <th className="py-3 px-4 font-extrabold text-center">Video</th>
                        <th className="py-3 px-4 font-extrabold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sellerProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-11 h-11 rounded-xl object-cover bg-gray-50 border border-gray-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-[#171717] truncate max-w-xs">{prod.title}</p>
                                <p className="text-[11px] text-gray-500 font-mono">ID: {prod.id}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-gray-600">
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#5B21B6] font-semibold border border-purple-200">
                              {prod.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <span className="font-mono font-bold text-[#171717]">
                              ৳{prod.price.toLocaleString()}
                            </span>
                            {prod.originalPrice && (
                              <span className="block font-mono text-[10px] text-gray-400 line-through">
                                ৳{prod.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                                prod.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              }`}
                              title="Click to toggle stock"
                            >
                              {prod.inStock ? (
                                <>
                                  <ToggleRight className="w-4 h-4 text-emerald-600" />
                                  <span>In Stock</span>
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4 h-4 text-red-500" />
                                  <span>Out of Stock</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {prod.videoUrl ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                <Video className="w-3 h-3" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">None</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-purple-100 text-[#5B21B6] font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: ORDER FULFILLMENT & STATUS CHANGER
           ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-[#171717]">
                Customer Orders for Your Store ({sellerOrders.length})
              </h3>
              <p className="text-xs text-[#525252]">
                Prepare parcel packaging and mark items as "Processing / Packed" or "Shipped / In Transit".
              </p>
            </div>

            {sellerOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-gray-50 border border-[#E5E7EB] space-y-4">
                <Truck className="w-12 h-12 text-gray-300 mx-auto" />
                <h4 className="text-base font-bold text-[#171717]">No Orders Received Yet</h4>
                <p className="text-xs text-[#525252] max-w-sm mx-auto">
                  Orders placed by customers for your store's products will appear here for processing and dispatch.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerOrders.map((order) => {
                  // Calculate subtotal of this seller's items in this order
                  const sellerItems = order.items.filter(item => {
                    const itemStore = (item.storeName || item.product.storeName || item.product.sellerName || '').toLowerCase().trim();
                    const sStore = (activeSeller?.storeName || '').toLowerCase().trim();
                    return itemStore === sStore || (activeSeller?.id === 'seller-1' && (itemStore.includes('perfume') || itemStore.includes('prime')));
                  });
                  const sellerSubtotal = sellerItems.reduce((sum, it) => sum + it.product.price * it.quantity, 0);

                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-3xl bg-white border border-[#E5E7EB] hover:border-purple-300 transition-all shadow-2xs space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">Order ID:</span>
                          <span className="font-mono font-black text-sm text-[#5B21B6]">{order.id}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-mono text-gray-500">{order.date}</span>
                        </div>

                        {/* Status Changer Buttons */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-semibold">Change Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="px-3 py-1.5 rounded-xl border border-purple-300 bg-purple-50/50 text-[#5B21B6] font-bold text-xs focus:outline-none cursor-pointer"
                          >
                            <option value="Confirmed">Confirmed 📝</option>
                            <option value="Processing">Processing / Packed 📦</option>
                            <option value="Shipped">Shipped / Ready for Pickup 🚚</option>
                            <option value="Delivered">Delivered 🎉</option>
                          </select>
                        </div>
                      </div>

                      {/* Items from this seller */}
                      <div className="space-y-2">
                        {sellerItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-200 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-[#171717]">{item.product.title}</p>
                                <p className="text-[11px] text-gray-500">
                                  Qty: <strong>{item.quantity}</strong> • Unit: ৳{item.product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-[#171717]">
                              ৳{(item.product.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info & Subtotal */}
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-gray-500">
                          Recipient: <strong className="text-[#171717]">{order.address.fullName}</strong> ({order.address.phone}) • {order.address.cityDivision}
                        </div>
                        <div className="font-bold text-[#171717]">
                          Your Items Value: <span className="text-[#5B21B6] font-mono text-sm">৳{sellerSubtotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 4: SELLER REGISTRATION & ONBOARDING
           ========================================================= */}
        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center mx-auto shadow-2xs">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717]">
                Merchant Registration & Onboarding
              </h2>
              <p className="text-xs sm:text-sm text-[#525252]">
                Sell genuine luxury perfumes, gadgets, and lifestyle goods on Prime Vault Zone.
              </p>
            </div>

            {regSubmitted ? (
              <div className="p-8 text-center space-y-4 rounded-3xl bg-purple-50 border border-purple-200">
                <CheckCircle2 className="w-14 h-14 text-[#5B21B6] mx-auto" />
                <h3 className="text-lg font-bold text-[#171717]">Merchant Application Submitted!</h3>
                <p className="text-xs text-[#525252] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{regOwnerName}</strong>! Your application for <strong>"{regStoreName}"</strong> has been queued for admin verification. You can check its approval status in the top merchant selector.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: Pending Admin Approval</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-6 py-2.5 rounded-xl bg-[#5B21B6] text-white text-xs font-bold cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-5">
                {/* Store Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      Store / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regStoreName}
                      onChange={handleStoreNameChange}
                      placeholder="e.g. Aroma Perfume Vault"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      Store URL Slug
                    </label>
                    <div className="flex items-center">
                      <span className="px-2.5 py-2.5 bg-gray-50 border border-r-0 border-[#E5E7EB] rounded-l-xl text-[11px] text-gray-500 font-mono">
                        /store/
                      </span>
                      <input
                        type="text"
                        required
                        value={regSlug}
                        onChange={(e) => setRegSlug(e.target.value)}
                        placeholder="aroma-perfume-vault"
                        className="w-full px-3 py-2.5 rounded-r-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Name, Phone, Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      Owner Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={regOwnerName}
                      onChange={(e) => setRegOwnerName(e.target.value)}
                      placeholder="Tanvir Ahmed"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      Phone Number (BD) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01883418309"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="merchant@aroma.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                </div>

                {/* Category & NID / Trade License */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      Primary Business Category *
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171717] mb-1">
                      NID / Trade License Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={regNid}
                      onChange={(e) => setRegNid(e.target.value)}
                      placeholder="e.g. 19942691234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                    />
                  </div>
                </div>

                {/* Payout Details */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-[#E5E7EB] space-y-3">
                  <span className="block text-xs font-extrabold text-[#171717]">
                    Payout Settlement Information (বিকাশ / নগদ / ব্যাংক অ্যাকাউন্ট)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegPayoutMethod('bkash')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        regPayoutMethod === 'bkash'
                          ? 'bg-pink-50 border-pink-400 text-pink-700'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      bKash Merchant / Personal
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegPayoutMethod('nagad')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        regPayoutMethod === 'nagad'
                          ? 'bg-orange-50 border-orange-400 text-orange-700'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      Nagad Account
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegPayoutMethod('bank')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        regPayoutMethod === 'bank'
                          ? 'bg-blue-50 border-blue-400 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      Commercial Bank
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {regPayoutMethod === 'bank' ? 'Account Number' : 'bKash / Nagad Wallet Number'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={regPayoutAccount}
                        onChange={(e) => setRegPayoutAccount(e.target.value)}
                        placeholder="01883418309"
                        className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-[#171717]"
                      />
                    </div>

                    {regPayoutMethod === 'bank' && (
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Bank Name & Branch *
                        </label>
                        <input
                          type="text"
                          required
                          value={regBankName}
                          onChange={(e) => setRegBankName(e.target.value)}
                          placeholder="City Bank, Dhanmondi Branch"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-[#171717]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EDE9FE]/50 border border-purple-200 flex items-start gap-2.5 text-xs text-[#525252]">
                  <ShieldCheck className="w-4 h-4 text-[#5B21B6] shrink-0 mt-0.5" />
                  <span>
                    By registering as a seller, you pledge to supply only 100% authentic products. Prime Vault Zone enforces zero-tolerance policy against counterfeit or replica goods.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-black transition-all shadow-md cursor-pointer"
                >
                  Submit Merchant Registration Application
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          ADD / EDIT PRODUCT MODAL
         ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl my-6 bg-white rounded-3xl border border-[#E5E7EB] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#EDE9FE] text-[#5B21B6]">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-[#171717] text-sm sm:text-base">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Your Store'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#171717] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  placeholder="e.g. Royal Oud Extrait de Parfum 100ml"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setProdInStock(!prodInStock)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      prodInStock ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-red-50 text-red-700 border-red-300'
                    }`}
                  >
                    {prodInStock ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-red-500" />}
                    <span>{prodInStock ? 'In Stock (Available)' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] font-mono focus:outline-none focus:border-[#5B21B6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171717] mb-1">Original Price (৳) (Optional)</label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    placeholder="3200"
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] font-mono focus:outline-none focus:border-[#5B21B6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  AI Video Showcase URL (MP4 / WebM / Shorts)
                </label>
                <input
                  type="url"
                  value={prodVideoUrl}
                  onChange={(e) => setProdVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/... or /video.mp4"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  placeholder="Describe your product scent, longevity, ingredients..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={prodFeatures}
                  onChange={(e) => setProdFeatures(e.target.value)}
                  placeholder="100% Genuine, 12h Longevity, Free Sample"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-[#525252] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-black transition-all cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
