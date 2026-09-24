import React, { useState } from 'react';
import { X, Star, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
      onClose();
    } else {
      handleAddToCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        id="product-details-modal"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#151c2c] rounded-2xl border border-[#1e293b] p-5 sm:p-7 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#0b0f19] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] border border-[#1e293b] transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Product Image */}
          <div className="relative rounded-xl overflow-hidden aspect-square bg-[#0b0f19] border border-[#1e293b]">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.tag && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-md bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 shadow-lg">
                {product.tag}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider font-bold text-[#38bdf8] mb-1">
              {product.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#f8fafc] mb-2 leading-snug">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-[#fbbf24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#fbbf24]" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#f8fafc]">{product.rating}</span>
              <span className="text-xs text-[#94a3b8]">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-black text-[#f8fafc] font-mono">
                ৳{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#94a3b8] line-through font-mono">
                  ৳{product.originalPrice}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-bold text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/30 px-2 py-0.5 rounded-full">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% (Save ৳{product.originalPrice - product.price})
                </span>
              )}
            </div>

            {/* Stock Status Indicator */}
            <div className="mb-4">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  In Stock • Ready to Dispatch
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-950/50 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Out of Stock • সাময়িকভাবে স্টক শেষ
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#94a3b8] mb-5 leading-relaxed">
              {product.description}
            </p>

            {/* Features Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#94a3b8]">
                  <Zap className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Quantity Selector & Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-[#1e293b]">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-xs text-slate-400 font-medium sm:hidden">পরিমাণ:</span>
                <div className="flex items-center bg-[#0b0f19] border border-[#1e293b] rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-[#38bdf8]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    !product.inStock
                      ? 'bg-slate-900 border border-[#1e293b] text-slate-500 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : 'bg-[#38bdf8] hover:bg-[#0284c7] text-slate-950 font-black shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                  }`}
                >
                  {!product.inStock ? (
                    <span>Out of Stock (স্টক শেষ)</span>
                  ) : added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span className="truncate">Add to Cart • ৳{product.price * quantity}</span>
                    </>
                  )}
                </button>

                {product.inStock && (
                  <button
                    id="modal-buy-now-btn"
                    onClick={handleBuyNow}
                    className="py-3 px-4 sm:px-5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#f59e0b] hover:brightness-110 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Buy Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#94a3b8] mt-5 pt-3 border-t border-[#1e293b]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>100% Original</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#fbbf24]" />
                <span>Fast Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>7 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
