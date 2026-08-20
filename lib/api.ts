import axios, { AxiosError } from 'axios';
import type {
  Customer,
  DashboardSummary,
  Order,
  OrderStats,
  OrderStatus,
  Paginated,
  Product,
  ProductStats,
  StatusOption,
  TopProduct,
} from './types';
import { clearAuth, getToken } from './auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: false,
  timeout: 20_000,
});

// Attach Sanctum bearer token if we have one.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear local auth and bounce to /login so the rest of the app
// can re-render with the gate.
if (typeof window !== 'undefined') {
  api.interceptors.response.use(
    (r) => r,
    (err: AxiosError) => {
      if (err.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
        clearAuth();
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?next=${next}`;
      }
      return Promise.reject(err);
    }
  );
}

/** Normalize Laravel validation errors into a single human message. */
export const extractErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Unexpected error';
};

export const isCancelError = (err: unknown): boolean =>
  axios.isAxiosError(err) && err.code === 'ERR_CANCELED';

// ===== Orders =====
export interface OrderListParams {
  status?: OrderStatus;
  search?: string;
  customer_id?: number;
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
}

export interface CreateOrderInput {
  customer_id: number;
  status?: OrderStatus;
  notes?: string;
  shipping_address?: string;
  items: { product_id: number; quantity: number }[];
}

export const ordersApi = {
  list: (params: OrderListParams = {}) =>
    api.get<Paginated<Order>>('/orders', { params }).then((r) => r.data),

  get: (id: number) => api.get<{ data: Order }>(`/orders/${id}`).then((r) => r.data.data),

  create: (payload: CreateOrderInput) =>
    api.post<{ data: Order }>('/orders', payload).then((r) => r.data.data),

  update: (id: number, payload: Partial<Order>) =>
    api.put<{ data: Order }>(`/orders/${id}`, payload).then((r) => r.data.data),

  updateStatus: (id: number, status: OrderStatus) =>
    api.patch<{ data: Order }>(`/orders/${id}/status`, { status }).then((r) => r.data.data),

  remove: (id: number) => api.delete<{ message: string }>(`/orders/${id}`).then((r) => r.data),

  statuses: () => api.get<{ data: StatusOption[] }>('/orders/statuses/list').then((r) => r.data.data),

  stats: () => api.get<{ data: OrderStats }>('/orders/stats').then((r) => r.data.data),
};

// ===== Products =====
export interface ProductListParams {
  search?: string;
  is_active?: boolean;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  sort?: 'latest' | 'price_asc' | 'price_desc' | 'name' | 'stock';
  page?: number;
  per_page?: number;
}

export const productsApi = {
  list: (params: ProductListParams = {}) =>
    api.get<Paginated<Product>>('/products', { params }).then((r) => r.data),

  get: (id: number) => api.get<{ data: Product }>(`/products/${id}`).then((r) => r.data.data),

  create: (payload: Partial<Product>) =>
    api.post<{ data: Product }>('/products', payload).then((r) => r.data.data),

  update: (id: number, payload: Partial<Product>) =>
    api.put<{ data: Product }>(`/products/${id}`, payload).then((r) => r.data.data),

  remove: (id: number) => api.delete<{ message: string }>(`/products/${id}`).then((r) => r.data),

  stats: () => api.get<{ data: ProductStats }>('/products/stats').then((r) => r.data.data),
};

// ===== Customers =====
export interface CustomerListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export const customersApi = {
  list: (params: CustomerListParams = {}) =>
    api.get<Paginated<Customer>>('/customers', { params }).then((r) => r.data),

  get: (id: number) => api.get<{ data: Customer }>(`/customers/${id}`).then((r) => r.data.data),

  create: (payload: Partial<Customer>) =>
    api.post<{ data: Customer }>('/customers', payload).then((r) => r.data.data),

  update: (id: number, payload: Partial<Customer>) =>
    api.put<{ data: Customer }>(`/customers/${id}`, payload).then((r) => r.data.data),

  remove: (id: number) => api.delete<{ message: string }>(`/customers/${id}`).then((r) => r.data),
};

// ===== Dashboard =====
export const dashboardApi = {
  summary: (rangeDays = 30) =>
    api
      .get<{ data: DashboardSummary }>('/dashboard/summary', { params: { range: rangeDays } })
      .then((r) => r.data.data),

  recentOrders: (limit = 10) =>
    api.get<{ data: Order[] }>('/dashboard/recent-orders', { params: { limit } }).then((r) => r.data.data),

  topProducts: (limit = 5) =>
    api.get<{ data: TopProduct[] }>('/dashboard/top-products', { params: { limit } }).then((r) => r.data.data),
};

export type { AxiosError };
