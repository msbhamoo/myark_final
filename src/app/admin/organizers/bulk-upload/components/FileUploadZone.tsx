import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X, Download } from 'lucide-react';

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
        disabled: isProcessing,
    });

    const handleDownloadTemplate = async () => {
        try {
            const response = await fetch('/api/admin/organizers/bulk-upload/template');
            if (!response.ok) throw new Error('Failed to download template');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'organizers_template.xlsx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to download template:', error);
            alert('Failed to download template');
        }
    };

    return (
        <div className="space-y-4">
            {/* Download Template Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50 transition"
                >
                    <Download className="w-4 h-4" />
                    Download Template
                </button>
            </div>

            {/* Upload Zone */}
            <div
                {...getRootProps()}
                className={`
                    relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                    ${isDragActive
                        ? 'border-orange-500 bg-orange-500/5'
                        : 'border-border hover:border-orange-500/50 hover:bg-muted/50'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />

                {file ? (
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full">
                            <FileSpreadsheet className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClearFile();
                            }}
                            className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                        >
                            <X className="w-4 h-4" />
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-foreground">
                                {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                or click to browse
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Supported formats: .xlsx, .xls, .csv
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
