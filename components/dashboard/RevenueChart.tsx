'use client';

import { useMemo } from 'react';
import {
  AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { formatCurrency, formatDateShort } from '@/lib/format';
import type { DailyRevenue } from '@/lib/types';

export default function RevenueChart({ data, rangeDays }: { data: DailyRevenue[]; rangeDays?: number }) {
  const formatted = useMemo(() => {
    if (!rangeDays || data.length >= rangeDays) {
      return data.map((d) => ({ ...d, label: formatDateShort(d.date) }));
    }

    // Fill in missing days with zero revenue so single/sparse data points
    // don't collapse to the middle of the chart with huge empty margins.
    const byDate = new Map(data.map((d) => [d.date.slice(0, 10), d]));
    const filled: (DailyRevenue & { label: string })[] = [];
    const today = new Date();
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const existing = byDate.get(key);
      filled.push({
        date: key,
        total: existing?.total ?? 0,
        orders: existing?.orders ?? 0,
        label: formatDateShort(key),
      });
    }
    return filled;
  }, [data, rangeDays]);

  if (!formatted.length) {
    return <div className="flex h-72 items-center justify-center text-sm text-slate-400">هنوز داده‌ای وجود ندارد</div>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(226 232 240)" className="dark:opacity-20" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            className="text-slate-500 dark:text-slate-400"
            minTickGap={28}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickLine={false}
            axisLine={false}
            className="text-slate-500 dark:text-slate-400"
            width={56}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgb(226 232 240)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              fontSize: 12,
              backgroundColor: 'rgb(255 255 255)',
            }}
            formatter={(v: number) => [formatCurrency(v), 'Revenue']}
            labelStyle={{ color: '#64748b' }}
            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#revenueFill)"
            activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
