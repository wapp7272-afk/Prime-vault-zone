import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Save, 
  Eye, 
  RefreshCw, 
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  PhoneCall,
  Sliders
} from 'lucide-react';
import { SystemBannerSettings } from '../../types';

interface AdminBannersManagerProps {
  settings: SystemBannerSettings;
  onUpdateSettings: (newSettings: SystemBannerSettings) => void;
  showToast?: (msg: string) => void;
}

export const AdminBannersManager: React.FC<AdminBannersManagerProps> = ({
  settings,
  onUpdateSettings,
  showToast = () => {},
}) => {
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementBadge, setAnnouncementBadge] = useState(settings.announcementBadge);
  const [helplineNumber, setHelplineNumber] = useState(settings.helplineNumber);
  const [heroHeadline, setHeroHeadline] = useState(settings.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(settings.heroSubheadline);
  const [flashSaleTag, setFlashSaleTag] = useState(settings.flashSaleTag);
  const [heroBannerImage, setHeroBannerImage] = useState(settings.heroBannerImage || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Quick Preset Templates
  const applyPreset = (presetName: string) => {
    if (presetName === 'eid') {
      setAnnouncementBadge('🌙 EID MUBARAK');
      setAnnouncementText('Special Eid Fragrance Festival: Get Flat 20% OFF + Free Nationwide Delivery on orders over ৳1500!');
      setFlashSaleTag('EID EXCLUSIVE — UP TO 60% OFF');
      setHeroHeadline('Celebrate Eid With Signature Luxury Scents');
      setHeroSubheadline('Exquisite perfumes, artisanal attars and glowing lifestyle decors curated for your festive moments.');
    } else if (presetName === 'flash') {
      setAnnouncementBadge('⚡ FLASH SALE');
      setAnnouncementText('Limited 48-Hour Vault Rush! Flash discounts up to 50% across 500+ premium authentic items.');
      setFlashSaleTag('MEGA FLASH SALE — 48H ONLY');
      setHeroHeadline('High-Grade Imported Fragrances at Direct Vault Rates');
      setHeroSubheadline('Directly sourced from Paris, Dubai & Milan. 100% verified authentic with certificate of origin.');
    } else if (presetName === 'free_shipping') {
      setAnnouncementBadge('🚚 ZERO DELIVERY FEE');
      setAnnouncementText('Free Nationwide Express Delivery across Bangladesh on all orders today! Use code FREESHIP.');
      setFlashSaleTag('FREE SHIPPING MADNESS');
      setHeroHeadline('Shop Bangladesh’s #1 Authentic Lifestyle Marketplace');
      setHeroSubheadline('Zero delivery charges for Dhaka & all 64 districts. Cash on Delivery & bKash available.');
    } else {
      // Default
      setAnnouncementBadge('⚡ Flash Offer');
      setAnnouncementText('Free Delivery on orders over ৳2000 in Dhaka! | 🇧🇩 100% Genuine Guaranteed');
      setFlashSaleTag('UP TO 50% OFF — EXCLUSIVE');
      setHeroHeadline('Luxury Scents & Lifestyle Vault');
      setHeroSubheadline('Bangladesh’s Premier Authentic Perfume & Lifestyle Marketplace. 100% genuine guaranteed with fast nationwide express delivery.');
    }
    showToast(`Applied preset: ${presetName.toUpperCase()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemBannerSettings = {
      announcementText: announcementText.trim(),
      announcementBadge: announcementBadge.trim(),
      helplineNumber: helplineNumber.trim(),
      heroHeadline: heroHeadline.trim(),
      heroSubheadline: heroSubheadline.trim(),
      flashSaleTag: flashSaleTag.trim(),
      heroBannerImage: heroBannerImage.trim() || undefined,
    };
    onUpdateSettings(updated);
    setSavedSuccess(true);
    showToast('🚀 System Banners & Global Announcements saved successfully!');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-cyan-400" />
            <span>Homepage Announcements & Banner Campaign Manager</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify promotional headlines, announcement bar badges, and flash sale banners across the entire store.
          </p>
        </div>

        {/* Campaign Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-cyan-400" /> Quick Presets:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('eid')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 transition-colors cursor-pointer"
          >
            🌙 Eid Festive
          </button>
          <button
            type="button"
            onClick={() => applyPreset('flash')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-200 transition-colors cursor-pointer"
          >
            ⚡ Flash Sale
          </button>
          <button
            type="button"
            onClick={() => applyPreset('free_shipping')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 transition-colors cursor-pointer"
          >
            🚚 Free Shipping
          </button>
          <button
            type="button"
            onClick={() => applyPreset('default')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Reset Default
          </button>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold border-b border-white/10 pb-2">
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" /> Live Customer View Simulation
          </span>
          <span className="text-[10px] text-slate-500">Real-time Homepage preview</span>
        </div>

        {/* 1. Announcement Bar Preview */}
        <div className="rounded-lg bg-[#5B21B6] text-white p-2.5 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-[#4C1D95] px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 shrink-0">
              {announcementBadge || '⚡ Flash Offer'}
            </span>
            <span className="truncate text-white/95 text-xs">
              {announcementText || 'Free Delivery on orders over ৳2000 in Dhaka!'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-purple-200 shrink-0 pl-2">
            <PhoneCall className="w-3 h-3" />
            <span>{helplineNumber || '01883-418309'}</span>
          </div>
        </div>

        {/* 2. Hero Headline Preview */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-950/40 to-slate-900/60 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" /> {flashSaleTag || 'UP TO 50% OFF'}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">{heroHeadline}</h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{heroSubheadline}</p>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Announcement Badge */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Top Bar Badge Text
            </label>
            <input
              type="text"
              required
              value={announcementBadge}
              onChange={(e) => setAnnouncementBadge(e.target.value)}
              placeholder="e.g. ⚡ Flash Offer, 🌙 Eid Fest"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Helpline phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Customer Support Helpline
            </label>
            <input
              type="text"
              required
              value={helplineNumber}
              onChange={(e) => setHelplineNumber(e.target.value)}
              placeholder="e.g. 01883-418309"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Announcement Bar Text */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Top Header Announcement Marquee / Message
            </label>
            <input
              type="text"
              required
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. Free Delivery on orders over ৳2000 in Dhaka! | 🇧🇩 100% Genuine Guaranteed"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Hero Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Homepage Hero Spotlight Headline
            </label>
            <input
              type="text"
              required
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              placeholder="e.g. Luxury Scents & Lifestyle Vault"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Flash Sale Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Flash Sale Campaign Tag
            </label>
            <input
              type="text"
              required
              value={flashSaleTag}
              onChange={(e) => setFlashSaleTag(e.target.value)}
              placeholder="e.g. UP TO 50% OFF — EXCLUSIVE"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Hero Subheadline */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hero Section Subtitle / Value Proposition
            </label>
            <textarea
              rows={2}
              required
              value={heroSubheadline}
              onChange={(e) => setHeroSubheadline(e.target.value)}
              placeholder="Detailed tagline shown in Hero Spotlight..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Hero Custom Image URL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Optional Hero Custom Promotional Image URL</span>
            </label>
            <input
              type="url"
              value={heroBannerImage}
              onChange={(e) => setHeroBannerImage(e.target.value)}
              placeholder="https://images.unsplash.com/... (Leave empty to use featured product video & artwork)"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Changes take effect immediately across all customer sessions and devices.
          </div>

          <button
            type="submit"
            id="admin-save-banners-btn"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-black" />
                <span>Save & Deploy Banners</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
