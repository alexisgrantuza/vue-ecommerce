// types/api.ts - Fixed version
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  is_active: boolean;
  rating: number;
  num_reviews: number;
  discount: number;
  popular: boolean;
  onSale: boolean;
  created_at: string;
  updated_at: string;
}

// Enhanced props interface for ProductCard
export interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'list';
  showDiscount?: boolean;
  showRating?: boolean;
  showDescription?: boolean;
  clickable?: boolean;
}

export interface ProductCardEmits {
  (e: 'product-click', product: Product): void;
  (e: 'add-to-cart', product: Product): void;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export interface Cart {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed";
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
}

// Extended types for API responses and joined data
export interface CartWithProduct extends Cart {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
}

export interface AuthRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  shipping_address: string;
  payment_method: string;
}