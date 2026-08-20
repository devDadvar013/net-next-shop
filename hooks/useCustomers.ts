'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CustomerListParams, customersApi, extractErrorMessage } from '@/lib/api';
import type { Customer } from '@/lib/types';
import { useToast } from './useToast';

const KEY = ['customers'] as const;

export const customerKeys = {
  all: KEY,
  list: (params: CustomerListParams) => [...KEY, 'list', params] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
};

export function useCustomers(params: CustomerListParams = {}) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customersApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id: number | null | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id ?? 0),
    queryFn: () => customersApi.get(id as number),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Partial<Customer>) => customersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('مشتری ایجاد شد');
    },
    onError: (err) => toast.error('ایجاد مشتری ناموفق بود', extractErrorMessage(err)),
  });
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Partial<Customer>) => customersApi.update(id, payload),
    onSuccess: (customer) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData(customerKeys.detail(id), customer);
      toast.success('مشتری بروزرسانی شد');
    },
    onError: (err) => toast.error('بروزرسانی ناموفق بود', extractErrorMessage(err)),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: number) => customersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('مشتری حذف شد');
    },
    onError: (err) => toast.error('حذف ناموفق بود', extractErrorMessage(err)),
  });
}
