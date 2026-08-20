'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, X, Package } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, TableRowSkeleton } from '@/components/ui/Feedback';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';
import { useDeleteProduct, useProducts } from '@/hooks/useProducts';
import { formatCurrency, classNames } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'latest' | 'price_asc' | 'price_desc' | 'name' | 'stock'>('latest');
  const [activeFilter, setActiveFilter] = useState<'' | 'active' | 'inactive'>('');
  const debouncedSearch = useDebounce(search, 350);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const { data, isLoading, isFetching } = useProducts({
    page, search: debouncedSearch || undefined, sort,
    is_active: activeFilter === '' ? undefined : activeFilter === 'active',
    per_page: 12,
  });

  const remove = useDeleteProduct();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="محصولات"
        subtitle="کاتالوگ و موجودی"
        actions={
          <Link href="/products/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>محصول جدید</Button>
          </Link>
        }
      />

      <div className="card p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <Input
              placeholder="جستجو بر اساس نام، SKU یا توضیحات…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              leftIcon={<Search className="h-4 w-4" />}
              className="text-[0.8rem]"
            />
          </div>
          <div className="md:col-span-3">
            <Select
              value={sort}
              onChange={(value) => setSort(value as 'latest' | 'price_asc' | 'price_desc' | 'name' | 'stock')}
              options={[
                { label: 'جدیدترین', value: 'latest' },
                { label: 'نام (الف تا ی)', value: 'name' },
                { label: 'قیمت (کم به زیاد)', value: 'price_asc' },
                { label: 'قیمت (زیاد به کم)', value: 'price_desc' },
                { label: 'موجودی (کم به زیاد)', value: 'stock' },
              ]}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              value={activeFilter}
              onChange={(value) => { setActiveFilter(value as '' | 'active' | 'inactive'); setPage(1); }}
              options={[
                { label: 'همه محصولات', value: '' },
                { label: 'فقط فعال', value: 'active' },
                { label: 'فقط غیرفعال', value: 'inactive' },
              ]}
            />
          </div>
          <div className="md:col-span-1">
            <Button
              variant="outline"
              onClick={() => { setSearch(''); setSort('latest'); setActiveFilter(''); setPage(1); }}
              disabled={!search && sort === 'latest' && !activeFilter}
              className="h-12 w-full !px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50/60 dark:bg-slate-900/60">
              <tr>
                <th className="table-th">محصول</th>
                <th className="table-th">SKU</th>
                <th className="table-th text-right">قیمت</th>
                <th className="table-th text-right">موجودی</th>
                <th className="table-th">وضعیت</th>
                <th className="table-th text-right">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              ) : !data || data.data.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="هیچ محصولی نیست"
                      hint="برای شروع اولین محصول را اضافه کنید."
                      action={<Link href="/products/new"><Button>محصول جدید</Button></Link>}
                    />
                  </td>
                </tr>
              ) : (
                data.data.map((p) => (
                  <tr
                    key={p.id}
                    className={classNames('transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40', isFetching && 'opacity-60')}
                  >
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 dark:from-slate-800 dark:to-slate-700 dark:text-slate-400">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                          {p.description && <div className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{p.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="table-td font-mono text-xs">{p.sku}</td>
                    <td className="table-td text-right font-semibold">{formatCurrency(p.price)}</td>
                    <td className="table-td text-right">
                      {p.stock <= 0 ? (
                        <Badge tone="rose">ناموجود</Badge>
                      ) : p.is_low_stock ? (
                        <Badge tone="amber">{p.stock} باقی</Badge>
                      ) : (
                        <span className="font-medium text-slate-700 dark:text-slate-300">{p.stock}</span>
                      )}
                    </td>
                    <td className="table-td">
                      <Badge tone={p.is_active ? 'emerald' : 'slate'}>
                        {p.is_active ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </td>
                    <td className="table-td text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/products/${p.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setToDelete(p)}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
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
        title="آیا محصول حذف شود؟"
        description={toDelete ? `"${toDelete.name}" به‌صورت دائمی حذف خواهد شد.` : ''}
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
