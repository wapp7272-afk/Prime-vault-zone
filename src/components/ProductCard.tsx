import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Eye, Zap, Heart, Store } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
  onOpenSellerStore?: (storeNameOrSlug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onBuyNow,
  isWishlisted = false,
  onToggleWishlist,
  onOpenSellerStore,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    } else {
      onAddToCart(product);
      onQuickView(product);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  // Derive merchant store name consistently
  const storeName = product.storeName || product.sellerName || (() => {
    if (product.category.includes('Perfume') || product.category === 'Attar Perfumes') return 'PerfumeVault BD';
    if (product.category.includes('Gadgets') || product.category === 'Glow Lights') return 'Apex Tech BD';
    if (product.category.includes('Fashion')) return 'Prime Atelier';
    if (product.category.includes('Watches')) return 'Chronos Official';
    if (product.category.includes('Beauty')) return 'Glow & Glam BD';
    if (product.category.includes('Home')) return 'Nordic Living';
    return 'Prime Vault Official';
  })();

  // Discount is strictly calculated only when an explicit Original Price is present and greater than Sale Price
  const hasValidDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasValidDiscount
    ? `-${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%`
    : null;

  // Calculate or retrieve sold count
  const soldCount = product.soldCount || (() => {
    const charCodeSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 80 + (charCodeSum % 420);
  })();

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col justify-between rounded-lg overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-xs cursor-pointer"
    >
      {/* ================= Product Image Container ================= */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top-Left: Subtle Discount or Stock Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-600 text-white tracking-tight">
              {discountPercent}
            </span>
          )}

          {product.inStock === false && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase rounded bg-slate-900/90 text-white">
              Out of Stock
            </span>
          )}
        </div>

        {/* Top-Right: Wishlist Toggle Button */}
        {onToggleWishlist && (
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200/80 transition-colors z-10 flex items-center justify-center cursor-pointer ${
              isWishlisted
                ? 'text-rose-500'
                : 'text-slate-400 hover:text-rose-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}

        {/* Floating Quick View on Hover */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white text-slate-700 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xs pointer-events-none border border-slate-200">
          <Eye className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ================= Product Information ================= */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Category & Store Meta */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-1">
            <span className="truncate uppercase tracking-wider text-[10px] font-semibold text-slate-400">
              {product.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenSellerStore) {
                  onOpenSellerStore(storeName);
                }
              }}
              className="hover:text-[#4F46E5] truncate max-w-[120px] transition-colors cursor-pointer text-right text-[10px]"
              title={`Visit ${storeName} Storefront`}
            >
              {storeName}
            </button>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-[#4F46E5] transition-colors min-h-[34px] sm:min-h-[38px]">
            {product.title}
          </h3>

          {/* Rating & Sold Count */}
          <div className="flex items-center justify-between text-[11px] mt-1 text-slate-500">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-semibold text-xs">{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
              <span className="text-slate-400">({product.reviewsCount || 120})</span>
            </div>

            <span className="text-slate-400 text-[10px] tabular-nums">
              {soldCount} sold
            </span>
          </div>
        </div>

        {/* ================= Pricing & Action Buttons ================= */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Dynamic Pricing */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[#0F172A] font-mono tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through tabular-nums">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-medium text-emerald-600">
                -৳{(product.originalPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleAdd}
              disabled={product.inStock === false}
              className={`w-full py-1.5 px-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                product.inStock === false
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-98'
              }`}
              title="Add to Cart"
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" />
                  <span className="truncate">Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.inStock === false}
              className={`w-full py-1.5 px-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-none active:scale-98 ${
                product.inStock === false
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'
              }`}
              title="Buy Now"
            >
              <Zap className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="truncate">Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
