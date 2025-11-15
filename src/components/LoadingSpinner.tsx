'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-r-blue-600 dark:border-slate-700 dark:border-r-blue-400',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>}
    </div>
  );
}

export function LoadingGrid({ itemCount = 6 }: { itemCount?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: itemCount }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50 animate-pulse"
        >
          <div className="space-y-3">
            {/* Header badges */}
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Title */}
            <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />

            {/* Organizer */}
            <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />

            {/* Badges */}
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Deadline info */}
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Button */}
            <div className="h-10 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
