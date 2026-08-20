'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  from?: number | null;
  to?: number | null;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, lastPage, total, from, to, onPageChange }: PaginationProps) {
  if (lastPage <= 1) {
    return total > 0 ? (
      <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
        Showing {total} {total === 1 ? 'item' : 'items'}
      </div>
    ) : null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm sm:flex-row dark:border-slate-800">
      <div className="text-slate-600 dark:text-slate-400">
        Showing <span className="font-medium text-slate-900 dark:text-slate-100">{from ?? 0}</span>–
        <span className="font-medium text-slate-900 dark:text-slate-100">{to ?? 0}</span> of{' '}
        <span className="font-medium text-slate-900 dark:text-slate-100">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="px-2 text-slate-600 dark:text-slate-400">
          Page <span className="font-medium">{page}</span> / {lastPage}
        </span>
        <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
