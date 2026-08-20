export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type StatusTone = 'amber' | 'blue' | 'indigo' | 'emerald' | 'rose' | 'slate';

export interface StatusOption {
  value: OrderStatus;
  label: string;
  color: StatusTone;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  orders_count?: number;
  total_spent?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  is_active: boolean;
  is_low_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_label: string;
  total_amount: number;
  notes?: string | null;
  shipping_address?: string | null;
  customer_id: number;
  customer?: Customer;
  items?: OrderItem[];
  items_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  links?: { first: string; last: string; prev: string | null; next: string | null };
}

export interface DailyRevenue {
  date: string;
  total: number;
  orders: number;
}

export interface DashboardSummary {
  range_days: number;
  total_revenue: number;
  orders_count: number;
  pending_orders: number;
  customers_count: number;
  products_count: number;
  low_stock_count: number;
  average_order_value: number;
  status_breakdown: Record<string, number>;
  daily_revenue: DailyRevenue[];
}

export interface OrderStats {
  total: number;
  pending: number;
  revenue: number;
  today: number;
}

export interface ProductStats {
  total: number;
  active: number;
  low_stock: number;
  out_of_stock: number;
  inventory_value: number;
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  sold: number;
  revenue: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
