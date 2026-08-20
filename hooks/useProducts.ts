'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProductListParams, extractErrorMessage, productsApi } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useToast } from './useToast';

const KEY = ['products'] as const;

export const productKeys = {
  all: KEY,
  list: (params: ProductListParams) => [...KEY, 'list', params] as const,
  detail: (id: number) => [...KEY, 'detail', id] as const,
  stats: () => [...KEY, 'stats'] as const,
};

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: number | null | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? 0),
    queryFn: () => productsApi.get(id as number),
    enabled: !!id,
  });
}

export function useProductStats() {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => productsApi.stats(),
    staleTime: 30_000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Partial<Product>) => productsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('محصول ایجاد شد');
    },
    onError: (err) => toast.error('ایجاد محصول ناموفق بود', extractErrorMessage(err)),
  });
}

export function useUpdateProduct(id: number) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: Partial<Product>) => productsApi.update(id, payload),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.setQueryData(productKeys.detail(id), product);
      toast.success('محصول بروزرسانی شد');
    },
    onError: (err) => toast.error('بروزرسانی ناموفق بود', extractErrorMessage(err)),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success('محصول حذف شد');
    },
    onError: (err) => toast.error('حذف ناموفق بود', extractErrorMessage(err)),
  });
}
