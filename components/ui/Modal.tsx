'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '@/lib/format';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in dark:bg-slate-950/80"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={classNames(
          'relative w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-slide-up sm:rounded-2xl',
          'dark:bg-slate-900 dark:ring-slate-800',
          sizeMap[size]
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div>
              {title && <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
              {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
              aria-label="بستن"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
