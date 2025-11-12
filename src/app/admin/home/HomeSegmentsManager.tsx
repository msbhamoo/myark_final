"use client";

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type AdminHomeSegment = {
  id: string | null;
  segmentKey: string;
  title: string;
  subtitle: string;
  limit: number;
  order: number;
  highlight: boolean;
  isVisible: boolean;
  isDefault: boolean;
  defaultId: string | null;
  persisted: boolean;
};

type SegmentFormState = {
  id: string | null;
  segmentKey: string;
  title: string;
  subtitle: string;
  limit: string;
  order: string;
  highlight: boolean;
  isVisible: boolean;
  isDefault: boolean;
  persisted: boolean;
};

const defaultSegmentForm: SegmentFormState = {
  id: null,
  segmentKey: '',
  title: '',
  subtitle: '',
  limit: '8',
  order: '0',
  highlight: false,
  isVisible: true,
  isDefault: false,
  persisted: false,
};

const clampMultiplier = (value: number) => Math.min(Math.max(value, 1), 10);

export function HomeSegmentsManager() {
  const [segments, setSegments] = useState<AdminHomeSegment[]>([]);
  const [segmentsLoading, setSegmentsLoading] = useState(false);
  const [segmentsError, setSegmentsError] = useState<string | null>(null);

  const [formState, setFormState] = useState<SegmentFormState>(defaultSegmentForm);
  const [segmentSubmitting, setSegmentSubmitting] = useState(false);

  const [statsMultiplier, setStatsMultiplier] = useState(1);
  const [statsInput, setStatsInput] = useState('1');
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsSaving, setStatsSaving] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [statsMessage, setStatsMessage] = useState<string | null>(null);

  const hasSegments = segments.length > 0;
  const isEditingSegment = Boolean(formState.id) || formState.isDefault;

  const sortedSegments = useMemo(
    () => [...segments].sort((a, b) => (a.order - b.order) || a.segmentKey.localeCompare(b.segmentKey)),
    [segments],
  );

  const loadSegments = async () => {
    setSegmentsLoading(true);
    setSegmentsError(null);
    try {
      const response = await fetch('/api/admin/home-segments');
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load home segments');
      }
      const payload = await response.json();
      const items: AdminHomeSegment[] = Array.isArray(payload.items) ? payload.items : [];
      setSegments(items);
      if (isEditingSegment) {
        const match = items.find((item) =>
          formState.id ? item.id === formState.id : item.segmentKey === formState.segmentKey,
        );
        if (match) {
          setFormState({
            id: match.id,
            segmentKey: match.segmentKey,
            title: match.title,
            subtitle: match.subtitle,
            limit: String(match.limit),
            order: String(match.order),
            highlight: match.highlight,
            isVisible: match.isVisible,
            isDefault: match.isDefault,
            persisted: match.persisted,
          });
        }
      }
    } catch (error) {
      console.error(error);
      setSegmentsError(error instanceof Error ? error.message : 'Failed to load home segments');
    } finally {
      setSegmentsLoading(false);
    }
  };

  const loadStatsMultiplier = async () => {
    setStatsLoading(true);
    setStatsError(null);
    setStatsMessage(null);
    try {
      const response = await fetch('/api/admin/home-stats');
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load stats multiplier');
      }
      const payload = await response.json();
      const multiplier =
        typeof payload.multiplier === 'number' && Number.isFinite(payload.multiplier)
          ? clampMultiplier(payload.multiplier)
          : 1;
      setStatsMultiplier(multiplier);
      setStatsInput(String(multiplier));
    } catch (error) {
      console.error(error);
      setStatsError(error instanceof Error ? error.message : 'Failed to load stats multiplier');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadSegments();
    loadStatsMultiplier();
  }, []);

  const resetForm = () => {
    setFormState(defaultSegmentForm);
  };

  const handleEditSegment = (segment: AdminHomeSegment) => {
    setFormState({
      id: segment.id,
      segmentKey: segment.segmentKey,
      title: segment.title,
      subtitle: segment.subtitle,
      limit: String(segment.limit),
      order: String(segment.order),
      highlight: segment.highlight,
      isVisible: segment.isVisible,
      isDefault: segment.isDefault,
      persisted: segment.persisted,
    });
  };

  const handleCreateCustomSegment = () => {
    setFormState(defaultSegmentForm);
  };

  const handleSegmentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSegmentSubmitting(true);
    setSegmentsError(null);

    const payload = {
      segmentKey: formState.segmentKey.trim(),
      title: formState.title.trim(),
      subtitle: formState.subtitle.trim(),
      limit: Number.parseInt(formState.limit, 10),
      order: Number.parseInt(formState.order, 10),
      highlight: formState.highlight,
      isVisible: formState.isVisible,
    };

    if (!payload.segmentKey) {
      setSegmentsError('Segment key is required.');
      setSegmentSubmitting(false);
      return;
    }

    if (!payload.title) {
      setSegmentsError('Title is required.');
      setSegmentSubmitting(false);
      return;
    }

    const requestInit: RequestInit = {
      method: formState.persisted ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      const endpoint = formState.persisted && formState.id
        ? `/api/admin/home-segments/${formState.id}`
        : '/api/admin/home-segments';
      const response = await fetch(endpoint, requestInit);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save segment');
      }
      await loadSegments();
      resetForm();
    } catch (error) {
      console.error(error);
      setSegmentsError(error instanceof Error ? error.message : 'Failed to save segment');
    } finally {
      setSegmentSubmitting(false);
    }
  };

  const handleDeleteSegment = async (segment: AdminHomeSegment) => {
    if (!segment.id) {
      return;
    }
    const confirmationMessage = segment.isDefault
      ? 'This will remove saved overrides and fall back to the default configuration. Continue?'
      : 'Delete this custom segment?';
    if (!confirm(confirmationMessage)) {
      return;
    }
    setSegmentSubmitting(true);
    setSegmentsError(null);
    try {
      const response = await fetch(`/api/admin/home-segments/${segment.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to delete segment');
      }
      await loadSegments();
      if (formState.id === segment.id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setSegmentsError(error instanceof Error ? error.message : 'Failed to delete segment');
    } finally {
      setSegmentSubmitting(false);
    }
  };

  const handleStatsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatsSaving(true);
    setStatsError(null);
    setStatsMessage(null);
    const parsed = Number(statsInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setStatsError('Multiplier must be a positive number.');
      setStatsSaving(false);
      return;
    }
    const multiplier = clampMultiplier(parsed);

    try {
      const response = await fetch('/api/admin/home-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to update stats multiplier');
      }
      setStatsMultiplier(multiplier);
      setStatsInput(String(multiplier));
      setStatsMessage('Multiplier updated successfully.');
    } catch (error) {
      console.error(error);
      setStatsError(error instanceof Error ? error.message : 'Failed to update stats multiplier');
    } finally {
      setStatsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground dark:text-white">Home stats multiplier</h2>
            <p className="mt-1 text-sm text-slate-300">
              Control the inflation counter shown on the public home page stats tiles.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadStatsMultiplier}
            disabled={statsLoading || statsSaving}
          >
            Refresh
          </Button>
        </div>

        <form onSubmit={handleStatsSubmit} className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="home-stats-multiplier">
              Multiplier
            </label>
            <Input
              id="home-stats-multiplier"
              type="number"
              min={1}
              max={10}
              step={0.1}
              value={statsInput}
              onChange={(event) => setStatsInput(event.target.value)}
              disabled={statsLoading || statsSaving}
              className="bg-slate-900/70 text-slate-100"
            />
            <p className="text-xs text-slate-400">
              Applied across students, organizations, verified schools, and opportunities counters.
            </p>
          </div>
          <Button type="submit" disabled={statsLoading || statsSaving}>
            {statsSaving ? 'Saving...' : 'Save multiplier'}
          </Button>
        </form>
        {statsError && (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {statsError}
          </p>
        )}
        {statsMessage && (
          <p className="mt-2 text-sm text-emerald-300" role="status">
            {statsMessage}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              {isEditingSegment ? 'Edit home segment' : 'Create custom segment'}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Permanent segments (Featured, Trending, Scholarships) are always available. Use this form to customise
              them or add additional sections.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateCustomSegment}
            disabled={segmentSubmitting}
          >
            New custom segment
          </Button>
        </div>

        <form onSubmit={handleSegmentSubmit} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="segment-key">
              Segment key *
            </label>
            <Input
              id="segment-key"
              value={formState.segmentKey}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, segmentKey: event.target.value }))
              }
              placeholder="featured"
              disabled={segmentSubmitting || formState.isDefault}
              required
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="segment-title">
              Title *
            </label>
            <Input
              id="segment-title"
              value={formState.title}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Featured Opportunities"
              required
              disabled={segmentSubmitting}
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="segment-subtitle">
              Subtitle
            </label>
            <Textarea
              id="segment-subtitle"
              value={formState.subtitle}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, subtitle: event.target.value }))
              }
              placeholder="Curated picks from leading organizations"
              disabled={segmentSubmitting}
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="segment-limit">
              Card limit
            </label>
            <Input
              id="segment-limit"
              type="number"
              min={1}
              max={50}
              value={formState.limit}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, limit: event.target.value }))
              }
              disabled={segmentSubmitting}
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="segment-order">
              Display order
            </label>
            <Input
              id="segment-order"
              type="number"
              value={formState.order}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, order: event.target.value }))
              }
              disabled={segmentSubmitting}
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="segment-highlight"
              checked={formState.highlight}
              onCheckedChange={(checked) =>
                setFormState((prev) => ({ ...prev, highlight: checked }))
              }
              disabled={segmentSubmitting}
            />
            <label htmlFor="segment-highlight" className="text-sm text-slate-300">
              Highlight segment on home page
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="segment-visible"
              checked={formState.isVisible}
              onCheckedChange={(checked) =>
                setFormState((prev) => ({ ...prev, isVisible: checked }))
              }
              disabled={segmentSubmitting}
            />
            <label htmlFor="segment-visible" className="text-sm text-slate-300">
              Visible on home page
            </label>
          </div>
          <div className="flex items-center gap-3 lg:col-span-2">
            <Button type="submit" disabled={segmentSubmitting}>
              {segmentSubmitting ? 'Saving...' : formState.persisted ? 'Update segment' : 'Save segment'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              disabled={segmentSubmitting}
            >
              Reset form
            </Button>
            {formState.isDefault && (
              <Badge variant="outline" className="border-orange-500/40 bg-orange-500/10 text-orange-200">
                Permanent segment
              </Badge>
            )}
          </div>
          {segmentsError && (
            <p className="lg:col-span-2 text-sm text-red-400" role="alert">
              {segmentsError}
            </p>
          )}
        </form>
      </section>

      <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground dark:text-white">Existing segments</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSegments}
            disabled={segmentsLoading}
          >
            Refresh
          </Button>
        </div>
        <p className="mt-1 text-sm text-slate-300">
          {segmentsLoading
            ? 'Loading segments...'
            : hasSegments
            ? `Showing ${segments.length} segment${segments.length === 1 ? '' : 's'}.`
            : 'No saved segments yet. Defaults will be shown automatically.'}
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-border/60 dark:border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/80 dark:bg-white/5 hover:bg-card/80 dark:bg-white/5">
                <TableHead>Title</TableHead>
                <TableHead>Segment Key</TableHead>
                <TableHead className="text-center">Limit</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!segmentsLoading && sortedSegments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-300 py-6">
                    Permanent segments will appear once saved. Use the form above to create or customise entries.
                  </TableCell>
                </TableRow>
              )}
              {sortedSegments.map((segment) => (
                <TableRow key={`${segment.segmentKey}-${segment.id ?? 'default'}`} className="hover:bg-card/80 dark:bg-white/5">
                  <TableCell className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground dark:text-white">{segment.title}</span>
                      {segment.isDefault && (
                        <Badge variant="outline" className="border-orange-500/40 bg-orange-500/10 text-orange-200">
                          Default
                        </Badge>
                      )}
                      {!segment.persisted && (
                        <Badge variant="outline" className="border-slate-500/40 bg-slate-500/10 text-slate-200">
                          Using fallback
                        </Badge>
                      )}
                    </div>
                    {segment.subtitle && (
                      <p className="text-xs text-slate-400">{segment.subtitle}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-200">{segment.segmentKey}</TableCell>
                  <TableCell className="text-center text-slate-200">{segment.limit}</TableCell>
                  <TableCell className="text-center text-slate-200">{segment.order}</TableCell>
                  <TableCell className="space-y-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={
                          segment.isVisible
                            ? 'border-green-500/40 bg-green-500/10 text-green-200'
                            : 'border-red-500/40 bg-red-500/10 text-red-200'
                        }
                      >
                        {segment.isVisible ? 'Visible' : 'Hidden'}
                      </Badge>
                      {segment.highlight && (
                        <Badge variant="outline" className="border-purple-500/40 bg-purple-500/10 text-purple-200">
                          Highlighted
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSegment(segment)}
                      disabled={segmentSubmitting}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSegment(segment)}
                      disabled={segmentSubmitting || !segment.persisted}
                      className={
                        segment.isDefault
                          ? 'border-orange-500/30 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20'
                          : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      }
                    >
                      {segment.isDefault ? 'Reset' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}



