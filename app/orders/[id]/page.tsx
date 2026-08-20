'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Mail, MapPin, Package, Pencil, Phone, Truck, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Feedback';
import { useDeleteOrder, useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useOrderStatuses } from '@/hooks/useOrders';
import { formatCurrency, formatDate, relativeTime, statusLabel } from '@/lib/format';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useState } from 'react';
import type { OrderStatus } from '@/lib/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const orderId = Number(id);

  const { data: order, isLoading } = useOrder(orderId);
  const { data: statuses } = useOrderStatuses();
  const updateStatus = useUpdateOrderStatus();
  const remove = useDeleteOrder();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!order) {
    return (
      <Card><CardBody className="text-center text-sm text-rose-600">سفارش پیدا نشد.</CardBody></Card>
    );
  }

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
        title={order.order_number}
        subtitle={`ایجاد شده در ${formatDate(order.created_at)} · ${relativeTime(order.created_at)}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/orders/${order.id}/edit`}>
              <Button variant="outline" leftIcon={<Pencil className="h-4 w-4" />}>ویرایش</Button>
            </Link>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>حذف</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="اقلام"
              subtitle={`${order.items?.length ?? 0} کالا`}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50/60 dark:bg-slate-900/60">
                  <tr>
                    <th className="table-th">کالا</th>
                    <th className="table-th text-right">قیمت واحد</th>
                    <th className="table-th text-right">تعداد</th>
                    <th className="table-th text-right">جمع ردیف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items?.map((it) => (
                    <tr key={it.id}>
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 dark:from-slate-800 dark:to-slate-700 dark:text-slate-300">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">{it.product?.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{it.product?.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-td text-right">{formatCurrency(it.unit_price)}</td>
                      <td className="table-td text-right">{it.quantity}</td>
                      <td className="table-td text-right font-semibold">{formatCurrency(it.line_total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                    <td colSpan={3} className="table-td text-right text-sm font-semibold text-slate-700 dark:text-slate-300">جمع کل</td>
                    <td className="table-td text-right text-lg font-bold text-brand-600 dark:text-brand-400">
                      {formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader title="یادداشت‌ها" />
              <CardBody>
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{order.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="وضعیت" />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <StatusBadge status={order.status} />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  بروزرسانی {relativeTime(order.updated_at)}
                </span>
              </div>
              <div>
                <Select
                  label="تغییر وضعیت"
                  value={order.status}
                  onChange={(value) => updateStatus.mutate({ id: order.id, status: value as OrderStatus })}
                  options={statuses?.map((s) => ({ label: statusLabel(s.value), value: s.value })) ?? []}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="مشتری" />
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {order.customer?.name}
                  </div>
                  {order.customer?.email && (
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${order.customer.email}`} className="hover:text-brand-600">
                        {order.customer.email}
                      </a>
                    </div>
                  )}
                  {order.customer?.phone && (
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      {order.customer.phone}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {order.shipping_address && (
            <Card>
              <CardHeader title="ارسال" />
              <CardBody>
                <div className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <p className="whitespace-pre-wrap">{order.shipping_address}</p>
                </div>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardBody className="text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>ایجاد شده</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>بروزرسانی شده</span>
                <span>{formatDate(order.updated_at)}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="این سفارش حذف شود؟"
        description="این عملیات قابل بازگشت نیست. موجودی به انبار بازگردانده خواهد شد."
        confirmText="حذف"
        danger
        loading={remove.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          remove.mutate(order.id, {
            onSuccess: () => router.push('/orders'),
          });
        }}
      />
    </div>
  );
}
