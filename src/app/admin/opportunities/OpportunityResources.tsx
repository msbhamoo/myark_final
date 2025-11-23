'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash, ExternalLink, FileText, Video, Link as LinkIcon, Plus } from 'lucide-react';
import { OpportunityItem, ResourceDraft } from './types';
import { OpportunityResource } from '@/types/opportunity';

interface OpportunityResourcesProps {
    items: OpportunityItem[];
    onRefresh: () => Promise<void>;
}

export function OpportunityResources({ items, onRefresh }: OpportunityResourcesProps) {
    const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('');
    const [resourceDraft, setResourceDraft] = useState<ResourceDraft>({
        title: '',
        url: '',
        type: 'link',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedOpportunity = items.find((item) => item.id === selectedOpportunityId);

    const createResourceId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `res_${Math.random().toString(36).slice(2, 10)}`;
    };

    const normalizeResourceUrl = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            return '';
        }
        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    const handleResourceSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedOpportunity) {
            setError('Select an opportunity to add a resource.');
            return;
        }

        const title = resourceDraft.title.trim();
        const url = normalizeResourceUrl(resourceDraft.url);
        const description = resourceDraft.description.trim();

        if (!title) {
            setError('Resource title is required.');
            return;
        }

        if (!url) {
            setError('Resource URL is required.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const newResource: OpportunityResource = {
                id: createResourceId(),
                title,
                url,
                type: resourceDraft.type,
                description: description || undefined,
            };
            const existingResources = selectedOpportunity.resources ?? [];
            const response = await fetch(`/api/admin/opportunities/${selectedOpportunity.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resources: [...existingResources, newResource] }),
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error ?? 'Failed to save resource');
            }
            await onRefresh();
            setResourceDraft({
                title: '',
                url: '',
                type: 'link',
                description: '',
            });
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResourceRemove = async (resourceId: string) => {
        if (!selectedOpportunity) {
            return;
        }
        if (!confirm('Remove this resource?')) {
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const filteredResources = (selectedOpportunity.resources ?? []).filter(
                (resource) => resource.id !== resourceId,
            );
            const response = await fetch(`/api/admin/opportunities/${selectedOpportunity.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resources: filteredResources }),
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error ?? 'Failed to remove resource');
            }
            await onRefresh();
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
            <div className='mb-6'>
                <h2 className='text-lg font-semibold text-foreground dark:text-white'>Manage Resources</h2>
                <p className='text-sm text-muted-foreground'>
                    Add study materials, past papers, or official links to opportunities.
                </p>
            </div>

            <div className='grid gap-8 md:grid-cols-[300px_1fr]'>
                {/* Sidebar: Select Opportunity */}
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white'>Select Opportunity</label>
                        <select
                            value={selectedOpportunityId}
                            onChange={(e) => setSelectedOpportunityId(e.target.value)}
                            className='w-full h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                        >
                            <option value=''>Select an opportunity...</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedOpportunity && (
                        <div className='rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4'>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='h-10 w-10 rounded-lg border border-border/60 dark:border-white/10 bg-white p-1 overflow-hidden flex-shrink-0'>
                                    <img
                                        src={selectedOpportunity.organizerLogo || 'https://via.placeholder.com/40'}
                                        alt="Logo"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <p className='font-medium text-sm text-foreground dark:text-white line-clamp-1'>{selectedOpportunity.title}</p>
                                    <p className='text-xs text-muted-foreground'>{selectedOpportunity.organizerName}</p>
                                </div>
                            </div>
                            <div className='text-xs text-muted-foreground'>
                                <p>Resources: {selectedOpportunity.resources?.length || 0}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className='space-y-6'>
                    {selectedOpportunity ? (
                        <>
                            {/* Add Resource Form */}
                            <form onSubmit={handleResourceSubmit} className='rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4 space-y-4'>
                                <h3 className='text-sm font-semibold text-foreground dark:text-white flex items-center gap-2'>
                                    <Plus className="h-4 w-4" /> Add New Resource
                                </h3>
                                <div className='grid gap-4 md:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <label className='text-xs font-medium text-muted-foreground'>Title</label>
                                        <Input
                                            value={resourceDraft.title}
                                            onChange={(e) => setResourceDraft(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder='e.g., Official Syllabus 2024'
                                            className='bg-card/80 dark:bg-white/5'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-xs font-medium text-muted-foreground'>Type</label>
                                        <select
                                            value={resourceDraft.type}
                                            onChange={(e) => setResourceDraft(prev => ({ ...prev, type: e.target.value as any }))}
                                            className='w-full h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
                                        >
                                            <option value="pdf">PDF Document</option>
                                            <option value="link">External Link</option>
                                            <option value="video">Video</option>
                                            <option value="official">Official Website</option>
                                        </select>
                                    </div>
                                    <div className='space-y-2 md:col-span-2'>
                                        <label className='text-xs font-medium text-muted-foreground'>URL</label>
                                        <Input
                                            value={resourceDraft.url}
                                            onChange={(e) => setResourceDraft(prev => ({ ...prev, url: e.target.value }))}
                                            placeholder='https://...'
                                            className='bg-card/80 dark:bg-white/5'
                                        />
                                    </div>
                                    <div className='space-y-2 md:col-span-2'>
                                        <label className='text-xs font-medium text-muted-foreground'>Description (Optional)</label>
                                        <Textarea
                                            value={resourceDraft.description}
                                            onChange={(e) => setResourceDraft(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder='Brief description of the resource...'
                                            className='bg-card/80 dark:bg-white/5 min-h-[80px]'
                                        />
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <Button type='submit' disabled={isSubmitting} size="sm">
                                        {isSubmitting ? 'Adding...' : 'Add Resource'}
                                    </Button>
                                </div>
                                {error && <p className='text-xs text-red-400'>{error}</p>}
                            </form>

                            {/* Existing Resources List */}
                            <div className='space-y-3'>
                                <h3 className='text-sm font-semibold text-foreground dark:text-white'>Existing Resources</h3>
                                {!selectedOpportunity.resources || selectedOpportunity.resources.length === 0 ? (
                                    <p className='text-sm text-muted-foreground italic'>No resources added yet.</p>
                                ) : (
                                    <div className='grid gap-3'>
                                        {selectedOpportunity.resources.map((resource) => (
                                            <div
                                                key={resource.id}
                                                className='flex items-start justify-between gap-4 rounded-lg border border-border/60 dark:border-white/10 bg-card/40 dark:bg-white/5 p-3 group hover:border-orange-500/20 transition-colors'
                                            >
                                                <div className='flex items-start gap-3'>
                                                    <div className='mt-1 p-2 rounded-md bg-card/80 dark:bg-white/10 text-orange-500'>
                                                        {resource.type === 'pdf' && <FileText className="h-4 w-4" />}
                                                        {resource.type === 'video' && <Video className="h-4 w-4" />}
                                                        {(resource.type === 'link' || resource.type === 'official') && <LinkIcon className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <h4 className='font-medium text-sm text-foreground dark:text-white'>{resource.title}</h4>
                                                        <a
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className='text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5'
                                                        >
                                                            {resource.url} <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                        {resource.description && (
                                                            <p className='text-xs text-muted-foreground mt-1'>{resource.description}</p>
                                                        )}
                                                        <span className='inline-block mt-2 text-[10px] uppercase tracking-wide text-muted-foreground border border-border/60 px-1.5 py-0.5 rounded'>
                                                            {resource.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleResourceRemove(resource.id)}
                                                    disabled={isSubmitting}
                                                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground border-2 border-dashed border-border/60 dark:border-white/10 rounded-2xl'>
                            <FileText className="h-12 w-12 mb-4 opacity-20" />
                            <p className='text-lg font-medium'>No Opportunity Selected</p>
                            <p className='text-sm'>Select an opportunity from the sidebar to manage its resources.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
