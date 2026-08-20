'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
} from 'lucide-react';
import clsx from 'clsx';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/customers', label: 'Customers', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-bold">
          S
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">ShopOrders</div>
          <div className="text-xs text-slate-500">Management panel</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-4 text-white">
        <div className="text-sm font-semibold">Need help?</div>
        <p className="mt-1 text-xs text-white/80">
          Check the README for setup steps and API docs.
        </p>
      </div>
    </aside>
  );
}
