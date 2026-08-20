'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get('next') || '/';
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('admin@shop.io');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('خوش آمدید!', 'شما با موفقیت وارد شدید.');
      router.replace(nextPath);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'ورود ناموفق بود';
      setError(msg);
      toast.error('ورود ناموفق', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertCircle className=" h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Input
        label="ایمیل"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@shop.io"
        leftIcon={<Mail className="h-4 w-4" />}
      />

      <Input
        label="رمز عبور"
        type={showPassword ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        leftIcon={<Lock className="h-4 w-4" />}
        rightAddon={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={submitting}
        leftIcon={<LogIn className="h-4 w-4" />}
        className="w-full"
      >
        {submitting ? 'در حال ورود…' : 'ورود'}
      </Button>

      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:ring-slate-700">
        <p className="font-semibold text-slate-700 dark:text-slate-200">اطلاعات ورود نمونه</p>
        <p className="mt-1">
          <span className="font-mono">admin@shop.io</span> · <span className="font-mono">password</span>
        </p>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-brand-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold">ShopOrders</div>
              <div className="text-xs text-white/80">پنل مدیریت</div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight">
              فروشگاه خود را با خیال راحت مدیریت کنید.
            </h2>
            <p className="mt-3 text-sm text-white/80">
              سفارش‌ها، مشتریان، کالاها و درآمد را در یک داشبورد منظم پیگیری کنید.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-white/90">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" /> داشبورد لحظه‌ای
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" /> پیگیری سفارش‌ها و موجودی
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" /> ورود امن مبتنی بر توکن
              </li>
            </ul>
          </div>

          <p className="text-xs text-white/70">© {new Date().getFullYear()} ShopOrders</p>
        </div>

        {/* Form panel */}
        <div className="p-8 sm:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-slate-100">ShopOrders</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">پنل مدیریت</div>
            </div>
          </div>

          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-sm text-rose-900 shadow-sm dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-200"
          >
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="font-semibold">توجه: ورود فقط از طریق VPN امکان‌پذیر است.</p>
              <p className="mt-1 text-xs leading-relaxed text-rose-800/90 dark:text-rose-300/90">
                پیش از وارد کردن اطلاعات حساب، VPN خود را فعال کنید. در غیر این صورت دسترسی به سامانه برقرار نخواهد شد.
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">ورود</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            با اطلاعات مدیر خود وارد داشبورد شوید.
          </p>

          <div className="mt-6">
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />}>
              <LoginForm />
            </Suspense>
          </div>

          {/* <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            نیاز به راهنمایی دارید؟ <Link href="https://laravel.com/docs" className="text-brand-600 hover:underline">اسناد API</Link> را ببینید.
          </p> */}
        </div>
      </div>
    </div>
  );
}
