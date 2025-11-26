import { StickyTabBar, type TabItem } from '@/components/StickyTabBar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, HelpCircle, Globe, Download, BookOpen, Timer } from 'lucide-react';
import { Opportunity, OpportunityTimelineEvent } from '@/types/opportunity';
import { CustomTabContent } from '@/types/customTab';
import { ResourceDisplayItem } from '@/lib/opportunity-utils';

interface OpportunityTabsProps {
    opportunity: Opportunity;
    timelineEntries: OpportunityTimelineEvent[];
    formattedDeadline: string;
    displayFee: string;
    formattedStartDate: string;
    resourceItems: ResourceDisplayItem[];
    onResourcePreview: (resource: ResourceDisplayItem) => void;
}

const renderCustomTabContent = (content: CustomTabContent) => {
    switch (content.type) {
        case 'rich-text':
            return (
                <div
                    className="text-slate-600 dark:text-slate-100 leading-relaxed prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.html }}
                />
            );
        case 'list':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.items.map((item, index) => (
                        <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <p className="text-slate-700 dark:text-slate-200">{item}</p>
                        </div>
                    ))}
                </div>
            );
        case 'structured-data':
            return (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                    <table className="w-full text-sm text-left min-w-[300px]">
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {Object.entries(content.schema).map(([key, value], index) => (
                                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-foreground dark:text-white w-1/3">{key}</td>
                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{String(value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case 'custom-json':
            return (
                <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-auto text-xs">
                    {JSON.stringify(content.data, null, 2)}
                </pre>
            );
        default:
            return null;
    }
};

export function OpportunityTabs({
    opportunity,
    timelineEntries,
    formattedDeadline,
    displayFee,
    formattedStartDate,
    resourceItems,
    onResourcePreview,
}: OpportunityTabsProps) {
    const contactInfo = opportunity.contactInfo ?? {};
    const examPattern = opportunity.examPattern ?? {};
    const examSections = examPattern.sections ?? [];

    // Determine which tabs have content
    const hasOverview = Boolean(opportunity.description?.trim()) || (opportunity.benefits && opportunity.benefits.length > 0);
    const hasEligibility = opportunity.eligibility && opportunity.eligibility.length > 0;
    const hasTimeline = timelineEntries && timelineEntries.length > 0;
    const hasRegistration = (opportunity.registrationProcess && opportunity.registrationProcess.length > 0) ||
        Boolean(contactInfo.email || contactInfo.phone || contactInfo.website);
    const hasExamPattern = (() => {
        // Check new exam patterns array
        if (opportunity.examPatterns && opportunity.examPatterns.length > 0) {
            return opportunity.examPatterns.some(pattern =>
                (pattern.totalQuestions && pattern.totalQuestions > 0) ||
                (pattern.sections && pattern.sections.length > 0)
            );
        }
        // Check legacy exam pattern
        if (examPattern.totalQuestions && examPattern.totalQuestions > 0) {
            return true;
        }
        if (examSections && examSections.length > 0) {
            return true;
        }
        return false;
    })();
    const hasResources = resourceItems.length > 0;

    // Build custom tabs
    const customTabs: TabItem[] = (opportunity.customTabs || [])
        .sort((a, b) => a.order - b.order)
        .map((tab) => ({
            value: tab.id,
            label: tab.label,
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        {tab.label}
                    </h2>
                    {renderCustomTabContent(tab.content)}
                </Card>
            ),
        }));

    // Build full tabs array
    const allTabs: TabItem[] = [
        {
            value: 'overview',
            label: 'Overview',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg md:text-2xl font-bold mb-4 text-foreground dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                About This Opportunity
                            </h2>
                            <div
                                className="text-slate-600 dark:text-slate-100 leading-relaxed prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: opportunity.description || 'Detailed description will be available soon.' }}
                            />
                        </div>

                        <Separator className="bg-white/80 dark:bg-slate-800/70" />

                        <div>
                            <h3 className="text-base md:text-xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-chart-2 animate-pulse"></span>
                                Key Benefits
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(opportunity.benefits ?? []).map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:border-primary/20 transition-colors"
                                    >
                                        <div className="mt-1">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-100">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            ),
        },
        ...customTabs,
        {
            value: 'eligibility',
            label: 'Eligibility',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-chart-3 animate-pulse"></span>
                        Eligibility Criteria
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {(opportunity.eligibility ?? []).map((criteria, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
                            >
                                <div className="mt-1">
                                    <div className="h-2 w-2 rounded-full bg-chart-3" />
                                </div>
                                <span className="text-slate-600 dark:text-slate-100">{criteria}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            ),
        },
        {
            value: 'timeline',
            label: 'Timeline',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-chart-4 animate-pulse"></span>
                        Important Dates
                    </h2>
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-8">
                        {timelineEntries.map((event, index) => (
                            <div key={index} className="relative pl-8">
                                <div
                                    className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 ${event.status === 'completed'
                                        ? 'border-slate-400 bg-slate-200 dark:border-slate-600 dark:bg-slate-800'
                                        : event.status === 'active'
                                            ? 'border-primary bg-primary animate-pulse'
                                            : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950'
                                        }`}
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h4
                                            className={`font-semibold ${event.status === 'active'
                                                ? 'text-primary'
                                                : 'text-foreground dark:text-white'
                                                }`}
                                        >
                                            {event.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{event.date}</p>
                                    </div>
                                    {event.status === 'active' && (
                                        <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                            Active Now
                                        </Badge>
                                    )}
                                </div>
                                {event.description && (
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        {event.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            ),
        },
        {
            value: 'registration',
            label: 'Registration',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-chart-5 animate-pulse"></span>
                        Registration Process
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {(opportunity.registrationProcess ?? []).map((step, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                                        {index + 1}
                                    </div>
                                    <p className="mt-1 text-slate-600 dark:text-slate-100">{step}</p>
                                </div>
                            ))}
                        </div>

                        {(contactInfo.email || contactInfo.phone || contactInfo.website) && (
                            <>
                                <Separator className="bg-slate-200 dark:bg-slate-700" />
                                <div>
                                    <h3 className="font-semibold mb-4 text-foreground dark:text-white">Contact Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contactInfo.email && (
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email</p>
                                                <p className="font-medium text-foreground dark:text-white">{contactInfo.email}</p>
                                            </div>
                                        )}
                                        {contactInfo.phone && (
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                                                <p className="font-medium text-foreground dark:text-white">{contactInfo.phone}</p>
                                            </div>
                                        )}
                                        {contactInfo.website && (
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 md:col-span-2">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Website</p>
                                                <a
                                                    href={contactInfo.website}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-medium text-primary hover:underline break-all"
                                                >
                                                    {contactInfo.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Card>
            ),
        },
        {
            value: 'exam-pattern',
            label: 'Exam Pattern',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-chart-1 animate-pulse"></span>
                        Exam Pattern
                    </h2>

                    {/* New Exam Patterns Array Support */}
                    {opportunity.examPatterns && opportunity.examPatterns.length > 0 ? (
                        <div className="space-y-8">
                            {opportunity.examPatterns.map((pattern, index) => (
                                <div key={index} className="space-y-6">
                                    {opportunity.examPatterns!.length > 1 && (
                                        <h3 className="text-lg font-semibold text-foreground dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                            {pattern.name || `Pattern ${index + 1}`}
                                        </h3>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <BookOpen className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</span>
                                            </div>
                                            <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{pattern.totalQuestions ?? '—'}</p>
                                        </div>

                                        <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-primaryDark/10 flex items-center justify-center">
                                                    <Timer className="h-4 w-4 text-primaryDark" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</span>
                                            </div>
                                            <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                                                {typeof pattern.durationMinutes === 'number'
                                                    ? `${Math.floor(pattern.durationMinutes / 60)}h ${pattern.durationMinutes % 60}m`
                                                    : '—'}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-chart-2" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marks</span>
                                            </div>
                                            <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{pattern.totalMarks ?? '—'}</p>
                                        </div>

                                        <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="h-8 w-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                                                    <HelpCircle className="h-4 w-4 text-chart-5" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Neg. Marking</span>
                                            </div>
                                            <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                                                {pattern.negativeMarking
                                                    ? (typeof pattern.negativeMarksPerQuestion === 'number'
                                                        ? `Yes (-${pattern.negativeMarksPerQuestion})`
                                                        : 'Yes')
                                                    : 'No'}
                                            </p>
                                        </div>
                                    </div>

                                    {pattern.sections && pattern.sections.length > 0 && (
                                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Section</th>
                                                        <th className="px-4 py-3 font-medium">Questions</th>
                                                        <th className="px-4 py-3 font-medium">Marks</th>
                                                        <th className="px-4 py-3 font-medium">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800/50">
                                                    {pattern.sections.map((section, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                                            <td className="px-4 py-3 font-medium text-foreground dark:text-white">{section.name}</td>
                                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{section.questions ?? '—'}</td>
                                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{section.marks ?? '—'}</td>
                                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{section.durationMinutes ? `${section.durationMinutes}m` : '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Legacy Exam Pattern Support
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{examPattern.totalQuestions ?? '—'}</p>
                                </div>

                                <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primaryDark/10 flex items-center justify-center">
                                            <Timer className="h-4 w-4 text-primaryDark" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                                        {typeof examPattern.durationMinutes === 'number'
                                            ? `${Math.floor(examPattern.durationMinutes / 60)}h ${examPattern.durationMinutes % 60}m`
                                            : '—'}
                                    </p>
                                </div>

                                <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
                                            <CheckCircle2 className="h-4 w-4 text-chart-2" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marks</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{examPattern.totalMarks ?? '—'}</p>
                                </div>

                                <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-chart-5/10 flex items-center justify-center">
                                            <HelpCircle className="h-4 w-4 text-chart-5" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Neg. Marking</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">
                                        {examPattern.negativeMarking
                                            ? (typeof examPattern.negativeMarksPerQuestion === 'number'
                                                ? `Yes (-${examPattern.negativeMarksPerQuestion})`
                                                : 'Yes')
                                            : 'No'}
                                    </p>
                                </div>
                            </div>

                            {examSections.length > 0 && (
                                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Section</th>
                                                <th className="px-4 py-3 font-medium">Questions</th>
                                                <th className="px-4 py-3 font-medium">Marks</th>
                                                <th className="px-4 py-3 font-medium">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800/50">
                                            {examSections.map((section, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                                    <td className="px-4 py-3 font-medium text-foreground dark:text-white">{section.name}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{section.questions ?? '—'}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{section.marks ?? '—'}</td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{section.durationMinutes ? `${section.durationMinutes}m` : '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            ),
        },
        {
            value: 'resources',
            label: 'Resources',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-chart-5 animate-pulse"></span>
                        Downloads & Resources
                    </h2>
                    {resourceItems.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {resourceItems.map((resource, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 backdrop-blur-sm gap-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                            <resource.Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                        </div>
                                        <div className="space-y-1">
                                            <Badge
                                                variant="outline"
                                                className="border-accent bg-accent/50 px-2.5 py-0.5 text-xs font-semibold text-[#1A2A33] dark:border-white/20 dark:bg-slate-800/70 dark:text-white"
                                            >
                                                {resource.typeLabel}
                                            </Badge>
                                            <p className="text-lg font-semibold text-foreground dark:text-white">{resource.title}</p>
                                            {resource.description && (
                                                <p className="text-sm text-slate-500 dark:text-slate-300">{resource.description}</p>
                                            )}
                                            <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                                                {resource.url}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-stretch md:self-auto">
                                        <Button
                                            variant="outline"
                                            className="border-accent text-primary hover:bg-accent/20 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                            onClick={() => onResourcePreview(resource)}
                                        >
                                            Preview
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="border-slate-200 text-slate-700 hover:bg-white/90 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                        >
                                            <a href={resource.url} target="_blank" rel="noreferrer">
                                                <Globe className="mr-2 h-4 w-4" />
                                                Open tab
                                            </a>
                                        </Button>
                                        {resource.type === 'pdf' && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="border-slate-200 text-slate-700 hover:bg-white/90 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                            >
                                                <a href={resource.url} download rel="noreferrer">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            ),
        },
        {
            value: 'faq',
            label: 'FAQ',
            content: (
                <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: `What is the deadline for ${opportunity.title}?`,
                                a: formattedDeadline !== 'TBA'
                                    ? `The registration deadline is ${formattedDeadline}. Make sure to apply before this date.`
                                    : `The deadline has not been announced yet. Please keep checking for updates.`
                            },
                            {
                                q: `Who is eligible to apply?`,
                                a: opportunity.gradeEligibility
                                    ? `This opportunity is open to ${opportunity.gradeEligibility}. Please check the eligibility section for more details.`
                                    : `Eligibility details are available in the eligibility section.`
                            },
                            {
                                q: `Is there a registration fee?`,
                                a: displayFee === 'FREE'
                                    ? `No, this opportunity is free to register.`
                                    : `Yes, the registration fee is ${displayFee}.`
                            },
                            {
                                q: `How do I register?`,
                                a: `You can register by clicking the "Register Now" button on this page. If it's an external registration, you'll be redirected to the official website.`
                            },
                            {
                                q: `When does the event start?`,
                                a: formattedStartDate !== 'TBA'
                                    ? `The event is scheduled to start on ${formattedStartDate}.`
                                    : `The start date has not been announced yet.`
                            }
                        ].map((faq, index) => (
                            <div key={index} className="p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                                <h3 className="font-semibold text-foreground dark:text-white flex items-start gap-2 mb-2">
                                    <HelpCircle className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                                    {faq.q}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 pl-7">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            ),
        },
    ];

    // Filter tabs based on content availability
    const visibleTabs = allTabs.filter(tab => {
        if (tab.value === 'overview') return hasOverview;
        if (tab.value === 'eligibility') return hasEligibility;
        if (tab.value === 'timeline') return hasTimeline;
        if (tab.value === 'registration') return hasRegistration;
        if (tab.value === 'exam-pattern') return hasExamPattern;
        if (tab.value === 'resources') return hasResources;
        if (tab.value === 'faq') return true; // FAQ is always visible
        return true;
    });

    // Determine the default tab (first visible tab)
    const defaultTab = visibleTabs.length > 0 ? visibleTabs[0].value : 'overview';

    return (
        <StickyTabBar
            defaultValue={defaultTab}
            tabs={visibleTabs}
        />
    );
}
