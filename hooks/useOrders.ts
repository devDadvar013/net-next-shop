'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateOrderInput, OrderListParams, extractErrorMessage, ordersApi } from '@/lib/api';
import { statusLabel } from '@/lib/format';
import type { Order, OrderStatus } from '@/lib/types';
import { useToast } from './useToast';

const KEY = ['orders'] as const;

export const orderKeys = {
  all: KEY,
  list: (params: OrderListParams) => [...KEY, 'list', params] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
  statuses: () => [...KEY, 'statuses'] as const,
  stats: () => [...KEY, 'stats'] as const,
};

export function useOrders(params: OrderListParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useOrder(id: number | null | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? 0),
    queryFn: () => ordersApi.get(id as number),
    enabled: !!id,
  });
}

export function useOrderStatuses() {
  return useQuery({
    queryKey: orderKeys.statuses(),
    queryFn: () => ordersApi.statuses(),
    staleTime: Infinity,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => ordersApi.stats(),
    staleTime: 30_000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.setQueryData(orderKeys.detail(order.id), order);
      toast.success('سفارش ایجاد شد', `سفارش ${order.order_number} ثبت شد.`);
    },
    onError: (err) => toast.error('ایجاد سفارش ناموفق بود', extractErrorMessage(err)),
  });
}

export function useUpdateOrder(id: number) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Partial<Order>) => ordersApi.update(id, payload),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData(orderKeys.detail(id), order);
      toast.success('سفارش بروزرسانی شد');
    },
    onError: (err) => toast.error('بروزرسانی ناموفق بود', extractErrorMessage(err)),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (order, { status }) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData(orderKeys.detail(order.id), order);
      toast.success('وضعیت تغییر کرد', `→ ${statusLabel(status)}`);
    },
    onError: (err) => toast.error('تغییر وضعیت ناموفق بود', extractErrorMessage(err)),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: number) => ordersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('سفارش حذف شد');
    },
    onError: (err) => toast.error('حذف ناموفق بود', extractErrorMessage(err)),
  });
}
