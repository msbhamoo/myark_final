import { Badge } from '@/components/ui/badge';
import { Opportunity } from '@/types/opportunity';
import { QuickInfoGrid } from './QuickInfoGrid';

interface OpportunityHeroProps {
    heroImage: string;
    title: string;
    categoryLabel: string;
    organizerLabel: string;
    opportunity: Opportunity;
    viewCount: number;
    dateDisplay: string;
    modeLabel: string;
}

export function OpportunityHero({
    heroImage,
    title,
    categoryLabel,
    organizerLabel,
    opportunity,
    viewCount,
    dateDisplay,
    modeLabel,
}: OpportunityHeroProps) {
    return (
        <>
            {/* Cover Image Section */}
            <div className="relative w-full bg-slate-100 dark:bg-slate-800">
                <div className="container mx-auto px-0 md:px-6 lg:px-8 xl:px-16 max-w-[1920px]">
                    <div className="relative w-full aspect-[21/9] md:aspect-[21/7] lg:rounded-2xl overflow-hidden">
                        <img
                            src={heroImage}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>
            </div>

            {/* Primary Information Card */}
            <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] -mt-8 md:-mt-12 relative z-10">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                        {/* Category Badge */}
                        <div>
                            <Badge className="border border-accent bg-accent/50 text-accent-foreground dark:border-primary/20 dark:bg-primary/10 dark:text-accent text-xs font-semibold">
                                {categoryLabel}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl md:text-4xl lg:text-3xl font-bold text-foreground dark:text-white leading-tight">
                            {title}
                        </h1>

                        {/* Organizer and Meta Info */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                    <img
                                        src={opportunity.organizerLogo || 'https://via.placeholder.com/96x96.png?text=Org'}
                                        alt={organizerLabel}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Organized by</p>
                                    <p className="font-semibold text-foreground dark:text-white">{organizerLabel}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tags and Info Pills */}
                        <QuickInfoGrid
                            opportunity={opportunity}
                            viewCount={viewCount}
                            dateDisplay={dateDisplay}
                            modeLabel={modeLabel}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
