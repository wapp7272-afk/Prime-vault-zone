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
      className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* ================= Product Image Container ================= */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#F9FAFB]">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top-Left: Discount Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent ? (
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase rounded-md bg-rose-600 text-white shadow-xs">
              {discountPercent}
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-[#EDE9FE] text-[#5B21B6] border border-purple-200 shadow-xs">
              {product.category}
            </span>
          )}

          {product.inStock === false && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-gray-900 text-white shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Top-Right: Wishlist Toggle Button */}
        {onToggleWishlist && (
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-xs cursor-pointer ${
              isWishlisted
                ? 'bg-white text-rose-500 scale-105'
                : 'bg-white/80 hover:bg-white text-gray-500 hover:text-rose-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}

        {/* Floating Quick View Eye on Hover */}
        <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/95 text-[#5B21B6] hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 shadow-md pointer-events-none">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* ================= Product Information ================= */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Seller / Store Badge */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSellerStore) {
                onOpenSellerStore(storeName);
              }
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-[#5B21B6] hover:text-[#4C1D95] hover:underline mb-1 cursor-pointer group/store text-left"
            title={`Visit ${storeName} Storefront`}
          >
            <Store className="w-3 h-3 shrink-0 text-[#5B21B6] group-hover/store:scale-110 transition-transform" />
            <span className="truncate max-w-[170px]">{storeName}</span>
          </button>

          {/* Product Title (Truncated to 2 lines max) */}
          <h3 className="text-xs sm:text-sm font-bold text-[#171717] line-clamp-2 leading-snug group-hover:text-[#5B21B6] transition-colors min-h-[34px] sm:min-h-[38px]">
            {product.title}
          </h3>

          {/* Rating, Reviews Count, and Sold Quantity Badge */}
          <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '4.9'}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount || 120})</span>
            </div>

            {/* Sold Quantity Badge */}
            <span className="text-gray-500 font-medium text-[10px] sm:text-[11px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
              {soldCount} Sold
            </span>
          </div>
        </div>

        {/* ================= Pricing & Quick Action Buttons ================= */}
        <div className="pt-2 border-t border-[#E5E7EB]/80 space-y-2">
          {/* Dynamic Pricing */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-[#5B21B6]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded hidden sm:inline">
                Save ৳{(product.originalPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={handleAdd}
              disabled={product.inStock === false}
              className={`w-full py-1.5 sm:py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                product.inStock === false
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#EDE9FE] hover:bg-purple-200 text-[#5B21B6] border border-purple-200 active:scale-95'
              }`}
              title="Add to Cart"
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="truncate">Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="truncate">Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.inStock === false}
              className={`w-full py-1.5 sm:py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-95 ${
                product.inStock === false
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#5B21B6] hover:bg-[#4C1D95] text-white'
              }`}
              title="Buy Now"
            >
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span className="truncate">Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
