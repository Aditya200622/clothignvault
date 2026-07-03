export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  tag: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  details: string[];
  reviews: Review[];
  material: string;
  care: string;
  stock: number;
  sku: string;
  brand?: string;
  fabric?: string;
  countryOfOrigin?: string;
  gstPercent?: number;
  tags?: string[];
  isActive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface Order {
  id: string;
  userEmail: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status:
    | 'Processing'
    | 'Confirmed'
    | 'Packed'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  trackingNumber?: string;
  courierPartner?: string;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  joinedDate: string;
  preferredStyle: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  avatar: string;
  role?: 'admin' | 'customer';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  cart?: CartItem[];
  wishlist?: Product[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiryDate: string;
}

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
