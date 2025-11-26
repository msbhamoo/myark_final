'use client';

import { useState, useEffect } from 'react';
import { OpportunityWithValidation } from '../types';
import { X } from 'lucide-react';
import { OpportunityForm } from '../../OpportunityForm';
import { OpportunityCategory, Organizer } from '@/types/masters';
import { HomeSegmentOption, OpportunityItem } from '../../types';

interface InlineEditorProps {
    item: OpportunityWithValidation | null;
    categories: OpportunityCategory[];
    organizers: Organizer[];
    availableSegments: HomeSegmentOption[];
    onSave: (updatedOpportunity: any) => void;
    onClose: () => void;
}

export function InlineEditor({
    item,
    categories,
    organizers,
    availableSegments,
    onSave,
    onClose,
}: InlineEditorProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!item) return null;

    const handleSubmit = async (payload: any) => {
        setIsSubmitting(true);
        try {
            // Merge the payload with existing tempId and rowNumber
            const updatedOpportunity = {
                ...payload,
                tempId: item.opportunity.tempId,
                rowNumber: item.opportunity.rowNumber,
            };

            onSave(updatedOpportunity);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Convert ParsedOpportunity to OpportunityItem format for the form
    const opportunityForForm: OpportunityItem = {
        id: item.opportunity.tempId,
        title: item.opportunity.title || '',
        category: item.opportunity.category
            ? { id: item.opportunity.categoryId || '', name: item.opportunity.category }
            : { id: '', name: '' },
        categoryId: item.opportunity.categoryId || '',
        categoryName: item.opportunity.categoryName,
        organizer: item.opportunity.organizer
            ? { id: item.opportunity.organizerId || '', name: item.opportunity.organizer }
            : { id: '', name: '' },
        organizerId: item.opportunity.organizerId || '',
        organizerName: item.opportunity.organizerName,
        organizerLogo: item.opportunity.organizerLogo || '',
        gradeEligibility: item.opportunity.gradeEligibility || '',
        eligibilityType: item.opportunity.eligibilityType,
        ageEligibility: item.opportunity.ageEligibility,
        mode: item.opportunity.mode || 'online',
        state: item.opportunity.state,
        status: 'draft',
        startDate: item.opportunity.startDate || null,
        endDate: item.opportunity.endDate || null,
        registrationDeadline: item.opportunity.registrationDeadline || null,
        startDateTBD: item.opportunity.startDateTBD,
        endDateTBD: item.opportunity.endDateTBD,
        registrationDeadlineTBD: item.opportunity.registrationDeadlineTBD,
        fee: item.opportunity.fee || '',
        currency: item.opportunity.currency || '',
        image: item.opportunity.image || '',
        description: item.opportunity.description || '',
        eligibility: item.opportunity.eligibility || [],
        benefits: item.opportunity.benefits || [],
        timeline: item.opportunity.timeline || [],
        registrationProcess: item.opportunity.registrationProcess || [],
        examPattern: (item.opportunity.examPattern as any) || {
            totalQuestions: null,
            durationMinutes: null,
            negativeMarking: false,
            negativeMarksPerQuestion: null,
            sections: []
        },
        examPatterns: item.opportunity.examPatterns || [],
        contactInfo: item.opportunity.contactInfo || {
            email: '',
            phone: '',
            website: ''
        },
        resources: item.opportunity.resources || [],
        segments: item.opportunity.segments || [],
        applicationUrl: item.opportunity.applicationUrl,
        registrationMode: item.opportunity.registrationMode,
        registrationCount: item.opportunity.registrationCount,
        customTabs: item.opportunity.customTabs,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-6xl bg-background border border-border rounded-lg shadow-2xl my-8">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-background">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">
                            Edit Opportunity - Row {item.opportunity.rowNumber}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Make changes to fix validation errors
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-muted rounded-lg transition disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    <OpportunityForm
                        editingId={item.opportunity.tempId}
                        opportunity={opportunityForForm}
                        categories={categories}
                        organizers={organizers}
                        availableSegments={availableSegments}
                        existingOpportunities={[]}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
