'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
    UploadState,
    BulkUploadStep,
    ParsedOpportunity,
    OpportunityWithValidation,
    BulkUploadResult
} from './types';
import { parseUploadedFile } from './utils/fileParser';
import { validateOpportunities } from './utils/validator';
import { Stepper } from './components/Stepper';
import { FileUploadZone } from './components/FileUploadZone';
import { PreviewTable } from './components/PreviewTable';
import { InlineEditor } from './components/InlineEditor';
import { OpportunityCategory, Organizer } from '@/types/masters';
import { HomeSegmentOption } from '../types';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Loader2, CheckCircle, Upload, ArrowLeft } from 'lucide-react';

export default function BulkUploadPage() {
    const router = useRouter();

    const [uploadState, setUploadState] = useState<UploadState>({
        currentStep: 'upload',
        file: null,
        fileName: null,
        parsedData: [],
        validatedData: [],
        isProcessing: false,
        error: null,
        uploadStats: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            warningRows: 0,
        },
    });

    const [categories, setCategories] = useState<OpportunityCategory[]>([]);
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [availableSegments, setAvailableSegments] = useState<HomeSegmentOption[]>([]);
    const [existingTitles, setExistingTitles] = useState<Set<string>>(new Set());
    const [editingItem, setEditingItem] = useState<OpportunityWithValidation | null>(null);
    const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);

    // Load master data
    useEffect(() => {
        const loadMasters = async () => {
            try {
                const [catRes, orgRes, segRes] = await Promise.all([
                    fetch(API_ENDPOINTS.admin.opportunityCategories),
                    fetch(API_ENDPOINTS.admin.organizers),
                    fetch(API_ENDPOINTS.admin.homeSegments),
                ]);

                if (catRes.ok) {
                    const data = await catRes.json();
                    setCategories(data.items || []);
                }

                if (orgRes.ok) {
                    const data = await orgRes.json();
                    setOrganizers(data.items || []);
                }

                if (segRes.ok) {
                    const data = await segRes.json();
                    const segments: HomeSegmentOption[] = (data.items || []).map((seg: any) => ({
                        segmentKey: seg.segmentKey,
                        title: seg.title,
                        isVisible: seg.isVisible,
                    }));
                    setAvailableSegments(segments);
                }

                // Load existing opportunity titles for duplicate detection
                const oppRes = await fetch(API_ENDPOINTS.admin.opportunities);
                if (oppRes.ok) {
                    const data = await oppRes.json();
                    const titles = new Set<string>(
                        (data.items || []).map((opp: any) =>
                            (opp.title || '').toLowerCase().trim()
                        ).filter((t: string) => t.length > 0)
                    );
                    setExistingTitles(titles);
                }
            } catch (err) {
                console.error('Failed to load master data', err);
            }
        };

        loadMasters();
    }, []);

    const handleFileSelect = async (file: File) => {
        setUploadState(prev => ({
            ...prev,
            file,
            fileName: file.name,
            error: null,
            isProcessing: true,
            currentStep: 'upload',
        }));

        try {
            // Parse file
            const parsedData = await parseUploadedFile(file);

            setUploadState(prev => ({
                ...prev,
                parsedData,
                isProcessing: false,
                currentStep: 'validation',
            }));

            // Immediately start validation
            await validateData(parsedData);
        } catch (error) {
            setUploadState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to parse file',
                isProcessing: false,
                currentStep: 'upload',
            }));
        }
    };

    const validateData = async (parsedData: ParsedOpportunity[]) => {
        setUploadState(prev => ({
            ...prev,
            isProcessing: true,
            currentStep: 'validation',
        }));

        try {
            const validationResults = await validateOpportunities(parsedData, {
                categories,
                organizers,
                existingTitles,
            });

            const validatedData: OpportunityWithValidation[] = parsedData.map((opp, index) => ({
                opportunity: opp,
                validation: validationResults[index]
            }));

            const validRows = validatedData.filter(d => d.validation.isValid && d.validation.warnings.length === 0).length;
            const invalidRows = validatedData.filter(d => !d.validation.isValid).length;
            const warningRows = validatedData.filter(d => d.validation.isValid && d.validation.warnings.length > 0).length;

            setUploadState(prev => ({
                ...prev,
                validatedData,
                isProcessing: false,
                currentStep: 'preview',
                uploadStats: {
                    totalRows: parsedData.length,
                    validRows,
                    invalidRows,
                    warningRows,
                },
            }));
        } catch (error) {
            console.error('Validation error:', error);
            setUploadState(prev => ({
                ...prev,
                error: 'Validation failed',
                isProcessing: false,
                currentStep: 'upload',
            }));
        }
    };

    const handleClearFile = () => {
        setUploadState({
            currentStep: 'upload',
            file: null,
            fileName: null,
            parsedData: [],
            validatedData: [],
            isProcessing: false,
            error: null,
            uploadStats: {
                totalRows: 0,
                validRows: 0,
                invalidRows: 0,
                warningRows: 0,
            },
        });
        setUploadResult(null);
    };

    const handleEdit = (item: OpportunityWithValidation) => {
        setEditingItem(item);
    };

    const handleSaveEdit = async (updatedOpportunity: any) => {
        // Update the opportunity in validatedData
        const updatedData = uploadState.validatedData.map(item =>
            item.opportunity.tempId === updatedOpportunity.tempId
                ? {
                    opportunity: { ...item.opportunity, ...updatedOpportunity },
                    validation: item.validation, // Will be re-validated
                }
                : item
        );

        setUploadState(prev => ({
            ...prev,
            validatedData: updatedData,
        }));

        setEditingItem(null);

        // Re-validate the updated data
        const parsedData = updatedData.map(item => item.opportunity);
        await validateData(parsedData);
    };

    const handleDelete = (tempId: string) => {
        const updatedData = uploadState.validatedData.filter(
            item => item.opportunity.tempId !== tempId
        );

        setUploadState(prev => ({
            ...prev,
            validatedData: updatedData,
            uploadStats: {
                totalRows: updatedData.length,
                validRows: updatedData.filter(d => d.validation.isValid && d.validation.warnings.length === 0).length,
                invalidRows: updatedData.filter(d => !d.validation.isValid).length,
                warningRows: updatedData.filter(d => d.validation.isValid && d.validation.warnings.length > 0).length,
            },
        }));
    };

    const handleDeleteAllInvalid = () => {
        if (!confirm(`Delete all ${uploadState.uploadStats.invalidRows} invalid rows?`)) {
            return;
        }
        const updatedData = uploadState.validatedData.filter(
            item => item.validation.isValid
        );

        setUploadState(prev => ({
            ...prev,
            validatedData: updatedData,
            uploadStats: {
                totalRows: updatedData.length,
                validRows: updatedData.filter(d => d.validation.isValid && d.validation.warnings.length === 0).length,
                invalidRows: 0,
                warningRows: updatedData.filter(d => d.validation.isValid && d.validation.warnings.length > 0).length,
            },
        }));
    };

    const handleSubmit = async () => {
        // Check if all rows are valid
        const hasErrors = uploadState.validatedData.some(item => !item.validation.isValid);
        if (hasErrors) {
            alert('Please fix all errors before submitting');
            return;
        }

        setUploadState(prev => ({ ...prev, isProcessing: true }));

        try {
            const opportunities = uploadState.validatedData.map(item => item.opportunity);

            const response = await fetch('/api/admin/opportunities/bulk-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opportunities }),
            });

            if (!response.ok) {
                throw new Error('Failed to upload opportunities');
            }

            const result: BulkUploadResult = await response.json();
            setUploadResult(result);
            setUploadState(prev => ({
                ...prev,
                isProcessing: false,
                currentStep: 'success',
            }));
        } catch (error) {
            setUploadState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Upload failed',
                isProcessing: false,
            }));
        }
    };

    const canSubmit =
        uploadState.validatedData.length > 0 &&
        uploadState.uploadStats.invalidRows === 0 &&
        !uploadState.isProcessing;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin/opportunities')}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Opportunities
                    </button>

                    <h1 className="text-3xl font-bold text-foreground">
                        Bulk Upload Opportunities
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Upload multiple opportunities at once using Excel or CSV files
                    </p>
                </div >

                {/* Stepper */}
                < Stepper currentStep={uploadState.currentStep} />

                {/* Error Display */}
                {
                    uploadState.error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                            <strong>Error:</strong> {uploadState.error}
                        </div>
                    )
                }

                {/* Step 1: Upload File */}
                {
                    uploadState.currentStep === 'upload' && (
                        <div className="space-y-6">
                            <FileUploadZone
                                file={uploadState.file}
                                onFileSelect={handleFileSelect}
                                onClearFile={handleClearFile}
                                isProcessing={uploadState.isProcessing}
                            />

                            {uploadState.isProcessing && (
                                <div className="flex items-center justify-center gap-3 p-8 text-muted-foreground">
                                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                                    <span>Parsing file...</span>
                                </div>
                            )}
                        </div>
                    )
                }

                {/* Step 2: Validation */}
                {
                    uploadState.currentStep === 'validation' && (
                        <div className="flex items-center justify-center gap-3 p-12 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            <div className="text-center">
                                <p className="text-lg font-medium text-foreground">Validating opportunities...</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Checking {uploadState.parsedData.length} rows
                                </p>
                            </div>
                        </div>
                    )
                }

                {/* Step 3: Preview & Fix */}
                {
                    uploadState.currentStep === 'preview' && (
                        <div className="space-y-6">
                            <PreviewTable
                                data={uploadState.validatedData}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onDownloadErrors={() => { }}
                            />

                            <div className="flex items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
                                <button
                                    onClick={handleClearFile}
                                    disabled={uploadState.isProcessing}
                                    className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition disabled:opacity-50"
                                >
                                    Re-upload File
                                </button>

                                <div className="flex items-center gap-4">
                                    {uploadState.uploadStats.invalidRows > 0 && (
                                        <>
                                            <button
                                                onClick={handleDeleteAllInvalid}
                                                disabled={uploadState.isProcessing}
                                                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                                            >
                                                Delete All Invalid ({uploadState.uploadStats.invalidRows})
                                            </button>
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                Please fix or delete {uploadState.uploadStats.invalidRows} error{uploadState.uploadStats.invalidRows !== 1 ? 's' : ''} before submitting
                                            </p>
                                        </>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!canSubmit}
                                        className={`
                    px-8 py-2.5 rounded-lg font-medium transition flex items-center gap-2
                    ${canSubmit
                                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                            }
                  `}
                                    >
                                        {uploadState.isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                Submit to Drafts
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Step 4: Success */}
                {
                    uploadState.currentStep === 'success' && uploadResult && (
                        <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Successfully Created {uploadResult.createdCount} Opportunities!
                                </h2>
                                <p className="text-muted-foreground">
                                    All opportunities have been saved as drafts. You can now review and publish them from the Opportunity Manager.
                                </p>
                            </div>

                            {uploadResult.errors.length > 0 && (
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-left">
                                    <p className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                                        {uploadResult.errors.length} row{uploadResult.errors.length !== 1 ? 's' : ''} had issues:
                                    </p>
                                    <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                                        {uploadResult.errors.slice(0, 5).map((err, idx) => (
                                            <li key={idx}>Row {err.rowNumber}: {err.error}</li>
                                        ))}
                                        {uploadResult.errors.length > 5 && (
                                            <li>... and {uploadResult.errors.length - 5} more</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={handleClearFile}
                                    className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition"
                                >
                                    Upload More
                                </button>
                                <button
                                    onClick={() => router.push('/admin/opportunities')}
                                    className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                                >
                                    View in Opportunity Manager
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >

            {/* Inline Editor Modal */}
            {
                editingItem && (
                    <InlineEditor
                        item={editingItem}
                        categories={categories}
                        organizers={organizers}
                        availableSegments={availableSegments}
                        onSave={handleSaveEdit}
                        onClose={() => setEditingItem(null)}
                    />
                )
            }
        </div >
    );
}


