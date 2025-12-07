import { OrganizerWithValidation } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Edit2, Trash2 } from 'lucide-react';

interface PreviewTableProps {
    data: OrganizerWithValidation[];
    onEdit: (item: OrganizerWithValidation) => void;
    onDelete: (tempId: string) => void;
}

export function PreviewTable({ data, onEdit, onDelete }: PreviewTableProps) {
    const getStatusIcon = (item: OrganizerWithValidation) => {
        if (!item.validation.isValid) {
            return <XCircle className="w-5 h-5 text-red-500" />;
        }
        if (item.validation.warnings.length > 0) {
            return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        }
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    };

    const getStatusBadge = (item: OrganizerWithValidation) => {
        if (!item.validation.isValid) {
            return (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    Errors: {item.validation.errors.length}
                </span>
            );
        }
        if (item.validation.warnings.length > 0) {
            return (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                    Warnings: {item.validation.warnings.length}
                </span>
            );
        }
        return (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Valid
            </span>
        );
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Stats Header */}
            <div className="px-6 py-4 bg-muted/50 border-b border-border">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Preview ({data.length} organizers)</h3>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {data.filter(d => d.validation.isValid && d.validation.warnings.length === 0).length} Valid
                        </span>
                        <span className="flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            {data.filter(d => d.validation.isValid && d.validation.warnings.length > 0).length} Warnings
                        </span>
                        <span className="flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-red-500" />
                            {data.filter(d => !d.validation.isValid).length} Errors
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Row</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Website</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Issues</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((item) => (
                            <tr key={item.organizer.tempId} className="hover:bg-muted/20 transition">
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {item.organizer.rowNumber}
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusIcon(item)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium text-foreground">
                                        {item.organizer.name || <span className="text-red-500 italic">Missing</span>}
                                    </span>
                                    {item.organizer.shortName && (
                                        <span className="text-sm text-muted-foreground ml-2">
                                            ({item.organizer.shortName})
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground capitalize">
                                    {item.organizer.type || 'other'}
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {item.organizer.website ? (
                                        <span className="truncate max-w-[150px] block">{item.organizer.website}</span>
                                    ) : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {item.organizer.contactEmail || '-'}
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusBadge(item)}
                                    {item.validation.errors.length > 0 && (
                                        <div className="mt-1 text-xs text-red-500">
                                            {item.validation.errors[0].message}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="p-1.5 text-muted-foreground hover:text-orange-500 hover:bg-orange-50 rounded transition"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.organizer.tempId)}
                                            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
