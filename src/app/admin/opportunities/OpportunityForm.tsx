'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CustomTabsManager } from '@/components/CustomTabsManager';
import { Card } from '@/components/ui/card';
import { OpportunityCategory, Organizer } from '@/types/masters';
import {
    X,
    Save,
    LayoutList,
    Users,
    Calendar,
    ImageIcon,
    FileText,
    GraduationCap,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { INDIAN_STATES, INDIAN_STATES_SET } from '@/constants/india';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modeOptions = ['online', 'offline', 'hybrid'];
const statusOptions = ['pending', 'draft', 'approved', 'published', 'archived', 'rejected'];

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
    const [segmentsLoading, setSegmentsLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        if (opportunity && editingId) {
            const validatedState: OpportunityFormState['state'] = isValidState(opportunity.state ?? '') ? (opportunity.state as OpportunityFormState['state']) : '';
            setFormState({
                title: opportunity.title,
                categoryId: opportunity.categoryId,
                organizerId: opportunity.organizerId,
                organizerLogo: opportunity.organizerLogo ?? '',
                gradeEligibility: opportunity.gradeEligibility,
                eligibilityType: opportunity.eligibilityType || (opportunity.ageEligibility ? 'both' : 'grade'),
                ageEligibility: opportunity.ageEligibility ?? '',
                targetAudience: opportunity.targetAudience ?? 'students',
                participationType: opportunity.participationType ?? 'individual',
                minTeamSize: opportunity.minTeamSize?.toString() ?? '',
                maxTeamSize: opportunity.maxTeamSize?.toString() ?? '',
                mode: opportunity.mode,
                state: validatedState,
                status: opportunity.status,
                fee: opportunity.fee ?? '',
                currency: 'INR',
                registrationDeadline: opportunity.registrationDeadline?.split('T')[0] ?? '',
                registrationDeadlineTBD: opportunity.registrationDeadlineTBD ?? false,
                startDate: opportunity.startDate?.split('T')[0] ?? '',
                startDateTBD: opportunity.startDateTBD ?? false,
                endDate: opportunity.endDate?.split('T')[0] ?? '',
                endDateTBD: opportunity.endDateTBD ?? false,
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
            eligibilityType: formState.eligibilityType,
            ageEligibility: formState.ageEligibility || null,
            targetAudience: formState.targetAudience,
            participationType: formState.participationType,
            minTeamSize: toNumberOrNull(formState.minTeamSize),
            maxTeamSize: toNumberOrNull(formState.maxTeamSize),
            mode: formState.mode,
            state: normalizedState,
            status: formState.status,
            fee: formState.fee,
            currency: 'INR',
            registrationDeadline: formState.registrationDeadline || null,
            registrationDeadlineTBD: formState.registrationDeadlineTBD,
            startDate: formState.startDate || null,
            startDateTBD: formState.startDateTBD,
            endDate: formState.endDate || null,
            endDateTBD: formState.endDateTBD,
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

    const handleSubmit = async () => {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageUploading(true);
        try {
            // Compression settings
            const options = {
                maxSizeMB: 2.5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(file, options);

            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFormState((prev) => ({ ...prev, image: data.url }));
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    // Category to keyword mapping for better stock photo matching
    const categoryKeywords: Record<string, string[]> = {
        'olympiad': ['education', 'science', 'mathematics', 'trophy', 'competition'],
        'scholarship': ['graduation', 'university', 'education', 'books', 'success'],
        'competition': ['trophy', 'awards', 'victory', 'celebration', 'achievement'],
        'hackathon': ['technology', 'coding', 'laptop', 'innovation', 'programming'],
        'quiz': ['quiz', 'knowledge', 'brain', 'learning', 'questions'],
        'workshop': ['workshop', 'learning', 'classroom', 'training', 'skills'],
        'internship': ['office', 'business', 'career', 'professional', 'work'],
        'fellowship': ['research', 'academics', 'study', 'university', 'library'],
        'default': ['education', 'success', 'achievement', 'inspiration', 'learning']
    };

    const generateCoverImage = async () => {
        if (!formState.title) {
            setError('Please enter a title first');
            return;
        }

        setImageUploading(true);
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 630;
            const ctx = canvas.getContext('2d')!;

            // Gradient palettes for beautiful backgrounds
            const gradientPalettes = [
                ['#667eea', '#764ba2'], // Purple-violet
                ['#f093fb', '#f5576c'], // Pink-red
                ['#4facfe', '#00f2fe'], // Blue-cyan
                ['#43e97b', '#38f9d7'], // Green-teal
                ['#fa709a', '#fee140'], // Pink-yellow
                ['#ff9a9e', '#fecfef'], // Soft pink
                ['#a8edea', '#fed6e3'], // Soft teal-pink
                ['#667eea', '#f093fb'], // Purple-pink
                ['#11998e', '#38ef7d'], // Teal-green
                ['#ee0979', '#ff6a00'], // Red-orange
                ['#6a11cb', '#2575fc'], // Deep purple-blue
                ['#f12711', '#f5af19'], // Orange-yellow
            ];

            // Pick a random gradient
            const palette = gradientPalettes[Math.floor(Math.random() * gradientPalettes.length)];
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, palette[0]);
            gradient.addColorStop(1, palette[1]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add decorative geometric shapes
            ctx.globalAlpha = 0.15;
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = 50 + Math.random() * 200;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            }

            // Add diagonal lines pattern
            ctx.globalAlpha = 0.08;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            for (let i = -canvas.height; i < canvas.width + canvas.height; i += 60) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + canvas.height, canvas.height);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            // Add accent bar at bottom
            const accentColor = palette[0];
            ctx.fillStyle = accentColor;
            ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

            // Add title text with professional styling
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const title = formState.title;
            let fontSize = 68;
            ctx.font = `bold ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;

            // Auto-size text to fit
            while (ctx.measureText(title).width > canvas.width - 140 && fontSize > 28) {
                fontSize -= 4;
                ctx.font = `bold ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
            }

            // Text shadow for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 6;
            ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 15);

            // Add category badge
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            const category = categories.find(c => c.id === formState.categoryId)?.name;
            if (category) {
                ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
                const badgeText = category.toUpperCase();
                const badgeWidth = ctx.measureText(badgeText).width + 50;

                // Badge background with rounded corners
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.beginPath();
                ctx.roundRect(canvas.width / 2 - badgeWidth / 2, canvas.height / 2 + fontSize / 2 + 15, badgeWidth, 44, 22);
                ctx.fill();

                // Badge border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Badge text
                ctx.fillStyle = '#ffffff';
                ctx.fillText(badgeText, canvas.width / 2, canvas.height / 2 + fontSize / 2 + 37);
            }

            // Add MyArk branding watermark
            ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'right';
            ctx.fillText('myark.in', canvas.width - 35, canvas.height - 35);

            // Convert to blob and upload
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92);
            });

            const formData = new FormData();
            formData.append('file', blob, `cover-${Date.now()}.jpg`);

            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFormState((prev) => ({ ...prev, image: data.url }));
        } catch (error) {
            console.error('Generate cover error:', error);
            setError('Failed to generate cover image');
        } finally {
            setImageUploading(false);
        }
    };



    return (
        <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/80 dark:to-slate-800/50 p-6 backdrop-blur shadow-xl">
            {/* Modern Header */}
            <div className="relative mb-8 -mx-6 -mt-6 px-6 py-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onCancel} className="text-white/80 hover:text-white hover:bg-white/10">
                            <X className="h-5 w-5" />
                        </Button>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {editingId ? '✏️ Edit Opportunity' : '✨ Create New Opportunity'}
                            </h2>
                            <p className="text-sm text-white/70">
                                Fill in the sections below to {editingId ? 'update' : 'create'} your opportunity
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-white text-purple-700 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Saving...' : 'Save Opportunity'}
                    </Button>
                </div>
            </div>

            <Accordion type="multiple" defaultValue={['essentials', 'audience', 'schedule']} className="w-full space-y-4">
                {/* Section 1: Essentials - Emerald Theme */}
                <AccordionItem value="essentials" className="border-l-4 border-l-emerald-500 rounded-xl border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="px-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 [&[data-state=open]]:bg-emerald-50/50 dark:[&[data-state=open]]:bg-emerald-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                <LayoutList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-emerald-700 dark:text-emerald-300">Essential Information</p>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Title, category, organizer & status</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-900/10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-right-4 duration-300">
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
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
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
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
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
                                <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-status'>
                                    Status
                                </label>
                                <select
                                    id='op-status'
                                    value={formState.status}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-mode'>
                                    Mode
                                </label>
                                <select
                                    id='op-mode'
                                    value={formState.mode}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, mode: event.target.value }))}
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
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
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                                >
                                    <option value=''>Select state</option>
                                    {INDIAN_STATES.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 2: Audience - Violet Theme */}
                <AccordionItem value="audience" className="border-l-4 border-l-violet-500 rounded-xl border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="px-4 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 [&[data-state=open]]:bg-violet-50/50 dark:[&[data-state=open]]:bg-violet-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-violet-700 dark:text-violet-300">Target Audience</p>
                                <p className="text-xs text-violet-600/70 dark:text-violet-400/70">Who can participate & eligibility</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-gradient-to-b from-violet-50/30 to-transparent dark:from-violet-900/10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Target Audience
                                </label>
                                <select
                                    value={formState.targetAudience}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, targetAudience: event.target.value as any }))}
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                                >
                                    <option value='students'>Students</option>
                                    <option value='schools'>Schools</option>
                                    <option value='both'>Both</option>
                                </select>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Participation Type
                                </label>
                                <select
                                    value={formState.participationType}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, participationType: event.target.value as any }))}
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                                >
                                    <option value='individual'>Individual</option>
                                    <option value='team'>Team</option>
                                </select>
                            </div>

                            {formState.participationType === 'team' && (
                                <>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-medium text-foreground dark:text-white'>
                                            Min Team Size
                                        </label>
                                        <Input
                                            type="number"
                                            value={formState.minTeamSize}
                                            onChange={(event) => setFormState((prev) => ({ ...prev, minTeamSize: event.target.value }))}
                                            className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-medium text-foreground dark:text-white'>
                                            Max Team Size
                                        </label>
                                        <Input
                                            type="number"
                                            value={formState.maxTeamSize}
                                            onChange={(event) => setFormState((prev) => ({ ...prev, maxTeamSize: event.target.value }))}
                                            className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                        />
                                    </div>
                                </>
                            )}

                            <div className='md:col-span-2 space-y-3'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Eligibility Criteria
                                </label>
                                <select
                                    value={formState.eligibilityType}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, eligibilityType: event.target.value as 'grade' | 'age' | 'both' }))}
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                                >
                                    <option value='grade'>By Grade</option>
                                    <option value='age'>By Age</option>
                                    <option value='both'>Both Grade & Age</option>
                                </select>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {(formState.eligibilityType === 'grade' || formState.eligibilityType === 'both') && (
                                        <div className='space-y-2'>
                                            <label className='text-xs font-medium text-muted-foreground' htmlFor='op-grade'>
                                                Grade Range
                                            </label>
                                            <Input
                                                id='op-grade'
                                                value={formState.gradeEligibility}
                                                onChange={(event) => setFormState((prev) => ({ ...prev, gradeEligibility: event.target.value }))}
                                                placeholder='e.g., 6-12, 9-10'
                                                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                            />
                                        </div>
                                    )}
                                    {(formState.eligibilityType === 'age' || formState.eligibilityType === 'both') && (
                                        <div className='space-y-2'>
                                            <label className='text-xs font-medium text-muted-foreground' htmlFor='op-age'>
                                                Age Range
                                            </label>
                                            <Input
                                                id='op-age'
                                                value={formState.ageEligibility}
                                                onChange={(event) => setFormState((prev) => ({ ...prev, ageEligibility: event.target.value }))}
                                                placeholder='e.g., 14-18 years, Under 21'
                                                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 3: Schedule - Blue Theme */}
                <AccordionItem value="schedule" className="border-l-4 border-l-blue-500 rounded-xl border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="px-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 [&[data-state=open]]:bg-blue-50/50 dark:[&[data-state=open]]:bg-blue-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-blue-700 dark:text-blue-300">Schedule & Registration</p>
                                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Dates, fees, and registration mode</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-900/10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-start'>
                                    Start date
                                </label>
                                <div className='flex items-center gap-2'>
                                    <Input
                                        id='op-start'
                                        type='date'
                                        value={formState.startDate}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
                                        disabled={formState.startDateTBD}
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white disabled:opacity-50'
                                    />
                                    <label className='flex items-center gap-2 whitespace-nowrap text-sm'>
                                        <input
                                            type='checkbox'
                                            checked={formState.startDateTBD}
                                            onChange={(e) => setFormState((prev) => ({
                                                ...prev,
                                                startDateTBD: e.target.checked,
                                                startDate: e.target.checked ? '' : prev.startDate
                                            }))}
                                            className='h-4 w-4 rounded border border-border/50 dark:border-white/20'
                                        />
                                        <span className='text-foreground dark:text-white'>TBD</span>
                                    </label>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-end'>
                                    End date
                                </label>
                                <div className='flex items-center gap-2'>
                                    <Input
                                        id='op-end'
                                        type='date'
                                        value={formState.endDate}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
                                        disabled={formState.endDateTBD}
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white disabled:opacity-50'
                                    />
                                    <label className='flex items-center gap-2 whitespace-nowrap text-sm'>
                                        <input
                                            type='checkbox'
                                            checked={formState.endDateTBD}
                                            onChange={(e) => setFormState((prev) => ({
                                                ...prev,
                                                endDateTBD: e.target.checked,
                                                endDate: e.target.checked ? '' : prev.endDate
                                            }))}
                                            className='h-4 w-4 rounded border border-border/50 dark:border-white/20'
                                        />
                                        <span className='text-foreground dark:text-white'>TBD</span>
                                    </label>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration'>
                                    Registration deadline
                                </label>
                                <div className='flex items-center gap-2'>
                                    <Input
                                        id='op-registration'
                                        type='date'
                                        value={formState.registrationDeadline}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, registrationDeadline: event.target.value }))}
                                        disabled={formState.registrationDeadlineTBD}
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white disabled:opacity-50'
                                    />
                                    <label className='flex items-center gap-2 whitespace-nowrap text-sm'>
                                        <input
                                            type='checkbox'
                                            checked={formState.registrationDeadlineTBD}
                                            onChange={(e) => setFormState((prev) => ({
                                                ...prev,
                                                registrationDeadlineTBD: e.target.checked,
                                                registrationDeadline: e.target.checked ? '' : prev.registrationDeadline
                                            }))}
                                            className='h-4 w-4 rounded border border-border/50 dark:border-white/20'
                                        />
                                        <span className='text-foreground dark:text-white'>TBD</span>
                                    </label>
                                </div>
                            </div>

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
                                    className='h-10 w-full rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
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
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 4: Media & Content - Rose Theme */}
                <AccordionItem value="media" className="border-l-4 border-l-rose-500 rounded-xl border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="px-4 hover:bg-rose-50/50 dark:hover:bg-rose-900/10 [&[data-state=open]]:bg-rose-50/50 dark:[&[data-state=open]]:bg-rose-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30">
                                <ImageIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-rose-700 dark:text-rose-300">Media & Description</p>
                                <p className="text-xs text-rose-600/70 dark:text-rose-400/70">Cover image, description & segments</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-gradient-to-b from-rose-50/30 to-transparent dark:from-rose-900/10">
                        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-image'>
                                    Cover image URL
                                </label>
                                <div className="flex flex-col gap-3">
                                    {/* Image Preview */}
                                    {formState.image && (
                                        <div className="relative group rounded-xl overflow-hidden border-2 border-rose-200 dark:border-rose-800/50 shadow-md">
                                            <img
                                                src={formState.image}
                                                alt="Cover preview"
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setFormState((prev) => ({ ...prev, image: '' }))}
                                                    className="shadow-lg"
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <Input
                                        id='op-image'
                                        value={formState.image}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
                                        placeholder='https://...'
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={imageUploading}
                                            className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generateCoverImage}
                                            disabled={imageUploading || !formState.title}
                                            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Auto Generate
                                        </Button>
                                        {imageUploading && <span className="text-sm text-muted-foreground animate-pulse">Processing...</span>}
                                    </div>

                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Description
                                </label>
                                <ReactQuill
                                    theme='snow'
                                    value={formState.description}
                                    onChange={(value) => setFormState((prev) => ({ ...prev, description: value }))}
                                    className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white rounded-md'
                                />
                            </div>

                            <div className='space-y-3'>
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
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 5: Additional Details - Amber Theme */}
                <AccordionItem value="details" className="border-l-4 border-l-amber-500 rounded-xl border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="px-4 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 [&[data-state=open]]:bg-amber-50/50 dark:[&[data-state=open]]:bg-amber-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-amber-700 dark:text-amber-300">Additional Details</p>
                                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Eligibility, benefits, timeline & custom tabs</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-gradient-to-b from-amber-50/30 to-transparent dark:from-amber-900/10">
                        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Eligibility Details
                                </label>
                                <Textarea
                                    value={formState.eligibilityText}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, eligibilityText: event.target.value }))}
                                    placeholder='One requirement per line...'
                                    className='min-h-[100px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Benefits
                                </label>
                                <Textarea
                                    value={formState.benefitsText}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, benefitsText: event.target.value }))}
                                    placeholder='One benefit per line...'
                                    className='min-h-[100px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Registration Process
                                </label>
                                <Textarea
                                    value={formState.registrationProcessText}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, registrationProcessText: event.target.value }))}
                                    placeholder='One step per line...'
                                    className='min-h-[100px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-foreground dark:text-white'>
                                    Timeline
                                </label>
                                <Textarea
                                    value={formState.timelineText}
                                    onChange={(event) => setFormState((prev) => ({ ...prev, timelineText: event.target.value }))}
                                    placeholder='YYYY-MM-DD | Event Name | status'
                                    className='min-h-[100px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white font-mono text-xs'
                                />
                                <p className='text-xs text-muted-foreground'>
                                    Format: Date | Event | Status (upcoming/active/completed)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground dark:text-white'>
                                        Contact Email
                                    </label>
                                    <Input
                                        value={formState.contactEmail}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, contactEmail: event.target.value }))}
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground dark:text-white'>
                                        Contact Phone
                                    </label>
                                    <Input
                                        value={formState.contactPhone}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, contactPhone: event.target.value }))}
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <label className='text-sm font-medium text-foreground dark:text-white'>
                                        Contact Website
                                    </label>
                                    <Input
                                        value={formState.contactWebsite}
                                        onChange={(event) => setFormState((prev) => ({ ...prev, contactWebsite: event.target.value }))}
                                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground dark:text-white">
                                    Custom Tabs
                                </label>
                                <CustomTabsManager
                                    customTabs={formState.customTabs}
                                    onChange={(newTabs) => setFormState(prev => ({ ...prev, customTabs: newTabs }))}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Section 6: Exam Pattern - Cyan Theme */}
                <AccordionItem value="exam" className="border-l-4 border-l-cyan-500 rounded-xl border border-border/40 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="px-4 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 [&[data-state=open]]:bg-cyan-50/50 dark:[&[data-state=open]]:bg-cyan-900/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                                <GraduationCap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-cyan-700 dark:text-cyan-300">Exam Pattern</p>
                                <p className="text-xs text-cyan-600/70 dark:text-cyan-400/70">Define exam structure & patterns</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2 bg-gradient-to-b from-cyan-50/30 to-transparent dark:from-cyan-900/10">
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {formState.examPatterns.map((pattern, index) => (
                                <Card key={pattern.id} className="p-4 border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-semibold text-foreground dark:text-white">
                                            Pattern Configuration {index + 1}
                                        </h4>
                                        {formState.examPatterns.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemovePattern(pattern.id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Total Questions</label>
                                            <Input
                                                value={pattern.totalQuestions}
                                                onChange={(e) => handlePatternChange(pattern.id, 'totalQuestions', e.target.value)}
                                                className="bg-card/80 dark:bg-white/5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Duration (mins)</label>
                                            <Input
                                                value={pattern.durationMinutes}
                                                onChange={(e) => handlePatternChange(pattern.id, 'durationMinutes', e.target.value)}
                                                className="bg-card/80 dark:bg-white/5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-muted-foreground">Negative Marking</label>
                                            <div className="flex items-center gap-2 h-10">
                                                <input
                                                    type="checkbox"
                                                    checked={pattern.negativeMarking}
                                                    onChange={(e) => handlePatternChange(pattern.id, 'negativeMarking', e.target.checked)}
                                                    className="h-4 w-4 rounded border-border/50 dark:border-white/20"
                                                />
                                                <span className="text-sm text-foreground dark:text-white">Enabled</span>
                                            </div>
                                        </div>
                                        {pattern.negativeMarking && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-muted-foreground">Marks per wrong answer</label>
                                                <Input
                                                    value={pattern.negativeMarksPerQuestion}
                                                    onChange={(e) => handlePatternChange(pattern.id, 'negativeMarksPerQuestion', e.target.value)}
                                                    className="bg-card/80 dark:bg-white/5"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-muted-foreground">Sections</label>
                                        <Textarea
                                            value={pattern.sectionsText}
                                            onChange={(e) => handlePatternChange(pattern.id, 'sectionsText', e.target.value)}
                                            placeholder="Section Name | Questions | Marks"
                                            className="bg-card/80 dark:bg-white/5 font-mono text-xs min-h-[80px]"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Format: Name | Questions | Marks</p>
                                    </div>
                                </Card>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddPattern}
                                className="w-full border-dashed border-border/60 dark:border-white/20"
                            >
                                + Add Another Exam Pattern
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="mt-6 flex items-center justify-end border-t border-border/60 dark:border-white/10 pt-4 gap-3">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="border-border/60 dark:border-white/10"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Opportunity' : 'Create Opportunity')}
                </Button>
            </div>
        </section>
    );
}
