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

// types.ts
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
  created_at: Date | string;
  updated_at: Date | string;
}

// Product Image interface (for the database table)
export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  created_at?: Date;
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

// Extended interfaces for relationships
export interface CartWithProduct extends Cart {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
}

import { Request } from "express";

export interface AuthRequest extends Request {
  user?: User;
}
