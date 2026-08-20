'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Feedback';
import { useOrder, useOrderStatuses, useUpdateOrder } from '@/hooks/useOrders';
import { extractErrorMessage } from '@/lib/api';
import { statusLabel } from '@/lib/format';
import type { OrderStatus } from '@/lib/types';

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = Number(id);

  const { data: order, isLoading } = useOrder(orderId);
  const { data: statuses } = useOrderStatuses();
  const update = useUpdateOrder(orderId);

  const [status, setStatus] = useState<OrderStatus>('pending');
  const [notes, setNotes] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setNotes(order.notes ?? '');
    setShippingAddress(order.shipping_address ?? '');
  }, [order]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!order) {
    return <Card><CardBody className="text-center text-sm text-rose-600">سفارش پیدا نشد.</CardBody></Card>;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    update.mutate(
      { status, notes, shipping_address: shippingAddress },
      {
        onSuccess: () => router.push(`/orders/${orderId}`),
        onError: (err) => setError(extractErrorMessage(err)),
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="md" onClick={() => router.back()} className="!px-2 text-base">
        بازگشت
      </Button>
      <PageHeader title={`ویرایش ${order.order_number}`} subtitle="بروزرسانی وضعیت، یادداشت‌ها یا آدرس ارسال" />

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="جزئیات سفارش" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="وضعیت"
              value={status}
              onChange={(value) => setStatus(value as OrderStatus)}
              options={statuses?.map((s) => ({ label: statusLabel(s.value), value: s.value })) ?? []}
            />
            <Input label="مشتری" value={order.customer?.name ?? ''} disabled />
            <div className="sm:col-span-2">
              <Textarea label="آدرس ارسال" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Textarea label="یادداشت‌ها" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>لغو</Button>
            <Button type="submit" loading={update.isPending}>ذخیره تغییرات</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
