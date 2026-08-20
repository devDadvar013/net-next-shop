'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { useCreateOrder, useOrderStatuses } from '@/hooks/useOrders';
import { extractErrorMessage } from '@/lib/api';
import { formatCurrency, statusLabel } from '@/lib/format';
import type { OrderStatus } from '@/lib/types';

interface LineItem { product_id: number; quantity: number }

export default function NewOrderPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [notes, setNotes] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { data: customers } = useCustomers({ per_page: 100 });
  const { data: products } = useProducts({ per_page: 100, is_active: true });
  const { data: statuses } = useOrderStatuses();
  const create = useCreateOrder();

  const productMap = new Map((products?.data ?? []).map((p) => [p.id, p]));

  const addRow = () => setItems((p) => [...p, { product_id: 0, quantity: 1 }]);
  const removeRow = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateRow = (i: number, patch: Partial<LineItem>) =>
    setItems((p) => p.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const total = items.reduce((sum, row) => {
    const p = productMap.get(row.product_id);
    return sum + (p ? p.price * row.quantity : 0);
  }, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerId || items.length === 0 || items.some((i) => !i.product_id || i.quantity < 1)) {
      setError('لطفاً یک مشتری و حداقل یک آیتم معتبر اضافه کنید.');
      return;
    }
    create.mutate(
      {
        customer_id: customerId as number,
        status,
        notes: notes || undefined,
        shipping_address: shippingAddress || undefined,
        items: items.map(({ product_id, quantity }) => ({ product_id, quantity })),
      },
      {
        onSuccess: () => router.push('/orders'),
        onError: (err) => setError(extractErrorMessage(err)),
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        size="md"
        onClick={() => router.back()}
        className="!px-2 text-base"
      >
        بازگشت
      </Button>
      <PageHeader
        title="سفارش جدید"
        subtitle="یک سفارش برای مشتری ایجاد کنید"
      />

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="مشتری" subtitle="این سفارش را چه کسی ثبت می‌کند؟" />
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="مشتری *"
                value={customerId}
                onChange={(value) => setCustomerId(value ? Number(value) : '')}
                placeholder="— انتخاب مشتری —"
                options={[
                  { label: '— انتخاب مشتری —', value: '' },
                  ...(customers?.data.map((c) => ({ label: `${c.name} · ${c.email}`, value: c.id })) ?? []),
                ]}
              />
              <Select
                label="وضعیت"
                value={status}
                onChange={(value) => setStatus(value as OrderStatus)}
                options={statuses?.map((s) => ({ label: statusLabel(s.value), value: s.value })) ?? []}
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="آدرس ارسال"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="خیابان، شهر، کد پستی…"
                />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="یادداشت‌ها"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="یادداشت‌های داخلی…"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="اقلام"
              subtitle="محصولات را به این سفارش اضافه کنید"
              action={
                <Button type="button" variant="secondary" size="sm" onClick={addRow} leftIcon={<Plus className="h-4 w-4" />}>
                  افزودن آیتم
                </Button>
              }
            />
            <CardBody>
              {items.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/30">
                  <ShoppingBag className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">هنوز آیتمی اضافه نشده</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">برای شروع، روی «افزودن آیتم» کلیک کنید.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((row, i) => {
                    const p = productMap.get(row.product_id);
                    const line = p ? p.price * row.quantity : 0;
                    const outOfStock = p && row.quantity > p.stock;
                    return (
                      <div key={i} className="grid grid-cols-12 items-center gap-2 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                        <div className="col-span-12 sm:col-span-6">
                          <Select
                            value={row.product_id}
                            onChange={(value) => updateRow(i, { product_id: Number(value) })}
                            options={[
                              { label: '— انتخاب محصول —', value: 0 },
                              ...(products?.data.map((pp) => ({
                                label: `${pp.name} (${pp.sku}) — ${formatCurrency(pp.price)} · موجودی ${pp.stock}`,
                                value: pp.id,
                              })) ?? []),
                            ]}
                          />
                        </div>
                        <div className="col-span-5 sm:col-span-2">
                          <Input
                            type="number"
                            min={1}
                            value={row.quantity}
                            onChange={(e) => updateRow(i, { quantity: Math.max(1, Number(e.target.value)) })}
                          />
                        </div>
                        <div className="col-span-5 text-right text-sm font-semibold text-slate-900 dark:text-slate-100 sm:col-span-3">
                          {formatCurrency(line)}
                          {outOfStock && <p className="text-[11px] font-normal text-rose-500">موجودی کافی نیست</p>}
                        </div>
                        <div className="col-span-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeRow(i)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="خلاصه" />
            <CardBody>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <dt>اقلام</dt>
                  <dd className="font-semibold text-slate-900 dark:text-slate-100">{items.length}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                  <dt>مشتری</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {customerId ? customers?.data.find((c) => c.id === customerId)?.name : '—'}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-800">
                  <dt className="text-base font-semibold text-slate-900 dark:text-slate-100">جمع</dt>
                  <dd className="text-lg font-bold text-brand-600 dark:text-brand-400">
                    {formatCurrency(total)}
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>لغو</Button>
            <Button type="submit" loading={create.isPending}>ایجاد سفارش</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
