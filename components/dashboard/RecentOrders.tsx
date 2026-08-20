'use client';

import Link from 'next/link';
import { useRecentOrders } from '@/hooks/useDashboard';
import { formatCurrency, relativeTime } from '@/lib/format';
import { StatusBadge } from '@/components/ui/Badge';
import { EmptyState, Skeleton } from '@/components/ui/Feedback';
import { ShoppingBag } from 'lucide-react';

export default function RecentOrders() {
  const { data, isLoading } = useRecentOrders(8);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">سفارش‌های اخیر</h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">آخرین فعالیت‌ها از فروشگاه شما</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-400"
        >
          مشاهده همه
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState title="هنوز سفارشی ثبت نشده" hint="اولین سفارش خود را ایجاد کنید تا اینجا نمایش داده شود." />
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orders/${o.id}`}
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 dark:from-brand-500/20 dark:to-brand-500/5 dark:text-brand-300">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {o.order_number}
                    </p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {o.customer?.name ?? 'ناشناخته'} · {relativeTime(o.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(o.total_amount)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
