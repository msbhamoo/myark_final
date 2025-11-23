'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CustomTabsManager } from '@/components/CustomTabsManager';
import { Card } from '@/components/ui/card';
import { OpportunityCategory, Organizer } from '@/types/masters';
import { X } from 'lucide-react';
import { INDIAN_STATES, INDIAN_STATES_SET } from '@/constants/india';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { OpportunityFormState, OpportunityItem, HomeSegmentOption } from './types';
import {
    defaultForm,
    isValidState,
    joinLines,
    sectionsToText,
    timelineToText,
    splitLines,
    textToTimeline,
    textToSections,
    toNumberOrNull
} from './utils';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modeOptions = ['online', 'offline', 'hybrid'];
const statusOptions = ['pending', 'draft', 'approved', 'published', 'archived', 'rejected'];
const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

interface OpportunityFormProps {
    editingId: string | null;
    opportunity: OpportunityItem | null;
    categories: OpportunityCategory[];
    organizers: Organizer[];
    availableSegments: HomeSegmentOption[];
    existingOpportunities: OpportunityItem[];
    onSubmit: (payload: any) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function OpportunityForm({
    editingId,
    opportunity,
    categories,
    organizers,
    availableSegments,
    existingOpportunities,
    onSubmit,
    onCancel,
    isSubmitting
}: OpportunityFormProps) {
    const [formState, setFormState] = useState<OpportunityFormState>(defaultForm);
    const [error, setError] = useState<string | null>(null);
    const [segmentsLoading, setSegmentsLoading] = useState(false); // Assuming segments are passed loaded, but keeping state if needed

    useEffect(() => {
        if (opportunity && editingId) {
            const validatedState: OpportunityFormState['state'] = isValidState(opportunity.state ?? '') ? (opportunity.state as OpportunityFormState['state']) : '';
            setFormState({
                title: opportunity.title,
                categoryId: opportunity.categoryId,
                organizerId: opportunity.organizerId,
                organizerLogo: opportunity.organizerLogo ?? '',
                gradeEligibility: opportunity.gradeEligibility,
                mode: opportunity.mode,
                state: validatedState,
                status: opportunity.status,
                fee: opportunity.fee ?? '',
                currency: 'INR',
                registrationDeadline: opportunity.registrationDeadline ?? '',
                startDate: opportunity.startDate ?? '',
                endDate: opportunity.endDate ?? '',
                selectedSegments: opportunity.segments,
                image: opportunity.image ?? '',
                description: opportunity.description ?? '',
                eligibilityText: joinLines(opportunity.eligibility ?? []),
                benefitsText: joinLines(opportunity.benefits ?? []),
                registrationProcessText: joinLines(opportunity.registrationProcess ?? []),
                timelineText: timelineToText(opportunity.timeline ?? []),
                examPatterns:
                    opportunity.examPatterns && opportunity.examPatterns.length > 0
                        ? opportunity.examPatterns.map((pattern) => ({
                            id: pattern.id || crypto.randomUUID(),
                            classSelection: pattern.classSelection || { type: 'single', selectedClasses: [] },
                            totalQuestions: pattern.totalQuestions?.toString() ?? '',
                            durationMinutes: pattern.durationMinutes?.toString() ?? '',
                            negativeMarking: Boolean(pattern.negativeMarking),
                            negativeMarksPerQuestion: pattern.negativeMarksPerQuestion?.toString() ?? '',
                            sectionsText: sectionsToText(pattern.sections ?? []),
                        }))
                        : [
                            {
                                id: 'legacy',
                                classSelection: { type: 'single', selectedClasses: [] },
                                totalQuestions: opportunity.examPattern?.totalQuestions?.toString() ?? '',
                                durationMinutes: opportunity.examPattern?.durationMinutes?.toString() ?? '',
                                negativeMarking: Boolean(opportunity.examPattern?.negativeMarking),
                                negativeMarksPerQuestion: opportunity.examPattern?.negativeMarksPerQuestion?.toString() ?? '',
                                sectionsText: sectionsToText(opportunity.examPattern?.sections ?? []),
                            },
                        ],
                contactEmail: opportunity.contactInfo?.email ?? '',
                contactPhone: opportunity.contactInfo?.phone ?? '',
                contactWebsite: opportunity.contactInfo?.website ?? '',
                registrationMode: opportunity.registrationMode ?? 'internal',
                applicationUrl: opportunity.applicationUrl ?? '',
                customTabs: opportunity.customTabs ?? [],
            });
        } else {
            setFormState(defaultForm);
        }
    }, [opportunity, editingId]);

    const handleOrganizerChange = async (organizerId: string) => {
        setFormState((prev) => ({ ...prev, organizerId }));

        if (!organizerId) {
            setFormState((prev) => ({
                ...prev,
                organizerLogo: '',
                contactEmail: '',
                contactPhone: '',
                contactWebsite: '',
            }));
            return;
        }

        const selectedOrganizer = organizers.find((item) => item.id === organizerId);
        if (selectedOrganizer) {
            setFormState((prev) => ({
                ...prev,
                organizerLogo: selectedOrganizer.logoUrl || selectedOrganizer.schoolLogoUrl || prev.organizerLogo || '',
                contactEmail: selectedOrganizer.contactEmail || prev.contactEmail || '',
                contactPhone: selectedOrganizer.contactPhone || prev.contactPhone || '',
                contactWebsite: selectedOrganizer.contactWebsite || prev.contactWebsite || '',
            }));
        }
    };

    const toggleSegmentSelection = (segmentKey: string) => {
        setFormState((prev) => {
            const exists = prev.selectedSegments.includes(segmentKey);
            const nextSegments = exists
                ? prev.selectedSegments.filter((key) => key !== segmentKey)
                : [...prev.selectedSegments, segmentKey];
            return { ...prev, selectedSegments: nextSegments };
        });
    };

    const removeSegmentSelection = (segmentKey: string) => {
        setFormState((prev) => ({
            ...prev,
            selectedSegments: prev.selectedSegments.filter((key) => key !== segmentKey),
        }));
    };

    const handleAddPattern = () => {
        setFormState((prev) => ({
            ...prev,
            examPatterns: [
                ...prev.examPatterns,
                {
                    id: crypto.randomUUID(),
                    classSelection: { type: 'single', selectedClasses: [] },
                    totalQuestions: '',
                    durationMinutes: '',
                    negativeMarking: false,
                    negativeMarksPerQuestion: '',
                    sectionsText: '',
                },
            ],
        }));
    };

    const handleRemovePattern = (id: string) => {
        setFormState((prev) => ({
            ...prev,
            examPatterns: prev.examPatterns.filter((p) => p.id !== id),
        }));
    };

    const handlePatternChange = (id: string, field: keyof OpportunityFormState['examPatterns'][number], value: any) => {
        setFormState((prev) => ({
            ...prev,
            examPatterns: prev.examPatterns.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
        }));
    };

    const buildPayload = () => {
        const selectedOrganizer = organizers.find((entry) => entry.id === formState.organizerId);
        const selectedCategory = categories.find((entry) => entry.id === formState.categoryId);
        const fallbackOrganizerName =
            selectedOrganizer?.name?.trim() ||
            existingOpportunities.find((item) => item.organizerId === formState.organizerId)?.organizerName ||
            existingOpportunities.find((item) => item.organizerId === formState.organizerId)?.organizer?.name ||
            '';
        const fallbackCategoryName =
            selectedCategory?.name?.trim() ||
            existingOpportunities.find((item) => item.categoryId === formState.categoryId)?.categoryName ||
            existingOpportunities.find((item) => item.categoryId === formState.categoryId)?.category?.name ||
            '';
        const segments = Array.from(
            new Set(formState.selectedSegments.map((segment) => segment.trim()).filter(Boolean)),
        );
        const eligibility = splitLines(formState.eligibilityText);
        const benefits = splitLines(formState.benefitsText);
        const registrationProcess = splitLines(formState.registrationProcessText);
        const timeline = textToTimeline(formState.timelineText);

        const examPatterns = formState.examPatterns.map((pattern) => ({
            id: pattern.id,
            classSelection: pattern.classSelection,
            totalQuestions: toNumberOrNull(pattern.totalQuestions),
            durationMinutes: toNumberOrNull(pattern.durationMinutes),
            negativeMarking: pattern.negativeMarking,
            negativeMarksPerQuestion: toNumberOrNull(pattern.negativeMarksPerQuestion),
            sections: textToSections(pattern.sectionsText),
        }));

        const normalizedState: OpportunityFormState['state'] = formState.state && INDIAN_STATES_SET.has(formState.state) ? (formState.state as OpportunityFormState['state']) : '';

        return {
            title: formState.title,
            categoryId: formState.categoryId || null,
            categoryName: fallbackCategoryName,
            category: fallbackCategoryName,
            organizerId: formState.organizerId || null,
            organizerName: fallbackOrganizerName,
            organizer: fallbackOrganizerName,
            organizerLogo: formState.organizerLogo,
            gradeEligibility: formState.gradeEligibility,
            mode: formState.mode,
            state: normalizedState,
            status: formState.status,
            fee: formState.fee,
            currency: 'INR',
            registrationDeadline: formState.registrationDeadline || null,
            startDate: formState.startDate || null,
            endDate: formState.endDate || null,
            segments,
            image: formState.image,
            description: formState.description,
            eligibility,
            benefits,
            registrationProcess,
            timeline,
            examPatterns,
            examPattern: examPatterns[0] || null,
            contactInfo: {
                email: formState.contactEmail,
                phone: formState.contactPhone,
                website: formState.contactWebsite,
            },
            registrationMode: formState.registrationMode,
            applicationUrl: formState.registrationMode === 'external' ? formState.applicationUrl : '',
            customTabs: formState.customTabs,
        };
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!formState.categoryId) {
            setError('Category is required');
            return;
        }
        if (!formState.organizerId) {
            setError('Organizer is required');
            return;
        }

        try {
            const payload = buildPayload();
            await onSubmit(payload);
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        }
    };

    const selectedSegmentOptions = useMemo(() => {
        return availableSegments.filter(segment => formState.selectedSegments.includes(segment.segmentKey));
    }, [availableSegments, formState.selectedSegments]);

    return (
        <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    {/* Back button logic handled by parent via onCancel */}
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground dark:text-white">
                            {editingId ? 'Edit opportunity' : 'Create opportunity'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Provide core details and supporting metadata.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className='md:col-span-2 space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-title'>
                        Title *
                    </label>
                    <Input
                        id='op-title'
                        value={formState.title}
                        onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                        required
                        placeholder='National Science Olympiad'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-category'>
                        Category *
                    </label>
                    <select
                        id='op-category'
                        value={formState.categoryId}
                        onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
                        required
                        className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                    >
                        <option value=''>Select a category</option>
                        {formState.categoryId &&
                            !categories.some((category) => category.id === formState.categoryId) && (
                                <option value={formState.categoryId}>
                                    {existingOpportunities.find((item) => item.categoryId === formState.categoryId)?.categoryName ??
                                        'Current category'}
                                </option>
                            )}
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-organizer'>
                        Organizer *
                    </label>
                    <select
                        id='op-organizer'
                        value={formState.organizerId}
                        onChange={(event) => handleOrganizerChange(event.target.value)}
                        required
                        className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                    >
                        <option value=''>Select an organizer</option>
                        {formState.organizerId &&
                            !organizers.some((organizer) => organizer.id === formState.organizerId) && (
                                <option value={formState.organizerId}>
                                    {existingOpportunities.find((item) => item.organizerId === formState.organizerId)?.organizerName ??
                                        'Current organizer (private)'}
                                </option>
                            )}
                        {organizers.map((organizer) => (
                            <option key={organizer.id} value={organizer.id}>
                                {organizer.name}
                                {organizer.visibility === 'private' ? ' (Private)' : ''}
                                {organizer.isVerified ? '' : ' (Unverified)'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-organizer-logo'>
                        Organizer logo URL
                    </label>
                    <Input
                        id='op-organizer-logo'
                        value={formState.organizerLogo}
                        onChange={(event) => setFormState((prev) => ({ ...prev, organizerLogo: event.target.value }))}
                        placeholder='https://...'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-grade'>
                        Grade eligibility
                    </label>
                    <Input
                        id='op-grade'
                        value={formState.gradeEligibility}
                        onChange={(event) => setFormState((prev) => ({ ...prev, gradeEligibility: event.target.value }))}
                        placeholder='6-12'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-mode'>
                        Mode
                    </label>
                    <select
                        id='op-mode'
                        value={formState.mode}
                        onChange={(event) => setFormState((prev) => ({ ...prev, mode: event.target.value }))}
                        className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                    >
                        {modeOptions.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-state'>
                        State
                    </label>
                    <select
                        id='op-state'
                        value={formState.state}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (isValidState(value)) {
                                setFormState((prev) => ({ ...prev, state: value }));
                            }
                        }}
                        className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                    >
                        <option value=''>Select state</option>
                        {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-status'>
                        Status
                    </label>
                    <select
                        id='op-status'
                        value={formState.status}
                        onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
                        className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration-mode'>
                        Registration Mode
                    </label>
                    <select
                        id='op-registration-mode'
                        value={formState.registrationMode}
                        onChange={(event) =>
                            setFormState((prev) => ({
                                ...prev,
                                registrationMode: event.target.value as 'internal' | 'external',
                            }))
                        }
                        className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                    >
                        <option value='internal'>Internal</option>
                        <option value='external'>External</option>
                    </select>
                </div>

                {formState.registrationMode === 'external' && (
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-application-url'>
                            Application URL
                        </label>
                        <Input
                            id='op-application-url'
                            value={formState.applicationUrl}
                            onChange={(event) =>
                                setFormState((prev) => ({ ...prev, applicationUrl: event.target.value }))
                            }
                            placeholder='https://example.com/apply'
                            className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                        />
                    </div>
                )}

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-fee'>
                        Fee
                    </label>
                    <Input
                        id='op-fee'
                        value={formState.fee}
                        onChange={(event) => setFormState((prev) => ({ ...prev, fee: event.target.value }))}
                        placeholder='50'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-currency'>
                        Currency
                    </label>
                    <Input
                        id='op-currency'
                        value={formState.currency}
                        readOnly
                        aria-readonly='true'
                        className='bg-card/60 dark:bg-white/5 text-muted-foreground'
                    />
                    <p className='text-xs text-muted-foreground'>All opportunities are shown in Indian Rupees (INR).</p>
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration'>
                        Registration deadline
                    </label>
                    <Input
                        id='op-registration'
                        value={formState.registrationDeadline}
                        onChange={(event) => setFormState((prev) => ({ ...prev, registrationDeadline: event.target.value }))}
                        placeholder='2024-02-28'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-start'>
                        Start date
                    </label>
                    <Input
                        id='op-start'
                        value={formState.startDate}
                        onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
                        placeholder='2024-03-15'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-end'>
                        End date
                    </label>
                    <Input
                        id='op-end'
                        value={formState.endDate}
                        onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
                        placeholder='2024-03-16'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-image'>
                        Cover image URL
                    </label>
                    <div className="flex flex-col gap-2">
                        <Input
                            id='op-image'
                            value={formState.image}
                            onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
                            placeholder='https://...'
                            className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                        />
                        <Input
                            type="file"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append('file', file);

                                try {
                                    const res = await fetch('/api/admin/upload', {
                                        method: 'POST',
                                        body: formData,
                                    });
                                    if (!res.ok) throw new Error('Upload failed');
                                    const data = await res.json();
                                    setFormState(prev => ({ ...prev, image: data.url }));
                                } catch (err) {
                                    console.error(err);
                                    setError('Failed to upload image');
                                }
                            }}
                            className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                        />
                    </div>
                </div>

                <div className='md:col-span-2 space-y-3'>
                    <div className='flex items-center justify-between gap-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white'>
                            Segments
                        </label>
                        <a
                            href='/admin/home'
                            className='text-xs text-orange-300 hover:text-orange-200'
                        >
                            Manage segments
                        </a>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                        Opportunities only appear on the home page sections you select below. Hidden segments from the home layout are shown with a warning.
                    </p>

                    <div className='min-h-[42px] rounded-lg border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-2'>
                        {selectedSegmentOptions.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>
                                No segments selected yet.
                            </p>
                        ) : (
                            <div className='flex flex-wrap gap-2'>
                                {selectedSegmentOptions.map((segment) => (
                                    <span
                                        key={`selected-${segment.segmentKey}`}
                                        className='inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-100'
                                    >
                                        <span className='flex items-center gap-1'>
                                            {segment.title}
                                            {!segment.isVisible && (
                                                <span className='rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-[1px] text-[10px] font-semibold uppercase tracking-wide text-yellow-200'>
                                                    Hidden
                                                </span>
                                            )}
                                        </span>
                                        <button
                                            type='button'
                                            className='text-orange-200/80 hover:text-orange-100'
                                            onClick={() => removeSegmentSelection(segment.segmentKey)}
                                            aria-label={`Remove ${segment.title}`}
                                        >
                                            <X className='h-3 w-3' />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='rounded-lg border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5'>
                        <div className='flex items-center justify-between border-b border-border/60 dark:border-white/10 px-3 py-2'>
                            <p className='text-xs font-medium text-foreground dark:text-white uppercase tracking-wide'>Available segments</p>
                            {segmentsLoading && <span className='text-[11px] text-muted-foreground'>Loading...</span>}
                        </div>
                        <div className='max-h-64 overflow-y-auto px-3 py-2 space-y-2'>
                            {availableSegments.length === 0 ? (
                                <p className='text-sm text-muted-foreground'>
                                    No segments configured yet. Use the Home Page Segments section to add some.
                                </p>
                            ) : (
                                availableSegments.map((segment) => {
                                    const checked = formState.selectedSegments.includes(segment.segmentKey);
                                    return (
                                        <label
                                            key={segment.segmentKey}
                                            className='flex items-start justify-between gap-3 rounded-md px-2 py-2 text-sm text-foreground dark:text-white hover:bg-card/80 dark:bg-white/5'
                                        >
                                            <div className='flex items-center gap-2'>
                                                <input
                                                    type='checkbox'
                                                    checked={checked}
                                                    onChange={() => toggleSegmentSelection(segment.segmentKey)}
                                                    className='h-4 w-4 rounded border border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5 text-orange-500 focus:ring-orange-500'
                                                />
                                                <div>
                                                    <p className='font-medium text-foreground dark:text-white'>{segment.title}</p>
                                                    <p className='text-xs text-muted-foreground'>{segment.segmentKey}</p>
                                                </div>
                                            </div>
                                            {!segment.isVisible && (
                                                <span className='rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[11px] font-medium text-yellow-200'>
                                                    Hidden
                                                </span>
                                            )}
                                        </label>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className='md:col-span-2 space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-description'>
                        Description
                    </label>
                    <div className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white rounded-md overflow-hidden">
                        <ReactQuill
                            theme="snow"
                            value={formState.description}
                            onChange={(value) => setFormState((prev) => ({ ...prev, description: value }))}
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike'],
                                    ['blockquote', 'code-block'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    [{ 'script': 'sub' }, { 'script': 'super' }],
                                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                                    [{ 'direction': 'rtl' }],
                                    [{ 'size': ['small', false, 'large', 'huge'] }],
                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                    [{ 'color': [] }, { 'background': [] }],
                                    [{ 'font': [] }],
                                    [{ 'align': [] }],
                                    ['clean'],
                                    ['link']
                                ],
                            }}
                            className="text-foreground dark:text-white"
                        />
                    </div>
                </div>

                <div className='md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-eligibility'>
                            Eligibility (one per line)
                        </label>
                        <Textarea
                            id='op-eligibility'
                            value={formState.eligibilityText}
                            onChange={(event) => setFormState((prev) => ({ ...prev, eligibilityText: event.target.value }))}
                            className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-benefits'>
                            Benefits (one per line)
                        </label>
                        <Textarea
                            id='op-benefits'
                            value={formState.benefitsText}
                            onChange={(event) => setFormState((prev) => ({ ...prev, benefitsText: event.target.value }))}
                            className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration-process'>
                            Registration steps (one per line)
                        </label>
                        <Textarea
                            id='op-registration-process'
                            value={formState.registrationProcessText}
                            onChange={(event) =>
                                setFormState((prev) => ({ ...prev, registrationProcessText: event.target.value }))
                            }
                            className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                        />
                    </div>
                </div>

                <div className='md:col-span-2 space-y-2'>
                    <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-timeline'>
                        Timeline (one per line as <code>date|event|status</code>)
                    </label>
                    <Textarea
                        id='op-timeline'
                        value={formState.timelineText}
                        onChange={(event) => setFormState((prev) => ({ ...prev, timelineText: event.target.value }))}
                        placeholder='2024-02-01|Registration Opens|completed'
                        className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                    />
                </div>

                <div className='md:col-span-2 space-y-4'>
                    <div className="flex items-center justify-between">
                        <h3 className='text-sm font-semibold text-foreground dark:text-white'>Exam patterns</h3>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddPattern}>
                            Add Pattern
                        </Button>
                    </div>

                    {formState.examPatterns.map((pattern, index) => (
                        <div key={pattern.id} className='rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4 relative'>
                            <div className="absolute right-4 top-4">
                                {formState.examPatterns.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleRemovePattern(pattern.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <h4 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
                                Pattern {index + 1}
                            </h4>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">Class Selection Type</label>
                                    <select
                                        value={pattern.classSelection.type}
                                        onChange={(e) =>
                                            handlePatternChange(pattern.id, 'classSelection', {
                                                ...pattern.classSelection,
                                                type: e.target.value,
                                                selectedClasses: [], // Reset selection on type change
                                                rangeStart: '',
                                                rangeEnd: '',
                                            })
                                        }
                                        className="w-full h-9 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
                                    >
                                        <option value="single">Single Class</option>
                                        <option value="multiple">Multiple Classes</option>
                                        <option value="range">Class Range</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground">Select Class(es)</label>
                                    {pattern.classSelection.type === 'single' && (
                                        <select
                                            value={pattern.classSelection.selectedClasses[0] || ''}
                                            onChange={(e) =>
                                                handlePatternChange(pattern.id, 'classSelection', {
                                                    ...pattern.classSelection,
                                                    selectedClasses: [e.target.value],
                                                })
                                            }
                                            className="w-full h-9 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
                                        >
                                            <option value="">Select Class</option>
                                            {CLASS_OPTIONS.map((cls) => (
                                                <option key={cls} value={cls}>
                                                    Class {cls}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {pattern.classSelection.type === 'multiple' && (
                                        <div className="flex flex-wrap gap-2 p-2 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 min-h-[38px]">
                                            {CLASS_OPTIONS.map((cls) => (
                                                <label key={cls} className="flex items-center gap-1 text-sm cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={pattern.classSelection.selectedClasses.includes(cls)}
                                                        onChange={(e) => {
                                                            const current = pattern.classSelection.selectedClasses;
                                                            const next = e.target.checked
                                                                ? [...current, cls]
                                                                : current.filter((c) => c !== cls);
                                                            handlePatternChange(pattern.id, 'classSelection', {
                                                                ...pattern.classSelection,
                                                                selectedClasses: next,
                                                            });
                                                        }}
                                                        className="rounded border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5 text-orange-500 focus:ring-orange-500"
                                                    />
                                                    <span className="text-foreground dark:text-white">{cls}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {pattern.classSelection.type === 'range' && (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={pattern.classSelection.rangeStart || ''}
                                                onChange={(e) =>
                                                    handlePatternChange(pattern.id, 'classSelection', {
                                                        ...pattern.classSelection,
                                                        rangeStart: e.target.value,
                                                    })
                                                }
                                                className="w-full h-9 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
                                            >
                                                <option value="">From</option>
                                                {CLASS_OPTIONS.map((cls) => (
                                                    <option key={cls} value={cls}>
                                                        Class {cls}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-muted-foreground">-</span>
                                            <select
                                                value={pattern.classSelection.rangeEnd || ''}
                                                onChange={(e) =>
                                                    handlePatternChange(pattern.id, 'classSelection', {
                                                        ...pattern.classSelection,
                                                        rangeEnd: e.target.value,
                                                    })
                                                }
                                                className="w-full h-9 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
                                            >
                                                <option value="">To</option>
                                                {CLASS_OPTIONS.map((cls) => (
                                                    <option key={cls} value={cls}>
                                                        Class {cls}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                                <div className='space-y-2'>
                                    <label className='text-xs text-muted-foreground'>
                                        Total questions
                                    </label>
                                    <Input
                                        value={pattern.totalQuestions}
                                        onChange={(event) =>
                                            handlePatternChange(pattern.id, 'totalQuestions', event.target.value)
                                        }
                                        placeholder='100'
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs text-muted-foreground'>
                                        Duration (minutes)
                                    </label>
                                    <Input
                                        value={pattern.durationMinutes}
                                        onChange={(event) =>
                                            handlePatternChange(pattern.id, 'durationMinutes', event.target.value)
                                        }
                                        placeholder='120'
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs text-muted-foreground'>
                                        Negative marking?
                                    </label>
                                    <div className='flex items-center gap-2 text-sm text-foreground dark:text-white'>
                                        <input
                                            type='checkbox'
                                            checked={pattern.negativeMarking}
                                            onChange={(event) =>
                                                handlePatternChange(pattern.id, 'negativeMarking', event.target.checked)
                                            }
                                            className='h-4 w-4 rounded border border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5'
                                        />
                                        <span>Enabled</span>
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-xs text-muted-foreground'>
                                        Penalty per question
                                    </label>
                                    <Input
                                        value={pattern.negativeMarksPerQuestion}
                                        onChange={(event) =>
                                            handlePatternChange(pattern.id, 'negativeMarksPerQuestion', event.target.value)
                                        }
                                        placeholder='0.25'
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                </div>
                            </div>
                            <div className='mt-4 space-y-2'>
                                <label className='text-xs text-muted-foreground'>
                                    Sections (one per line as <code>name|questions|marks</code>)
                                </label>
                                <Textarea
                                    value={pattern.sectionsText}
                                    onChange={(event) =>
                                        handlePatternChange(pattern.id, 'sectionsText', event.target.value)
                                    }
                                    placeholder='Physics|25|25'
                                    className='min-h-[100px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Tabs - NEW LOCATION */}
                <div className="md:col-span-2 space-y-2">
                    <h3 className="text-sm font-semibold text-foreground dark:text-white">Custom Tabs</h3>
                    <p className="text-xs text-muted-foreground">Add custom content tabs to the opportunity details page.</p>
                    <Card className="p-4 bg-card/60 dark:bg-white/5 border-border/60 dark:border-white/10">
                        <CustomTabsManager
                            customTabs={formState.customTabs}
                            onChange={(tabs) => setFormState(prev => ({ ...prev, customTabs: tabs }))}
                        />
                    </Card>
                </div>

                <div className='md:col-span-2 rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4'>
                    <h3 className='text-sm font-semibold text-foreground dark:text-white'>Contact information</h3>
                    <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='space-y-2'>
                            <label className='text-xs text-muted-foreground' htmlFor='op-contact-email'>
                                Email
                            </label>
                            <Input
                                id='op-contact-email'
                                value={formState.contactEmail}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, contactEmail: event.target.value }))
                                }
                                placeholder='info@example.org'
                                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs text-muted-foreground' htmlFor='op-contact-phone'>
                                Phone
                            </label>
                            <Input
                                id='op-contact-phone'
                                value={formState.contactPhone}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, contactPhone: event.target.value }))
                                }
                                placeholder='+1-800-123-4567'
                                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='text-xs text-muted-foreground' htmlFor='op-contact-website'>
                                Website
                            </label>
                            <Input
                                id='op-contact-website'
                                value={formState.contactWebsite}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, contactWebsite: event.target.value }))
                                }
                                placeholder='https://example.org'
                                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                            />
                        </div>
                    </div>
                </div>

                <div className='md:col-span-2 flex items-center gap-3'>
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : editingId ? 'Update opportunity' : 'Create opportunity'}
                    </Button>
                    {editingId && (
                        <Button type='button' variant='ghost' onClick={onCancel} disabled={isSubmitting}>
                            Cancel edit
                        </Button>
                    )}
                </div>

                {error && (
                    <p className='md:col-span-2 text-sm text-red-400' role='alert'>
                        {error}
                    </p>
                )}
            </form>
        </section>
    );
}
