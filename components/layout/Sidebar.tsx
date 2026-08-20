'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Sparkles,
  X,
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { classNames } from '@/lib/format';

const nav = [
  { href: '/', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/orders', label: 'سفارش‌ها', icon: ShoppingCart },
  { href: '/products', label: 'کالاها', icon: Package },
  { href: '/customers', label: 'مشتریان', icon: Users },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const content = (
    <div className="flex h-full flex-col w-full">
      <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-200 px-5 dark:border-slate-800">
        <Link href="/" onClick={onClose} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">ShopOrders</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">پنل مدیریت</div>
          </div>
        </Link>
        {isMobile && onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-1.5">
        <div className="px-2 pb-1 pt-2 text-[15px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          منو
        </div>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={classNames(
                'group flex items-center gap-3 rounded-xl px-2 py-1.5 text-base font-medium transition',
                active
                  ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/10 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
              )}
            >
              <Icon className={classNames('h-5 w-5 transition', active && 'text-brand-600 dark:text-brand-400')} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
            </Link>
          );
        })}
      </nav>

      {/* <div className="m-3 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 p-4 text-white shadow-glow">
        <div className="text-sm font-semibold">نسخه ۱.۰ · لاراول ۱۱</div>
        <p className="mt-1 text-xs text-white/80">
          راه‌اندازی را در <code className="rounded bg-white/15 px-1 py-0.5 text-[10px]">README.md</code> ببینید.
        </p>
      </div> */}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm animate-fade-in lg:hidden"
            onClick={onClose}
          />
        )}
        <aside
          className={classNames(
            'fixed inset-y-0 right-0 z-50 w-72 transform border-l border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:hidden',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside className="hidden w-72 shrink-0 border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
      {content}
    </aside>
  );
}
