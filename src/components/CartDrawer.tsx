import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Store,
  Truck,
  Gift,
  Check,
  Percent
} from 'lucide-react';
import { CartItem, UserProfile, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  user: UserProfile;
  couponCode: string;
  isCouponApplied: boolean;
  appliedCoupon?: Coupon | null;
  couponDiscount: number;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  applyWalletBonus: boolean;
  onToggleWalletBonus: (apply: boolean) => void;
  onProceedToCheckout: () => void;
  onViewOrders?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  user,
  couponCode,
  isCouponApplied,
  appliedCoupon,
  couponDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  applyWalletBonus,
  onToggleWalletBonus,
  onProceedToCheckout,
  onViewOrders,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deliveryArea, setDeliveryArea] = useState<'Inside Dhaka' | 'Outside Dhaka'>('Inside Dhaka');

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [items]);

  // Delivery charge based on area: ৳60 Inside Dhaka, ৳120 Outside Dhaka
  const deliveryCharge = deliveryArea === 'Inside Dhaka' ? 60 : 120;

  // Wallet bonus calculation: can deduct up to ৳20 from bill
  const availableBonus = Math.min(user.walletBalance, 20);
  const walletDeduction = applyWalletBonus && subtotal > 0 ? availableBonus : 0;

  // Grand Total calculation
  const grandTotal = Math.max(0, subtotal - couponDiscount - walletDeduction + (items.length > 0 ? deliveryCharge : 0));

  // Multi-Vendor grouping: group items by merchant / store name
  const vendorGroups = useMemo(() => {
    const groups: { [store: string]: CartItem[] } = {};
    items.forEach((item) => {
      const storeName = item.storeName || item.product.storeName || item.product.sellerName || (() => {
        const cat = item.product.category || '';
        if (cat.includes('Perfume') || cat === 'Attar Perfumes') return 'PerfumeVault BD';
        if (cat.includes('Gadgets') || cat === 'Glow Lights') return 'Apex Tech BD';
        if (cat.includes('Fashion')) return 'Prime Atelier';
        if (cat.includes('Watches')) return 'Chronos Official';
        if (cat.includes('Beauty')) return 'Glow & Glam BD';
        if (cat.includes('Home')) return 'Nordic Living';
        return 'Prime Vault Official';
      })();

      if (!groups[storeName]) {
        groups[storeName] = [];
      }
      groups[storeName].push({ ...item, storeName });
    });
    return groups;
  }, [items]);

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const vendorCount = Object.keys(vendorGroups).length;

  const handleApplyCoupon = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const code = (customCode || couponInput).trim().toUpperCase();
    if (!code) return;

    const res = onApplyCoupon(code);
    setCouponFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message
    });
    if (res.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponFeedback(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-2 sm:pl-10">
        <div 
          id="shopping-cart-drawer"
          className="w-full sm:w-[420px] max-w-[calc(100vw-8px)] bg-white border-l border-[#E5E7EB] shadow-2xl flex flex-col"
        >
          {/* ================= Header ================= */}
          <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#EDE9FE] text-[#5B21B6] border border-purple-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#171717] text-base sm:text-lg flex items-center gap-2">
                  <span>Shopping Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#5B21B6] border border-purple-200">
                      {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#525252]">
                  {vendorCount > 1 
                    ? `Multi-Vendor Cart (${vendorCount} Stores)` 
                    : 'Prime Vault Zone Marketplace'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-[#171717] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ================= Cart Content / Items List ================= */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center mx-auto border border-purple-200">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] text-base mb-1">আপনার শপিং কার্ট খালি আছে</h4>
                  <p className="text-xs text-[#525252] max-w-xs mx-auto">
                    আমাদের এক্সক্লুসিভ লাইফস্টাইল, পারফিউম ও গ্যাজেট কালেকশন এক্সপ্লোর করুন।
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            ) : (
              <>
                {/* Free shipping or trust announcement */}
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center gap-2.5 text-xs text-[#5B21B6]">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#5B21B6]" />
                  <span>
                    কুপন কোড <strong className="font-mono font-black">PRIME10</strong> ব্যবহারে পেয়ে যান ১০% ইনস্ট্যান্ট ডিসকাউন্ট!
                  </span>
                </div>

                {/* Multi-Vendor Grouped Product Listing */}
                <div className="space-y-5">
                  {Object.entries(vendorGroups).map(([vendorName, vendorItems]) => (
                    <div 
                      key={vendorName}
                      className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-2xs"
                    >
                      {/* Vendor Store Header */}
                      <div className="px-3.5 py-2.5 bg-[#EDE9FE]/40 border-b border-[#E5E7EB] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#5B21B6]">
                          <Store className="w-3.5 h-3.5 text-[#5B21B6]" />
                          <span className="truncate max-w-[200px]">{vendorName}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-purple-100">
                          {vendorItems.length} {vendorItems.length === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>

                      {/* Store Items */}
                      <div className="divide-y divide-gray-100 p-2 sm:p-3 space-y-2">
                        {vendorItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="pt-2 first:pt-0 flex gap-3 items-center justify-between"
                          >
                            {/* Product Thumbnail */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info & Variants */}
                            <div className="flex-1 min-w-0 pr-2">
                              <h5 className="text-xs font-bold text-[#171717] line-clamp-1">
                                {item.product.title}
                              </h5>

                              {/* Variant Attribute (Size or Volume) */}
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.selectedSize && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-[#5B21B6]">
                                    {item.selectedSize}
                                  </span>
                                )}
                                <span className="text-[11px] font-mono text-[#525252]">
                                  ৳{item.product.price.toLocaleString()}
                                </span>
                                {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ৳{item.product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {/* Total per Item */}
                              <div className="text-xs font-extrabold text-[#5B21B6] mt-1">
                                Total: ৳{(item.product.price * item.quantity).toLocaleString()}
                              </div>
                            </div>

                            {/* Quantity Controls & Delete */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-gray-50 p-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-white transition-colors cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-[#171717]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-white transition-colors cursor-pointer"
                                  title="Increase quantity"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ================= Delivery Location Selector ================= */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#171717]">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#5B21B6]" />
                      <span>Delivery Location (ডেলিভারি এলাকা)</span>
                    </span>
                    <span className="text-[#5B21B6]">৳{deliveryCharge}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('Inside Dhaka')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        deliveryArea === 'Inside Dhaka'
                          ? 'bg-white border-[#5B21B6] ring-1 ring-[#5B21B6] shadow-2xs'
                          : 'bg-white/60 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-[#171717]">Inside Dhaka</div>
                      <div className="text-[10px] text-[#5B21B6] font-semibold">৳60 (1-2 Days)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('Outside Dhaka')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        deliveryArea === 'Outside Dhaka'
                          ? 'bg-white border-[#5B21B6] ring-1 ring-[#5B21B6] shadow-2xs'
                          : 'bg-white/60 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-[#171717]">Outside Dhaka</div>
                      <div className="text-[10px] text-[#5B21B6] font-semibold">৳120 (3-5 Days)</div>
                    </button>
                  </div>
                </div>

                {/* ================= Coupon Input & Promo Suggestion ================= */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#5B21B6]" />
                      <span>Have a Promo Code?</span>
                    </span>
                    {!isCouponApplied && (
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(undefined, 'PRIME10')}
                        className="text-[11px] font-bold text-[#5B21B6] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Percent className="w-3 h-3" />
                        Apply "PRIME10"
                      </button>
                    )}
                  </div>

                  {isCouponApplied && appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="font-black text-emerald-800 uppercase tracking-wide">
                            {appliedCoupon.code} APPLIED
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            You saved ৳{couponDiscount.toLocaleString()} ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `৳${appliedCoupon.discountValue}`})
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onRemoveCoupon}
                        className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleApplyCoupon(e)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon (e.g. PRIME10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6]"
                      />
                      <button
                        type="submit"
                        disabled={!couponInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#5B21B6] disabled:bg-gray-200 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponFeedback && (
                    <p className={`text-[11px] font-semibold ${couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* ================= Wallet Bonus Deduction Toggle ================= */}
                {user.isLoggedIn && user.walletBalance > 0 && (
                  <div className="p-3 rounded-xl bg-[#EDE9FE]/50 border border-purple-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#5B21B6]" />
                      <div>
                        <span className="font-bold text-[#171717]">Wallet Balance: ৳{user.walletBalance}</span>
                        <p className="text-[10px] text-gray-500">Apply ৳{availableBonus} bonus discount</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyWalletBonus}
                        onChange={(e) => onToggleWalletBonus(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5B21B6]"></div>
                    </label>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= Footer & Financial Breakdown ================= */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E5E7EB] bg-gray-50 space-y-3">
              {/* Financial Calculation List */}
              <div className="space-y-1.5 text-xs text-[#525252]">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-bold text-[#171717]">৳{subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                {walletDeduction > 0 && (
                  <div className="flex justify-between text-purple-700 font-semibold">
                    <span>Wallet Bonus Used</span>
                    <span>-৳{walletDeduction.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charge ({deliveryArea})</span>
                  <span className="font-bold text-[#171717]">৳{deliveryCharge.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-[#171717]">Grand Total</span>
                  <span className="text-xl font-black text-[#5B21B6]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-white bg-[#5B21B6] hover:bg-[#4C1D95] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout (চেকআউট করুন)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Cash on Delivery
                </span>
                <span>•</span>
                <span>bKash / Nagad / Card</span>
                <span>•</span>
                <span>7 Days Replacement</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
