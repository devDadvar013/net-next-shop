import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: number;
  icon?: React.ReactNode;
  tone?: 'brand' | 'emerald' | 'amber' | 'rose' | 'slate';
}

const toneStyles: Record<NonNullable<StatCardProps['tone']>, string> = {
  brand:   'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber:   'bg-amber-50 text-amber-700',
  rose:    'bg-rose-50 text-rose-700',
  slate:   'bg-slate-100 text-slate-700',
};

export default function StatCard({ label, value, hint, trend, icon, tone = 'brand' }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && (
          <span className={clsx('flex h-9 w-9 items-center justify-center rounded-xl', toneStyles[tone])}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
        {typeof trend === 'number' && (
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold',
              trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            )}
          >
            <ArrowUpRight className={clsx('h-3 w-3', trend < 0 && 'rotate-180')} />
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {hint && <span>{hint}</span>}
      </div>
    </div>
  );
}
