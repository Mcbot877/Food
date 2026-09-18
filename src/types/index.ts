export type DietaryType = 'vegan' | 'gluten-free' | 'high-protein' | 'chef-special' | 'spicy' | 'keto';

export interface NutritionalInfo {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'bowls' | 'burgers' | 'pizza' | 'salads' | 'juices' | 'desserts';
  image: string;
  blurHashPlaceholder?: string;
  rating: number;
  reviewsCount: number;
  prepTimeMinutes: number;
  dietary: DietaryType[];
  nutrition: NutritionalInfo;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  stockRemaining?: number;
}

export interface DealItem {
  id: string;
  title: string;
  code: string;
  discountPercentage: number;
  description: string;
  menuItemId: string;
  menuItem: MenuItem;
  dealPrice: number;
  expiresAt: number; // timestamp in ms
  totalSlots: number;
  claimedSlots: number;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
  selectedAddons?: string[];
  unitPrice: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSubtotal: number;
  description: string;
}

export type OrderStatus = 'idle' | 'processing' | 'confirmed' | 'cooking' | 'delivering' | 'delivered';

export interface ActiveOrder {
  id: string;
  createdAt: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  estimatedDeliveryTimeMinutes: number;
  deliveryAddress: string;
  contactNumber: string;
}

export type SortOption = 'popular' | 'rating' | 'prepTime' | 'priceAsc' | 'priceDesc';
