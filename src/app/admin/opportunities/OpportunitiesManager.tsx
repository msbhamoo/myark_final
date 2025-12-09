'use client';

import { useEffect, useState, useCallback } from 'react';
import { OpportunityCategory, Organizer } from '@/types/masters';
import { OpportunityItem, HomeSegmentOption } from './types';
import { OpportunityForm } from './OpportunityForm';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { OpportunityListView } from './OpportunityListView';
import { OpportunityResources } from './OpportunityResources';

export function OpportunitiesManager() {
  const [items, setItems] = useState<OpportunityItem[]>([]);
  const [categories, setCategories] = useState<OpportunityCategory[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [availableSegments, setAvailableSegments] = useState<HomeSegmentOption[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [activeTab, setActiveTab] = useState<'opportunities' | 'resources'>('opportunities');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_ENDPOINTS.admin.opportunities);
      if (!res.ok) throw new Error('Failed to load opportunities');
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load opportunities');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMasters = useCallback(async () => {
    try {
      const [catRes, orgRes] = await Promise.all([
        fetch(API_ENDPOINTS.admin.opportunityCategories),
        fetch(API_ENDPOINTS.admin.organizers),
      ]);
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data.items || []);
      }
      if (orgRes.ok) {
        const data = await orgRes.json();
        setOrganizers(data.items || []);
      }
    } catch (err) {
      console.error('Failed to load masters', err);
    }
  }, []);

  const loadSegments = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.admin.homeSegments);
      if (res.ok) {
        const data = await res.json();
        const segments: HomeSegmentOption[] = (data.items || []).map((seg: any) => ({
          segmentKey: seg.segmentKey,
          title: seg.title,
          isVisible: seg.isVisible,
        }));
        setAvailableSegments(segments);
      }
    } catch (err) {
      console.error('Failed to load segments', err);
    }
  }, []);

  useEffect(() => {
    loadItems();
    loadMasters();
    loadSegments();
  }, [loadItems, loadMasters, loadSegments]);

  const handleCreateNew = () => {
    setEditingId(null);
    setViewMode('form');
    setError(null);
  };

  const handleEdit = (item: OpportunityItem) => {
    setEditingId(item.id);
    setViewMode('form');
    setError(null);
  };

  const handleCancelForm = () => {
    setEditingId(null);
    setViewMode('list');
    setError(null);
  };

  const handleFormSubmit = async (payload: any) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const endpoint = editingId
        ? API_ENDPOINTS.admin.opportunityById(editingId)
        : API_ENDPOINTS.admin.opportunities;

      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Request failed');
      }

      await loadItems();
      setViewMode('list');
      setEditingId(null);
    } catch (err) {
      console.error(err);
      throw err; // Re-throw to be handled by the form component if needed, or just set error here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this opportunity?')) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.admin.opportunityById(id), { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      await loadItems();
      if (editingId === id) {
        setEditingId(null);
        setViewMode('list');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete opportunity');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickApprove = async (item: OpportunityItem, publish = false) => {
    setActioningId(item.id);
    try {
      const payload = {
        ...item,
        status: publish ? 'published' : 'approved',
        state: item.state || '', // Ensure state is string
        customTabs: item.customTabs || [], // Ensure customTabs is array
      };

      const response = await fetch(API_ENDPOINTS.admin.opportunityById(item.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });


      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      await loadItems();
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('opportunities');
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === 'opportunities'
            ? 'bg-orange-500 text-foreground dark:text-white shadow-lg shadow-orange-500/30'
            : 'text-muted-foreground hover:bg-card/70 dark:hover:bg-white/10'
            }`}
        >
          Opportunities
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('resources');
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === 'resources'
            ? 'bg-orange-500 text-foreground dark:text-white shadow-lg shadow-orange-500/30'
            : 'text-muted-foreground hover:bg-card/70 dark:hover:bg-white/10'
            }`}
        >
          Resources
        </button>
        <button
          type="button"
          onClick={() => window.location.href = '/admin/opportunities/bulk-upload'}
          className="rounded-full px-4 py-2 text-sm font-medium transition bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30"
        >
          📤 Bulk Upload
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {activeTab === 'opportunities' && (
        <>
          {viewMode === 'list' ? (
            <OpportunityListView
              items={items}
              categories={categories}
              organizers={organizers}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              actioningId={actioningId}
              editingId={editingId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onQuickApprove={handleQuickApprove}
              onCreate={handleCreateNew}
              onRefresh={loadItems}
            />
          ) : (
            <OpportunityForm
              editingId={editingId}
              opportunity={items.find(i => i.id === editingId) || null}
              categories={categories}
              organizers={organizers}
              availableSegments={availableSegments}
              existingOpportunities={items}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
              onRefreshMasters={loadMasters}
            />
          )}
        </>
      )}

      {activeTab === 'resources' && (
        <OpportunityResources
          items={items}
          onRefresh={loadItems}
        />
      )}
    </div>
  );
}
