'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Phone, Plus, Search, Trash2, User, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState, Skeleton } from '@/components/ui/Feedback';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useCustomers, useDeleteCustomer } from '@/hooks/useCustomers';
import { formatCurrency, classNames } from '@/lib/format';
import type { Customer } from '@/lib/types';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [toDelete, setToDelete] = useState<Customer | null>(null);

  const { data, isLoading, isFetching } = useCustomers({
    page, search: debouncedSearch || undefined, per_page: 12,
  });
  const remove = useDeleteCustomer();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="مشتریان"
        subtitle="افرادی که از فروشگاه شما خرید می‌کنند"
        actions={
          <Link href="/customers/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>مشتری جدید</Button>
          </Link>
        }
      />

      <div className="card p-4">
        <Input
          placeholder="جستجو بر اساس نام، ایمیل یا تلفن…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          leftIcon={<Search className="h-4 w-4" />}
          className="text-[0.8rem]"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <EmptyState
          title="مشتری‌ای وجود ندارد"
          hint="برای شروع اولین مشتری را اضافه کنید."
          action={
            <Link href="/customers/new">
              <Button>مشتری جدید</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.data.map((c) => (
            <div
              key={c.id}
              className={classNames(
                'card card-hover group p-5',
                isFetching && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={c.name} size="lg" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {c.orders_count ?? 0} سفارش · {formatCurrency(c.total_spent ?? 0)} هزینه‌شده
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setToDelete(c)}
                  className="rounded-lg p-2 text-rose-500 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  title="حذف"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{c.email}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    {c.phone}
                  </div>
                )}
                {c.address && (
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{c.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data && data.last_page > 1 && (
        <div className="card p-0 overflow-hidden">
          <Pagination
            page={data.current_page}
            lastPage={data.last_page}
            total={data.total}
            from={data.from}
            to={data.to}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="مشتری حذف شود؟"
        description={toDelete ? `${toDelete.name} و تمام اطلاعات مرتبط با آن حذف خواهد شد.` : ''}
        confirmText="حذف"
        danger
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) });
        }}
      />
    </div>
  );
}
