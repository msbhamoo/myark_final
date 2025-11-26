import { Eye, Calendar, Trophy, Globe, MapPin, Clock, Users } from 'lucide-react';
import { Opportunity } from '@/types/opportunity';
import { getEligibilityDisplay } from '@/components/OpportunityCard';
import { formatDate } from '@/lib/opportunity-utils';

interface QuickInfoGridProps {
    opportunity: Opportunity;
    viewCount: number;
    dateDisplay: string;
    modeLabel: string;
}

export function QuickInfoGrid({
    opportunity,
    viewCount,
    dateDisplay,
    modeLabel,
}: QuickInfoGridProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {/* Views */}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                <Eye className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span className="text-slate-700 dark:text-slate-200">
                    {viewCount.toLocaleString()} Views
                </span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                <Calendar className="h-4 w-4 text-pink-500 dark:text-pink-300" />
                <span className="text-slate-700 dark:text-slate-200">{dateDisplay}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                <Trophy className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                <p className="text-sm text-slate-500 dark:text-slate-300">Eligibility</p>
                <p className="font-semibold text-foreground dark:text-white">
                    {getEligibilityDisplay({
                        gradeEligibility: opportunity.gradeEligibility || '',
                        eligibilityType: opportunity.eligibilityType,
                        ageEligibility: opportunity.ageEligibility,
                        registrationDeadline: opportunity.registrationDeadline || '',
                    } as any)}
                </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                <Globe className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                <span className="text-slate-700 dark:text-slate-200">{modeLabel}</span>
            </div>
            {opportunity.state && (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                    <span className="text-slate-700 dark:text-slate-200">{opportunity.state}</span>
                </div>
            )}

            <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                <Clock className="h-4 w-4 text-primary dark:text-accent" />
                <span className="text-slate-700 dark:text-slate-200">
                    Updated: {formatDate((opportunity as any).updatedAt || (opportunity as any).createdAt)}
                </span>
            </div>

            {/* Target Audience */}
            {opportunity.targetAudience && (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                    <Users className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                    <span className="text-slate-700 dark:text-slate-200 capitalize">
                        {opportunity.targetAudience}
                    </span>
                </div>
            )}

            {/* Participation Type */}
            {opportunity.participationType && (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                    <Users className="h-4 w-4 text-teal-500 dark:text-teal-300" />
                    <span className="text-slate-700 dark:text-slate-200 capitalize">
                        {opportunity.participationType}
                        {opportunity.participationType === 'team' && opportunity.minTeamSize && opportunity.maxTeamSize && (
                            <span className="ml-1 text-xs text-muted-foreground">
                                ({opportunity.minTeamSize}-{opportunity.maxTeamSize} members)
                            </span>
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}
