'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useState } from 'react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = pathname.startsWith('/login');

  if (isLoading && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500" />
          <p className="text-sm text-slate-500 dark:text-slate-400">در حال بارگذاری…</p>
        </div>
      </div>
    );
  }

  // Login page renders bare, no sidebar/topbar.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Not authenticated → render nothing while the redirect in useAuth fires.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white/60 px-6 py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          ShopOrders · لاراول ۱۱ + Next.js 14 · ساخته‌شده برای فروشگاه‌های کوچک
        </footer>
      </div>
    </div>
  );
}
