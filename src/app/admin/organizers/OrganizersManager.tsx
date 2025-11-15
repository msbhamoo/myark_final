
"use client";

import { useEffect, useState } from 'react';
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
import { Organizer } from '@/types/masters';

const defaultForm = {
  name: '',
  address: '',
  website: '',
  foundationYear: '',
  type: 'other' as 'government' | 'private' | 'other',
  visibility: 'public' as 'public' | 'private',
  isVerified: true,
};

export function OrganizersManager() {
  const [items, setItems] = useState<Organizer[]>([]);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/organizers');
      if (!response.ok) {
        throw new Error('Failed to load organizers');
      }
      const payload = await response.json();
      const records = (payload.items ?? [])
        .map((item: Record<string, unknown>) => {
          const rawYear =
            typeof item.foundationYear === 'number'
              ? item.foundationYear
              : typeof item.foundationYear === 'string'
                ? Number(item.foundationYear)
                : null;
          const foundationYear =
            typeof rawYear === 'number' && Number.isFinite(rawYear) ? rawYear : null;
          const idCandidate =
            item.id === undefined || item.id === null ? '' : String(item.id).trim();
          const id =
            idCandidate && idCandidate !== 'undefined' && idCandidate !== 'null' ? idCandidate : '';
        const name = typeof item.name === 'string' ? item.name.trim() : '';
        const normalizedName = name || 'Unnamed organizer';

        if (!id) {
          return null;
        }

        return {
          id,
          name: normalizedName,
            address: typeof item.address === 'string' ? item.address : '',
            website: typeof item.website === 'string' ? item.website : '',
            foundationYear,
            type: (typeof item.type === 'string' ? item.type : 'other') as Organizer['type'],
            visibility: (item.visibility === 'private' ? 'private' : 'public') as 'public' | 'private',
            isVerified: Boolean(item.isVerified),
          } satisfies Organizer;
        })
        .filter((entry: Organizer | undefined): entry is Organizer => Boolean(entry));
      setItems(records);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleReset = () => {
    setEditingId(null);
    setFormState(defaultForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const numericYear = formState.foundationYear
        ? Number(formState.foundationYear)
        : null;
      const payload = {
        ...formState,
        foundationYear:
          typeof numericYear === 'number' && Number.isFinite(numericYear) ? numericYear : null,
        isVerified: Boolean(formState.isVerified),
        visibility: formState.visibility,
      };
      const response = await fetch(editingId ? `/api/admin/organizers/${editingId}` : '/api/admin/organizers', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Request failed');
      }
      await loadItems();
      handleReset();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Organizer) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      address: item.address,
      website: item.website,
      foundationYear: item.foundationYear?.toString() ?? '',
      type: item.type,
      visibility: item.visibility ?? 'public',
      isVerified: item.isVerified ?? false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this organizer?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/organizers/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to delete');
      }
      await loadItems();
      if (editingId === id) {
        handleReset();
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
        <h2 className="text-lg font-semibold text-foreground dark:text-white">{editingId ? 'Edit organizer' : 'Create organizer'}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="org-name">
              Name *
            </label>
            <Input
              id="org-name"
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              required
              placeholder="e.g., Science Foundation"
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="org-website">
              Website
            </label>
            <Input
              id="org-website"
              value={formState.website}
              onChange={(event) => setFormState((prev) => ({ ...prev, website: event.target.value }))}
              placeholder="https://example.com"
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="org-address">
              Address
            </label>
            <Textarea
              id="org-address"
              value={formState.address}
              onChange={(event) => setFormState((prev) => ({ ...prev, address: event.target.value }))}
              placeholder="123 Main St, Anytown, USA"
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="org-foundation-year">
              Foundation Year
            </label>
            <Input
              id="org-foundation-year"
              type="number"
              value={formState.foundationYear}
              onChange={(event) => setFormState((prev) => ({ ...prev, foundationYear: event.target.value }))}
              placeholder="e.g., 1990"
              className="bg-slate-900/70 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="org-type">
              Type
            </label>
            <select
              id="org-type"
              value={formState.type}
              onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value as any }))}
              className="h-10 rounded-md border border-border/60 dark:border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100"
            >
              <option value="other">Other</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="org-visibility">
              Visibility
            </label>
            <select
              id="org-visibility"
              value={formState.visibility}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, visibility: event.target.value as 'public' | 'private' }))
              }
              className="h-10 rounded-md border border-border/60 dark:border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="org-verified"
              type="checkbox"
              className="h-4 w-4 rounded border-border/50 dark:border-white/20 bg-slate-900/70 text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              checked={formState.isVerified}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, isVerified: event.target.checked }))
              }
            />
            <label className="text-sm font-medium text-slate-200" htmlFor="org-verified">
              Verified organizer
            </label>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={handleReset} disabled={isSubmitting}>
                Cancel edit
              </Button>
            )}
          </div>
          {error && (
            <p className="md:col-span-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>

      <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground dark:text-white">Existing Organizers</h2>
          <Button variant="outline" size="sm" onClick={loadItems} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <p className="mt-1 text-sm text-slate-300">
          {isLoading ? 'Loading organizers...' : `Showing ${items.length} record(s).`}
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border/60 dark:border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-card/80 dark:bg-white/5 hover:bg-card/80 dark:bg-white/5">
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-400">
                    No organizers found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-card/80 dark:bg-white/5">
                  <TableCell className="font-medium text-slate-100">{item.name}</TableCell>
                  <TableCell className="text-slate-300">{item.website || '—'}</TableCell>
                  <TableCell className="text-slate-300 capitalize">{item.type}</TableCell>
                  <TableCell className="text-slate-300 capitalize">
                    {item.visibility ?? 'public'}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {item.isVerified ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      disabled={isSubmitting && editingId === item.id}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={isSubmitting}>
                      Delete
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



