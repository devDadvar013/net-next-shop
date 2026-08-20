'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, Filter, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { EmptyState, TableRowSkeleton } from '@/components/ui/Feedback';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeleteOrder, useOrderStatuses, useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { formatCurrency, formatDate, classNames, statusLabel } from '@/lib/format';
import type { Order, OrderStatus } from '@/lib/types';

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [toDelete, setToDelete] = useState<Order | null>(null);

  const { data, isLoading, isFetching } = useOrders({
    page, status: status || undefined, search: debouncedSearch || undefined, per_page: 10,
  });
  const { data: statuses } = useOrderStatuses();
  const updateStatus = useUpdateOrderStatus();
  const remove = useDeleteOrder();

  const hasFilters = !!(status || search);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="سفارش‌ها"
        subtitle="سفارش‌های مشتری را دنبال، بروزرسانی و ارسال کنید"
        actions={
          <Link href="/orders/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>سفارش جدید</Button>
          </Link>
        }
      />

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <Input
              placeholder="جستجو بر اساس شماره سفارش یا مشتری…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              leftIcon={<Search className="h-4 w-4" />}
              className="text-[0.8rem]"
            />
          </div>
          <div className="md:col-span-4">
            <Select
              value={status}
              onChange={(value) => { setStatus(value as OrderStatus | ''); setPage(1); }}
              options={[
                { label: 'همه وضعیت‌ها', value: '' },
                ...(statuses?.map((s) => ({ label: statusLabel(s.value), value: s.value })) ?? []),
              ]}
              className="text-sm"
            />
          </div>
          <div className="md:col-span-4">
            <Button
              variant="outline"
              className="w-full h-12 text-sm"
              onClick={() => { setSearch(''); setStatus(''); setPage(1); }}
              disabled={!hasFilters}
              leftIcon={hasFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            >
              {hasFilters ? 'پاک کردن' : 'فیلترها'}
            </Button>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50/60 dark:bg-slate-900/60">
              <tr>
                <th className="table-th">سفارش</th>
                <th className="table-th">مشتری</th>
                <th className="table-th">وضعیت</th>
                <th className="table-th">اقلام</th>
                <th className="table-th text-right">جمع</th>
                <th className="table-th">ایجاد شده</th>
                <th className="table-th text-right">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
              ) : !data || data.data.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="سفارشی پیدا نشد"
                      hint={hasFilters ? 'سعی کنید فیلترها را پاک کنید.' : 'برای شروع اولین سفارش خود را ایجاد کنید.'}
                      action={
                        hasFilters ? (
                          <Button variant="outline" onClick={() => { setSearch(''); setStatus(''); setPage(1); }}>پاک کردن فیلترها</Button>
                        ) : (
                          <Link href="/orders/new"><Button>ایجاد سفارش</Button></Link>
                        )
                      }
                    />
                  </td>
                </tr>
              ) : (
                data.data.map((o) => (
                  <tr
                    key={o.id}
                    className={classNames(
                      'transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40',
                      isFetching && 'opacity-60'
                    )}
                  >
                    <td className="table-td">
                      <Link href={`/orders/${o.id}`} className="font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="table-td">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{o.customer?.name ?? '—'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{o.customer?.email}</div>
                    </td>
                    <td className="table-td">
                      <Select
                        value={o.status}
                        onChange={(value) => updateStatus.mutate({ id: o.id, status: value as OrderStatus })}
                        options={statuses?.map((s) => ({ label: statusLabel(s.value), value: s.value })) ?? []}
                        className="!py-1 !text-xs"
                      />
                      <div className="mt-1.5">
                        <StatusBadge status={o.status} />
                      </div>
                    </td>
                    <td className="table-td">
                      <Badge tone="slate">{o.items_count ?? o.items?.length ?? 0}</Badge>
                    </td>
                    <td className="table-td text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(o.total_amount)}
                    </td>
                    <td className="table-td text-slate-500 dark:text-slate-400">{formatDate(o.created_at)}</td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/orders/${o.id}`} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" title="مشاهده">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/orders/${o.id}/edit`} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" title="ویرایش">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete(o)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && (
          <Pagination
            page={data.current_page}
            lastPage={data.last_page}
            total={data.total}
            from={data.from}
            to={data.to}
            onPageChange={setPage}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="آیا سفارش حذف شود؟"
        description={toDelete ? `${toDelete.order_number} به‌صورت دائمی حذف خواهد شد. در صورتی که سفارش لغو نشده باشد، موجودی بازگردانده خواهد شد.` : ''}
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
