'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, AlertTriangle, DollarSign, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import StatCard from '@/components/dashboard/StatCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import StatusChart from '@/components/dashboard/StatusChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { useDashboardSummary } from '@/hooks/useDashboard';
import { formatCurrency, formatNumber } from '@/lib/format';
import { StatSkeleton } from '@/components/ui/Feedback';

const RANGES = [
  { label: '۷ روز',  value: 7 },
  { label: '۳۰ روز', value: 30 },
  { label: '۹۰ روز', value: 90 },
];

export default function DashboardPage() {
  const [range, setRange] = useState(30);
  const { data, isLoading } = useDashboardSummary(range);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={<LayoutDashboard className="h-5 w-5" />}
        title="داشبورد"
        subtitle="فروشگاه شما در یک نگاه"
        actions={
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={
                  range === r.value
                    ? 'rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm dark:bg-slate-700 dark:text-brand-300'
                    : 'rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          <>
            <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="درآمد کل"
              value={formatCurrency(data?.total_revenue ?? 0)}
              icon={<DollarSign className="h-5 w-5" />}
              tone="emerald"
              hint={`${data?.orders_count ?? 0} سفارش در بازه`}
            />
            <StatCard
              label="میانگین ارزش سفارش"
              value={formatCurrency(data?.average_order_value ?? 0)}
              icon={<Sparkles className="h-5 w-5" />}
              tone="brand"
              hint="برای هر سفارش تکمیل شده"
            />
            <StatCard
              label="سفارش‌های در انتظار"
              value={formatNumber(data?.pending_orders ?? 0)}
              icon={<ShoppingCart className="h-5 w-5" />}
              tone="amber"
              hint="در انتظار پردازش"
            />
            <StatCard
              label="موجودی کم"
              value={formatNumber(data?.low_stock_count ?? 0)}
              icon={<AlertTriangle className="h-5 w-5" />}
              tone="rose"
              hint={`${data?.products_count ?? 0} کالای فعال`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card card-hover lg:col-span-2 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">درآمد</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">مجموع روزانه در بازه انتخاب‌شده</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-500" />
              درآمد
            </div>
          </div>
          <RevenueChart data={data?.daily_revenue ?? []} rangeDays={range} />
        </div>

        <div className="card card-hover p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">وضعیت سفارش‌ها</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">توزیع همه سفارش‌ها</p>
          </div>
          <StatusChart data={data?.status_breakdown ?? {}} />
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}
