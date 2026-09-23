import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ShoppingBag, 
  Zap, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  Share2,
  Flame,
  Award,
  Video,
  Store,
  UserCheck,
  MapPin,
  ChevronRight,
  ThumbsUp,
  Tag
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailViewProps {
  product: Product;
  onBackToShop: () => void;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedSize?: string) => void;
  onOpenSellerStore?: (sellerName: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBackToShop,
  onAddToCart,
  onBuyNow,
  onOpenSellerStore,
  isWishlisted: externalWishlisted,
  onToggleWishlist,
}) => {
  // Gallery images list (fallback to high-res images if none provided)
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [
        product.image,
        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
      ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [infoTab, setInfoTab] = useState<'specs' | 'fragrance' | 'reviews'>('specs');

  // Variant (Size) selection
  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['50ml', '100ml'];
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '100ml');

  // Quantity selection
  const [quantity, setQuantity] = useState(1);
  const [internalWishlisted, setInternalWishlisted] = useState(false);
  const isWishlisted = externalWishlisted !== undefined ? externalWishlisted : internalWishlisted;

  const [copySuccess, setCopySuccess] = useState(false);
  const [isFollowingStore, setIsFollowingStore] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<'inside' | 'outside'>('inside');

  // Video Player state & refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted to ensure autoplay works smoothly
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reliable video source fallback
  const fallbackVideo = 'https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-in-a-dark-setting-41710-large.mp4';
  const videoSource = product.videoUrl || fallbackVideo;

  const youtubeEmbedUrl = React.useMemo(() => {
    if (!product.videoUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = product.videoUrl.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}`
      : null;
  }, [product.videoUrl]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Video autoplay policy handling
  useEffect(() => {
    if (activeMediaTab !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeMediaTab, videoSource]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTo = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTo;
    setCurrentTime(seekTo);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    } else {
      setInternalWishlisted(prev => !prev);
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

  // Calculate or retrieve sold count
  const soldCount = product.soldCount || (() => {
    const charCodeSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 80 + (charCodeSum % 420);
  })();

  // Size-adjusted pricing calculation
  const sizeMultiplier = selectedSize.includes('50ml') ? 0.85 : selectedSize.includes('150ml') ? 1.35 : 1;
  const unitPrice = Math.round(product.price * sizeMultiplier);
  const originalPrice = product.originalPrice 
    ? Math.round(product.originalPrice * sizeMultiplier)
    : Math.round(unitPrice * 1.25);
  const savings = Math.max(0, originalPrice - unitPrice);
  const discountLabel = product.discount || `${Math.round(((originalPrice - unitPrice) / originalPrice) * 100)}% OFF`;

  const shippingCost = deliveryLocation === 'inside' ? 60 : 120;
  const estimatedDelivery = deliveryLocation === 'inside' ? '1-2 Days (Inside Dhaka)' : '3-5 Days (Outside Dhaka)';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* ================= Breadcrumb Navigation ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#525252]">
            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-1.5 font-bold text-[#5B21B6] hover:text-[#4C1D95] hover:underline cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Shop</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="hover:text-[#171717] cursor-pointer" onClick={onBackToShop}>Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-[#171717] cursor-pointer" onClick={onBackToShop}>{product.category}</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-[#171717] truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-gray-50 border-[#E5E7EB] text-gray-500 hover:text-rose-600 hover:bg-rose-50'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-gray-50 border border-[#E5E7EB] hover:bg-gray-100 text-gray-600 transition-all relative cursor-pointer"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
              {copySuccess && (
                <span className="absolute -bottom-8 right-0 bg-[#5B21B6] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ================= Main 2-Column Product Layout ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* ========================================================
              LEFT COLUMN: MEDIA SECTION (Multi-Image Gallery & AI Video)
              ======================================================== */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Media Mode Tabs: Photos vs AI Video Review */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100 border border-[#E5E7EB] w-fit">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'photos'
                    ? 'bg-[#5B21B6] text-white shadow-xs'
                    : 'text-[#525252] hover:text-[#171717]'
                }`}
              >
                <span>Product Photos ({images.length})</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-[#525252] hover:text-amber-600'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>AI Video Review</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* TAB 1: Photo Gallery & Thumbnails */}
            {activeMediaTab === 'photos' ? (
              <div className="space-y-4">
                {/* Main Active Image Viewport */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB] group shadow-xs">
                  <img
                    src={images[selectedImageIndex] || product.image}
                    alt={product.title}
                    className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                  />

                  {/* Badges Over Image */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      In Stock & Verified Authentic
                    </span>
                  </div>

                  {discountLabel && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-xs">
                        {discountLabel}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs border border-gray-200 text-[11px] text-gray-600 font-medium pointer-events-none">
                    Image {selectedImageIndex + 1} of {images.length}
                  </div>
                </div>

                {/* Thumbnails Carousel Row */}
                <div className="grid grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-gray-50 border transition-all duration-200 cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#5B21B6] ring-2 ring-purple-200 scale-95 shadow-sm'
                          : 'border-[#E5E7EB] opacity-75 hover:opacity-100 hover:border-purple-300'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* TAB 2: Dedicated AI Video Player Showcase */
              <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden p-4 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      AI Ultra HD Video Review • 360° Showcase
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-purple-300 border border-purple-800">
                    1080p HD
                  </span>
                </div>

                {/* HTML5 Video Player Container */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-gray-800 group">
                  {youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title={product.title}
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        src={videoSource}
                        poster={product.videoPoster || product.image}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                        className="w-full h-full object-cover cursor-pointer"
                      />

                      {!isPlaying && (
                        <div 
                          onClick={togglePlay}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Video Controls Bar */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-gray-700 accent-amber-400 rounded-lg cursor-pointer"
                        />

                        <div className="flex items-center justify-between text-xs text-white">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={togglePlay}
                              className="text-white hover:text-amber-400 transition-colors p-1 cursor-pointer"
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={toggleMute}
                              className="text-white hover:text-amber-400 transition-colors p-1 flex items-center gap-1 cursor-pointer"
                            >
                              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                              <span className="text-[10px] font-mono text-gray-300">{isMuted ? 'Muted' : 'Sound ON'}</span>
                            </button>

                            <span className="font-mono text-[11px] text-gray-300">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>

                          <button
                            onClick={handleFullscreen}
                            className="text-gray-300 hover:text-white p-1 transition-colors cursor-pointer"
                            title="Fullscreen"
                          >
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>ভিডিওটি স্বয়ংক্রিয়ভাবে প্লে হচ্ছে। অডিও চালু করতে সাউন্ড বাটনে ক্লিক করুন।</span>
                </p>
              </div>
            )}

            {/* Quick Scent or Feature Highlight Note */}
            {product.fragranceNotes && (
              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-[#5B21B6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#5B21B6]" />
                  <span><strong>Top Note Preview:</strong> {product.fragranceNotes.top || 'Bergamot, Citrus & Fresh Woods'}</span>
                </div>
                <button 
                  onClick={() => setInfoTab('fragrance')}
                  className="font-bold underline hover:text-[#4C1D95] cursor-pointer"
                >
                  View Pyramid
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: PRODUCT CORE DETAILS, PRICING & ACTIONS
              ======================================================== */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Category & Store Badge */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#EDE9FE] text-[#5B21B6] border border-purple-200">
                    {product.category}
                  </span>
                  <span className="text-xs text-[#525252] font-mono">
                    SKU: PVZ-{product.id.toUpperCase()}
                  </span>
                </div>

                {/* Verified Seller Badge & Store Link */}
                <button
                  onClick={() => onOpenSellerStore ? onOpenSellerStore(storeName) : null}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B21B6] hover:text-[#4C1D95] hover:underline cursor-pointer bg-purple-50 px-2 py-1 rounded-lg border border-purple-200"
                  title="Visit Seller Store"
                >
                  <Store className="w-3.5 h-3.5 text-[#5B21B6]" />
                  <span>Store: {storeName}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Rating, Reviews Count, and Sold Units */}
            <div className="flex flex-wrap items-center gap-4 py-2.5 border-y border-[#E5E7EB] text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.8)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#171717] ml-1">{(product.rating || 4.8).toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount || 124} Reviews)</span>
              </div>

              <span className="text-gray-300 hidden sm:inline">|</span>

              <div className="flex items-center gap-1 text-gray-600 font-medium">
                <Tag className="w-3.5 h-3.5 text-[#5B21B6]" />
                <span><strong>{soldCount}</strong> Units Sold</span>
              </div>

              <span className="text-gray-300 hidden sm:inline">|</span>

              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic</span>
              </div>
            </div>

            {/* ================= Pricing Display Box ================= */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#5B21B6]">
                  ৳{unitPrice.toLocaleString()}
                </span>
                {originalPrice > unitPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ৳{originalPrice.toLocaleString()}
                  </span>
                )}
                {discountLabel && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-600 text-white text-xs font-black shadow-xs">
                    {discountLabel}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <p className="text-xs text-emerald-700 font-bold">
                  🎉 আপনি এই অর্ডারে সাশ্রয় করছেন ৳{savings.toLocaleString()}!
                </p>
              )}

              <div className="pt-2 text-[11px] text-gray-500 flex flex-wrap items-center gap-3">
                <span className="text-emerald-700 font-semibold">✓ VAT অন্তর্ভুক্ত</span>
                <span>•</span>
                <span>ক্যাশ অন ডেলিভারি সুবিধা আছে</span>
                <span>•</span>
                <span>৭ দিনের ফ্রি রিটার্ন ও রিপ্লেসমেন্ট</span>
              </div>
            </div>

            {/* Dynamic Variant Selector (Size/Volume) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171717]">Select Size / Volume:</span>
                <span className="font-bold text-[#5B21B6]">{selectedSize}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm'
                          : 'bg-white text-[#171717] border-[#E5E7EB] hover:border-purple-300'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-xs text-[#171717] block">Quantity:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl bg-white border border-[#E5E7EB] p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-sm text-[#171717]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-gray-500">
                  Subtotal: <strong className="text-[#5B21B6] text-sm">৳{(unitPrice * quantity).toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Primary Action Buttons: Buy Now + Add to Cart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                id="product-detail-buy-now"
                onClick={() => onBuyNow(product, quantity, selectedSize)}
                className="w-full py-3.5 px-6 rounded-xl font-black text-white bg-[#5B21B6] hover:bg-[#4C1D95] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Buy Now (অর্ডার করুন)</span>
              </button>

              <button
                id="product-detail-add-to-cart"
                onClick={() => onAddToCart(product, quantity, selectedSize)}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-[#5B21B6] bg-[#EDE9FE] hover:bg-purple-200 border border-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (ব্যাগে রাখুন)</span>
              </button>
            </div>

            {/* ================= Logistics & Delivery Calculator ================= */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171717] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#5B21B6]" />
                  <span>Delivery Options & Estimated Time</span>
                </span>
                <span className="text-emerald-700 font-bold">Fast Dispatch</span>
              </div>

              {/* Delivery Location Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryLocation('inside')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    deliveryLocation === 'inside'
                      ? 'bg-white border-[#5B21B6] ring-1 ring-[#5B21B6] shadow-xs'
                      : 'bg-white/60 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-[#171717]">Inside Dhaka</div>
                  <div className="text-[11px] text-[#5B21B6] font-bold">৳60 • 1-2 Days</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryLocation('outside')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    deliveryLocation === 'outside'
                      ? 'bg-white border-[#5B21B6] ring-1 ring-[#5B21B6] shadow-xs'
                      : 'bg-white/60 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-[#171717]">Outside Dhaka</div>
                  <div className="text-[11px] text-[#5B21B6] font-bold">৳120 • 3-5 Days</div>
                </button>
              </div>

              <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-[#525252]">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>Selected: <strong>{estimatedDelivery}</strong></span>
                </div>
                <span className="font-bold text-[#171717]">৳{shippingCost}</span>
              </div>
            </div>

            {/* ================= Verified Seller Card ================= */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => onOpenSellerStore && onOpenSellerStore(storeName)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                  title={`Visit ${storeName} storefront`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] group-hover:bg-purple-200 flex items-center justify-center text-[#5B21B6] font-black text-base border border-purple-200 transition-colors">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#5B21B6] transition-colors">{storeName}</h4>
                      <span title="Verified Merchant">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    </div>
                    <p className="text-[11px] text-[#525252] flex items-center gap-1">
                      <span>Prime Vault Verified Seller</span>
                      <ChevronRight className="w-3 h-3 text-[#5B21B6]" />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenSellerStore && onOpenSellerStore(storeName)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#5B21B6] bg-purple-50 hover:bg-purple-100 border border-purple-200 cursor-pointer transition-colors"
                  >
                    Visit Store
                  </button>

                  <button
                    onClick={() => setIsFollowingStore(!isFollowingStore)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isFollowingStore
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-[#171717]'
                    }`}
                  >
                    {isFollowingStore ? '✓ Following' : '+ Follow'}
                  </button>
                </div>
              </div>

              {/* Seller Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center text-xs">
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="font-black text-[#171717]">98.6%</div>
                  <div className="text-[10px] text-gray-500">Positive Ratings</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="font-black text-[#171717]">99.2%</div>
                  <div className="text-[10px] text-gray-500">Ship on Time</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-50">
                  <div className="font-black text-[#171717]">100%</div>
                  <div className="text-[10px] text-gray-500">Chat Response</div>
                </div>
              </div>
            </div>

            {/* 4 Trust Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#5B21B6] mx-auto" />
                <div className="text-[11px] font-bold text-[#171717]">100% Authentic</div>
                <div className="text-[9px] text-gray-500">Brand Guaranteed</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-1">
                <Truck className="w-4 h-4 text-emerald-600 mx-auto" />
                <div className="text-[11px] font-bold text-[#171717]">Fast Shipping</div>
                <div className="text-[9px] text-gray-500">Across Bangladesh</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-1">
                <RotateCcw className="w-4 h-4 text-amber-600 mx-auto" />
                <div className="text-[11px] font-bold text-[#171717]">7 Days Return</div>
                <div className="text-[9px] text-gray-500">Easy Replacement</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-1">
                <Award className="w-4 h-4 text-rose-600 mx-auto" />
                <div className="text-[11px] font-bold text-[#171717]">Cash on Delivery</div>
                <div className="text-[9px] text-gray-500">Pay at Doorstep</div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================
            TABBED INFORMATION, SPECS, NOTES & REVIEWS SECTION
            ======================================================== */}
        <div className="mt-14 pt-8 border-t border-[#E5E7EB]">
          
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] overflow-x-auto pb-1 mb-8">
            <button
              onClick={() => setInfoTab('specs')}
              className={`pb-3 px-4 text-sm font-bold whitespace-nowrap relative cursor-pointer ${
                infoTab === 'specs'
                  ? 'text-[#5B21B6]'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              <span>Specifications & Description</span>
              {infoTab === 'specs' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setInfoTab('fragrance')}
              className={`pb-3 px-4 text-sm font-bold whitespace-nowrap relative cursor-pointer ${
                infoTab === 'fragrance'
                  ? 'text-[#5B21B6]'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              <span>Fragrance Notes & Key Highlights</span>
              {infoTab === 'fragrance' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setInfoTab('reviews')}
              className={`pb-3 px-4 text-sm font-bold whitespace-nowrap relative cursor-pointer flex items-center gap-1.5 ${
                infoTab === 'reviews'
                  ? 'text-[#5B21B6]'
                  : 'text-[#525252] hover:text-[#171717]'
              }`}
            >
              <span>Verified Customer Reviews</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-[#5B21B6] font-extrabold">
                {product.reviewsCount || 124}
              </span>
              {infoTab === 'reviews' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#5B21B6] rounded-full" />
              )}
            </button>
          </div>

          {/* TAB 1 CONTENT: Specifications & Description */}
          {infoTab === 'specs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#171717] mb-3">Product Overview</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#171717] mb-3 uppercase tracking-wider">Key Highlights</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {product.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#171717] bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                          <Check className="w-4 h-4 text-[#5B21B6] shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Specifications Table */}
              <div className="lg:col-span-4 bg-gray-50 rounded-2xl p-5 border border-[#E5E7EB] space-y-3">
                <h4 className="text-sm font-bold text-[#171717] border-b border-gray-200 pb-2">
                  Technical Specifications
                </h4>
                <div className="divide-y divide-gray-200 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Brand / Merchant</span>
                    <span className="font-bold text-[#171717]">{storeName}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="font-bold text-[#171717]">{product.category}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">SKU Code</span>
                    <span className="font-mono font-bold text-[#171717]">PVZ-{product.id.toUpperCase()}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Longevity / Battery</span>
                    <span className="font-bold text-[#171717]">8 to 14 Hours</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Country of Origin</span>
                    <span className="font-bold text-[#171717]">UAE / France / Global</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-500">Warranty</span>
                    <span className="font-bold text-emerald-700">100% Authenticity Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 CONTENT: Fragrance Notes & Scent Profile */}
          {infoTab === 'fragrance' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-[#171717] mb-2 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#5B21B6]" />
                  <span>Olfactory Pyramid & Scent Evolution</span>
                </h3>
                <p className="text-xs text-[#525252]">
                  বিশ্বমানের পারফিউমারদের তৈরি সুগন্ধির স্তরগুলো সময়ের সাথে সাথে পরিবর্তিত হয় এবং একটি অনন্য ব্যক্তিত্ব প্রকাশ করে।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#5B21B6]">Top Notes (প্রথম ১৫ মিনিট)</span>
                    <Sparkles className="w-4 h-4 text-[#5B21B6]" />
                  </div>
                  <p className="text-sm font-bold text-[#171717]">
                    {product.fragranceNotes?.top || 'Bergamot, Pink Pepper, Fresh Calabrian Lemon'}
                  </p>
                  <p className="text-xs text-[#525252]">স্প্রে করার সাথে সাথেই যে তাজা ও উদ্দীপক সুবাস নাকে আসে।</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700">Heart Notes (২ থেকে ৪ ঘণ্টা)</span>
                    <Flame className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-sm font-bold text-[#171717]">
                    {product.fragranceNotes?.heart || 'Damascus Rose, Cardamom, Nutmeg & Iris'}
                  </p>
                  <p className="text-xs text-[#525252]">পারফিউমের মূল নির্যাস যা হৃদয়কে মোহিত করে এবং দীর্ঘস্থায়ী হয়।</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-800">Base Notes (৮ থেকে ১২+ ঘণ্টা)</span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-[#171717]">
                    {product.fragranceNotes?.base || 'White Amber, Vanilla, Tonka Bean & Royal Oud'}
                  </p>
                  <p className="text-xs text-[#525252]">সারাদিন কাপড়ে লেগে থাকা ডিপ ও লাক্সারি সিগনেচার ট্রেইল।</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3 CONTENT: Verified Customer Reviews with Star Breakdown */}
          {infoTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating Summary & Breakdown Bars */}
              <div className="p-6 rounded-2xl bg-gray-50 border border-[#E5E7EB] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 text-center md:text-left space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-[#171717]">
                    {(product.rating || 4.8).toFixed(1)}
                  </div>
                  <div className="flex justify-center md:justify-start text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#525252]">
                    Based on {product.reviewsCount || 124} verified buyer ratings
                  </p>
                </div>

                {/* Progress bars */}
                <div className="md:col-span-8 space-y-1.5 text-xs">
                  {[
                    { stars: '5 Star', pct: 85, count: 105 },
                    { stars: '4 Star', pct: 12, count: 15 },
                    { stars: '3 Star', pct: 2, count: 3 },
                    { stars: '2 Star', pct: 1, count: 1 },
                    { stars: '1 Star', pct: 0, count: 0 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="w-12 text-gray-600 font-medium">{row.stars}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full" 
                          style={{ width: `${row.pct}%` }} 
                        />
                      </div>
                      <span className="w-8 text-right text-gray-500 font-mono">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Verified Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Arifur Rahman',
                    location: 'Mirpur-10, Dhaka',
                    rating: 5,
                    date: 'Yesterday',
                    comment: 'অরিজিনাল পারফিউম! প্যাকেজিং এবং ঘ্রাণের লংজিভিটি অসাধারণ। ১২ ঘণ্টারও বেশি স্থায়ী ছিল।',
                    verified: true,
                    likes: 18,
                  },
                  {
                    name: 'Dr. Nusrat Jahan',
                    location: 'Uttara, Dhaka',
                    rating: 5,
                    date: '3 days ago',
                    comment: 'এআই ভিডিও রিভিউ দেখে অর্ডার করেছিলাম, বাস্তবে ঠিক যেমনটা আশা করেছিলাম তেমনই পেয়েছি। প্রিমিয়াম কোয়ালিটি!',
                    verified: true,
                    likes: 24,
                  },
                  {
                    name: 'Shakil Anwar',
                    location: 'Agrabad, Chattogram',
                    rating: 5,
                    date: '1 week ago',
                    comment: 'ক্যাশ অন ডেলিভারিতে দ্রুত পেয়েছি। প্রাইম ভল্ট জোনের সার্ভিস দারুণ, কুপন ডিসকাউন্টে ভালো প্রাইসে মিলল।',
                    verified: true,
                    likes: 9,
                  },
                ].map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono">{rev.date}</span>
                    </div>

                    <p className="text-xs text-[#171717] leading-relaxed">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-[#171717]">{rev.name}</div>
                        <div className="text-[10px] text-gray-500">{rev.location}</div>
                      </div>

                      <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1">
                      <ThumbsUp className="w-3 h-3 text-gray-400" />
                      <span>Helpful ({rev.likes})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
