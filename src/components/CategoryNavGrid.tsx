import React from 'react';
import { 
  Sparkles, 
  Shirt, 
  Smartphone, 
  Heart, 
  Home, 
  Watch, 
  Gift,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export interface MarketplaceCategoryItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  itemCount: string;
  badge?: string;
  image: string;
  bgGradient: string;
  accentColor: string;
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategoryItem[] = [
  {
    id: 'cat-perfume',
    name: 'Perfume & Fragrances',
    shortName: 'Perfumes',
    description: 'Luxury scents, French EDPs & pure organic attars',
    itemCount: '240+ Items',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-purple-100 to-indigo-50',
    accentColor: '#5B21B6'
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Lifestyle',
    shortName: 'Fashion',
    description: 'Premium casual wear, formal attire & leather goods',
    itemCount: '180+ Items',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-amber-50 to-orange-100',
    accentColor: '#D97706'
  },
  {
    id: 'cat-electronics',
    name: 'Electronics & Gadgets',
    shortName: 'Electronics',
    description: 'Smart watches, neon glow lamps & tech accessories',
    itemCount: '95+ Items',
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-blue-50 to-cyan-100',
    accentColor: '#2563EB'
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Personal Care',
    shortName: 'Beauty',
    description: 'Skincare, beard grooming essentials & organic care',
    itemCount: '150+ Items',
    badge: 'Verified',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-rose-50 to-pink-100',
    accentColor: '#E11D48'
  },
  {
    id: 'cat-home',
    name: 'Home & Living',
    shortName: 'Home',
    description: 'Ambient illumination, room diffusers & modern decor',
    itemCount: '110+ Items',
    badge: 'Curated',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-emerald-50 to-teal-100',
    accentColor: '#059669'
  },
  {
    id: 'cat-watches',
    name: 'Watches & Accessories',
    shortName: 'Watches',
    description: 'Chronograph luxury watches, sunglasses & wallets',
    itemCount: '80+ Items',
    badge: 'Luxury',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-violet-50 to-purple-100',
    accentColor: '#7C3AED'
  },
  {
    id: 'cat-gifts',
    name: 'Premium Gifts',
    shortName: 'Gifts',
    description: 'Collector brick models, foil journals & luxury box sets',
    itemCount: '70+ Items',
    badge: 'Exclusive',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    bgGradient: 'from-fuchsia-50 to-purple-100',
    accentColor: '#9333EA'
  }
];

interface CategoryNavGridProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryNavGrid: React.FC<CategoryNavGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-8 bg-white" id="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#5B21B6]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B21B6]">
                Marketplace Explorer
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className={`text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'text-[#5B21B6]'
                : 'text-[#525252] hover:text-[#5B21B6]'
            }`}
          >
            <span>{selectedCategory === 'All' ? 'Showing All' : 'Reset to All'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid (Daraz & Modern E-Commerce Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const isSelected =
              selectedCategory === cat.name ||
              (selectedCategory === 'Perfume' && cat.name.includes('Perfume')) ||
              (selectedCategory === 'Attar Perfumes' && cat.name.includes('Perfume'));

            return (
              <button
                key={cat.id}
                id={`cat-card-${cat.id}`}
                onClick={() => onSelectCategory(cat.name)}
                className={`group relative flex flex-col items-center text-center p-3 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-[#5B21B6] bg-[#EDE9FE] shadow-md ring-2 ring-[#5B21B6]/20 -translate-y-1'
                    : 'border-[#E5E7EB] bg-[#F9FAFB] hover:bg-white hover:border-[#5B21B6]/50 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Badge */}
                {cat.badge && (
                  <span className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-2xs ${
                    isSelected
                      ? 'bg-[#5B21B6] text-white'
                      : 'bg-white text-[#5B21B6] border border-purple-200'
                  }`}>
                    {cat.badge}
                  </span>
                )}

                {/* Circular Category Image with Soft Shadow */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3 p-0.5 bg-white shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl ${
                    isSelected ? 'ring-2 ring-[#5B21B6]' : ''
                  }`} />
                </div>

                {/* Category Titles */}
                <h3 className={`text-xs sm:text-sm font-bold leading-tight mb-1 transition-colors ${
                  isSelected ? 'text-[#5B21B6]' : 'text-[#171717] group-hover:text-[#5B21B6]'
                }`}>
                  {cat.name}
                </h3>

                {/* Item Count */}
                <span className="text-[10px] sm:text-[11px] text-[#525252] font-medium">
                  {cat.itemCount}
                </span>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="w-8 h-1 bg-[#5B21B6] rounded-full mt-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
