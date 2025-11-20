'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AppliedOpportunityCardProps {
    id: string;
    opportunityId: string;
    opportunityTitle: string;
    registeredAt: string;
    registrationType?: 'internal' | 'external';
    className?: string;
}

export default function AppliedOpportunityCard({
    id,
    opportunityId,
    opportunityTitle,
    registeredAt,
    registrationType = 'internal',
    className,
}: AppliedOpportunityCardProps) {
    // Default cover image
    const coverImage = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop';

    const formatRegistrationDate = () => {
        const parsed = new Date(registeredAt);
        if (Number.isNaN(parsed.getTime())) {
            return registeredAt;
        }
        return parsed.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Link href={`/opportunity/${opportunityId}`} className="w-full max-w-full block">
            <Card
                className={cn(
                    'group relative h-full overflow-hidden rounded-2xl border-b border-x transition-all duration-300 flex flex-col py-0 gap-0 w-full max-w-full',
                    'bg-white dark:bg-slate-900/90',
                    'hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-400/50',
                    'border-slate-200/70 dark:border-slate-800/60',
                    'cursor-pointer',
                    className,
                )}
            >
                {/* Cover Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                    <img
                        src={coverImage}
                        alt={opportunityTitle}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Status Badge - Top Left Over Image */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-sm backdrop-blur-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-xs">Registered</span>
                        </span>
                    </div>

                    {/* Registration Type - Top Right Over Image */}
                    <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold shadow-sm bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                            {registrationType === 'internal' ? '🏫 Internal' : '🌐 External'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-3 sm:p-4 transition-colors min-w-0">
                    {/* Title - Prominent */}
                    <h3 className="text-sm sm:text-base font-bold leading-tight text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors mt-1 break-words">
                        {opportunityTitle}
                    </h3>

                    {/* Registration Date - Bottom */}
                    <div className="mt-auto pt-1">
                        <div className="flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Registered</span>
                            </div>
                            <span className="text-xs opacity-80 truncate ml-2">{formatRegistrationDate()}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
