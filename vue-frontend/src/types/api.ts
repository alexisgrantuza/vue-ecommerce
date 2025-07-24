// types/api.ts - Fixed version
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address[];
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

export interface CartItem {
  product: Product
  quantity: number
}

  

export interface Order {
  id: string;
  user_id: number;
  total_amount: number;
  shipping: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shipping_address: string;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed";
  tracking_number?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  shipped_at?: Date | string | null;
  delivered_at?: Date | string | null;
  items?: OrderItemWithProduct[];
}

export interface OrderItem {
  id: number;
  order_id: number | string;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date | string;
  updated_at?: Date | string;
  product?: Product;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

export interface OrderItemInput {
  product_id: number;
  quantity: number;
  price: number;
  product: any;
}

export interface UserOrdersStorage {
  [userId: number]: OrderWithItems[]
}

export interface ShippingInfo {
  address: string;
  paymentMethod: string;
  items?: OrderItemInput[];
}

export interface Wishlist {
  id: number;
  user_id: number;
  product_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  id: number;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}



// Extended types for API responses and joined data
export interface CartWithProduct extends Cart {
  product: Product;
}

export interface OrderWithItems extends Omit<Order, 'items'> {
  items: (OrderItem & { product: Product })[]
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
  address?: Address;
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
  shipping_address: Address;
  payment_method: string;
}