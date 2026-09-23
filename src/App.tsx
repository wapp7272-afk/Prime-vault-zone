import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Gift, 
  ShoppingBag, 
  Flame,
  ArrowRight, 
  Heart,
  Award,
  Clock,
  CheckCircle2, 
  XCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Video,
  Store,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Product, CartItem, UserProfile, Address, Order, Coupon, ActivePage, Seller, SystemBannerSettings, PayoutRequest } from './types';
import { PRODUCTS, CATEGORIES } from './data/products';
import { INITIAL_COUPONS } from './data/coupons';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProductDetailView } from './components/ProductDetailView';
import { MyOrdersView } from './components/MyOrdersView';
import { SellerCenterView } from './components/SellerCenterView';
import { PublicSellerStoreView } from './components/PublicSellerStoreView';
import { HeroSection } from './components/HeroSection';
import { CategoryNavGrid } from './components/CategoryNavGrid';
import { FlashSaleSection } from './components/FlashSaleSection';
import { TrustValueProposition } from './components/TrustValueProposition';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerSupport } from './components/CustomerSupport';
import { AdminDashboard, AUTHORIZED_ADMIN_EMAIL } from './components/AdminDashboard';

export default function App() {
  // State: Active Navigation Routing
  const [activePage, setActivePage] = useState<ActivePage>('Home');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>('perfume-vault-bd');

  // State: Dynamic Platform Commission Rate (Configurable: Default 8%)
  const [commissionRate, setCommissionRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('primevault_commission_rate');
      return saved ? parseFloat(saved) : 8;
    } catch {
      return 8;
    }
  });

  const handleUpdateCommissionRate = (newRate: number) => {
    setCommissionRate(newRate);
    try {
      localStorage.setItem('primevault_commission_rate', newRate.toString());
    } catch {}
    showToast(`⚡ Platform commission rate set to ${newRate}%!`);
  };

  // State: System Banner & Announcement Settings
  const [bannerSettings, setBannerSettings] = useState<SystemBannerSettings>(() => {
    try {
      const saved = localStorage.getItem('primevault_banner_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      announcementBadge: '⚡ Flash Offer',
      announcementText: 'Free Delivery on orders over ৳2000 in Dhaka! | 🇧🇩 100% Genuine Guaranteed',
      helplineNumber: '01883-418309',
      heroHeadline: 'Luxury Scents & Lifestyle Vault',
      heroSubheadline: 'Bangladesh’s Premier Authentic Perfume & Lifestyle Marketplace. 100% genuine guaranteed with fast nationwide express delivery.',
      flashSaleTag: 'UP TO 50% OFF — EXCLUSIVE',
    };
  });

  const handleUpdateBannerSettings = (newSettings: SystemBannerSettings) => {
    setBannerSettings(newSettings);
    try {
      localStorage.setItem('primevault_banner_settings', JSON.stringify(newSettings));
    } catch {}
    showToast('🚀 System Banners & Global Announcements updated!');
  };

  // State: Vendor Payout Requests & Settlements
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_payout_requests');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'PAY-1082',
        sellerId: 'seller-1',
        sellerName: 'Perfume Vault BD',
        amount: 3200,
        method: 'bkash',
        account: '01883-418309',
        requestedAt: '2026-09-21 16:30',
        status: 'Completed',
        trxId: 'TRX-9BKASH291'
      },
      {
        id: 'PAY-1094',
        sellerId: 'seller-2',
        sellerName: 'Glow Lights Studio',
        amount: 1450,
        method: 'nagad',
        account: '01712-345678',
        requestedAt: '2026-09-23 11:15',
        status: 'Pending'
      },
      {
        id: 'PAY-1102',
        sellerId: 'seller-3',
        sellerName: 'Oudh & Attar Heritage',
        amount: 2800,
        method: 'bank',
        account: '102.120.9841',
        bankName: 'City Bank Ltd',
        requestedAt: '2026-09-23 14:40',
        status: 'Pending'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('primevault_payout_requests', JSON.stringify(payoutRequests));
    } catch {}
  }, [payoutRequests]);

  const handleApprovePayout = (requestId: string, trxId: string) => {
    setPayoutRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'Completed', trxId } : r
      )
    );
    showToast(`✓ Payout #${requestId} disbursed with TrxID: ${trxId}`);
  };

  const handleRejectPayout = (requestId: string) => {
    setPayoutRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'Rejected' } : r
      )
    );
    showToast(`Payout #${requestId} has been rejected.`);
  };

  // Dynamic Document Title based on active page
  useEffect(() => {
    if (activePage === 'Store') {
      document.title = 'Brand Storefront | PRIME VAULT ZONE';
    } else if (activePage === 'SellerCenter') {
      document.title = 'Merchant Seller Center | PRIME VAULT ZONE';
    } else if (activePage === 'MyOrders') {
      document.title = 'Live Order Tracking & History | PRIME VAULT ZONE';
    } else {
      document.title = 'PRIME VAULT ZONE | Bangladesh Premier Lifestyle & Perfume Marketplace';
    }
  }, [activePage, selectedStoreSlug]);

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFilterTab, setActiveFilterTab] = useState<'All' | 'Flash Sale' | 'Best Deals' | 'New Arrivals'>('All');
  const [catalogTab, setCatalogTab] = useState<'recommended' | 'bestsellers' | 'newarrivals' | 'perfumes' | 'tech'>('recommended');

  // State: Wishlist with LocalStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('primevault_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : '❤️ Added to your Wishlist!');
      return updated;
    });
  };

  // State: Dynamic Products with LocalStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_products') || localStorage.getItem('zestflick_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: Product) => p.id));
          const missingDefaults = PRODUCTS.filter((p) => !existingIds.has(p.id));
          const synchronized = parsed.map((p: Product) => {
            const def = PRODUCTS.find((d) => d.id === p.id);
            if (def && ['p1', 'p2', 'p3', 'p4', 'p5'].includes(p.id)) {
              return { ...def, ...p, title: def.title, name: def.name, image: def.image, originalPrice: def.originalPrice, discount: def.discount };
            }
            return p;
          });
          return [...missingDefaults, ...synchronized];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return PRODUCTS;
  });

  // State: Dynamic Coupons with LocalStorage persistence
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_coupons') || localStorage.getItem('zestflick_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COUPONS;
  });

  // State: Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_cart') || localStorage.getItem('zestflick_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State: Coupon & Wallet
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [applyWalletBonus, setApplyWalletBonus] = useState(true);

  // State: User Profile with LocalStorage persistence
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('primevault_user') || localStorage.getItem('zestflick_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      isLoggedIn: false,
      name: '',
      email: '',
      phone: '',
      walletBalance: 0,
      hasReceivedBonus: false,
      address: {
        fullName: '',
        phone: '',
        cityDivision: 'Inside Dhaka',
        fullAddress: '',
      }
    };
  });

  // State: Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // State: Orders with LocalStorage persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_orders') || localStorage.getItem('zestflick_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      return [];
    }
    return [
      {
        id: 'PVZ-91823',
        date: '2026-09-19 18:32',
        items: [
          { product: PRODUCTS[0], quantity: 1 },
          { product: PRODUCTS[2], quantity: 2 }
        ],
        subtotal: 1850,
        discount: 185,
        walletDeducted: 20,
        deliveryFee: 60,
        total: 1705,
        paymentMethod: 'bkash',
        trxId: 'BKS90812391',
        address: {
          fullName: 'Tanvir Hossain',
          phone: '01712345678',
          cityDivision: 'Inside Dhaka',
          fullAddress: 'House 14, Road 5, Dhanmondi, Dhaka',
          notes: 'Call before delivery'
        },
        status: 'Confirmed'
      },
      {
        id: 'PVZ-82914',
        date: '2026-09-18 14:15',
        items: [
          { product: PRODUCTS[1], quantity: 1 }
        ],
        subtotal: 890,
        discount: 0,
        walletDeducted: 0,
        deliveryFee: 120,
        total: 1010,
        paymentMethod: 'cod',
        address: {
          fullName: 'Rahim Ahmed',
          phone: '01898765432',
          cityDivision: 'Outside Dhaka',
          fullAddress: 'Agrabad C/A, Chattogram'
        },
        status: 'Processing'
      }
    ];
  });

  // State: Registered Sellers with LocalStorage persistence
  const [sellers, setSellers] = useState<Seller[]>(() => {
    try {
      const saved = localStorage.getItem('primevault_sellers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
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
        description: 'Authorized importer of niche French and Arabian perfumes in Bangladesh.'
      },
      {
        id: 'seller-2',
        storeName: 'Apex Tech BD',
        slug: 'apex-tech-bd',
        ownerName: 'Farhan Kabir',
        phone: '01711223344',
        email: 'farhan@apextech.bd',
        category: 'Electronic Gadgets',
        nidOrTradeLicense: 'TR-DH-892147',
        payoutMethod: 'bank',
        payoutAccount: '2050123456789',
        bankName: 'BRAC Bank Ltd',
        status: 'Approved',
        createdAt: '2026-09-10 14:00',
        description: 'Original RGB neon lamps, smart accessories, and aesthetic desk setups.'
      }
    ];
  });

  const [currentSellerId, setCurrentSellerId] = useState<string>('seller-1');

  // State: Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('primevault_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('primevault_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('primevault_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('primevault_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('primevault_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('primevault_sellers', JSON.stringify(sellers));
  }, [sellers]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Product Management (Admin Handlers)
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `pvz-prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`✓ Product "${newProduct.title}" added to store!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === updatedProduct.id
          ? { ...item, product: updatedProduct }
          : item
      )
    );
    if (quickViewProduct?.id === updatedProduct.id) {
      setQuickViewProduct(updatedProduct);
    }
    showToast(`✓ Product "${updatedProduct.title}" updated!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct(null);
    }
    showToast('✓ Product deleted from store.');
  };

  // Coupon Management (Admin Handlers)
  const handleAddCoupon = (newCouponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...newCouponData,
      id: `coup-${Date.now()}`,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`✓ Coupon "${newCoupon.code}" created!`);
  };

  const handleUpdateCoupon = (updatedCoupon: Coupon) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c))
    );
    if (appliedCoupon?.id === updatedCoupon.id) {
      setAppliedCoupon(updatedCoupon);
    }
    showToast(`✓ Coupon "${updatedCoupon.code}" updated!`);
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    if (appliedCoupon?.id === couponId) {
      setAppliedCoupon(null);
      setIsCouponApplied(false);
      setCouponCode('');
    }
    showToast('✓ Coupon removed.');
  };

  // Seller Management Handlers
  const handleRegisterSeller = (newSellerData: Omit<Seller, 'id' | 'createdAt' | 'status'>) => {
    const newSeller: Seller = {
      ...newSellerData,
      id: `seller-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setSellers((prev) => [newSeller, ...prev]);
    setCurrentSellerId(newSeller.id);
    showToast(`🏪 Application for "${newSeller.storeName}" submitted for approval!`);
  };

  const handleUpdateSellerStatus = (sellerId: string, newStatus: Seller['status']) => {
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: newStatus } : s))
    );
    showToast(`✓ Merchant status changed to ${newStatus}`);
  };

  // Add to Cart handler
  const handleAddToCart = (product: Product, quantity = 1, selectedSize?: string) => {
    if (product.inStock === false) {
      showToast(`⚠️ Sorry, "${product.title}" is out of stock!`);
      return;
    }

    const derivedStoreName = product.storeName || product.sellerName || (() => {
      const cat = product.category || '';
      if (cat.includes('Perfume') || cat === 'Attar Perfumes') return 'PerfumeVault BD';
      if (cat.includes('Gadgets') || cat === 'Glow Lights') return 'Apex Tech BD';
      if (cat.includes('Fashion')) return 'Prime Atelier';
      if (cat.includes('Watches')) return 'Chronos Official';
      if (cat.includes('Beauty')) return 'Glow & Glam BD';
      if (cat.includes('Home')) return 'Nordic Living';
      return 'Prime Vault Official';
    })();

    // Adjust price by size multiplier if applicable
    const sizeMultiplier = selectedSize?.includes('50ml') ? 0.85 : selectedSize?.includes('150ml') ? 1.35 : 1;
    const adjustedPrice = selectedSize ? Math.round(product.price * sizeMultiplier) : product.price;

    const itemToAdd: Product = {
      ...product,
      price: adjustedPrice,
      title: selectedSize ? `${product.title} (${selectedSize})` : product.title,
      id: selectedSize ? `${product.id}-${selectedSize}` : product.id,
      storeName: derivedStoreName,
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === itemToAdd.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev, 
        { 
          product: itemToAdd, 
          quantity, 
          selectedSize: selectedSize || (product.sizes && product.sizes[0]), 
          storeName: derivedStoreName 
        }
      ];
    });
    showToast(`🛒 "${itemToAdd.title}" added to cart!`);
  };

  // Instant Buy Now trigger
  const handleBuyNow = (product: Product, quantity = 1, selectedSize?: string) => {
    handleAddToCart(product, quantity, selectedSize);
    setIsCheckoutOpen(true);
  };

  // Navigation Handlers
  const handleGoHome = () => {
    setSelectedProductDetail(null);
    setActivePage('Home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProductDetail = (product: Product) => {
    setSelectedProductDetail(product);
    setActivePage('ProductDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrders = () => {
    setSelectedProductDetail(null);
    setActivePage('MyOrders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSellerCenter = () => {
    setSelectedProductDetail(null);
    setActivePage('SellerCenter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSellerStore = (slugOrName: string) => {
    const raw = (slugOrName || '').toLowerCase().trim();
    const slugKey = raw.replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const found = sellers.find(
      (s) =>
        s.slug.toLowerCase() === slugKey ||
        s.slug.toLowerCase() === raw ||
        s.storeName.toLowerCase() === raw ||
        s.storeName.toLowerCase().includes(raw)
    );

    if (found) {
      setSelectedStoreSlug(found.slug);
    } else {
      setSelectedStoreSlug(slugKey || 'perfume-vault-bd');
    }
    setSelectedProductDetail(null);
    setActivePage('Store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      handleAddToCart(item.product, item.quantity, item.selectedSize);
    });
    showToast(`✓ Order ${order.id} items added to cart!`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  // Cart financial calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const couponDiscount = useMemo(() => {
    if (!isCouponApplied || !appliedCoupon) return 0;
    if (appliedCoupon.minOrderAmount && cartSubtotal < appliedCoupon.minOrderAmount) {
      return 0;
    }
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, cartSubtotal);
  }, [isCouponApplied, appliedCoupon, cartSubtotal]);

  const handleApplyCoupon = (codeToApply: string): { success: boolean; message: string } => {
    const formatted = codeToApply.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === formatted && c.isActive);

    if (!found) {
      const msg = 'Invalid or expired coupon code';
      showToast(`❌ ${msg}`);
      return { success: false, message: msg };
    }

    if (found.minOrderAmount && cartSubtotal < found.minOrderAmount) {
      const msg = `Minimum order amount ৳${found.minOrderAmount} required for this coupon`;
      showToast(`⚠️ ${msg}`);
      return { success: false, message: msg };
    }

    setAppliedCoupon(found);
    setIsCouponApplied(true);
    setCouponCode(found.code);
    const msg = `Coupon "${found.code}" applied!`;
    showToast(`🎉 ${msg}`);
    return { success: true, message: msg };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setIsCouponApplied(false);
    setCouponCode('');
    showToast('Coupon removed');
  };

  // User Profile Authentication Handlers
  const handleLogin = (phone: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      name: name || 'Valued Customer',
      phone,
    }));
    setIsAuthOpen(false);
    showToast(`Welcome back, ${name || 'Customer'}!`);
  };

  const handleSignup = (name: string, email: string, phone: string) => {
    const bonus = user.hasReceivedBonus ? 0 : 20;
    setUser({
      isLoggedIn: true,
      name,
      email,
      phone,
      walletBalance: user.walletBalance + bonus,
      hasReceivedBonus: true,
      address: {
        fullName: name,
        phone,
        cityDivision: 'Inside Dhaka',
        fullAddress: '',
      }
    });
    setIsAuthOpen(false);
    showToast(bonus > 0 ? '🎉 Congratulations! ৳20 Welcome Bonus credited to your wallet!' : `Welcome, ${name}!`);
  };

  const handleUpdateAddress = (newAddress: Address) => {
    setUser((prev) => ({
      ...prev,
      address: newAddress,
    }));
    showToast('✓ Delivery address saved successfully');
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      name: '',
      email: '',
      phone: '',
      walletBalance: 0,
      hasReceivedBonus: false,
      address: {
        fullName: '',
        phone: '',
        cityDivision: 'Inside Dhaka',
        fullAddress: '',
      }
    });
    setIsAuthOpen(false);
    showToast('You have been logged out.');
  };

  const handleCreateOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    if (order.walletDeducted > 0) {
      setUser((prev) => ({
        ...prev,
        walletBalance: Math.max(0, prev.walletBalance - order.walletDeducted),
      }));
    }
    showToast(`🎉 Order Placed Successfully! ID: ${order.id}`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`✓ Order #${orderId} status updated: ${newStatus}`);
  };

  // Download Standalone Single-File HTML
  const handleDownloadStandaloneHtml = () => {
    fetch('/primevault-standalone.html')
      .then((res) => (res.ok ? res.text() : fetch('/zestflick-standalone.html').then((r) => r.text())))
      .then((htmlContent) => {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'primevault-zone-store.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✓ Standalone HTML downloaded!');
      })
      .catch((err) => {
        console.error('Error downloading HTML:', err);
      });
  };

  // Filtered Products based on Category, Search Query, and Active Secondary Nav Filter Tab
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Matching (with support for marketplace group categories)
      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Perfume & Fragrances') {
          matchesCategory = product.category === 'Perfume' || product.category === 'Attar Perfumes' || product.category === 'Perfume & Fragrances';
        } else if (selectedCategory === 'Fashion & Lifestyle') {
          matchesCategory = product.category === 'Fashion & Lifestyle';
        } else if (selectedCategory === 'Electronics & Gadgets') {
          matchesCategory = product.category === 'Electronics & Gadgets' || product.category === 'Glow Lights';
        } else if (selectedCategory === 'Beauty & Personal Care') {
          matchesCategory = product.category === 'Beauty & Personal Care';
        } else if (selectedCategory === 'Home & Living') {
          matchesCategory = product.category === 'Home & Living';
        } else if (selectedCategory === 'Watches & Accessories') {
          matchesCategory = product.category === 'Watches & Accessories';
        } else if (selectedCategory === 'Premium Gifts') {
          matchesCategory = product.category === 'Premium Gifts' || product.category === 'Notebooks' || product.category === 'Bricks Toys';
        } else {
          matchesCategory = product.category.toLowerCase() === selectedCategory.toLowerCase();
        }
      }

      // 2. Search Query Matching
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        (product.name && product.name.toLowerCase().includes(q)) ||
        product.category.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q)) ||
        (product.features && product.features.some((f) => f.toLowerCase().includes(q)));

      // 3. Secondary Nav Tab Filtering ('All' | 'Flash Sale' | 'Best Deals' | 'New Arrivals')
      let matchesTab = true;
      if (activeFilterTab === 'Flash Sale') {
        matchesTab = Boolean(
          (product.originalPrice && product.originalPrice > product.price) ||
          (product.discount && product.discount.length > 0) ||
          (product.tag && (product.tag.includes('OFF') || product.tag.includes('Sale') || product.tag.includes('Hot')))
        );
      } else if (activeFilterTab === 'Best Deals') {
        matchesTab = Boolean(
          (product.rating && product.rating >= 4.8) ||
          (product.tag && (product.tag.includes('Best') || product.tag.includes('Popular') || product.tag.includes('Top') || product.tag.includes('Signature')))
        );
      } else if (activeFilterTab === 'New Arrivals') {
        matchesTab = Boolean(
          product.id.startsWith('fash') ||
          product.id.startsWith('wtch') ||
          product.id.startsWith('bty') ||
          product.id.startsWith('home') ||
          product.id.startsWith('brick') ||
          (product.tag && (product.tag.includes('Exclusive') || product.tag.includes('Trending') || product.tag.includes('New')))
        );
      }

      // 4. Catalog Sub-Tab Filtering ('recommended' | 'bestsellers' | 'newarrivals' | 'perfumes' | 'tech')
      let matchesCatalogTab = true;
      if (catalogTab === 'bestsellers') {
        matchesCatalogTab = Boolean(
          (product.rating && product.rating >= 4.8) ||
          (product.tag && (product.tag.includes('Best') || product.tag.includes('Popular') || product.tag.includes('Hot') || product.tag.includes('Sale')))
        );
      } else if (catalogTab === 'newarrivals') {
        matchesCatalogTab = Boolean(
          product.id.startsWith('fash') ||
          product.id.startsWith('wtch') ||
          product.id.startsWith('bty') ||
          product.id.startsWith('home') ||
          product.id.startsWith('brick') ||
          (product.tag && (product.tag.includes('Exclusive') || product.tag.includes('Trending') || product.tag.includes('New')))
        );
      } else if (catalogTab === 'perfumes') {
        matchesCatalogTab = Boolean(
          product.category === 'Perfume' ||
          product.category === 'Attar Perfumes' ||
          product.category === 'Perfume & Fragrances'
        );
      } else if (catalogTab === 'tech') {
        matchesCatalogTab = Boolean(
          product.category === 'Electronics & Gadgets' ||
          product.category === 'Glow Lights'
        );
      }

      return matchesCategory && matchesSearch && matchesTab && matchesCatalogTab;
    });
  }, [products, searchQuery, selectedCategory, activeFilterTab, catalogTab]);

  // Top 5 Popular Perfumes
  const popularPerfumes = useMemo(() => {
    const targetIds = ['p1', 'p2', 'p3', 'p4', 'p5'];
    const found = targetIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (found.length === 5) return found;
    const rest = products.filter((p) => !found.some((f) => f.id === p.id));
    return [...found, ...rest].slice(0, 5);
  }, [products]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const featuredProduct = useMemo(() => {
    return products.find((p) => p.isFeatured) || products.find((p) => p.id === 'p1') || products[0];
  }, [products]);

  return (
    <div className="min-h-screen bg-white text-[#171717] font-sans selection:bg-[#5B21B6] selection:text-white relative">
      {/* Animated Loading Screen */}
      <LoadingScreen />

      {/* Header with High-Converting Announcement Bar & Secondary Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        ordersCount={orders.length}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => {
          showToast(`❤️ You have ${wishlist.length} items saved in your Wishlist`);
        }}
        onOpenOrders={handleOpenOrders}
        onOpenSellerCenter={handleOpenSellerCenter}
        onOpenSellerStore={handleOpenSellerStore}
        onOpenAuth={() => setIsAuthOpen(true)}
        onDownloadHtml={handleDownloadStandaloneHtml}
        onOpenAdmin={handleOpenAdmin}
        onGoHome={handleGoHome}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveFilterTab('All');
          setActivePage('Home');
          const el = document.getElementById('explore');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectFilterTab={(tab) => {
          setActiveFilterTab(tab);
          setActivePage('Home');
          if (tab !== 'All') {
            const el = document.getElementById('explore');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        activeFilterTab={activeFilterTab}
        activeNav={activePage}
        bannerSettings={bannerSettings}
      />

      {/* Active Page Routing Router */}
      {activePage === 'MyOrders' ? (
        <MyOrdersView
          orders={orders}
          user={user}
          onBackToShop={handleGoHome}
          onViewProduct={handleSelectProductDetail}
          onReorder={handleReorder}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      ) : activePage === 'SellerCenter' ? (
        <SellerCenterView
          onBackToShop={handleGoHome}
          products={products}
          orders={orders}
          sellers={sellers}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onRegisterSeller={handleRegisterSeller}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          currentSellerId={currentSellerId}
          onSwitchSeller={setCurrentSellerId}
          commissionRate={commissionRate}
          onViewPublicStore={handleOpenSellerStore}
        />
      ) : activePage === 'Store' ? (
        <PublicSellerStoreView
          sellerSlug={selectedStoreSlug}
          sellers={sellers}
          products={products}
          orders={orders}
          onBackToShop={handleGoHome}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => handleSelectProductDetail(p)}
          onBuyNow={handleBuyNow}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenSellerCenter={handleOpenSellerCenter}
          onSwitchStore={(slug) => setSelectedStoreSlug(slug)}
          showToast={showToast}
        />
      ) : activePage === 'ProductDetail' && selectedProductDetail ? (
        <ProductDetailView
          product={selectedProductDetail}
          onBackToShop={handleGoHome}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isWishlisted={wishlist.includes(selectedProductDetail.id)}
          onToggleWishlist={handleToggleWishlist}
          onOpenSellerStore={handleOpenSellerStore}
        />
      ) : (
        <>
          {/* ==================== HERO SECTION (Prompt 03) ==================== */}
          <HeroSection
            featuredProduct={featuredProduct}
            bannerSettings={bannerSettings}
            onSelectProduct={handleSelectProductDetail}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
            onExploreDeals={() => {
              setActiveFilterTab('Best Deals');
              setSelectedCategory('All');
              const el = document.getElementById('explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* ==================== INTERACTIVE CATEGORY SECTION (Prompt 02) ==================== */}
          <CategoryNavGrid
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveFilterTab('All');
              const el = document.getElementById('explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* ==================== FLASH SALE SYSTEM & PROMOTIONAL BANNERS (Prompt 04) ==================== */}
          <FlashSaleSection
            products={products}
            onSelectProduct={handleSelectProductDetail}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onViewMoreDeals={() => {
              setActiveFilterTab('Flash Sale');
              setSelectedCategory('All');
              const el = document.getElementById('explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveFilterTab('All');
              const el = document.getElementById('explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* ==================== WHY SHOP WITH US - VALUE PROPOSITION (Prompt 02) ==================== */}
          <TrustValueProposition />

          {/* ==================== POPULAR PRODUCTS GRID ==================== */}
          <section id="popular" className="py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB]">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#5B21B6] font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-[#5B21B6]" />
                <span>TOP TRENDING FRAGRANCES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                Best Selling Perfumes in Bangladesh
              </h2>
              <p className="text-xs sm:text-sm text-[#525252]">
                যে ৫টি পারফিউম এখন সবার মধ্যে সবচেয়ে বেশি জনপ্রিয় ও প্রশংসিত
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {popularPerfumes.map((product) => {
                const isAdded = cart.some((item) => item.product.id === product.id);
                const isWishlisted = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl border border-[#E5E7EB] hover:border-[#C4B5FD] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Uniform Square Ratio */}
                    <div 
                      className="relative aspect-square w-full overflow-hidden bg-[#F9FAFB] cursor-pointer"
                      onClick={() => handleSelectProductDetail(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In Stock
                        </span>
                      </div>

                      {product.discount && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-[#5B21B6] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                            {product.discount}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(product.id);
                        }}
                        className={`absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#E5E7EB] shadow-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                          isWishlisted ? 'text-rose-500' : 'text-[#525252] hover:text-[#5B21B6]'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Product Info & Actions */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleSelectProductDetail(product)}
                      >
                        <span className="text-[10px] text-[#5B21B6] uppercase tracking-wider font-extrabold block">
                          {product.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-extrabold text-[#5B21B6]">
                            ৳{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#E5E7EB]">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-[#EDE9FE] hover:bg-purple-200 text-[#5B21B6] border border-purple-200'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleBuyNow(product)}
                          className="py-1.5 px-2 rounded-lg font-bold text-xs bg-[#5B21B6] hover:bg-[#4C1D95] text-white shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                          <span>Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==================== CATEGORIES & VAULT CATALOG ==================== */}
          <main id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
            {/* Category Navigation Pills */}
            <section className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-[#171717] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#5B21B6]" />
                  <span>Explore Marketplace Categories</span>
                </h2>
                <span className="text-xs text-[#525252] font-semibold">
                  Showing {filteredProducts.length} items
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#5B21B6] text-white shadow-sm'
                        : 'bg-white hover:bg-purple-50 text-[#525252] hover:text-[#5B21B6] border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* ==================== HOMEPAGE MULTI-CATEGORY CATALOG TABS (Prompt 05) ==================== */}
            <section className="mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200">
                {[
                  { id: 'recommended', label: 'Recommended For You', icon: '🌟' },
                  { id: 'bestsellers', label: 'Best Sellers', icon: '🔥' },
                  { id: 'newarrivals', label: 'New Arrivals', icon: '✨' },
                  { id: 'perfumes', label: 'Luxury Perfumes', icon: '💎' },
                  { id: 'tech', label: 'Tech & Gadgets', icon: '📱' },
                ].map((tab) => {
                  const isActive = catalogTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCatalogTab(tab.id as any);
                        if (tab.id === 'perfumes') setSelectedCategory('Perfume & Fragrances');
                        else if (tab.id === 'tech') setSelectedCategory('Electronics & Gadgets');
                      }}
                      className={`pb-3 px-4 text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all relative cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'text-[#5B21B6]'
                          : 'text-[#525252] hover:text-[#171717]'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#5B21B6] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Active Search / Category / Filter Tab feedback */}
            {(searchQuery || selectedCategory !== 'All' || activeFilterTab !== 'All' || catalogTab !== 'recommended') && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-[#525252] bg-purple-50/70 p-3.5 rounded-xl border border-purple-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-500">Active Filters:</span>
                  {catalogTab !== 'recommended' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B21B6] border border-purple-300 text-[11px] font-bold">
                      Tab: {catalogTab}
                      <button 
                        onClick={() => setCatalogTab('recommended')}
                        className="ml-1 hover:text-rose-600 cursor-pointer"
                        title="Reset tab"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {activeFilterTab !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5B21B6] text-white text-[11px] font-bold">
                      Badge: {activeFilterTab}
                      <button 
                        onClick={() => setActiveFilterTab('All')}
                        className="ml-1 hover:text-amber-300 cursor-pointer"
                        title="Remove tab filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6] border border-purple-200 text-[11px] font-bold">
                      Category: {selectedCategory}
                      <button 
                        onClick={() => setSelectedCategory('All')}
                        className="ml-1 hover:text-rose-600 cursor-pointer"
                        title="Remove category filter"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white text-[#171717] border border-gray-200 text-[11px] font-bold">
                      Search: &quot;{searchQuery}&quot;
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-rose-600 cursor-pointer"
                        title="Clear search"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setActiveFilterTab('All');
                    setCatalogTab('recommended');
                  }}
                  className="text-[#5B21B6] hover:text-[#4C1D95] font-bold hover:underline cursor-pointer text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Products Grid (Prompt 05: Responsive 2-Col Mobile, 3-Col Tablet, 4/5-Col Desktop) */}
            <section>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-[#E5E7EB]">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#171717] mb-1">কোনো পণ্য খুঁজে পাওয়া যায়নি</h3>
                  <p className="text-xs text-[#525252] mb-5">
                    অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setActiveFilterTab('All');
                      setCatalogTab('recommended');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    সব পণ্য দেখুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={(p) => handleSelectProductDetail(p)}
                      onBuyNow={handleBuyNow}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenSellerStore={handleOpenSellerStore}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Value Proposition Highlights */}
            <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#C4B5FD] transition-all shadow-xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#EDE9FE] text-[#5B21B6] border border-purple-200 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#171717] mb-1">১০০% অথেনটিক কোয়ালিটি</h4>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    অরিজিনাল ব্র্যান্ডের পারফিউম, খাঁটি প্রাকৃতিক আতর ও বিশ্বস্ত সেলার নিশ্চয়তা।
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#C4B5FD] transition-all shadow-xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#EDE9FE] text-[#5B21B6] border border-purple-200 shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#171717] mb-1">সারা বাংলাদেশে ফাস্ট হোম ডেলিভারি</h4>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    ঢাকার ভিতরে মাত্র ৳৬০ এবং বাইরে ৳১২০ তে ক্যাশ অন ডেলিভারিতে সরাসরি পৌঁছানো হয়।
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#C4B5FD] transition-all shadow-xs flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#EDE9FE] text-[#5B21B6] border border-purple-200 shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#171717] mb-1">ইনস্ট্যান্ট ওয়ালেট বোনাস ও ছাড়</h4>
                  <p className="text-xs text-[#525252] leading-relaxed">
                    সাইনআপ করলেই ওয়ালেটে ৳২০ বোনাস এবং <strong className="text-[#5B21B6]">VAULT10</strong> কোডে ১০% ছাড়।
                  </p>
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      {/* Multi-Column Localized Footer */}
      <Footer
        onGoHome={handleGoHome}
        onOpenOrders={handleOpenOrders}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSellerCenter={handleOpenSellerCenter}
        onOpenSellerStore={handleOpenSellerStore}
        onOpenAdmin={handleOpenAdmin}
        onDownloadHtml={handleDownloadStandaloneHtml}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-4 z-50 px-4 py-3 rounded-xl bg-[#171717] text-white text-xs font-bold shadow-xl flex items-center gap-2.5 animate-slideLeft">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        user={user}
        couponCode={couponCode}
        isCouponApplied={isCouponApplied}
        appliedCoupon={appliedCoupon}
        couponDiscount={couponDiscount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        applyWalletBonus={applyWalletBonus}
        onToggleWalletBonus={setApplyWalletBonus}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onViewOrders={handleOpenOrders}
      />

      {/* Product Quick View Modal */}
      <ProductDetailsModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Auth & Wallet Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onUpdateAddress={handleUpdateAddress}
        onLogout={handleLogout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        user={user}
        subtotal={cartSubtotal}
        couponDiscount={couponDiscount}
        walletDeducted={applyWalletBonus && cartSubtotal > 0 ? Math.min(user.walletBalance, 20) : 0}
        couponCode={couponCode}
        isCouponApplied={isCouponApplied}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onPlaceOrder={handleCreateOrder}
        onClearCart={() => setCart([])}
        onViewOrders={handleOpenOrders}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onUpdateCoupon={handleUpdateCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        sellers={sellers}
        onUpdateSellerStatus={handleUpdateSellerStatus}
        commissionRate={commissionRate}
        onUpdateCommissionRate={handleUpdateCommissionRate}
        bannerSettings={bannerSettings}
        onUpdateBannerSettings={handleUpdateBannerSettings}
        payoutRequests={payoutRequests}
        onApprovePayout={handleApprovePayout}
        onRejectPayout={handleRejectPayout}
        showToast={showToast}
        onViewPublicStore={(slug) => {
          setIsAdminOpen(false);
          handleOpenSellerStore(slug);
        }}
        onGoShop={handleGoHome}
        onGoOrders={handleOpenOrders}
      />

      {/* Floating Customer Support Widget */}
      <CustomerSupport />
    </div>
  );
}
