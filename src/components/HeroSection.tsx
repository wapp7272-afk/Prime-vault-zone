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
    rating: 4.9,
    reviewsCount: 328,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'],
    description: 'Authentic imported aromatic fresh fragrance with crisp mint, ocean water notes, lavender and sandalwood base.',
    tag: 'Trending',
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
    <section className="relative overflow-hidden bg-[#F9FAFB] border-b border-slate-200 pt-6 pb-12 lg:pt-10 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Tag */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-200/80 text-[#4F46E5] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>AUTHENTIC LUXURY & LIFESTYLE MARKETPLACE</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Genuine Verified
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#4F46E5]" />
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
              className="relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:h-[460px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group"
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs border border-white/20 text-white text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                  <Zap className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  <span>AI Product Spotlight</span>
                </div>

                <div className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-xs text-[11px] font-medium text-white/90 border border-white/10">
                  Featured Brand
                </div>
              </div>

              {/* Center Play/Pause Watermark on Hover */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              {/* Bottom Video Information & Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider mb-0.5">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>Signature Collection 2026</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-semibold text-white drop-shadow-xs">
                      Sensory Luxury Fragrance Film
                    </h4>
                  </div>

                  {/* Interactive Video Controls (Sound Toggle & Fullscreen) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      className="p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs border border-white/20 text-white transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-slate-300" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#F59E0B]" />
                      )}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-xs border border-white/20 text-white transition-colors cursor-pointer"
                      title="Fullscreen View"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Progress Visualizer Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#F59E0B] w-3/4 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Featured Showcase & Call to Action ================= */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              {/* Featured Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200/80 text-[#4F46E5] text-xs font-semibold tracking-wide">
                  <Star className="w-3.5 h-3.5 fill-[#4F46E5]" />
                  PRIME VAULT EXCLUSIVE
                </span>
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-[#F59E0B]" />
                  Limited Time Offer
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">
                  {bannerSettings?.heroHeadline ? (
                    <span>{bannerSettings.heroHeadline}</span>
                  ) : (
                    <>
                      Luxury Scents For Every You —{' '}
                      <span className="text-[#4F46E5]">Exclusive Perfume Vault</span>
                    </>
                  )}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {bannerSettings?.heroSubheadline ||
                    'প্রতিটি মুহূর্তকে করে তুলুন অনন্য। ১০০% অরিজিনাল ফ্রেগ্রেন্স, সিগনেচার সিল্যাজ ও বিশেষ ডিসকাউন্টে সরাসরি আপনার দরজায়। Authentic imports with long-lasting notes & certified batch codes.'}
                </p>
              </div>

              {/* Featured Product Preview Card */}
              <div 
                onClick={() => onSelectProduct(heroProduct)}
                className="p-3.5 sm:p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img 
                      src={heroProduct.image} 
                      alt={heroProduct.title}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded">
                        {heroProduct.category}
                      </span>
                      <div className="flex items-center text-[#F59E0B] text-xs font-semibold gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{heroProduct.rating || 4.9}</span>
                        <span className="text-slate-400 text-[10px]">({heroProduct.reviewsCount || 320})</span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors truncate">
                      {heroProduct.title}
                    </h3>

                    {/* Price & Discount Display */}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg sm:text-xl font-bold text-[#0F172A] font-mono tabular-nums">
                        ৳{heroProduct.price.toLocaleString()}
                      </span>
                      {heroProduct.originalPrice && heroProduct.originalPrice > heroProduct.price && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through tabular-nums">
                          ৳{heroProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {heroProduct.originalPrice && heroProduct.originalPrice > heroProduct.price && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold">
                          -{Math.round(((heroProduct.originalPrice - heroProduct.price) / heroProduct.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Express Shipping</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-5 mt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3 relative z-10">
              {/* Primary Indigo Button */}
              <button
                onClick={() => onBuyNow(heroProduct)}
                className="w-full sm:flex-1 py-3 px-5 rounded-lg font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span>Shop Featured Product Now</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button: Explore All Deals */}
              <button
                onClick={onExploreDeals}
                className="w-full sm:w-auto py-3 px-5 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-center cursor-pointer active:scale-98"
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
