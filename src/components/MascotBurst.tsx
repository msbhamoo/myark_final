'use client';

import { cn } from '@/lib/utils';

type MascotBurstProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_CLASS: Record<NonNullable<MascotBurstProps['size']>, string> = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-14 w-14 text-xl',
  lg: 'h-20 w-20 text-2xl',
} satisfies Record<NonNullable<MascotBurstProps['size']>, string>;

export function MascotBurst({ size = 'md', className }: MascotBurstProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 text-white shadow-lg shadow-primary/40 backdrop-blur',
        SIZE_CLASS[size!],
        className,
      )}
      aria-hidden="true"
    >
      <span className="drop-shadow-sm">✨</span>
      <span className="pointer-events-none absolute inset-0 rounded-full border border-white/30 opacity-60" />
    </div>
  );
}

type MascotOrbProps = {
  tone: 'sunset' | 'violet' | 'teal';
  icon: string;
  className?: string;
};

const ORB_STYLE: Record<MascotOrbProps['tone'], string> = {
  sunset:
    'from-chart-1 via-chart-2 to-chart-3 shadow-[0_18px_35px_rgba(88,204,2,0.35)]',
  violet:
    'from-violet-400 via-indigo-400 to-sky-400 shadow-[0_18px_35px_rgba(129,140,248,0.35)]',
  teal:
    'from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_18px_35px_rgba(16,185,129,0.28)]',
};

export function MascotOrb({ tone, icon, className }: MascotOrbProps) {
  return (
    <div
      className={cn(
        'relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-2xl text-white shadow-lg transition-transform duration-300',
        ORB_STYLE[tone],
        className,
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_55%)]" />
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2),transparent_55%)] opacity-80" />
      <span className="relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">{icon}</span>
    </div>
  );
}
