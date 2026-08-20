import { classNames } from '@/lib/format';
import { Inbox } from 'lucide-react';

export function EmptyState({
  title, hint, icon, action,
}: { title: string; hint?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 dark:from-slate-800 dark:to-slate-700">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {hint && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={classNames('skeleton h-4 w-full', className)} />;
}

export function StatSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-4 h-7 w-32" />
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="table-td">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
