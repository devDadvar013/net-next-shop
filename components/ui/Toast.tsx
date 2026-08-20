'use client';

import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToast, type Toast as T } from '@/hooks/useToast';
import { classNames } from '@/lib/format';

const styleMap: Record<T['kind'], { ring: string; bg: string; text: string; icon: React.ReactNode }> = {
  success: {
    ring: 'ring-emerald-200 dark:ring-emerald-500/30',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-emerald-600 dark:text-emerald-400',
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  error: {
    ring: 'ring-rose-200 dark:ring-rose-500/30',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-rose-600 dark:text-rose-400',
    icon: <AlertCircle className="h-5 w-5" />,
  },
  info: {
    ring: 'ring-blue-200 dark:ring-blue-500/30',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-blue-600 dark:text-blue-400',
    icon: <Info className="h-5 w-5" />,
  },
  warning: {
    ring: 'ring-amber-200 dark:ring-amber-500/30',
    bg: 'bg-white dark:bg-slate-900',
    text: 'text-amber-600 dark:text-amber-400',
    icon: <AlertTriangle className="h-5 w-5" />,
  },
};

export default function ToastViewport() {
  const { toasts, remove } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[60] flex w-full flex-col items-end gap-2 p-4 sm:max-w-sm">
      {toasts.map((t) => {
        const style = styleMap[t.kind];
        return (
          <div
            key={t.id}
            className={classNames(
              'pointer-events-auto flex w-full items-start gap-3 rounded-xl p-3 shadow-lg ring-1 animate-slide-in-r',
              style.bg, style.ring
            )}
          >
            <div className={classNames('mt-0.5 shrink-0', style.text)}>{style.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{t.description}</p>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
