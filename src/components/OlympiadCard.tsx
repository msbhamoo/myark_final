import Link from 'next/link';
import { Olympiad } from '@/lib/types';

interface OlympiadCardProps {
  olympiad: Olympiad;
}

export function OlympiadCard({ olympiad }: OlympiadCardProps) {
  const isFree = olympiad.is_free;
  
  return (
    <div className="group bg-surface border border-[var(--color-border-default)] rounded-2xl p-5 md:p-6 flex flex-col h-full hover:border-primary hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
          {olympiad.short_name}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted/10 text-muted">
          {olympiad.level.split(' ')[0]}
        </span>
      </div>

      <h3 className="text-[18px] md:text-[20px] font-heading font-bold text-heading leading-tight mb-2 group-hover:text-primary transition-colors">
        {olympiad.name}
      </h3>
      
      <p className="text-[13px] text-muted mb-4 line-clamp-1">
        {olympiad.organiser}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border-default)]">
          <span className="text-[11px] font-semibold text-body">{olympiad.eligibility_classes}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border-default)]">
          <span className="text-[11px] font-semibold text-body">Reg: {olympiad.registration_month}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${isFree ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-[var(--color-bg)] border-[var(--color-border-default)] text-body'}`}>
          <span className="text-[11px] font-semibold">{isFree ? 'Free' : olympiad.fee?.split(' ')[0]}</span>
        </div>
        {olympiad.is_individual_registration && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <span className="text-[11px] font-semibold">Individual Reg.</span>
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {olympiad.related_opportunity_slug ? (
          <Link 
            href={`/opportunities/${olympiad.related_opportunity_slug}`}
            className="w-full inline-flex items-center justify-center h-10 px-4 rounded-xl bg-green-600 text-white font-bold text-[13px] hover:bg-green-700 transition-colors"
          >
            Apply Now →
          </Link>
        ) : null}
        <Link 
          href={`/olympiads/${olympiad.slug}`}
          className="text-[13px] font-bold text-primary hover:underline flex items-center justify-center"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
