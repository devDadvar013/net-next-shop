import { Inbox } from 'lucide-react';

export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}
