import { classNames, statusBadgeClass, statusLabel } from '@/lib/format';
import type { OrderStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={classNames('badge', statusBadgeClass(status))}>{statusLabel(status)}</span>;
}

export function Badge({ tone = 'slate', children, className }: {
  tone?: 'slate' | 'brand' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo';
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    slate:   'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-600',
    brand:   'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/30',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
    amber:   'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30',
    rose:    'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
    blue:    'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/30',
    indigo:  'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
  } as const;
  return <span className={classNames('badge', tones[tone], className)}>{children}</span>;
}
