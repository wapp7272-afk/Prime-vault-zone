export interface Product {
  id: string;
  title: string;
  name?: string;
  category: 'Perfume' | 'Glow Lights' | 'Attar Perfumes' | 'Notebooks' | 'Bricks Toys' | string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  videoUrl?: string;
  videoPoster?: string;
  sampleVideoUrl?: string;
  aiShowcaseVideoUrl?: string;
  description: string;
  tag?: string;
  isFeatured?: boolean;
  inStock: boolean;
  storeName?: string;
  sellerName?: string;
  soldCount?: number;
  ratingText?: string;
  features: string[];
  fragranceNotes?: {
    top?: string;
    heart?: string;
    base?: string;
  };
  sizes?: string[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed'; // 'percentage' (%) or 'fixed' (৳)
  discountValue: number;
  minOrderAmount?: number;
  expiryDate?: string; // YYYY-MM-DD
  isActive: boolean;
  usageCount?: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  storeName?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  district?: string;
  cityDivision: 'Inside Dhaka' | 'Outside Dhaka';
  fullAddress: string;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  hasReceivedBonus: boolean;
  isPhoneVerified?: boolean;
  authProvider?: 'google' | 'phone' | 'email';
  avatar?: string;
  address: Address;
  savedAddresses?: Address[];
  walletHistory?: WalletTransaction[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  walletDeducted: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  trxId?: string;
  paymentStatus?: 'Verified' | 'Pending Verification' | 'Paid (COD on Delivery)' | 'Failed';
  address: Address;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  courierName?: string;
  trackingNumber?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  quickOptions?: string[];
}

export type ActivePage = 'Home' | 'ProductDetail' | 'Cart' | 'Checkout' | 'MyOrders' | 'SellerCenter' | 'Admin' | 'Store';

export interface Seller {
  id: string;
  storeName: string;
  slug: string;
  ownerName: string;
  phone: string;
  email: string;
  category: string;
  nidOrTradeLicense: string;
  payoutMethod: 'bkash' | 'nagad' | 'bank';
  payoutAccount: string;
  bankName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  bannerImage?: string;
  logoImage?: string;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  totalSales?: number;
  responseRate?: string;
  followersCount?: number;
  joinedDate?: string;
  verified?: boolean;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  urlOrId: string;
  description?: string;
  badge?: string;
}

export interface SystemBannerSettings {
  announcementText: string;
  announcementBadge: string;
  helplineNumber: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBannerImage?: string;
  flashSaleTag: string;
  // YouTube Video & Channel Integration
  youtubeVideoUrl?: string; // Featured video URL or Video ID
  youtubeChannelUrl?: string; // Official YouTube channel URL
  youtubeSectionTitle?: string;
  youtubeSectionSubtitle?: string;
  youtubePlaylist?: YouTubeVideo[];
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  method: 'bkash' | 'nagad' | 'bank';
  account: string;
  bankName?: string;
  requestedAt: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  trxId?: string;
}
