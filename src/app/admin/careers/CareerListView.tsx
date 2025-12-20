'use client';

import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash, Plus, Search, Filter, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Career } from '@/constants/careers';
import { cn } from '@/lib/utils';

interface CareerListViewProps {
    items: Career[];
    isLoading: boolean;
    isSubmitting: boolean;
    onEdit: (item: Career) => void;
    onDelete: (slug: string) => Promise<void>;
    onCreate: () => void;
    onRefresh: () => void;
}

export function CareerListView({
    items,
    isLoading,
    isSubmitting,
    onEdit,
    onDelete,
    onCreate,
    onRefresh,
}: CareerListViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.slug.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const clearFilters = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-foreground dark:text-white">Careers List</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {items.length} careers found in Firestore.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
                        <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button onClick={onCreate} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Career
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-6 space-y-4 rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search careers by title, slug, or category..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="pl-9"
                    />
                </div>

                {searchQuery && (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Filter className="h-4 w-4" />
                            <span>
                                Found {filteredItems.length} matches
                            </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                            <X className="h-3 w-3 mr-1" />
                            Clear Search
                        </Button>
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white/5 hover:bg-card/70 dark:bg-white/10 border-b border-border/60 dark:border-white/10">
                            <TableHead className="w-[40%] text-foreground dark:text-white font-semibold">Title & Slug</TableHead>
                            <TableHead className="w-[30%] text-foreground dark:text-white font-semibold">Category</TableHead>
                            <TableHead className="w-[20%] text-foreground dark:text-white font-semibold">Metadata</TableHead>
                            <TableHead className="w-[10%] text-foreground dark:text-white font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    Loading careers...
                                </TableCell>
                            </TableRow>
                        ) : filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                    No careers found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedItems.map((item) => (
                                <TableRow key={item.slug} className="group border-b border-border/70 dark:border-white/5 hover:bg-card/80 dark:bg-white/5">
                                    <TableCell className="py-4">
                                        <div className="space-y-1">
                                            <div className="font-medium text-foreground dark:text-white group-hover:text-indigo-400 transition-colors">
                                                {item.title}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono">
                                                {item.slug}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-semibold", item.categoryColor)}>
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <div>Roadmap: {item.roadmap.length} steps</div>
                                            <div>Exams: {item.exams.length} listed</div>
                                            {item.images && item.images.length > 0 && (
                                                <div className="text-indigo-500 font-medium">Images: {item.images.length}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onEdit(item)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Career
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(item.slug)}
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
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {filteredItems.length > itemsPerPage && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 dark:border-white/10">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
