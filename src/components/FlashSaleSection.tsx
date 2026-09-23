import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Flame, 
  Star, 
  ShoppingCart, 
  Eye, 
  Sparkles,
  Tag,
  Clock
} from 'lucide-react';
import { Product } from '../types';

interface FlashSaleSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewMoreDeals: () => void;
  onSelectCategory: (category: string) => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onViewMoreDeals,
  onSelectCategory,
}) => {
  // Live ticking countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    // End of current 8-hour block
    const now = new Date();
    const hoursRemaining = 7 - (now.getHours() % 8);
    const minutesRemaining = 59 - now.getMinutes();
    const secondsRemaining = 59 - now.getSeconds();
    return {
      hours: Math.max(0, hoursRemaining),
      minutes: Math.max(0, minutesRemaining),
      seconds: Math.max(0, secondsRemaining),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to next cycle
          return { hours: 7, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter flash sale products (with originalPrice or discount or tag)
  const flashProducts = React.useMemo(() => {
    const withDiscount = products.filter(
      (p) => (p.originalPrice && p.originalPrice > p.price) || (p.discount && p.discount.length > 0)
    );
    return withDiscount.length >= 6 ? withDiscount.slice(0, 10) : products.slice(0, 8);
  }, [products]);

  // Horizontal scroll container reference
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Helper to format two digits
  const format2 = (num: number) => num.toString().padStart(2, '0');

  // Deterministic mock stock progress based on product ID
  const getStockData = (productId: string) => {
    const charCodeSum = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const total = 25 + (charCodeSum % 25); // 25 to 50
    const sold = 12 + (charCodeSum % 12); // 12 to 24
    const percentage = Math.min(92, Math.round((sold / total) * 100));
    return { sold, total, percentage };
  };

  return (
    <section className="py-10 lg:py-14 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ================= 1. FLASH SALE HEADER & TICKING COUNTDOWN TIMER ================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE9FE]/70 border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          {/* Left: Flash Title & Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5B21B6] text-white flex items-center justify-center shadow-md">
              <Zap className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#5B21B6] tracking-tight">
                  Flash Sale
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-black uppercase tracking-wider">
                  <Flame className="w-3 h-3 fill-rose-600" />
                  Limited Stock
                </span>
              </div>
              <p className="text-xs text-[#525252] mt-0.5">
                বিশেষ মূল্যে সীমিত সময়ের সেরা ডিলসমূহ — স্টক শেষ হওয়ার আগেই অর্ডার করুন!
              </p>
            </div>
          </div>

          {/* Center/Right: Live Ticking Countdown Box & View All Link */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-4">
            {/* Live Ticking Countdown Timer */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-purple-200 shadow-xs">
              <Clock className="w-4 h-4 text-[#5B21B6]" />
              <span className="text-xs font-bold text-[#171717] hidden sm:inline">Ending in:</span>
              
              <div className="flex items-center gap-1 font-mono text-xs font-black">
                {/* Hours Box */}
                <div className="bg-[#5B21B6] text-white px-2 py-1 rounded-md min-w-[28px] text-center shadow-xs">
                  {format2(timeLeft.hours)}
                </div>
                <span className="text-[#5B21B6] font-bold">:</span>
                
                {/* Minutes Box */}
                <div className="bg-[#5B21B6] text-white px-2 py-1 rounded-md min-w-[28px] text-center shadow-xs">
                  {format2(timeLeft.minutes)}
                </div>
                <span className="text-[#5B21B6] font-bold">:</span>
                
                {/* Seconds Box */}
                <div className="bg-[#5B21B6] text-white px-2 py-1 rounded-md min-w-[28px] text-center shadow-xs animate-pulse">
                  {format2(timeLeft.seconds)}
                </div>
              </div>
            </div>

            {/* Shop More Deals Link */}
            <button
              onClick={onViewMoreDeals}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#5B21B6] hover:text-[#4C1D95] bg-white hover:bg-purple-50 px-3.5 py-2 rounded-xl border border-purple-200 transition-all cursor-pointer shadow-xs group"
            >
              <span>Shop More Deals</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ================= 2. FLASH SALE PRODUCT CAROUSEL / GRID ================= */}
        <div className="relative">
          {/* Navigation Arrows (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] hover:border-[#5B21B6] text-[#171717] hover:text-[#5B21B6] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              aria-label="Previous Flash Products"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] hover:border-[#5B21B6] text-[#171717] hover:text-[#5B21B6] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              aria-label="Next Flash Products"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontal Scrollable Flash Products Carousel */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth scrollbar-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {flashProducts.map((product) => {
              const { sold, total, percentage } = getStockData(product.id);
              const discountPercent = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 20;

              return (
                <div
                  key={product.id}
                  className="w-[240px] sm:w-[260px] shrink-0 bg-white rounded-2xl border border-[#E5E7EB] hover:border-purple-300 p-3 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Top Image Container with Discount Badge */}
                  <div>
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* High Discount Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 rounded-md bg-rose-600 text-white text-[11px] font-black shadow-sm flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-white" />
                          -{discountPercent}% OFF
                        </span>
                      </div>

                      {/* Quick View Button on Image */}
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/90 text-[#5B21B6] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 shadow-md cursor-pointer"
                        title="Quick View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#5B21B6] font-extrabold uppercase tracking-wider truncate max-w-[120px]">
                        {product.category}
                      </span>
                      <div className="flex items-center text-amber-500 font-bold gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{product.rating || 4.8}</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-xs sm:text-sm font-bold text-[#171717] hover:text-[#5B21B6] line-clamp-2 leading-snug cursor-pointer transition-colors mb-2 min-h-[36px]"
                    >
                      {product.title}
                    </h3>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-base sm:text-lg font-black text-[#5B21B6]">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Limit Progress Bar & Urgent Purchase Status */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-[11px] text-[#525252]">
                      <span className="font-semibold text-rose-600 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-rose-600" />
                        {percentage}% Claimed
                      </span>
                      <span className="text-gray-400 font-medium">{sold}/{total} Sold</span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-[#5B21B6] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Action Buttons: Add to Cart & Buy Now */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="py-1.5 px-2 rounded-lg bg-[#EDE9FE] hover:bg-purple-200 text-[#5B21B6] text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="truncate">Add Cart</span>
                      </button>

                      <button
                        onClick={() => onBuyNow(product)}
                        className="py-1.5 px-2 rounded-lg bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95"
                        title="Buy Now"
                      >
                        <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span className="truncate">Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 3. PROMOTIONAL GRID BANNERS (3 COLUMNS) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-2">
          {/* Banner 1: Perfume Vault Collection */}
          <div 
            onClick={() => onSelectCategory('Perfume & Fragrances')}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-[#5B21B6] text-white p-6 sm:p-7 flex flex-col justify-between h-[210px] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-purple-800"
          >
            {/* Background Decorative Graphic */}
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-30 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400"
                alt="Perfume Deco"
                className="w-full h-full object-cover rounded-tl-3xl mix-blend-screen"
              />
            </div>

            <div className="relative z-10 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Sparkles className="w-3 h-3" />
                Royal Luxury Notes
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Perfume Vault Collection
              </h3>
              <p className="text-xs text-purple-200 font-semibold">
                Up to 40% OFF on Top Designer Fragrances
              </p>
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white hover:text-[#5B21B6] px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all group-hover:translate-x-1">
                Shop Scents <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Banner 2: Trending Gadgets & Tech */}
          <div 
            onClick={() => onSelectCategory('Electronics & Gadgets')}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1B4B] to-purple-950 text-white p-6 sm:p-7 flex flex-col justify-between h-[210px] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-indigo-900"
          >
            {/* Background Decorative Graphic */}
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-30 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400"
                alt="Gadgets Deco"
                className="w-full h-full object-cover rounded-tl-3xl mix-blend-screen"
              />
            </div>

            <div className="relative z-10 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-cyan-300 bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Zap className="w-3 h-3 fill-current" />
                Smart Lifestyle
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Trending Gadgets & Tech
              </h3>
              <p className="text-xs text-indigo-200 font-semibold">
                Free Delivery Inside Dhaka on all tech orders
              </p>
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white hover:text-indigo-950 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all group-hover:translate-x-1">
                Explore Tech <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Banner 3: New Arrivals in Fashion */}
          <div 
            onClick={() => onSelectCategory('Fashion & Lifestyle')}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-600 via-rose-600 to-purple-700 text-white p-6 sm:p-7 flex flex-col justify-between h-[210px] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-rose-500"
          >
            {/* Background Decorative Graphic */}
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-30 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400"
                alt="Fashion Deco"
                className="w-full h-full object-cover rounded-tl-3xl mix-blend-screen"
              />
            </div>

            <div className="relative z-10 space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-amber-200 bg-black/30 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                <Tag className="w-3 h-3" />
                Wardrobe Essentials
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                New Arrivals in Fashion
              </h3>
              <p className="text-xs text-amber-100 font-semibold">
                Buy 1 Get 1 Deals on Selected Seasonal Outfits
              </p>
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 hover:bg-white hover:text-rose-900 px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all group-hover:translate-x-1">
                Claim Offer <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
