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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5E7EB] transition-all shadow-xs">
      {/* 1. High-Converting Top Announcement Bar */}
      <div className="bg-[#5B21B6] text-white px-4 py-2 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 bg-[#4C1D95] px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-300">
              {bannerSettings?.announcementBadge || '⚡ Flash Offer'}
            </span>
            <span className="text-white/95 text-xs">
              {bannerSettings?.announcementText || 'Free Delivery on orders over ৳2000 in Dhaka! | 🇧🇩 100% Genuine Guaranteed'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-purple-100">
            {onOpenSellerCenter && (
              <button 
                onClick={onOpenSellerCenter}
                className="hover:text-white transition-colors flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-amber-300" />
                <span>Seller Center</span>
              </button>
            )}
            <a href="tel:01883418309" className="hover:text-white transition-colors flex items-center gap-1">
              <PhoneCall className="w-3 h-3" />
              <span>Helpline: {bannerSettings?.helplineNumber || '01883-418309'}</span>
            </a>
            <span className="text-purple-300">|</span>
            <span className="bg-[#4C1D95] px-2 py-0.5 rounded text-amber-200 font-mono font-bold">
              Code: VAULT10 (10% OFF)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Search & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-6">
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

        {/* Prominent Search Bar with Deep Purple Accent */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#525252]">
              <Search className="w-4 h-4 text-[#5B21B6]" />
            </div>
            <input
              id="header-search-input-desktop"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, brands & categories..."
              className="w-full pl-10 pr-24 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#171717] placeholder-[#525252] focus:outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/20 transition-all shadow-2xs"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-16 p-1 text-[#525252] hover:text-[#171717]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
            <button
              onClick={() => {}}
              className="absolute right-1.5 px-3 py-1.5 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              Search
            </button>
          </div>
        </div>

        {/* Right Action Icons Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Button */}
          {onOpenWishlist && (
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl text-[#525252] hover:text-[#5B21B6] hover:bg-[#EDE9FE] transition-colors cursor-pointer"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-4 px-1 bg-[#5B21B6] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* User Wallet Badge */}
          <button
            id="header-wallet-btn"
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EDE9FE] hover:bg-purple-200 border border-purple-200 text-[#5B21B6] text-xs font-bold transition-all cursor-pointer"
            title="Prime Vault Wallet Balance"
          >
            <Wallet className="w-4 h-4 text-[#5B21B6]" />
            <span className="font-mono">৳{user.walletBalance}</span>
          </button>

          {/* Orders Tracking Button */}
          {onOpenOrders && (
            <button
              id="header-orders-btn"
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[#171717] hover:text-[#5B21B6] hover:bg-[#EDE9FE] border border-transparent hover:border-purple-200 text-xs font-semibold transition-all cursor-pointer"
              title="My Orders & Live Tracking"
            >
              <Package className="w-4 h-4 text-[#5B21B6]" />
              <span className="hidden lg:inline">Orders</span>
              {ordersCount > 0 && (
                <span className="min-w-[18px] h-4.5 px-1.5 bg-[#EDE9FE] text-[#5B21B6] border border-purple-200 rounded-full text-[10px] font-mono font-bold flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile Button */}
          <button
            id="header-profile-btn"
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-[#171717] hover:bg-[#EDE9FE] border border-[#E5E7EB] hover:border-[#5B21B6]/40 text-xs font-medium transition-all cursor-pointer"
            title="Account & Profile Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-xs font-bold shadow-xs">
              {user.isLoggedIn ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[10px] text-[#525252] leading-none">
                {user.isLoggedIn ? 'Hello,' : 'Sign in'}
              </span>
              <span className="font-bold text-xs text-[#171717] truncate max-w-[85px] leading-tight">
                {user.isLoggedIn ? user.name : 'Account'}
              </span>
            </div>
          </button>

          {/* Cart Icon with Vibrant Deep Purple Badge */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="hidden sm:inline text-xs font-bold">Cart</span>
            {cartCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 bg-amber-400 text-[#171717] text-[11px] font-black rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Shortcut */}
          <button
            id="header-admin-btn"
            onClick={onOpenAdmin}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE9FE] text-[#525252] hover:text-[#5B21B6] text-xs font-semibold transition-all"
            title="Admin Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B21B6]" />
            <span>Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-[#525252] hover:text-[#171717] rounded-lg hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#525252]">
            <Search className="w-4 h-4 text-[#5B21B6]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full pl-9 pr-8 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#171717] placeholder-[#525252] focus:outline-none focus:border-[#5B21B6]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 p-1 text-[#525252]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Secondary Navigation Bar (Prompt 02 requirement) */}
      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-[#525252]">
          <div className="flex items-center gap-1 sm:gap-6 overflow-x-auto py-2">
            {/* 1. Home */}
            <button
              id="nav-link-home"
              onClick={handleLogoOrHomeClick}
              className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNav === 'Home' && activeFilterTab === 'All'
                  ? 'text-[#5B21B6] font-extrabold bg-[#EDE9FE]'
                  : 'hover:text-[#5B21B6] hover:bg-gray-50'
              }`}
            >
              <span>Home</span>
              {activeNav === 'Home' && activeFilterTab === 'All' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>

            {/* 2. All Categories Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="nav-link-categories-dropdown"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  categoriesDropdownOpen
                    ? 'text-[#5B21B6] font-bold bg-[#EDE9FE]'
                    : 'hover:text-[#5B21B6] hover:bg-gray-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#5B21B6]" />
                <span>All Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#5B21B6]' : 'text-gray-400'}`} />
              </button>

              {/* Categories Dropdown Menu */}
              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5B21B6] border-b border-gray-100 mb-1">
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
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-[#171717] hover:bg-[#EDE9FE] hover:text-[#5B21B6] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-[#525252] font-mono">{item.count}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        if (onGoHome) onGoHome();
                        if (onSelectCategory) onSelectCategory('All');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-bold text-[#5B21B6] hover:underline cursor-pointer"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Flash Sale ⚡ */}
            <button
              id="nav-link-flash-sale"
              onClick={() => {
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('Flash Sale');
              }}
              className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilterTab === 'Flash Sale'
                  ? 'text-[#5B21B6] font-extrabold bg-[#EDE9FE]'
                  : 'hover:text-[#5B21B6] hover:bg-gray-50'
              }`}
            >
              <span>Flash Sale</span>
              <span className="text-amber-500">⚡</span>
              {activeFilterTab === 'Flash Sale' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>

            {/* 4. Best Deals 🏷️ */}
            <button
              id="nav-link-best-deals"
              onClick={() => {
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('Best Deals');
              }}
              className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilterTab === 'Best Deals'
                  ? 'text-[#5B21B6] font-extrabold bg-[#EDE9FE]'
                  : 'hover:text-[#5B21B6] hover:bg-gray-50'
              }`}
            >
              <span>Best Deals</span>
              <span>🏷️</span>
              {activeFilterTab === 'Best Deals' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>

            {/* 5. New Arrivals ✨ */}
            <button
              id="nav-link-new-arrivals"
              onClick={() => {
                if (onGoHome) onGoHome();
                if (onSelectFilterTab) onSelectFilterTab('New Arrivals');
              }}
              className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilterTab === 'New Arrivals'
                  ? 'text-[#5B21B6] font-extrabold bg-[#EDE9FE]'
                  : 'hover:text-[#5B21B6] hover:bg-gray-50'
              }`}
            >
              <span>New Arrivals</span>
              <span className="text-purple-500">✨</span>
              {activeFilterTab === 'New Arrivals' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>

            {/* 6. Brand Stores 🏬 */}
            {onOpenSellerStore && (
              <button
                id="nav-link-brand-store"
                onClick={() => onOpenSellerStore('perfume-vault-bd')}
                className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeNav === 'Store'
                    ? 'text-white bg-[#5B21B6]'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200'
                }`}
                title="Browse Verified Brand Storefronts"
              >
                <Store className="w-3.5 h-3.5 text-[#5B21B6]" />
                <span>Brand Store</span>
              </button>
            )}

            {/* 7. Become a Seller 🏪 (Links directly to SellerCenter view) */}
            {onOpenSellerCenter && (
              <button
                id="nav-link-become-seller"
                onClick={onOpenSellerCenter}
                className={`relative px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeNav === 'SellerCenter'
                    ? 'text-white bg-[#5B21B6]'
                    : 'text-[#5B21B6] bg-[#EDE9FE] hover:bg-purple-200 border border-purple-200'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Center</span>
                <span>🏪</span>
              </button>
            )}
          </div>

          {/* Standalone HTML Export */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={handleDownloadClick}
              className="text-[11px] font-medium text-[#525252] hover:text-[#5B21B6] flex items-center gap-1 cursor-pointer"
              title="Download Standalone Single-File HTML"
            >
              <Code2 className="w-3.5 h-3.5 text-[#5B21B6]" />
              <span>{downloadSuccess ? 'HTML Saved!' : 'Export HTML'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
