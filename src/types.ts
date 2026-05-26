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
  tag: string; // 'New Arrival' | 'Trending' | 'Oversized' | 'Atelier'
  images: string[];
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  details: string[];
  reviews: Review[];
  material: string;
  care: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface UserProfile {
  name: string;
  email: string;
  joinedDate: string;
  preferredStyle: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  avatar: string;
}
