export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  price: number;
  compare_price?: number | null;
  category_id?: string | null;
  images?: string[];
  main_image?: string;
  is_active: boolean;
  is_featured: boolean;
  is_top_rated: boolean;
  is_trending: boolean;
  is_best_selling: boolean;
  stock_quantity: number;
  sku: string;
  weight?: string | number | null;
  product_size?: string | null;
  delivery_date?: string | null;
  tags?: string[];
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
  categories?: Category | null;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
}

export interface OrderItem {
  product_id?: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'card' | 'stripe' | string;

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  orders_count?: number;
  total_spent?: number;
  created_at: string;
  updated_at?: string;
}

export type ContactSubmissionStatus = 'new' | 'in_progress' | 'replied' | 'archived';

export interface ContactSubmission {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactSubmissionStatus;
  created_at: string;
  updated_at?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginHistoryItem {
  id: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  status: 'success' | 'failed';
  created_at: string;
}

export interface RecentSale {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  created_at: string;
}

export interface RevenueDataPoint {
  name: string;
  total: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  productsCount: number;
  ordersCount: number;
  customersCount: number;
  revenueHistory?: RevenueDataPoint[];
  [key: string]: any;
}

export interface AdminSession {
  username: string;
  role?: string;
  isLoggedIn: boolean;
  loginTime?: string;
}

export type ApiResponse<T> =
  | { success: true; data: T; error?: null; count?: number }
  | { success: false; data?: null; error: string; count?: number };
