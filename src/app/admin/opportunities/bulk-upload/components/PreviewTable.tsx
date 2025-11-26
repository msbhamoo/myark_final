'use client';

import { useState, useMemo } from 'react';
import { OpportunityWithValidation } from '../types';
import { Search, ChevronDown, ChevronUp, Edit, Trash2, Download, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PreviewTableProps {
    data: OpportunityWithValidation[];
    onEdit: (item: OpportunityWithValidation) => void;
    onDelete: (tempId: string) => void;
    onDownloadErrors: () => void;
}

type FilterType = 'all' | 'valid' | 'invalid' | 'warnings';

export function PreviewTable({ data, onEdit, onDelete, onDownloadErrors }: PreviewTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 50;

    // Calculate stats
    const stats = useMemo(() => {
        const total = data.length;
        const valid = data.filter(d => d.validation.isValid && d.validation.warnings.length === 0).length;
        const invalid = data.filter(d => !d.validation.isValid).length;
        const withWarnings = data.filter(d => d.validation.isValid && d.validation.warnings.length > 0).length;

        return { total, valid, invalid, withWarnings };
    }, [data]);

    // Filter and search
    const filteredData = useMemo(() => {
        let result = data;

        // Apply search
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.opportunity.title?.toLowerCase().includes(search) ||
                item.opportunity.category?.toLowerCase().includes(search) ||
                item.opportunity.organizer?.toLowerCase().includes(search)
            );
        }

        // Apply filter
        if (filter === 'valid') {
            result = result.filter(d => d.validation.isValid && d.validation.warnings.length === 0);
        } else if (filter === 'invalid') {
            result = result.filter(d => !d.validation.isValid);
        } else if (filter === 'warnings') {
            result = result.filter(d => d.validation.isValid && d.validation.warnings.length > 0);
        }

        return result;
    }, [data, searchTerm, filter]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const toggleExpand = (tempId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tempId)) {
                newSet.delete(tempId);
            } else {
                newSet.add(tempId);
            }
            return newSet;
        });
    };

    const getRowColor = (item: OpportunityWithValidation) => {
        if (!item.validation.isValid) {
            return 'bg-red-500/10 border-red-500/20';
        }
        if (item.validation.warnings.length > 0) {
            return 'bg-yellow-500/10 border-yellow-500/20';
        }
        return 'bg-green-500/10 border-green-500/20';
    };

    const handleDownloadErrors = () => {
        const errorData = data
            .filter(item => !item.validation.isValid || item.validation.warnings.length > 0)
            .map(item => ({
                'Row Number': item.opportunity.rowNumber,
                'Title': item.opportunity.title || '',
                'Category': item.opportunity.category || '',
                'Organizer': item.opportunity.organizer || '',
                'Status': item.validation.isValid ? 'Warning' : 'Error',
                'Error Count': item.validation.errors.length,
                'Warning Count': item.validation.warnings.length,
                'Issues': [
                    ...item.validation.errors.map(e => `ERROR: ${e.field} - ${e.message}`),
                    ...item.validation.warnings.map(w => `WARNING: ${w.field} - ${w.message}`)
                ].join(' | '),
            }));

        const worksheet = XLSX.utils.json_to_sheet(errorData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');

        const fileName = `bulk-upload-errors-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border border-border rounded-lg bg-card">
                    <p className="text-sm text-muted-foreground">Total Rows</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                    <p className="text-sm text-green-600 dark:text-green-400">Valid</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.valid}</p>
                </div>
                <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                    <p className="text-sm text-red-600 dark:text-red-400">Invalid</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.invalid}</p>
                </div>
                <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.withWarnings}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by title, category, or organizer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'all'
                            ? 'bg-orange-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('valid')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'valid'
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                    >
                        Valid ({stats.valid})
                    </button>
                    <button
                        onClick={() => setFilter('invalid')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'invalid'
                            ? 'bg-red-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                    >
                        Invalid ({stats.invalid})
                    </button>
                    <button
                        onClick={() => setFilter('warnings')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'warnings'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                            }`}
                    >
                        Warnings ({stats.withWarnings})
                    </button>

                    {(stats.invalid > 0 || stats.withWarnings > 0) && (
                        <button
                            onClick={handleDownloadErrors}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Errors
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Row</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Organizer</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item) => {
                                const isExpanded = expandedRows.has(item.opportunity.tempId);
                                const hasIssues = item.validation.errors.length > 0 || item.validation.warnings.length > 0;

                                return (
                                    <>
                                        <tr
                                            key={item.opportunity.tempId}
                                            className={`border-b border-border transition ${getRowColor(item)}`}
                                        >
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {item.opportunity.rowNumber}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground max-w-xs truncate">
                                                {item.opportunity.title || <span className="text-muted-foreground italic">No title</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {item.opportunity.category || <span className="text-muted-foreground italic">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {item.opportunity.organizer || <span className="text-muted-foreground italic">-</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {!item.validation.isValid ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded text-xs font-medium">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {item.validation.errors.length} Error{item.validation.errors.length !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : item.validation.warnings.length > 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded text-xs font-medium">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {item.validation.warnings.length} Warning{item.validation.warnings.length !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                                                            <Info className="w-3 h-3" />
                                                            Valid
                                                        </span>
                                                    )}

                                                    {hasIssues && (
                                                        <button
                                                            onClick={() => toggleExpand(item.opportunity.tempId)}
                                                            className="p-1 hover:bg-muted rounded transition"
                                                            title={isExpanded ? "Collapse" : "Expand"}
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-2 hover:bg-orange-500/10 rounded transition text-orange-500"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(item.opportunity.tempId)}
                                                        className="p-2 hover:bg-red-500/10 rounded transition text-red-500"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded row for errors/warnings */}
                                        {isExpanded && hasIssues && (
                                            <tr className={`border-b border-border ${getRowColor(item)}`}>
                                                <td colSpan={6} className="px-4 py-4">
                                                    <div className="space-y-3 max-w-4xl">
                                                        {item.validation.errors.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                                                                    Errors:
                                                                </h4>
                                                                <ul className="space-y-1">
                                                                    {item.validation.errors.map((error, idx) => (
                                                                        <li key={idx} className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                                                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                            <span>
                                                                                <strong>{error.field}:</strong> {error.message}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {item.validation.warnings.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                                                                    Warnings:
                                                                </h4>
                                                                <ul className="space-y-1">
                                                                    {item.validation.warnings.map((warning, idx) => (
                                                                        <li key={idx} className="text-sm text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
                                                                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                                            <span>
                                                                                <strong>{warning.field}:</strong> {warning.message}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} entries
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-sm flex items-center">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-border rounded hover:bg-muted disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
