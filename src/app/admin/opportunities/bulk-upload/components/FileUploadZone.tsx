'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface FileUploadZoneProps {
    file: File | null;
    onFileSelect: (file: File) => void;
    onClearFile: () => void;
    isProcessing: boolean;
}

export function FileUploadZone({ file, onFileSelect, onClearFile, isProcessing }: FileUploadZoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const handleDownloadTemplate = (e: React.MouseEvent) => {
        e.stopPropagation();

        const headers = [
            'title', 'category', 'organizer', 'gradeEligibility', 'eligibilityType', 'ageEligibility',
            'mode', 'state', 'startDate', 'endDate', 'registrationDeadline',
            'startDateTBD', 'endDateTBD', 'registrationDeadlineTBD',
            'fee', 'description', 'image', 'applicationUrl',
            'eligibility', 'benefits', 'registrationProcess', 'segments', 'searchKeywords', 'timeline'
        ];

        const sampleRow = {
            title: 'National Science Olympiad 2025',
            category: 'Science',
            organizer: 'National Science Foundation',
            gradeEligibility: 'Grades 6-12',
            eligibilityType: 'grade',
            ageEligibility: '',
            mode: 'online',
            state: '',
            startDate: '2025-03-15',
            endDate: '2025-03-17',
            registrationDeadline: '2025-02-28',
            startDateTBD: 'false',
            endDateTBD: 'false',
            registrationDeadlineTBD: 'false',
            fee: '₹500',
            description: 'A competition for science enthusiasts...',
            image: 'https://example.com/image.jpg',
            applicationUrl: 'https://example.com/register',
            eligibility: 'Open to all students, Must be enrolled in school',
            benefits: 'Certificate, Cash prize ₹10,000, Internship opportunity',
            registrationProcess: 'Visit website, Fill form, Pay fee',
            segments: 'weekly-spotlight',
            searchKeywords: 'science, olympiad, STEM',
            timeline: '2025-02-28|Registration Opens|completed; 2025-03-15|Exam Date|upcoming'
        };

        const worksheet = XLSX.utils.json_to_sheet([sampleRow], { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        XLSX.writeFile(workbook, 'opportunity_upload_template.xlsx');
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
        },
        maxFiles: 1,
        disabled: isProcessing || !!file
    });

    if (file) {
        return (
            <div className="w-full p-8 border-2 border-dashed border-orange-500/30 rounded-xl bg-orange-500/5 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    {file.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    {(file.size / 1024).toFixed(2)} KB
                </p>

                {!isProcessing && (
                    <button
                        onClick={onClearFile}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                        <X className="w-4 h-4" />
                        Remove File
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`
        w-full p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
        ${isDragActive
                    ? 'border-orange-500 bg-orange-500/5 scale-[0.99]'
                    : 'border-border hover:border-orange-500/50 hover:bg-muted/50'
                }
        ${isDragReject ? 'border-red-500 bg-red-500/5' : ''}
      `}
        >
            <input {...getInputProps()} />

            <div className={`
        w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
        ${isDragActive ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-muted'}
      `}>
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-orange-600' : 'text-muted-foreground'}`} />
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
                {isDragActive ? 'Drop file here' : 'Drag & drop your file here'}
            </h3>

            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Support for Excel (.xlsx, .xls) and CSV files.
                Make sure to follow the template format.
            </p>

            <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition shadow-lg shadow-orange-500/20">
                    Browse Files
                </button>
                <button
                    onClick={handleDownloadTemplate}
                    className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download Template
                </button>
            </div>

            {isDragReject && (
                <div className="mt-4 flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Only Excel and CSV files are allowed</span>
                </div>
            )}
        </div>
    );
}
