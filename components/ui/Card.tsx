import { classNames } from '@/lib/format';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames('card', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={classNames('flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800', className)}>
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={classNames('p-5', className)}>{children}</div>;
}
