'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useCreateProduct } from '@/hooks/useProducts';
import { extractErrorMessage } from '@/lib/api';
import { groupThousands, parseNumberInput } from '@/lib/format';

export default function NewProductPage() {
  const router = useRouter();
  const create = useCreateProduct();
  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    price: '0',
    stock: '0',
    image_url: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);

  const upd = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    create.mutate(
      {
        name: form.name,
        sku: form.sku,
        description: form.description || undefined,
        price: parseFloat(form.price || '0'),
        stock: parseInt(form.stock || '0', 10),
        image_url: form.image_url || undefined,
        is_active: form.is_active,
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
      <PageHeader title="محصول جدید" subtitle="اضافه کردن محصول به کاتالوگ" />

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="اطلاعات محصول" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="نام *" value={form.name} onChange={(e) => upd('name', e.target.value)} required />
            </div>
            <Input label="SKU *" value={form.sku} onChange={(e) => upd('sku', e.target.value)} required />
            <Input label="آدرس تصویر" value={form.image_url} onChange={(e) => upd('image_url', e.target.value)} placeholder="https://…" />
            <div className="sm:col-span-2">
              <Textarea label="توضیحات" value={form.description} onChange={(e) => upd('description', e.target.value)} />
            </div>
            <Input
              label="قیمت *"
              type="text" inputMode="decimal" required
              value={groupThousands(form.price)}
              onChange={(e) => upd('price', parseNumberInput(e.target.value))}
            />
            <Input
              label="موجودی *"
              type="number" min="0" required
              value={form.stock}
              onChange={(e) => upd('stock', e.target.value)}
            />
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => upd('is_active', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="is_active" className="text-sm text-slate-700 dark:text-slate-300">
                فعال (قابل مشاهده در فروشگاه)
              </label>
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
            <Button type="submit" loading={create.isPending}>ایجاد محصول</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
