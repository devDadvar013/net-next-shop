import { initials } from '@/lib/format';
import { classNames } from '@/lib/format';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

const colorPalette = [
  'from-violet-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-blue-500 to-cyan-500',
  'from-fuchsia-500 to-purple-500',
];

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const gradient = colorPalette[hash(name) % colorPalette.length];
  return (
    <div
      className={classNames(
        'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ring-2 ring-white dark:ring-slate-900',
        sizeMap[size],
        gradient,
        className
      )}
    >
      {initials(name)}
    </div>
  );
}
