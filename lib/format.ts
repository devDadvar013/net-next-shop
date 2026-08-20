import type { OrderStatus, StatusTone } from './types';

export const groupThousands = (value: string): string => {
  if (!value) return '';
  const negative = value.startsWith('-');
  const raw = negative ? value.slice(1) : value;
  const [intPart, decPart] = raw.split('.');
  const grouped = (intPart || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const withDecimal = decPart !== undefined ? `${grouped}.${decPart}` : grouped;
  return negative ? `-${withDecimal}` : withDecimal;
};

export const parseNumberInput = (value: string): string => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
};

export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 2,
  }).format(num);
};
 
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('fa-IR').format(value);
};

export const formatDate = (iso?: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};
 
export const formatDateShort = (iso?: string | null): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
};
 
export const relativeTime = (iso?: string | null): string => {
  if (!iso) return '—';
  const date = new Date(iso);
  const diff = (Date.now() - date.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return 'لحظاتی پیش';
  if (abs < 3600) return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (abs < 86400) return `${Math.floor(diff / 3600)} ساعت پیش`;
  if (abs < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
  return formatDateShort(iso);
};

const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  pending:    'amber',
  processing: 'blue',
  shipped:    'indigo',
  delivered:  'emerald',
  cancelled:  'rose',
};

const TONE_STYLES: Record<StatusTone, string> = {
  amber:   'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  blue:    'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20',
  indigo:  'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  rose:    'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20',
  slate:   'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-600',
};

export const statusTone = (status: OrderStatus): StatusTone => STATUS_TONE[status] ?? 'slate';
export const statusBadgeClass = (status: OrderStatus): string => TONE_STYLES[statusTone(status)];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};
export const statusLabel = (status: OrderStatus): string => STATUS_LABEL[status] ?? status;

export const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('') || '?';

export const classNames = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');
