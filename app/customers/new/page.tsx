'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { extractErrorMessage } from '@/lib/api';

export default function NewCustomerPage() {
  const router = useRouter();
  const create = useCreateCustomer();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState<string | null>(null);
  const upd = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    create.mutate(
      {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        address: form.address || undefined,
      },
      {
        onSuccess: () => router.push('/customers'),
        onError: (err) => setError(extractErrorMessage(err)),
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="md" onClick={() => router.back()} className="!px-2 text-base">
        بازگشت
      </Button>
      <PageHeader title="مشتری جدید" subtitle="افزودن مشتری به پایگاه داده" />

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="جزئیات مشتری" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="نام *" value={form.name} onChange={(e) => upd('name', e.target.value)} required />
            <Input label="ایمیل *" type="email" value={form.email} onChange={(e) => upd('email', e.target.value)} required />
            <Input label="تلفن" value={form.phone} onChange={(e) => upd('phone', e.target.value)} />
            <div className="sm:col-span-2">
              <Textarea label="آدرس" value={form.address} onChange={(e) => upd('address', e.target.value)} />
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
            <Button type="submit" loading={create.isPending}>ایجاد مشتری</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
