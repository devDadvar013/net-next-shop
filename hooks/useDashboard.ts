'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';

export const dashboardKeys = {
  summary: (range: number) => ['dashboard', 'summary', range] as const,
  recent: (limit: number) => ['dashboard', 'recent', limit] as const,
  top: (limit: number) => ['dashboard', 'top', limit] as const,
};

export function useDashboardSummary(rangeDays = 30) {
  return useQuery({
    queryKey: dashboardKeys.summary(rangeDays),
    queryFn: () => dashboardApi.summary(rangeDays),
    staleTime: 60_000,
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.recent(limit),
    queryFn: () => dashboardApi.recentOrders(limit),
    staleTime: 30_000,
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: dashboardKeys.top(limit),
    queryFn: () => dashboardApi.topProducts(limit),
    staleTime: 60_000,
  });
}
