'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { CustomTabsManager } from '@/components/CustomTabsManager';
import { MoreVertical, Eye, Edit, Trash, CheckCircle, Upload, ExternalLink, Plus } from 'lucide-react';
import { OpportunityItem } from './types';
import { formatDate, sectionsToText } from './utils';

interface OpportunityListViewProps {
    items: OpportunityItem[];
    isLoading: boolean;
    isSubmitting: boolean;
    actioningId: string | null;
    editingId: string | null;
    onEdit: (item: OpportunityItem) => void;
    onDelete: (id: string) => Promise<void>;
    onQuickApprove: (item: OpportunityItem, publish?: boolean) => Promise<void>;
    onCreate: () => void;
    onRefresh: () => void;
}

export function OpportunityListView({
    items,
    isLoading,
    isSubmitting,
    actioningId,
    editingId,
    onEdit,
    onDelete,
    onQuickApprove,
    onCreate,
    onRefresh,
}: OpportunityListViewProps) {
    const router = useRouter();
    const [viewingOpportunity, setViewingOpportunity] = useState<OpportunityItem | null>(null);

    return (
        <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h2 className='text-lg font-semibold text-foreground dark:text-white'>Opportunities</h2>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Manage your opportunities here.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant='outline' size='sm' onClick={onRefresh} disabled={isLoading}>
                        Refresh
                    </Button>
                    <Button onClick={onCreate} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <div className="grid gap-4">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm overflow-hidden">
                        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-white/10 to-white/5 hover:bg-card/70 dark:bg-white/10 border-b border-border/60 dark:border-white/10 sticky top-0 z-10">
                                        <TableHead className="w-[30%] text-foreground dark:text-white font-semibold">Title & Info</TableHead>
                                        <TableHead className="w-[15%] text-foreground dark:text-white font-semibold">Category</TableHead>
                                        <TableHead className="w-[20%] text-foreground dark:text-white font-semibold">Organizer</TableHead>
                                        <TableHead className="w-[10%] text-foreground dark:text-white font-semibold text-center">Status</TableHead>
                                        <TableHead className="w-[5%] text-foreground dark:text-white font-semibold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.length === 0 && !isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                                    <div className="h-12 w-12 rounded-xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                    </div>
                                                    <p>No opportunities available</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {items.map((item) => (
                                        <TableRow key={item.id} className="group border-b border-border/70 dark:border-white/5 hover:bg-card/80 dark:bg-white/5">
                                            <TableCell className="align-top py-4">
                                                <div className="space-y-1">
                                                    <button
                                                        onClick={() => setViewingOpportunity(item)}
                                                        className="font-medium text-foreground dark:text-white group-hover:text-orange-400 transition-colors text-left hover:underline whitespace-normal break-words"
                                                    >
                                                        {item.title}
                                                    </button>
                                                    <div className="flex flex-col space-y-1">
                                                        <span className="text-xs text-muted-foreground">
                                                            Added {formatDate(item.startDate)}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Deadline: {formatDate(item.registrationDeadline)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <Badge
                                                    variant="outline"
                                                    className="border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors whitespace-normal text-center"
                                                >
                                                    {item.category?.name || item.categoryName || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-8 w-8 rounded-lg border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 overflow-hidden flex-shrink-0 mt-1">
                                                        <img
                                                            src={item.organizerLogo || 'https://via.placeholder.com/40'}
                                                            alt={item.organizer?.name || item.organizerName || 'Organizer'}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-foreground dark:text-white whitespace-normal break-words">
                                                            {item.organizer?.name || item.organizerName || 'N/A'}
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10 capitalize">
                                                                {item.mode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`
                            ${item.status === 'published' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                                                            item.status === 'approved' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                                item.status === 'rejected' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                                                                    'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                          `}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => setViewingOpportunity(item)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onEdit(item)} disabled={isSubmitting && editingId === item.id}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {item.registrationMode === 'internal' && (
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/opportunities/${item.id}/registrations`)}>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Registrations
                                                            </DropdownMenuItem>
                                                        )}
                                                        {item.registrationMode === 'external' && (
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/opportunities/${item.id}/external-clicks`)}>
                                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                                External Clicks
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => onQuickApprove(item, false)}
                                                            disabled={Boolean(actioningId) || item.status === 'approved' || item.status === 'published'}
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => onQuickApprove(item, true)}
                                                            disabled={Boolean(actioningId) || item.status === 'published'}
                                                        >
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Publish
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => onDelete(item.id)}
                                                            disabled={isSubmitting}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden grid gap-4 sm:grid-cols-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-4 hover:border-orange-500/20 transition-colors"
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-foreground dark:text-white truncate">{item.title}</h3>
                                            <p className="mt-1 text-xs text-muted-foreground">Added {formatDate(item.startDate)}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-lg border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.organizerLogo || 'https://via.placeholder.com/40'}
                                                alt={item.organizer?.name || item.organizerName || 'Organizer'}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Category:</span>
                                            <Badge
                                                variant="outline"
                                                className="border-orange-500/20 bg-orange-500/10 text-orange-400"
                                            >
                                                {item.category?.name || item.categoryName || 'N/A'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Organizer:</span>
                                            <span className="text-foreground dark:text-white">
                                                {item.organizer?.name || item.organizerName || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Mode:</span>
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs capitalize bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10">
                                                {item.mode}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Status:</span>
                                            <Badge
                                                variant="outline"
                                                className={`
                          ${item.status === 'published' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                                                        item.status === 'approved' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                            item.status === 'rejected' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                                                                'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                        `}
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Deadline:</span>
                                            <span className="text-foreground dark:text-white">{formatDate(item.registrationDeadline)}</span>
                                        </div>
                                    </div>

                                    {/* Segments */}
                                    <div className="flex flex-wrap gap-1">
                                        {item.segments.map((segment, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10"
                                            >
                                                {segment}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60 dark:border-white/10">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setViewingOpportunity(item)}
                                            className="flex-1 border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    Actions
                                                    <MoreVertical className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onEdit(item)} disabled={isSubmitting && editingId === item.id}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {item.registrationMode === 'internal' && (
                                                    <DropdownMenuItem onClick={() => router.push(`/admin/opportunities/${item.id}/registrations`)}>
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Registrations
                                                    </DropdownMenuItem>
                                                )}
                                                {item.registrationMode === 'external' && (
                                                    <DropdownMenuItem onClick={() => router.push(`/admin/opportunities/${item.id}/external-clicks`)}>
                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                        External Clicks
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onQuickApprove(item, false)}
                                                    disabled={Boolean(actioningId) || item.status === 'approved' || item.status === 'published'}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onQuickApprove(item, true)}
                                                    disabled={Boolean(actioningId) || item.status === 'published'}
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Publish
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(item.id)}
                                                    disabled={isSubmitting}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {items.length === 0 && !isLoading && (
                            <div className="col-span-full rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-8 text-center">
                                <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                    <div className="h-12 w-12 rounded-xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 flex items-center justify-center">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-medium">No opportunities available</p>
                                    <p className="text-sm text-slate-500">Create your first opportunity to get started</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Opportunity Detail Modal */}
            <Dialog open={!!viewingOpportunity} onOpenChange={(open) => !open && setViewingOpportunity(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-3">
                            {viewingOpportunity?.organizerLogo && (
                                <img
                                    src={viewingOpportunity.organizerLogo}
                                    alt="Logo"
                                    className="h-10 w-10 rounded-lg object-cover border border-border/60"
                                />
                            )}
                            {viewingOpportunity?.title}
                        </DialogTitle>
                        <DialogDescription>
                            Opportunity ID: {viewingOpportunity?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {viewingOpportunity && (
                        <div className="space-y-6 mt-4">
                            {/* Meta Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border/60">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                                    <p className="font-medium">{viewingOpportunity.category?.name || viewingOpportunity.categoryName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Organizer</p>
                                    <p className="font-medium">{viewingOpportunity.organizer?.name || viewingOpportunity.organizerName || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Mode</p>
                                    <p className="font-medium capitalize">{viewingOpportunity.mode}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                                    <Badge
                                        variant="outline"
                                        className={`mt-1
                      ${viewingOpportunity.status === 'published' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                                                viewingOpportunity.status === 'approved' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                                    viewingOpportunity.status === 'rejected' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                                                        'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                    `}
                                    >
                                        {viewingOpportunity.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Registration</p>
                                    <p className="font-medium capitalize">{viewingOpportunity.registrationMode}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Fee</p>
                                    <p className="font-medium">{viewingOpportunity.currency} {viewingOpportunity.fee}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Deadline</p>
                                    <p className="font-medium">{formatDate(viewingOpportunity.registrationDeadline)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Event Date</p>
                                    <p className="font-medium">{formatDate(viewingOpportunity.startDate)}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Description</h3>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none bg-card/50 p-4 rounded-lg border border-border/60"
                                    dangerouslySetInnerHTML={{ __html: viewingOpportunity.description }}
                                />
                            </div>

                            {/* Eligibility & Benefits */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Eligibility</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground bg-card/50 p-4 rounded-lg border border-border/60">
                                        {viewingOpportunity.eligibility.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                        {viewingOpportunity.eligibility.length === 0 && <li>No eligibility criteria specified</li>}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Benefits</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground bg-card/50 p-4 rounded-lg border border-border/60">
                                        {viewingOpportunity.benefits.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                        {viewingOpportunity.benefits.length === 0 && <li>No benefits specified</li>}
                                    </ul>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Timeline</h3>
                                <div className="space-y-2 bg-card/50 p-4 rounded-lg border border-border/60">
                                    {viewingOpportunity.timeline.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{item.event}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-muted-foreground">{item.date}</span>
                                                <Badge variant="outline" className="text-xs">{item.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {viewingOpportunity.timeline.length === 0 && <p className="text-sm text-muted-foreground">No timeline events</p>}
                                </div>
                            </div>

                            {/* Exam Patterns */}
                            {viewingOpportunity.examPatterns && viewingOpportunity.examPatterns.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Exam Patterns</h3>
                                    <div className="space-y-4">
                                        {viewingOpportunity.examPatterns.map((pattern, i) => (
                                            <div key={i} className="bg-card/50 p-4 rounded-lg border border-border/60">
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-medium text-sm">Pattern {i + 1}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {pattern.totalQuestions} Qs | {pattern.durationMinutes} Mins
                                                    </span>
                                                </div>
                                                <div className="text-xs text-muted-foreground mb-2">
                                                    Classes: {pattern.classSelection.type === 'single' ? pattern.classSelection.selectedClasses[0] :
                                                        pattern.classSelection.type === 'multiple' ? pattern.classSelection.selectedClasses.join(', ') :
                                                            `${pattern.classSelection.rangeStart} - ${pattern.classSelection.rangeEnd}`}
                                                </div>
                                                <div className="text-xs whitespace-pre-wrap font-mono bg-slate-950/5 dark:bg-white/5 p-2 rounded">
                                                    {sectionsToText(pattern.sections)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Custom Tabs */}
                            {viewingOpportunity.customTabs && viewingOpportunity.customTabs.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-2">Custom Tabs</h3>
                                    <Card className="p-6">
                                        <CustomTabsManager
                                            customTabs={viewingOpportunity.customTabs}
                                            onChange={() => { }} // Read-only in view mode
                                        />
                                    </Card>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card/50 p-4 rounded-lg border border-border/60">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="text-sm">{viewingOpportunity.contactInfo?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="text-sm">{viewingOpportunity.contactInfo?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Website</p>
                                        <a href={viewingOpportunity.contactInfo?.website} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline truncate block">
                                            {viewingOpportunity.contactInfo?.website || 'N/A'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
