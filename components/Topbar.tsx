'use client';

import { Search, Bell } from 'lucide-react';
import { useState } from 'react';

export default function Topbar() {
  const [query, setQuery] = useState('');
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur">
      <div className="flex items-center gap-2 lg:w-96">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, products, customers…"
            className="input pl-9"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5">
          <div className="h-7 w-7 rounded-full bg-brand-600 text-center text-xs font-semibold leading-7 text-white">
            A
          </div>
          <div className="text-xs">
            <div className="font-medium text-slate-900">Admin</div>
            <div className="text-slate-500">admin@shop.io</div>
          </div>
        </div>
      </div>
    </header>
  );
}
