'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { classNames } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: number;
  icon: React.ReactNode;
  tone?: 'brand' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo';
}

const toneStyles = {
  brand:   'from-brand-500 to-indigo-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber:   'from-amber-500 to-orange-600',
  rose:    'from-rose-500 to-pink-600',
  blue:    'from-blue-500 to-cyan-600',
  indigo:  'from-indigo-500 to-violet-600',
} as const;

export default function StatCard({ label, value, hint, trend, icon, tone = 'brand' }: StatCardProps) {
  const trendUp = typeof trend === 'number' && trend >= 0;
  return (
    <div className="card card-hover group relative overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        <div className={classNames(
          'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition group-hover:scale-105',
          toneStyles[tone]
        )}>
          {icon}
        </div>
      </div>
      <div className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        {typeof trend === 'number' && (
          <span className={classNames(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            trendUp
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
          )}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {hint && <span>{hint}</span>}
      </div>
    </div>
  );
}
