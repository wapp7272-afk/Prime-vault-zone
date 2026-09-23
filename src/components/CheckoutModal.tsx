import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Check, 
  MapPin, 
  Phone, 
  User, 
  Copy, 
  Truck, 
  AlertCircle,
  Download,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building2,
  FileText,
  Clock,
  ArrowRight,
  Store,
  DollarSign,
  Smartphone,
  ChevronRight,
  Zap,
  Bookmark
} from 'lucide-react';
import { CartItem, UserProfile, Order, Coupon, Address } from '../types';
import { sendOrderEmail } from '../lib/emailService';

// Popular Bangladesh districts for quick selection
const BD_DISTRICTS = [
  'Dhaka',
  'Chattogram',
  'Gazipur',
  'Narayanganj',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Rangpur',
  'Mymensingh',
  'Cumilla',
  'Cox\'s Bazar',
  'Bogura',
  'Jashore',
  'Dinajpur',
  'Tangail',
  'Faridpur',
  'Pabna',
  'Kushtia',
  'Noakhali',
  'Feni',
  'Brahmanbaria',
  'Other / অন্যান্য জেলা'
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: UserProfile;
  subtotal: number;
  couponDiscount: number;
  walletDeducted: number;
  couponCode?: string;
  isCouponApplied?: boolean;
  appliedCoupon?: Coupon | null;
  onApplyCoupon?: (code: string) => { success: boolean; message: string };
  onRemoveCoupon?: () => void;
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
  onViewOrders?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  subtotal,
  couponDiscount,
  walletDeducted,
  couponCode = '',
  isCouponApplied = false,
  appliedCoupon = null,
  onApplyCoupon,
  onRemoveCoupon,
  onPlaceOrder,
  onClearCart,
  onViewOrders,
}) => {
  // Step 1: Address Book & Quick Entry State
  const [addressMode, setAddressMode] = useState<'saved' | 'new'>('saved');
  const [selectedSavedIndex, setSelectedSavedIndex] = useState<number>(0);

  const savedAddressesList: Address[] = useMemo(() => {
    const list: Address[] = [];
    if (user.address?.fullName && user.address?.fullAddress) {
      list.push(user.address);
    }
    if (user.savedAddresses && user.savedAddresses.length > 0) {
      user.savedAddresses.forEach((addr) => {
        if (!list.some((a) => a.fullAddress === addr.fullAddress && a.phone === addr.phone)) {
          list.push(addr);
        }
      });
    }
    return list;
  }, [user]);

  const [fullName, setFullName] = useState(user.address?.fullName || user.name || '');
  const [phone, setPhone] = useState(user.address?.phone || user.phone || '');
  const [district, setDistrict] = useState<string>(user.address?.district || 'Dhaka');
  const [cityDivision, setCityDivision] = useState<'Inside Dhaka' | 'Outside Dhaka'>(
    user.address?.cityDivision || 'Inside Dhaka'
  );
  const [fullAddress, setFullAddress] = useState(user.address?.fullAddress || '');
  const [notes, setNotes] = useState(user.address?.notes || '');

  // Step 2: Delivery Area: 'Inside Dhaka' (৳60) vs 'Outside Dhaka' (৳120)
  // Step 3: Payment Method Options: 'cod' | 'bkash' | 'nagad' | 'card'
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [trxId, setTrxId] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [inputCouponCode, setInputCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when saved addresses or user changes
  useEffect(() => {
    if (savedAddressesList.length > 0 && addressMode === 'saved') {
      const active = savedAddressesList[selectedSavedIndex] || savedAddressesList[0];
      if (active) {
        setFullName(active.fullName);
        setPhone(active.phone);
        setDistrict(active.district || 'Dhaka');
        setCityDivision(active.cityDivision);
        setFullAddress(active.fullAddress);
        setNotes(active.notes || '');
      }
    }
  }, [addressMode, selectedSavedIndex, savedAddressesList]);

  // Handle District Change & update shipping fee automatically
  const handleDistrictChange = (selectedDist: string) => {
    setDistrict(selectedDist);
    if (selectedDist === 'Dhaka') {
      setCityDivision('Inside Dhaka');
    } else {
      setCityDivision('Outside Dhaka');
    }
  };

  // Handle Direct Shipping Fee toggle
  const handleShippingChange = (division: 'Inside Dhaka' | 'Outside Dhaka') => {
    setCityDivision(division);
    if (division === 'Inside Dhaka' && district !== 'Dhaka') {
      setDistrict('Dhaka');
    } else if (division === 'Outside Dhaka' && district === 'Dhaka') {
      setDistrict('Chattogram');
    }
  };

  // Multi-vendor grouping for order review
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

  if (!isOpen) return null;

  // Dynamic Shipping Fee: ৳60 Inside Dhaka, ৳120 Outside Dhaka
  const deliveryFee = cityDivision === 'Inside Dhaka' ? 60 : 120;
  const grandTotal = Math.max(0, subtotal - couponDiscount - walletDeducted + deliveryFee);

  const bkashNumber = '01883418309';
  const nagadNumber = '01883418309';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  // Handle Coupon Apply
  const handleApply = (codeToApply?: string) => {
    const code = (codeToApply || inputCouponCode).trim().toUpperCase();
    if (!code) {
      setCouponFeedback({ type: 'error', message: 'অনুগ্রহ করে কুপন কোড লিখুন' });
      return;
    }
    if (!onApplyCoupon) return;

    const res = onApplyCoupon(code);
    setCouponFeedback({
      type: res.success ? 'success' : 'error',
      message: res.message,
    });
    if (res.success) {
      setInputCouponCode('');
    }
  };

  // Format Date & Time: e.g. "23 Sep 2026, 03:15 PM"
  const generateOrderTimestamp = (): string => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('অনুগ্রহ করে আপনার পূর্ণ নাম প্রদান করুন।');
      return;
    }

    const cleanPhone = phone.trim().replace(/[-+\s]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)।');
      return;
    }

    if (!fullAddress.trim() || fullAddress.trim().length < 6) {
      alert('অনুগ্রহ করে পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন (বাড়ি নং, রোড নং, এলাকা / থানা)।');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !trxId.trim()) {
      alert(`অনুগ্রহ করে আপনার ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Transaction ID (TrxID) ইনপুট দিন।`);
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardInfo.cardNumber.trim() || cardInfo.cardNumber.replace(/\s/g, '').length < 16) {
        alert('অনুগ্রহ করে আপনার ১৬ ডিজিটের কার্ড নম্বর দিন।');
        return;
      }
      if (!cardInfo.expiry.trim() || !cardInfo.cvv.trim()) {
        alert('অনুগ্রহ করে কার্ডের মেয়াদ (MM/YY) এবং CVV প্রদান করুন।');
        return;
      }
    }

    setIsSubmitting(true);

    // Generate unique Order ID in the format #PVZ-8492
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const orderId = `#PVZ-${randomDigits}`;
    const orderTimestamp = generateOrderTimestamp();

    const newOrder: Order = {
      id: orderId,
      date: orderTimestamp,
      items: [...items],
      subtotal,
      discount: couponDiscount,
      walletDeducted,
      deliveryFee,
      total: grandTotal,
      paymentMethod,
      trxId: trxId.trim() || undefined,
      address: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        district,
        cityDivision,
        fullAddress: fullAddress.trim(),
        notes: notes.trim() || undefined,
      },
      status: 'Confirmed',
    };

    // Send order confirmation email via EmailJS (if configured)
    sendOrderEmail(newOrder, user.email || undefined);

    setTimeout(() => {
      onPlaceOrder(newOrder);
      setCompletedOrder(newOrder);
      onClearCart();
      setIsSubmitting(false);
    }, 600);
  };

  const handleModalClose = () => {
    if (completedOrder) {
      setCompletedOrder(null);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="checkout-modal-container"
        className="relative w-full max-w-4xl my-6 bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto text-[#171717]"
      >
        {/* Close button */}
        <button
          id="checkout-close-btn"
          onClick={handleModalClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 hover:text-[#171717] hover:bg-gray-200 transition-colors z-20 cursor-pointer"
          aria-label="Close Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================== ORDER SUCCESS SCREEN ==================== */}
        {completedOrder ? (
          <div className="text-center py-6 space-y-6">
            {/* Animated Celebration Icon */}
            <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-10 h-10 text-emerald-600 stroke-[2.5]" />
              <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping pointer-events-none opacity-40" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Order Confirmed & Placed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717]">
                ধন্যবাদ! আপনার অর্ডার সফল হয়েছে
              </h2>
              <p className="text-xs sm:text-sm text-[#525252] mt-1.5">
                আপনার অর্ডারটি দ্রুততম সময়ে ডেলিভারির জন্য প্রস্তুত করা হচ্ছে।
              </p>
            </div>

            {/* Order ID & Timestamp Bar */}
            <div className="p-3.5 rounded-2xl bg-[#EDE9FE]/50 border border-purple-200 flex flex-wrap items-center justify-between gap-3 text-xs max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <span className="text-[#525252] font-semibold">Order ID:</span>
                <span className="font-mono font-black text-[#5B21B6] text-sm sm:text-base">
                  {completedOrder.id}
                </span>
                <button
                  onClick={() => copyOrderId(completedOrder.id)}
                  className="p-1 text-gray-500 hover:text-[#5B21B6] transition-colors cursor-pointer"
                  title="Copy Order ID"
                >
                  {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-gray-600 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>{completedOrder.date}</span>
              </div>
            </div>

            {/* Ordered Items Preview */}
            <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 text-left max-w-xl mx-auto space-y-3 shadow-2xs">
              <h4 className="text-xs font-bold text-[#171717] flex items-center justify-between pb-2 border-b border-gray-100">
                <span>অর্ডারকৃত পণ্যসমূহ ({completedOrder.items.reduce((s, i) => s + i.quantity, 0)} টি)</span>
                <span className="text-[#5B21B6] font-mono text-[11px] font-bold">PRIME VAULT ZONE</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs py-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-11 h-11 rounded-xl object-cover bg-gray-50 border border-gray-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#171717] truncate text-xs">{item.product.title}</p>
                        <p className="text-[11px] text-[#525252] font-mono">
                          ৳{item.product.price.toLocaleString()} × {item.quantity}
                          {item.selectedSize && ` (${item.selectedSize})`}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-[#5B21B6] text-xs shrink-0">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Receipt Card */}
            <div className="rounded-2xl bg-gray-50 border border-[#E5E7EB] p-4 text-left text-xs space-y-2.5 max-w-xl mx-auto">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">ডেলিভারি প্রাপক:</span>
                <span className="text-[#171717] font-bold">
                  {completedOrder.address.fullName} ({completedOrder.address.phone})
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">ডেলিভারি ঠিকানা:</span>
                <span className="text-[#171717] text-right max-w-[280px] font-medium">
                  {completedOrder.address.fullAddress}, {completedOrder.address.district || completedOrder.address.cityDivision}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">পেমেন্ট মেথড:</span>
                <span className="text-[#5B21B6] font-bold uppercase">
                  {completedOrder.paymentMethod === 'cod' 
                    ? 'Cash on Delivery (COD)' 
                    : completedOrder.paymentMethod === 'card'
                    ? 'Credit / Debit Card'
                    : `${completedOrder.paymentMethod.toUpperCase()} (TrxID: ${completedOrder.trxId})`}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-[#171717]">সর্বমোট পরিশোধযোগ্য:</span>
                <span className="font-black text-[#5B21B6] text-base">
                  ৳{completedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto pt-2">
              {onViewOrders && (
                <button
                  onClick={() => {
                    handleModalClose();
                    onViewOrders();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Track Order / আমার অর্ডারসমূহ</span>
                </button>
              )}

              <button
                onClick={handleModalClose}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#171717] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#5B21B6]" />
                <span>Continue Shopping (আরও কিনুন)</span>
              </button>
            </div>
          </div>
        ) : (
          /* ==================== ACTIVE 4-STEP CHECKOUT FORM ==================== */
          <div>
            {/* Modal Title */}
            <div className="pb-5 mb-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#EDE9FE] text-[#5B21B6] border border-purple-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#171717]">
                    Smart Checkout & Secure Payment
                  </h2>
                  <p className="text-xs text-[#525252]">
                    নিরাপদ ও দ্রুত চেকআউট • সারা বাংলাদেশে ক্যাশ অন ডেলিভারি এবং ইনস্ট্যান্ট পেমেন্ট
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                
                {/* ========================================================
                    LEFT COLUMN: 3 STEPS (Address, Shipping Area, Payment)
                    ======================================================== */}
                <div className="lg:col-span-7 space-y-6">

                  {/* ================= STEP 1: DELIVERY ADDRESS ================= */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE9FE]/20 border border-purple-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-xs font-black">
                          1
                        </span>
                        <h3 className="text-sm font-extrabold text-[#171717] flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#5B21B6]" />
                          <span>Delivery Address (ডেলিভারি ঠিকানা)</span>
                        </h3>
                      </div>

                      {/* Saved Address Toggle (if user has address saved) */}
                      {savedAddressesList.length > 0 && (
                        <div className="flex items-center p-0.5 rounded-lg bg-gray-100 border border-gray-200 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setAddressMode('saved')}
                            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              addressMode === 'saved'
                                ? 'bg-white text-[#5B21B6] shadow-xs'
                                : 'text-gray-500 hover:text-[#171717]'
                            }`}
                          >
                            Saved Book
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAddressMode('new');
                              setFullName('');
                              setPhone('');
                              setFullAddress('');
                            }}
                            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                              addressMode === 'new'
                                ? 'bg-white text-[#5B21B6] shadow-xs'
                                : 'text-gray-500 hover:text-[#171717]'
                            }`}
                          >
                            New Address
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Saved addresses selector */}
                    {addressMode === 'saved' && savedAddressesList.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                          Select Saved Address:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {savedAddressesList.map((addr, idx) => (
                            <div
                              key={idx}
                              onClick={() => setSelectedSavedIndex(idx)}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                selectedSavedIndex === idx
                                  ? 'bg-white border-[#5B21B6] ring-2 ring-purple-200 shadow-xs'
                                  : 'bg-white/80 border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="font-bold text-[#171717] flex items-center justify-between">
                                <span className="truncate">{addr.fullName}</span>
                                <Bookmark className="w-3.5 h-3.5 text-[#5B21B6]" />
                              </div>
                              <div className="text-gray-500 text-[11px] mt-0.5">{addr.phone}</div>
                              <div className="text-gray-600 text-[11px] truncate mt-1">{addr.fullAddress}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address Form Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">
                          Full Name (পূর্ণ নাম) *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="আপনার নাম লিখুন"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">
                          Mobile Phone (মোবাইল নম্বর) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="01XXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-[#171717] block mb-1">
                          District / জেলা *
                        </label>
                        <select
                          value={district}
                          onChange={(e) => handleDistrictChange(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] bg-white cursor-pointer"
                        >
                          {BD_DISTRICTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-[#171717] block mb-1">
                          Full Delivery Address (বাড়ি নং, রোড নং, এলাকা / থানা) *
                        </label>
                        <textarea
                          required
                          rows={2}
                          placeholder="উদাহরণ: বাসা # ১২, রোড # ৪, সেক্টর # ৭, উত্তরা, ঢাকা"
                          value={fullAddress}
                          onChange={(e) => setFullAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] bg-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-medium text-gray-500 block mb-1">
                          Order Note / বিশেষ নির্দেশনা (ঐচ্ছিক)
                        </label>
                        <input
                          type="text"
                          placeholder="ডেলিভারির সময় বা বিশেষ কোনো অনুরোধ থাকলে লিখুন"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-[#171717] focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ================= STEP 2: DELIVERY AREA SELECTION ================= */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-xs font-black">
                        2
                      </span>
                      <h3 className="text-sm font-extrabold text-[#171717] flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#5B21B6]" />
                        <span>Delivery Area & Shipping Speed</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Inside Dhaka */}
                      <div
                        onClick={() => handleShippingChange('Inside Dhaka')}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          cityDivision === 'Inside Dhaka'
                            ? 'bg-[#EDE9FE]/50 border-[#5B21B6] ring-2 ring-purple-200'
                            : 'bg-white border-[#E5E7EB] hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs text-[#171717] flex items-center gap-1.5">
                            <span className="text-base">🏙️</span>
                            <span>Inside Dhaka (ঢাকার ভিতরে)</span>
                          </span>
                          <span className="text-sm font-black text-[#5B21B6]">৳60</span>
                        </div>
                        <p className="text-[11px] text-[#525252]">
                          দ্রুততম হোম ডেলিভারি: ১-২ কার্যদিবস
                        </p>
                      </div>

                      {/* Outside Dhaka */}
                      <div
                        onClick={() => handleShippingChange('Outside Dhaka')}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          cityDivision === 'Outside Dhaka'
                            ? 'bg-[#EDE9FE]/50 border-[#5B21B6] ring-2 ring-purple-200'
                            : 'bg-white border-[#E5E7EB] hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-xs text-[#171717] flex items-center gap-1.5">
                            <span className="text-base">🚚</span>
                            <span>Outside Dhaka (ঢাকার বাইরে)</span>
                          </span>
                          <span className="text-sm font-black text-[#5B21B6]">৳120</span>
                        </div>
                        <p className="text-[11px] text-[#525252]">
                          সারা বাংলাদেশে হোম ডেলিভারি: ৩-৫ কার্যদিবস
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ================= STEP 3: PAYMENT METHOD OPTIONS ================= */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5B21B6] text-white flex items-center justify-center text-xs font-black">
                        3
                      </span>
                      <h3 className="text-sm font-extrabold text-[#171717] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#5B21B6]" />
                        <span>Select Payment Method (পেমেন্ট পদ্ধতি)</span>
                      </h3>
                    </div>

                    {/* 4 Payment Options Radio Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {/* COD */}
                      <div
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'cod'
                            ? 'bg-[#EDE9FE] border-[#5B21B6] ring-1 ring-[#5B21B6]'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-2xl">💵</span>
                        <div className="font-bold text-xs text-[#171717]">Cash on Delivery</div>
                        <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                          0% Advance
                        </span>
                      </div>

                      {/* bKash */}
                      <div
                        onClick={() => setPaymentMethod('bkash')}
                        className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'bkash'
                            ? 'bg-[#EDE9FE] border-[#5B21B6] ring-1 ring-[#5B21B6]'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-2xl">📱</span>
                        <div className="font-bold text-xs text-[#171717]">bKash Direct</div>
                        <span className="text-[9px] text-pink-700 font-semibold bg-pink-100 px-1.5 py-0.5 rounded">
                          Instant Trx
                        </span>
                      </div>

                      {/* Nagad */}
                      <div
                        onClick={() => setPaymentMethod('nagad')}
                        className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'nagad'
                            ? 'bg-[#EDE9FE] border-[#5B21B6] ring-1 ring-[#5B21B6]'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-2xl">⚡</span>
                        <div className="font-bold text-xs text-[#171717]">Nagad Payment</div>
                        <span className="text-[9px] text-orange-700 font-semibold bg-orange-100 px-1.5 py-0.5 rounded">
                          Fast & Secure
                        </span>
                      </div>

                      {/* Card */}
                      <div
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'card'
                            ? 'bg-[#EDE9FE] border-[#5B21B6] ring-1 ring-[#5B21B6]'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className="text-2xl">💳</span>
                        <div className="font-bold text-xs text-[#171717]">Credit / Debit</div>
                        <span className="text-[9px] text-blue-700 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">
                          Visa / Master
                        </span>
                      </div>
                    </div>

                    {/* Detailed info panel per payment method */}
                    {paymentMethod === 'cod' && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <p className="font-bold">✓ Cash on Delivery (ক্যাশ অন ডেলিভারি)</p>
                        <p className="text-[11px] text-emerald-800">
                          কোনো প্রকার অগ্রিম পেমেন্টের প্রয়োজন নেই। ডেলিভারিম্যান পণ্য বুঝিয়ে দেওয়ার পর টাকা প্রদান করুন।
                        </p>
                      </div>
                    )}

                    {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                      <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#171717]">
                            {paymentMethod === 'bkash' ? 'bKash Merchant / Personal' : 'Nagad Payment'} Account:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-[#5B21B6] text-sm">
                              {paymentMethod === 'bkash' ? bkashNumber : nagadNumber}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paymentMethod === 'bkash' ? bkashNumber : nagadNumber)}
                              className="p-1 rounded bg-white border border-purple-200 text-[#5B21B6] hover:bg-purple-100 cursor-pointer"
                              title="Copy number"
                            >
                              {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          ১. আপনার {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} অ্যাপ থেকে সেন্ড মানি বা পেমেন্ট করুন।<br/>
                          ২. সর্বমোট পরিমাণ: <strong>৳{grandTotal.toLocaleString()}</strong><br/>
                          ৩. পেমেন্ট সম্পন্ন হওয়ার পর পাওয়া Transaction ID (TrxID) নিচে লিখুন:
                        </p>

                        <div>
                          <label className="text-xs font-bold text-[#171717] block mb-1">
                            Transaction ID (TrxID) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 9J8B7X6W5"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono uppercase text-xs focus:outline-none focus:border-[#5B21B6] bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#171717]">Card Details (SSL 256-bit Encrypted)</span>
                          <span className="text-[11px] text-gray-500">Visa / Mastercard / AMEX</span>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-[#171717] block mb-1">Card Number *</label>
                          <input
                            type="text"
                            placeholder="xxxx xxxx xxxx xxxx"
                            maxLength={19}
                            value={cardInfo.cardNumber}
                            onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#5B21B6] bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#171717] block mb-1">Expiry (MM/YY) *</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardInfo.expiry}
                              onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#5B21B6] bg-white"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#171717] block mb-1">CVV / CVC *</label>
                            <input
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              value={cardInfo.cvv}
                              onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs focus:outline-none focus:border-[#5B21B6] bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ========================================================
                    RIGHT COLUMN: ORDER SUMMARY CARD & STEP 4 CONFIRM CTA
                    ======================================================== */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl bg-gray-50 border border-[#E5E7EB] p-4 sm:p-5 space-y-4 sticky top-6">
                    <h3 className="text-sm font-extrabold text-[#171717] flex items-center justify-between pb-3 border-b border-gray-200">
                      <span>Order Summary (অর্ডার সামারি)</span>
                      <span className="text-xs font-bold text-[#5B21B6] bg-[#EDE9FE] px-2 py-0.5 rounded-full border border-purple-200">
                        {items.reduce((s, i) => s + i.quantity, 0)} Items
                      </span>
                    </h3>

                    {/* Multi-Vendor Cart Items Preview */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {Object.entries(vendorGroups).map(([vendor, vendorItems]) => (
                        <div key={vendor} className="space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5B21B6]">
                            <Store className="w-3 h-3" />
                            <span>{vendor}</span>
                          </div>

                          {vendorItems.map((item) => (
                            <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                <img
                                  src={item.product.image}
                                  alt={item.product.title}
                                  className="w-8 h-8 rounded-lg object-cover bg-white border border-gray-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#171717] truncate">{item.product.title}</p>
                                  <p className="text-[10px] text-gray-500">
                                    Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-[#171717] shrink-0">
                                ৳{(item.product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input Inside Summary */}
                    <div className="pt-2 border-t border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#171717] flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#5B21B6]" />
                          <span>Promo Code</span>
                        </span>
                        {!isCouponApplied && (
                          <button
                            type="button"
                            onClick={() => handleApply('PRIME10')}
                            className="text-[11px] font-bold text-[#5B21B6] hover:underline cursor-pointer"
                          >
                            Use "PRIME10"
                          </button>
                        )}
                      </div>

                      {isCouponApplied && appliedCoupon ? (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                          <span className="font-bold text-emerald-800 uppercase">
                            {appliedCoupon.code} (-৳{couponDiscount.toLocaleString()})
                          </span>
                          <button
                            type="button"
                            onClick={onRemoveCoupon}
                            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter promo code"
                            value={inputCouponCode}
                            onChange={(e) => setInputCouponCode(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono uppercase bg-white focus:outline-none focus:border-[#5B21B6]"
                          />
                          <button
                            type="button"
                            onClick={() => handleApply()}
                            className="px-3 py-1.5 rounded-lg bg-[#5B21B6] text-white text-xs font-bold hover:bg-[#4C1D95] cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      )}

                      {couponFeedback && (
                        <p className={`text-[10px] font-semibold ${couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {couponFeedback.message}
                        </p>
                      )}
                    </div>

                    {/* Financial Calculations */}
                    <div className="pt-2 border-t border-gray-200 space-y-1.5 text-xs text-[#525252]">
                      <div className="flex justify-between">
                        <span>Subtotal (সাবটোটাল)</span>
                        <span className="font-bold text-[#171717]">৳{subtotal.toLocaleString()}</span>
                      </div>

                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Coupon Discount (ছাড়)</span>
                          <span>-৳{couponDiscount.toLocaleString()}</span>
                        </div>
                      )}

                      {walletDeducted > 0 && (
                        <div className="flex justify-between text-purple-700 font-semibold">
                          <span>Wallet Bonus Used</span>
                          <span>-৳{walletDeducted.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Delivery Fee ({cityDivision})</span>
                        <span className="font-bold text-[#171717]">৳{deliveryFee.toLocaleString()}</span>
                      </div>

                      {/* GRAND TOTAL */}
                      <div className="pt-2.5 border-t border-gray-200 flex justify-between items-baseline">
                        <div>
                          <span className="text-sm font-extrabold text-[#171717] block">Grand Total</span>
                          <span className="text-[10px] text-gray-500">VAT & Taxes Included</span>
                        </div>
                        <span className="text-2xl font-black text-[#5B21B6]">
                          ৳{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* ================= STEP 4: PLACE ORDER CTA ================= */}
                    <button
                      id="checkout-confirm-order-btn"
                      type="submit"
                      disabled={isSubmitting || items.length === 0}
                      className="w-full py-4 px-4 rounded-xl font-black text-white bg-[#5B21B6] hover:bg-[#4C1D95] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-98"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                          <span>Confirm Order (অর্ডার নিশ্চিত করুন)</span>
                        </>
                      )}
                    </button>

                    <div className="pt-1 text-center text-[10px] text-gray-500 space-y-1">
                      <p className="flex items-center justify-center gap-1 text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>১০০% নিরাপদ ও সুরক্ষিত চেকআউট গ্যারান্টি</span>
                      </p>
                      <p>অর্ডার সংক্রান্ত কোনো সমস্যায় ২৪/৭ লাইভ সাপোর্ট কল: 01883418309</p>
                    </div>

                  </div>
                </div>

              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
