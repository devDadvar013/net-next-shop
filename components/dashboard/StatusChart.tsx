'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { statusLabel } from '@/lib/format';
import type { OrderStatus } from '@/lib/types';

const COLORS: Record<string, string> = {
  pending:    '#f59e0b',
  processing: '#3b82f6',
  shipped:    '#6366f1',
  delivered:  '#10b981',
  cancelled:  '#f43f5e',
};

export default function StatusChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return <div className="flex h-72 items-center justify-center text-sm text-slate-400">هنوز سفارشی ثبت نشده</div>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={0}
          >
            {chartData.map((d) => (
              <Cell key={d.name} fill={COLORS[d.name] ?? '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgb(226 232 240)',
              fontSize: 12,
            }}
            formatter={(v: number, name: string) => [v, statusLabel(name as OrderStatus)]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ display: 'flex', justifyContent: 'center', gap: '18px' }}
            formatter={(value) => (
              <span className="mx-2 text-xs text-slate-600 dark:text-slate-400">
                {statusLabel(value as OrderStatus)}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
