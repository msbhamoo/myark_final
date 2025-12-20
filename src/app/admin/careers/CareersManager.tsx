'use client';

import { useEffect, useState, useCallback } from 'react';
import { Career } from '@/constants/careers';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { CareerListView } from './CareerListView';
import { CareerForm } from './_components/CareerForm';

export function CareersManager() {
    const [items, setItems] = useState<Career[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
    const [editingSlug, setEditingSlug] = useState<string | null>(null);

    const loadItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await fetch(API_ENDPOINTS.admin.careers);
            if (!res.ok) throw new Error('Failed to load careers');
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load careers');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    const handleCreateNew = () => {
        setEditingSlug(null);
        setViewMode('form');
        setError(null);
    };

    const handleEdit = (item: Career) => {
        setEditingSlug(item.slug);
        setViewMode('form');
        setError(null);
    };

    const handleCancelForm = () => {
        setEditingSlug(null);
        setViewMode('list');
        setError(null);
    };

    const handleFormSubmit = async (payload: any) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const endpoint = editingSlug
                ? API_ENDPOINTS.admin.careerBySlug(editingSlug)
                : API_ENDPOINTS.admin.careers;

            const response = await fetch(endpoint, {
                method: editingSlug ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error ?? 'Request failed');
            }

            await loadItems();
            setViewMode('list');
            setEditingSlug(null);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Delete this career?')) {
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(API_ENDPOINTS.admin.careerBySlug(slug), { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete');
            }
            await loadItems();
            if (editingSlug === slug) {
                setEditingSlug(null);
                setViewMode('list');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to delete career');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
                    {error}
                </div>
            )}

            {viewMode === 'list' ? (
                <CareerListView
                    items={items}
                    isLoading={isLoading}
                    isSubmitting={isSubmitting}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCreate={handleCreateNew}
                    onRefresh={loadItems}
                />
            ) : (
                <CareerForm
                    editingSlug={editingSlug}
                    career={items.find(i => i.slug === editingSlug) || null}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
