'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    UploadState,
    ParsedOrganizer,
    OrganizerWithValidation,
    BulkUploadResult
} from './types';
import { parseUploadedFile } from './utils/fileParser';
import { validateOrganizers } from './utils/validator';
import { Stepper } from './components/Stepper';
import { FileUploadZone } from './components/FileUploadZone';
import { PreviewTable } from './components/PreviewTable';
import { OpportunityCategory } from '@/types/masters';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Loader2, CheckCircle, Upload, ArrowLeft } from 'lucide-react';

export default function OrganizerBulkUploadPage() {
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
    const [uploadResult, setUploadResult] = useState<BulkUploadResult | null>(null);

    // Load categories for mapping opportunity types
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.admin.opportunityCategories);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.items || []);
                }
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        loadCategories();
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
            const parsedData = await parseUploadedFile(file);

            setUploadState(prev => ({
                ...prev,
                parsedData,
                isProcessing: false,
                currentStep: 'validation',
            }));

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

    const validateData = async (parsedData: ParsedOrganizer[]) => {
        setUploadState(prev => ({
            ...prev,
            isProcessing: true,
            currentStep: 'validation',
        }));

        try {
            const validationResults = await validateOrganizers(parsedData, { categories });

            const validatedData: OrganizerWithValidation[] = parsedData.map((org, index) => ({
                organizer: org,
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

    const handleEdit = (item: OrganizerWithValidation) => {
        // For now, show a simple prompt to edit name
        const newName = prompt('Edit organizer name:', item.organizer.name);
        if (newName !== null && newName.trim()) {
            const updatedData = uploadState.validatedData.map(d =>
                d.organizer.tempId === item.organizer.tempId
                    ? { ...d, organizer: { ...d.organizer, name: newName.trim() } }
                    : d
            );
            setUploadState(prev => ({ ...prev, validatedData: updatedData }));

            // Re-validate
            const parsedData = updatedData.map(d => d.organizer);
            validateData(parsedData);
        }
    };

    const handleDelete = (tempId: string) => {
        const updatedData = uploadState.validatedData.filter(
            item => item.organizer.tempId !== tempId
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

    const handleSubmit = async () => {
        const hasErrors = uploadState.validatedData.some(item => !item.validation.isValid);
        if (hasErrors) {
            alert('Please fix all errors before submitting');
            return;
        }

        setUploadState(prev => ({ ...prev, isProcessing: true }));

        try {
            const organizers = uploadState.validatedData.map(item => item.organizer);

            const response = await fetch('/api/admin/organizers/bulk-upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizers }),
            });

            if (!response.ok) {
                throw new Error('Failed to upload organizers');
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
                        onClick={() => router.push('/admin/settings')}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-500 transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Settings
                    </button>

                    <h1 className="text-3xl font-bold text-foreground">
                        Bulk Upload Organizers
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Upload multiple organizers at once using Excel or CSV files
                    </p>
                </div>

                {/* Stepper */}
                <Stepper currentStep={uploadState.currentStep} />

                {/* Error Display */}
                {uploadState.error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                        <strong>Error:</strong> {uploadState.error}
                    </div>
                )}

                {/* Step 1: Upload File */}
                {uploadState.currentStep === 'upload' && (
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
                )}

                {/* Step 2: Validation */}
                {uploadState.currentStep === 'validation' && (
                    <div className="flex items-center justify-center gap-3 p-12 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <div className="text-center">
                            <p className="text-lg font-medium text-foreground">Validating organizers...</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Checking {uploadState.parsedData.length} rows
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 3: Preview & Fix */}
                {uploadState.currentStep === 'preview' && (
                    <div className="space-y-6">
                        <PreviewTable
                            data={uploadState.validatedData}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
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
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        Please fix {uploadState.uploadStats.invalidRows} error{uploadState.uploadStats.invalidRows !== 1 ? 's' : ''} before submitting
                                    </p>
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
                                            Create Organizers
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {uploadState.currentStep === 'success' && uploadResult && (
                    <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Successfully Created {uploadResult.createdCount} Organizers!
                            </h2>
                            <p className="text-muted-foreground">
                                All organizers have been saved. You can now view them in the Settings page.
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
                                onClick={() => router.push('/admin/settings')}
                                className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
                            >
                                Back to Settings
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
