import Link from 'next/link';
import { Button } from '@/components/ui/button';
import OpportunityCard from '@/components/OpportunityCard';
import { normalizeMode } from '@/lib/opportunity-utils';
import { Opportunity } from '@/types/opportunity';

interface SimilarOpportunitiesProps {
    relatedLoading: boolean;
    relatedError: string | null;
    relatedOpportunities: Opportunity[];
}

export function SimilarOpportunities({
    relatedLoading,
    relatedError,
    relatedOpportunities,
}: SimilarOpportunitiesProps) {
    return (
        <section className="border-t border-slate-200 bg-white/[0.04] dark:border-slate-700">
            <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
                <h2 className="text-2xl font-bold text-foreground dark:text-white md:text-3xl">Related opportunities picked for you</h2>
                <p className="mt-2 text-sm text-muted-foreground dark:text-white/70 md:text-base">
                    Tailored suggestions that weigh category, grade fit, segments, and timeline recency from this listing.
                </p>
                {relatedLoading ? (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {[0, 1, 2].map((index) => (
                            <div
                                key={index}
                                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
                            />
                        ))}
                    </div>
                ) : relatedError ? (
                    <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200">
                        {relatedError}
                    </p>
                ) : relatedOpportunities.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                        We are still gathering the closest matches. Explore the full listings to discover more programs right away.
                        <div className="mt-4">
                            <Button asChild variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                                <Link href="/opportunities">Browse all opportunities</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {relatedOpportunities.map((item) => {
                            const opportunityIdOrSlug = item.slug || item.id;
                            const category = item.categoryName || item.category || 'Opportunity';
                            const organizerName = item.organizerName || item.organizer || 'Organizer';
                            const deadline = item.registrationDeadline || item.endDate || '';
                            return (
                                <OpportunityCard
                                    key={opportunityIdOrSlug}
                                    id={opportunityIdOrSlug}
                                    title={item.title}
                                    category={category}
                                    gradeEligibility={item.gradeEligibility || 'All Grades'}
                                    organizer={organizerName}
                                    registrationDeadline={deadline}
                                    mode={normalizeMode(item.mode)}
                                    fee={item.fee}
                                    className="border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-800/50"
                                    organizerLogo={item.organizerLogo}
                                    image={item.image}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
