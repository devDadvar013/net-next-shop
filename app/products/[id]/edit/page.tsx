'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Feedback';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { extractErrorMessage } from '@/lib/api';
import { groupThousands, parseNumberInput } from '@/lib/format';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);

  const { data: product, isLoading } = useProduct(productId);
  const update = useUpdateProduct(productId);

  const [form, setForm] = useState({
    name: '', sku: '', description: '', price: '0', stock: '0', image_url: '', is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description ?? '',
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url ?? '',
      is_active: product.is_active,
    });
  }, [product]);

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-64 w-full" /></div>;
  }
  if (!product) {
    return <Card><CardBody className="text-center text-sm text-rose-600">محصول یافت نشد.</CardBody></Card>;
  }

  const upd = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    update.mutate(
      {
        ...form,
        price: parseFloat(form.price || '0'),
        stock: parseInt(form.stock || '0', 10),
      },
      {
        onSuccess: () => router.push('/products'),
        onError: (err) => setError(extractErrorMessage(err)),
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="md" onClick={() => router.back()} className="!px-2 text-base">
        بازگشت
      </Button>
      <PageHeader title={`ویرایش: ${product.name}`} subtitle="بروزرسانی جزئیات محصول" />

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="اطلاعات محصول" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="نام" value={form.name} onChange={(e) => upd('name', e.target.value)} required />
            </div>
            <Input label="SKU" value={form.sku} onChange={(e) => upd('sku', e.target.value)} required />
            <Input label="آدرس تصویر" value={form.image_url} onChange={(e) => upd('image_url', e.target.value)} />
            <div className="sm:col-span-2">
              <Textarea label="توضیحات" value={form.description} onChange={(e) => upd('description', e.target.value)} />
            </div>
            <Input
              label="قیمت"
              type="text" inputMode="decimal" required
              value={groupThousands(form.price)}
              onChange={(e) => upd('price', parseNumberInput(e.target.value))}
            />
            <Input label="موجودی" type="number" min="0" value={form.stock} onChange={(e) => upd('stock', e.target.value)} required />
            <div className="flex items-center gap-2 sm:col-span-2">
              <input id="is_active" type="checkbox" checked={form.is_active} onChange={(e) => upd('is_active', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <label htmlFor="is_active" className="text-sm text-slate-700 dark:text-slate-300">فعال</label>
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
