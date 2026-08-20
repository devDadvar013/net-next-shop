'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => void;
  remove: (id: number) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { ...t, id }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      push,
      remove,
      success: (title, description) => push({ kind: 'success', title, description }),
      error:   (title, description) => push({ kind: 'error',   title, description }),
      info:    (title, description) => push({ kind: 'info',    title, description }),
      warning: (title, description) => push({ kind: 'warning', title, description }),
    }),
    [toasts, push, remove]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
