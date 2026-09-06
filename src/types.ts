export interface HeroBanner {
  id: string;
  badge: string; // e.g., "LIMITED TIME OFFER"
  title: string; // e.g., "BETTER INGREDIENTS.\nBETTER BURGERS."
  subtitle: string; // e.g., "Made with fresh dough, real cheese & quality toppings."
  buttonText: string; // e.g., "Order Now"
  buttonLink?: string; // e.g., "menu"
  imageUrl: string;
  backgroundColor?: string; // e.g., "#073B24" or "#1C1C1E"
  textColor?: string;
  isActive: boolean;
}

export interface OfferBanner {
  id: string;
  badge: string; // e.g., "EXCLUSIVE DEAL"
  title: string; // e.g., "UP TO 30% OFF"
  subtitle: string; // e.g., "On Selected Combos"
  buttonText: string; // e.g., "Order Now"
  discountTag: string; // e.g., "30% OFF"
  imageUrl: string;
  backgroundColor?: string; // e.g., "#EAF4EC"
  isActive: boolean;
}

export interface RestaurantSettings {
  id?: string;
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryFee: number;
  minDeliveryOrder: number;
  estimatedDeliveryTime: string;
  estimatedPickupTime: string;
  isOpen: boolean;
  acceptedPaymentMethods: string[];
  adminEmails: string[];
  heroBanners?: HeroBanner[];
  offerBanners?: OfferBanner[];
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductOptionChoice {
  label: string;
  price: number;
}

export interface ProductOption {
  name: string;
  choices: ProductOptionChoice[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: 'BESTSELLER' | "CHEF'S PICK" | 'POPULAR' | 'NEW' | '';
  isAvailable: boolean;
  isPopular?: boolean;
  calories?: string;
  options?: ProductOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string; // unique item cart ID (combines product id + options hash)
  productId: string;
  name: string;
  price: number; // base price + selected options adjustments
  quantity: number;
  image: string;
  selectedOptions?: Record<string, string>;
  specialNotes?: string;
}

export type OrderType = 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'cash_on_delivery';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  subtotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  orderType: OrderType;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  defaultAddress?: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: string;
}

export interface SyncMenuResult {
  success: boolean;
  persistedToFirestore: boolean;
  message: string;
  itemCount: number;
  categoryCount: number;
}
