import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Banknote, 
  Headphones, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface TrustValuePropositionProps {
  onLearnMore?: () => void;
}

export const TrustValueProposition: React.FC<TrustValuePropositionProps> = () => {
  const features = [
    {
      id: 'feature-auth',
      icon: ShieldCheck,
      title: '100% Authentic Products',
      description: 'Guaranteed genuine items sourced directly from verified global & local sellers.',
      highlight: 'Zero Counterfeits',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'feature-delivery',
      icon: Truck,
      title: 'Express Nationwide Delivery',
      description: 'Fast shipping across Dhaka (24-48 hrs) and all 64 districts with real-time tracking.',
      highlight: 'Dhaka & 64 Districts',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'feature-cod',
      icon: Banknote,
      title: 'Cash on Delivery & Easy Refunds',
      description: 'Check your package at doorstep. Enjoy instant bKash/Nagad and 7-day hassle-free returns.',
      highlight: 'Check Before Pay',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'feature-support',
      icon: Headphones,
      title: '24/7 Dedicated Support',
      description: 'Round-the-clock live chat and direct phone assistance in both Bangla & English.',
      highlight: 'Bangla & English',
      badgeColor: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <section className="py-8 bg-[#F9FAFB] border-y border-[#E5E7EB]" id="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border border-purple-200 text-[#5B21B6] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Millions Trust Prime Vault Zone</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
            The Safe, Premium Bangladeshi Marketplace
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#525252]">
            Enjoy seamless shopping with customer protection, authenticated inventories, and door-to-door fulfillment.
          </p>
        </div>

        {/* 4-Column Feature Banner using Soft Lavender (#EDE9FE) Background Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={`trust-card-${idx}`}
                className="group relative p-5 sm:p-6 rounded-2xl bg-[#EDE9FE] border border-purple-200/80 hover:border-[#5B21B6] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon and Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white text-[#5B21B6] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-[#5B21B6] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${feature.badgeColor}`}>
                      {feature.highlight}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-base font-bold text-[#171717] mb-2 leading-snug group-hover:text-[#5B21B6] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Feature Description */}
                  <p className="text-xs sm:text-[13px] text-[#525252] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Trust Assurance Tick */}
                <div className="mt-4 pt-3 border-t border-purple-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#5B21B6]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Prime Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
