import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Sparkles, 
  Wallet, 
  X,
  Code2,
  CheckCircle,
  ShieldCheck,
  Package,
  Heart,
  Store,
  HelpCircle,
  PhoneCall,
  Menu,
  ChevronDown,
  Zap,
  Tag,
  Flame,
  Layers,
  Watch,
  Smartphone,
  Gift
} from 'lucide-react';
import { UserProfile, SystemBannerSettings } from '../types';
import { VaultLogo } from './VaultLogo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  user: UserProfile;
  ordersCount?: number;
  wishlistCount?: number;
  onOpenAuth: () => void;
  onOpenOrders?: () => void;
  onOpenWishlist?: () => void;
  onOpenSellerCenter?: () => void;
  onOpenSellerStore?: (slug: string) => void;
  onDownloadHtml: () => void;
  onOpenAdmin: () => void;
  onGoHome?: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectFilterTab?: (tab: 'All' | 'Flash Sale' | 'Best Deals' | 'New Arrivals') => void;
  activeFilterTab?: string;
  activeNav?: string;
  bannerSettings?: SystemBannerSettings;
}

export const CATEGORY_DROPDOWN_ITEMS = [
  { name: 'Perfume & Fragrances', icon: '✨', count: '240+ Items' },
  { name: 'Fashion & Lifestyle', icon: '👔', count: '180+ Items' },
  { name: 'Electronics & Gadgets', icon: '📱', count: '95+ Items' },
  { name: 'Beauty & Personal Care', icon: '💄', count: '150+ Items' },
  { name: 'Home & Living', icon: '🏠', count: '110+ Items' },
  { name: 'Watches & Accessories', icon: '⌚', count: '80+ Items' },
  { name: 'Premium Gifts', icon: '🎁', count: '70+ Items' },
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  user,
  ordersCount = 0,
  wishlistCount = 0,
  onOpenAuth,
  onOpenOrders,
  onOpenWishlist,
  onOpenSellerCenter,
  onOpenSellerStore,
  onDownloadHtml,
  onOpenAdmin,
  onGoHome,
  onSelectCategory,
  onSelectFilterTab,
  activeFilterTab = 'All',
  activeNav = 'Home',
  bannerSettings,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadClick = () => {
    onDownloadHtml();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleLogoOrHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGoHome) onGoHome();
    if (onSelectFilterTab) onSelectFilterTab('All');
    if (onSelectCategory) onSelectCategory('All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 transition-all shadow-2xs">
      {/* 1. Slim Announcement Topbar */}
      <div className="bg-[#0F172A] text-slate-300 px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold text-[#F59E0B]">
              {bannerSettings?.announcementBadge || '⚡ Flash Offer'}
            </span>
            <span className="text-slate-200 text-xs">
              {bannerSettings?.announcementText || 'Free Delivery on orders over ৳2000 in Dhaka | 🇧🇩 100% Genuine Guaranteed'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400">
            {onOpenSellerCenter && (
              <button 
                onClick={onOpenSellerCenter}
                className="hover:text-white transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Seller Center</span>
              </button>
            )}
            <button
              id="topbar-admin-portal-link"
              onClick={onOpenAdmin}
              className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 font-medium cursor-pointer"
              title="Open Secure Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </button>
            <a href="tel:01883418309" className="hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>Helpline: {bannerSettings?.helplineNumber || '01883-418309'}</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[#F59E0B] font-mono text-[11px] font-semibold">
              Code: VAULT10 (10% OFF)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Search & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-6 bg-white">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLogoOrHomeClick}
            className="flex items-center text-left focus:outline-none cursor-pointer"
            aria-label="Prime Vault Zone Home"
          >
            <VaultLogo size="md" />
          </button>
        </div>

        {/* Clean Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              id="header-search-input-desktop"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search perfumes, lifestyle, brands & categories..."
              className="w-full pl-10 pr-24 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:bg-white focus:ring-1 focus:ring-[#4F46E5] transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-18 p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <button
              onClick={() => {}}
              className="absolute right-1.5 px-3 py-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-md text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Action Icons Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Wishlist Button */}
          {onOpenWishlist && (
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 rounded-lg text-slate-600 hover:text-[#4F46E5] hover:bg-slate-50 transition-colors cursor-pointer"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[17px] h-4 px-1 bg-[#4F46E5] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* User Wallet Badge */}
          <button
            id="header-wallet-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-[#4F46E5] text-xs font-semibold transition-colors cursor-pointer active:scale-98"
            title="Prime Vault Wallet Balance"
          >
            <Wallet className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span className="font-mono text-xs font-bold">৳{user.walletBalance}</span>
            {user.walletBalance > 0 ? (
              <span className="hidden xs:inline-block text-[9px] px-1 bg-emerald-100 text-emerald-800 font-semibold rounded">
                Active
              </span>
            ) : (
              <span className="hidden xs:inline-block text-[9px] px-1 bg-[#F59E0B] text-slate-900 font-bold rounded">
                +৳20
              </span>
            )}
          </button>

          {/* Orders Tracking Button */}
          {onOpenOrders && (
            <button
              id="header-orders-btn"
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-700 hover:text-[#4F46E5] hover:bg-slate-50 border border-transparent text-xs font-medium transition-colors cursor-pointer"
              title="My Orders & Live Tracking"
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">Orders</span>
              {ordersCount > 0 && (
                <span className="min-w-[18px] h-4.5 px-1.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-mono font-bold flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile Button */}
          <button
            id="header-profile-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[#0F172A] hover:bg-slate-50 border border-slate-200 text-xs font-medium transition-colors cursor-pointer"
            title="Account & Profile Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold">
              {user.isLoggedIn ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] text-slate-400 leading-none">
                {user.isLoggedIn ? 'Hello,' : 'Sign in'}
              </span>
              <span className="font-semibold text-xs text-[#0F172A] truncate max-w-[85px] leading-tight">
                {user.isLoggedIn ? user.name : 'Account'}
              </span>
            </div>
          </button>

          {/* Cart Button */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative px-3 py-1.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-colors cursor-pointer flex items-center gap-2"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="min-w-[18px] h-4.5 px-1 bg-[#F59E0B] text-[#0F172A] text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Shortcut */}
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[#F59E0B] hover:text-white text-xs font-medium transition-colors border border-slate-800 cursor-pointer"
            title="Secure Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5 bg-white border-b border-slate-100">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 p-1 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Secondary Navigation Bar */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
            {/* 1. Home */}
            <button
              id="nav-link-home"
              onClick={handleLogoOrHomeClick}
              className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeNav === 'Home' && activeFilterTab === 'All'
                  ? 'text-[#4F46E5] font-semibold bg-indigo-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Home</span>
            </button>

            {/* 2. All Categories Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-link-categories-dropdown"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  categoriesDropdownOpen
                    ? 'text-[#4F46E5] font-semibold bg-indigo-50/80'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>All Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#4F46E5]' : 'text-slate-400'}`} />
              </button>

              {/* Categories Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-lg shadow-lg border border-slate-200 p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Marketplace Categories
                  </div>
                  {CATEGORY_DROPDOWN_ITEMS.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (onGoHome) onGoHome();
                        if (onSelectCategory) onSelectCategory(item.name);
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-left text-xs text-slate-700 hover:bg-indigo-50 hover:text-[#4F46E5] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.count}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        if (onGoHome) onGoHome();
                        if (onSelectCategory) onSelectCategory('All');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-center py-1 text-[11px] font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Flash Sale */}
            <button
              id="nav-link-flash-sale"
              onClick={() => {
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('Flash Sale');
              }}
              className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilterTab === 'Flash Sale'
                  ? 'text-[#4F46E5] font-semibold bg-indigo-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Flash Sale</span>
              <span className="text-[#F59E0B]">⚡</span>
            </button>

            {/* 4. Best Deals */}
            <button
              id="nav-link-best-deals"
              onClick={() => {
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('Best Deals');
              }}
              className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilterTab === 'Best Deals'
                  ? 'text-[#4F46E5] font-semibold bg-indigo-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Best Deals</span>
              <span>🏷️</span>
            </button>

            {/* 5. New Arrivals */}
            <button
              id="nav-link-new-arrivals"
              onClick={() => {
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('New Arrivals');
              }}
              className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilterTab === 'New Arrivals'
                  ? 'text-[#4F46E5] font-semibold bg-indigo-50/80'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>New Arrivals</span>
              <span>✨</span>
            </button>

            {/* 6. Brand Stores */}
            {onOpenSellerStore && (
              <button
                id="nav-link-brand-store"
                onClick={() => onOpenSellerStore('perfume-vault-bd')}
                className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-medium ${
                  activeNav === 'Store'
                    ? 'text-white bg-[#4F46E5]'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
                title="Browse Verified Brand Storefronts"
              >
                <Store className="w-3.5 h-3.5 text-slate-500" />
                <span>Brand Store</span>
              </button>
            )}

            {/* 7. Become a Seller */}
            {onOpenSellerCenter && (
              <button
                id="nav-link-become-seller"
                onClick={onOpenSellerCenter}
                className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-medium ${
                  activeNav === 'SellerCenter'
                    ? 'text-white bg-[#4F46E5]'
                    : 'text-[#4F46E5] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Center</span>
              </button>
            )}
          </div>

          {/* Standalone HTML Export */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleDownloadClick}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              title="Download Standalone Single-File HTML"
            >
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{downloadSuccess ? 'HTML Saved!' : 'Export HTML'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Responsive Mobile Drawer / Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg max-h-[80vh] overflow-y-auto animate-fadeIn">
          {/* Mobile User & Wallet Summary Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm">
                  {user.isLoggedIn ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0F172A]">
                    {user.isLoggedIn ? user.name : 'Welcome to Prime Vault'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {user.isLoggedIn ? (user.phone || user.email) : 'Sign in to unlock ৳20 bonus'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="px-3 py-1.5 rounded-md bg-[#4F46E5] text-white text-[11px] font-semibold hover:bg-[#4338CA] transition-colors cursor-pointer"
              >
                {user.isLoggedIn ? 'Profile' : 'Sign In'}
              </button>
            </div>

            {/* Mobile Wallet Bonus Highlight Card */}
            <div 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-50 text-[#4F46E5]">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                    Prime Vault Wallet
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold font-mono text-[#0F172A]">
                      ৳{user.walletBalance}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      {user.isPhoneVerified ? '✓ Phone Verified' : '+৳20 on Verification'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-[#4F46E5] font-semibold">View →</span>
            </div>
          </div>

          {/* Mobile Links List */}
          <div className="p-3 space-y-1 text-xs font-medium text-slate-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('All');
                if (onSelectCategory) onSelectCategory('All');
              }}
              className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left"
            >
              <span>Home (প্রধান পাতা)</span>
              <span>🏠</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('Flash Sale');
              }}
              className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left text-amber-700"
            >
              <span>Flash Sale ⚡ (ফ্ল্যাশ সেল)</span>
              <span>⚡</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('Best Deals');
              }}
              className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left"
            >
              <span>Best Deals 🏷️ (সেরা অফার)</span>
              <span>🏷️</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('New Arrivals');
              }}
              className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left"
            >
              <span>New Arrivals ✨ (নতুন কালেকশন)</span>
              <span>✨</span>
            </button>

            {onOpenSellerStore && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSellerStore('perfume-vault-bd');
                }}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left text-slate-800"
              >
                <span>Brand Stores 🏬 (ব্র্যান্ড স্টোর)</span>
                <span>🏬</span>
              </button>
            )}

            {onOpenOrders && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrders();
                }}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left"
              >
                <span>My Orders & Tracking 📦 (আমার অর্ডার)</span>
                {ordersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {ordersCount}
                  </span>
                )}
              </button>
            )}

            {onOpenWishlist && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-left"
              >
                <span>Saved Wishlist ❤️ (পছন্দের তালিকা)</span>
                {wishlistCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {onOpenSellerCenter && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSellerCenter();
                }}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md bg-indigo-50/70 text-[#4F46E5] hover:bg-indigo-100 transition-colors text-left font-semibold"
              >
                <span>Seller Center 🏪 (মার্চেন্ট পোর্টাল)</span>
                <span>🏪</span>
              </button>
            )}

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-between py-2 px-3 rounded-md bg-slate-900 text-amber-300 hover:text-white transition-colors text-left font-semibold"
              >
                <span>Admin Portal 🛡️ (এডমিন ড্যাশবোর্ড)</span>
                <span>🛡️</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
