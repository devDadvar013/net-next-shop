'use client';

import { useState } from 'react';
import { Bell, Menu, Moon, Search, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Badge } from '@/components/ui/Badge';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [signingOut, setSigningOut] = useState(false);

  const onLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
      toast.info('خروج انجام شد', 'به امید دیدار!');
    } catch (e) {
      toast.error('خروج ناموفق بود', e instanceof Error ? e.message : 'دوباره تلاش کنید');
    } finally {
      setSigningOut(false);
    }
  };

  const initial = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:hover:bg-slate-800"
            aria-label="باز کردن منو"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {/* <div className="relative hidden w-60 sm:block">
          <Search className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
          <input
            placeholder="جستجو…"
            className="input pr-11 pl-14 text-sm"
          />
          <kbd className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 sm:inline dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            ⌘K
          </kbd>
        </div> */}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={toggle}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
          aria-label="تغییر حالت"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
          aria-label="اعلان‌ها"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User menu */}
        <div className="ml-1 hidden items-center gap-2 rounded-xl bg-slate-100 px-2.5 py-1.5 sm:flex dark:bg-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-semibold text-white">
            {initial}
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {user?.name ?? 'مهمان'}
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              {user?.email ?? '—'}
            </div>
          </div>
        </div>

        <Badge tone="emerald" className="ml-1 hidden md:inline-flex">آنلاین</Badge>
 
        <button
          onClick={onLogout}
          disabled={signingOut}
          className="ml-1 inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
          aria-label="خروج"
          title="خروج"
        >
          {signingOut ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-300 border-t-rose-600" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">خروج</span>
        </button>

        {/* Mobile compact user icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-semibold text-white sm:hidden">
          {initial}
        </div>
        <span className="sr-only">
          <UserIcon className="h-4 w-4" />
        </span>
      </div>
    </header>
  );
}
