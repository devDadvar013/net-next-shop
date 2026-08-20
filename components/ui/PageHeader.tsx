'use client';

import { classNames } from '@/lib/format';

export function PageHeader({
  title, subtitle, actions, icon,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className={classNames('flex flex-wrap items-center gap-2')}>{actions}</div>}
    </div>
  );
}
