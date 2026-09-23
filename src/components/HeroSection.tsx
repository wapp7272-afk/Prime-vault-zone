import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Maximize2, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Star,
  Flame,
  ShoppingBag,
  Heart,
  CheckCircle
} from 'lucide-react';
import { Product, SystemBannerSettings } from '../types';

interface HeroSectionProps {
  featuredProduct?: Product;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onExploreDeals: () => void;
  bannerSettings?: SystemBannerSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProduct,
  onSelectProduct,
  onBuyNow,
  onAddToCart,
  onExploreDeals,
  bannerSettings,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Fallback hero product if none passed
  const heroProduct: Product = featuredProduct || {
    id: 'p1',
    title: 'Cool Water Davidoff — Signature Edition',
    name: 'Cool Water Davidoff',
    category: 'Perfume',
    price: 3450,
    originalPrice: 4500,
    discount: '23% OFF',
    rating: 4.9,
    reviewsCount: 328,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'],
    description: 'Authentic imported aromatic fresh fragrance with crisp mint, ocean water notes, lavender and sandalwood base.',
    tag: '23% OFF',
    inStock: true,
    features: ['100% Original Imported', 'All-Day Crisp Sillage', 'Signature Fresh Scent', 'Instant Nationwide Delivery']
  };

  // High definition promotional perfume showcase video
  const videoUrl = heroProduct.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-and-rose-petals-40291-large.mp4';
  const posterUrl = heroProduct.videoPoster || heroProduct.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200';

  // Toggle Video Sound
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EDE9FE]/50 via-white to-white border-b border-[#E5E7EB] pt-6 pb-12 lg:pt-10 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Tag */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] border border-purple-200 text-[#5B21B6] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#5B21B6]" />
            <span>AUTHENTIC LUXURY & LIFESTYLE MARKETPLACE</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-[#525252]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Genuine Verified
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#5B21B6]" />
              Express 64 Districts Delivery
            </span>
          </div>
        </div>

        {/* 2-Column Split Grid (Desktop) / Vertical Stack (Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ================= LEFT COLUMN: Promotional Autoplay Video Container ================= */}
          <div className="lg:col-span-6 flex flex-col">
            <div 
              ref={containerRef}
              className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#171717] border border-[#E5E7EB] shadow-lg group"
            >
              {/* HTML5 Autoplay Video Player */}
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                autoPlay
                muted
                loop
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

              {/* Top High-Converting Overlay Text Badge */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>⚡ AI Product Spotlight</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10">
                  Featured Brand
                </div>
              </div>

              {/* Center Play/Pause Watermark on Hover */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 active:scale-95 cursor-pointer z-10"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              {/* Bottom Video Information & Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>Signature Collection 2026</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-sm">
                      Sensory Luxury Fragrance Film
                    </h4>
                  </div>

                  {/* Interactive Video Controls (Sound Toggle & Fullscreen) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-gray-300" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-amber-300" />
                      )}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                      title="Fullscreen View"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Visualizer Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#5B21B6] to-amber-400 w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Featured Showcase & Call to Action ================= */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#E5E7EB] shadow-md relative overflow-hidden">
            {/* Subtle background lavender accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDE9FE]/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

            <div className="space-y-4 relative z-10">
              {/* Featured Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border border-purple-200 text-[#5B21B6] text-xs font-black tracking-wide">
                  <Star className="w-3.5 h-3.5 fill-[#5B21B6]" />
                  PRIME VAULT EXCLUSIVE
                </span>
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Limited Time Offer
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171717] tracking-tight leading-tight">
                  {bannerSettings?.heroHeadline ? (
                    <span>{bannerSettings.heroHeadline}</span>
                  ) : (
                    <>
                      Luxury Scents For Every You —{' '}
                      <span className="text-[#5B21B6]">Exclusive Perfume Vault</span>
                    </>
                  )}
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-[#525252] leading-relaxed">
                  {bannerSettings?.heroSubheadline ||
                    'প্রতিটি মুহূর্তকে করে তুলুন অনন্য। ১০০% অরিজিনাল ফ্রেগ্রেন্স, সিগনেচার সিল্যাজ ও বিশেষ ডিসকাউন্টে সরাসরি আপনার দরজায়। Authentic imports with long-lasting notes & certified batch codes.'}
                </p>
              </div>

              {/* Featured Product Preview Card */}
              <div 
                onClick={() => onSelectProduct(heroProduct)}
                className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 to-white border border-purple-200 hover:border-[#5B21B6] transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-white border border-[#E5E7EB] shrink-0">
                    <img 
                      src={heroProduct.image} 
                      alt={heroProduct.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B21B6] bg-[#EDE9FE] px-2 py-0.5 rounded-md">
                        {heroProduct.category}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{heroProduct.rating || 4.9}</span>
                        <span className="text-gray-400 text-[10px]">({heroProduct.reviewsCount || 320})</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-[#171717] group-hover:text-[#5B21B6] transition-colors truncate">
                      {heroProduct.title}
                    </h3>

                    {/* Price & Discount Display */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg sm:text-xl font-black text-[#5B21B6]">
                        ৳{heroProduct.price.toLocaleString()}
                      </span>
                      {heroProduct.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ৳{heroProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black">
                        {heroProduct.discount || '23% OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-[#171717] font-semibold bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#171717] font-semibold bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Express Shipping</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 text-xs text-[#171717] font-semibold bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-3 relative z-10">
              {/* Primary Gold/Purple Button */}
              <button
                onClick={() => onBuyNow(heroProduct)}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-[#5B21B6] hover:bg-[#4C1D95] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Shop Featured Product Now</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button: Explore All Deals */}
              <button
                onClick={onExploreDeals}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-[#5B21B6] bg-[#EDE9FE] hover:bg-purple-200 border border-purple-200 transition-all text-center cursor-pointer shadow-xs active:scale-98"
              >
                Explore All Deals
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
