import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  CreditCard, 
  Store,
  ExternalLink,
  Heart,
  Code2
} from 'lucide-react';
import { VaultLogo } from './VaultLogo';

interface FooterProps {
  onGoHome: () => void;
  onOpenOrders: () => void;
  onOpenAuth: () => void;
  onOpenSellerCenter?: () => void;
  onOpenSellerStore?: (slug: string) => void;
  onOpenAdmin: () => void;
  onDownloadHtml: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onGoHome,
  onOpenOrders,
  onOpenAuth,
  onOpenSellerCenter,
  onOpenSellerStore,
  onOpenAdmin,
  onDownloadHtml,
}) => {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] text-[#171717] pt-12 pb-8">
      {/* Trust & Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-[#EDE9FE]/50 border border-purple-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-[#5B21B6] shadow-xs shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">Fast Delivery Nationwide</h4>
              <p className="text-[11px] text-[#525252]">24-48h in Dhaka, 3-5 days outside</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-[#5B21B6] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">100% Genuine Guaranteed</h4>
              <p className="text-[11px] text-[#525252]">Authentic products & verified sellers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-[#5B21B6] shadow-xs shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">7 Days Easy Return</h4>
              <p className="text-[11px] text-[#525252]">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white border border-purple-200 flex items-center justify-center text-[#5B21B6] shadow-xs shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#171717]">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-[#525252]">Phone, WhatsApp & Live Help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-[#E5E7EB]">
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={onGoHome} className="focus:outline-none cursor-pointer">
              <VaultLogo size="md" />
            </button>
            <p className="text-xs text-[#525252] leading-relaxed max-w-sm">
              Prime Vault Zone is Bangladesh's premier verified lifestyle and perfume marketplace. Discover authentic fragrances, curated collections, and enjoy seamless shopping with bKash, Nagad, and cash on delivery.
            </p>

            <div className="space-y-2 pt-1 text-xs text-[#525252]">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-[#5B21B6]" />
                <span className="font-semibold text-[#171717]">+880 1700-000000</span>
                <span className="text-[11px] text-[#525252]">(9 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#5B21B6]" />
                <span className="text-[#171717]">support@primevaultzone.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#5B21B6] shrink-0 mt-0.5" />
                <span className="text-[#525252]">
                  Dhanmondi 27, Dhaka - 1209, Bangladesh
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Customer Support & Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li>
                <button 
                  onClick={onOpenOrders}
                  className="hover:text-[#5B21B6] transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenAuth}
                  className="hover:text-[#5B21B6] transition-colors cursor-pointer"
                >
                  My Account & Wallet
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#5B21B6] transition-colors">
                  Help Center & FAQs
                </a>
              </li>
              <li>
                <a href="#returns" className="hover:text-[#5B21B6] transition-colors">
                  Returns & Refunds Policy
                </a>
              </li>
              <li>
                <a href="#shipping" className="hover:text-[#5B21B6] transition-colors">
                  Shipping Rates & Delivery
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-[#5B21B6] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Seller Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-3">
              Seller Information
            </h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              {onOpenSellerStore && (
                <li>
                  <button 
                    onClick={() => onOpenSellerStore('perfume-vault-bd')}
                    className="hover:text-[#5B21B6] transition-colors font-semibold text-[#5B21B6] flex items-center gap-1 cursor-pointer"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Brand Storefronts</span>
                  </button>
                </li>
              )}
              {onOpenSellerCenter && (
                <li>
                  <button 
                    onClick={onOpenSellerCenter}
                    className="hover:text-[#5B21B6] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Seller Center & Portal</span>
                  </button>
                </li>
              )}
              <li>
                <a href="#sell" className="hover:text-[#5B21B6] transition-colors">
                  Sell on Prime Vault
                </a>
              </li>
              <li>
                <a href="#seller-policy" className="hover:text-[#5B21B6] transition-colors">
                  Seller Code of Conduct
                </a>
              </li>
              <li>
                <a href="#warehouses" className="hover:text-[#5B21B6] transition-colors">
                  Fulfillment Centers
                </a>
              </li>
              <li>
                <a href="#verified" className="hover:text-[#5B21B6] transition-colors">
                  Verified Brand Badge
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods & Logistics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-3">
              Payment & Security
            </h4>
            <div className="space-y-3">
              <p className="text-[11px] text-[#525252]">
                100% Secure Checkout with Instant Automated Confirmation:
              </p>

              {/* Bangladesh Payment Badges */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#E2136E] shadow-2xs">
                  bKash
                </div>
                <div className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#F7941D] shadow-2xs">
                  Nagad
                </div>
                <div className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#8C1E70] shadow-2xs">
                  Rocket
                </div>
                <div className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#1A1F71] shadow-2xs">
                  VISA
                </div>
                <div className="p-1.5 rounded-lg border border-[#E5E7EB] bg-white text-[10px] font-bold text-[#EB001B] shadow-2xs">
                  Mastercard
                </div>
                <div className="p-1.5 rounded-lg border border-[#E5E7EB] bg-[#EDE9FE] text-[10px] font-bold text-[#5B21B6] shadow-2xs">
                  Cash on Del.
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-semibold text-[#525252] block mb-1">
                  Delivery Logistics Partners:
                </span>
                <div className="flex items-center gap-2 text-[10px] text-[#525252] font-mono">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">Pathao Courier</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded">Steadfast</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded">Paperfly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Admin Shortcut */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#525252]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong>PRIME VAULT ZONE</strong>. All rights reserved. Registered Trademark in Bangladesh.
          </p>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onDownloadHtml}
              className="text-[#5B21B6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Export HTML</span>
            </button>
            <span className="text-gray-300">•</span>
            <button
              id="footer-admin-link"
              onClick={onOpenAdmin}
              className="text-[#525252] hover:text-[#5B21B6] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B21B6]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
