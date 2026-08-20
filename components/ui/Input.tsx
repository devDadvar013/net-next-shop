'use client';

import { forwardRef } from 'react';
import { classNames } from '@/lib/format';
import { Select } from './Select';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightAddon, className, id, ...props },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          dir="rtl"
          className={classNames(
            'input',
            leftIcon ? 'pr-9' : '',
            rightAddon ? 'pl-12' : '',
            error ? 'border-rose-300 ring-2 ring-rose-200 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500/50 dark:ring-rose-500/10' : '',
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-slate-500">
            {rightAddon}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...props },
  ref
) {
  const tid = id || `ta-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="w-full">
      {label && <label htmlFor={tid} className="label">{label}</label>}
      <textarea
        ref={ref}
        id={tid}
        dir="rtl"
        className={classNames('input min-h-[80px]', error && 'ring-rose-300', className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
});

export { Select } from './Select';
