
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
import { Organizer, OpportunityCategory } from '@/types/masters';

const defaultForm = {
  name: '',
  shortName: '',
  address: '',
  website: '',
  foundationYear: '',
  type: 'other' as 'government' | 'private' | 'ngo' | 'international' | 'other',
  visibility: 'public' as 'public' | 'private',
  isVerified: true,
  logoUrl: '',
  contactUrl: '',
  contactEmail: '',
  contactPhone: '',
  contactWebsite: '',
  description: '',
  opportunityTypeIds: [] as string[],
};

export function OrganizersManager() {
  const [items, setItems] = useState<Organizer[]>([]);
  const [categories, setCategories] = useState<OpportunityCategory[]>([]);
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
            shortName: typeof item.shortName === 'string' ? item.shortName : '',
            address: typeof item.address === 'string' ? item.address : '',
            website: typeof item.website === 'string' ? item.website : '',
            foundationYear,
            type: (typeof item.type === 'string' ? item.type : 'other') as Organizer['type'],
            visibility: (item.visibility === 'private' ? 'private' : 'public') as 'public' | 'private',
            isVerified: Boolean(item.isVerified),
            logoUrl: typeof item.logoUrl === 'string' ? item.logoUrl : '',
            contactUrl: typeof item.contactUrl === 'string' ? item.contactUrl : '',
            contactEmail: typeof item.contactEmail === 'string' ? item.contactEmail : '',
            contactPhone: typeof item.contactPhone === 'string' ? item.contactPhone : '',
            contactWebsite: typeof item.contactWebsite === 'string' ? item.contactWebsite : '',
            description: typeof item.description === 'string' ? item.description : '',
            opportunityTypeIds: Array.isArray(item.opportunityTypeIds) ? item.opportunityTypeIds : [],
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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/opportunity-categories');
      if (response.ok) {
        const payload = await response.json();
        setCategories(payload.items ?? []);
      }
    } catch (err) {
      console.error('Failed to load opportunity categories:', err);
    }
  };

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
      shortName: item.shortName ?? '',
      address: item.address,
      website: item.website,
      foundationYear: item.foundationYear?.toString() ?? '',
      type: item.type,
      visibility: item.visibility ?? 'public',
      isVerified: item.isVerified ?? false,
      logoUrl: item.logoUrl ?? '',
      contactUrl: item.contactUrl ?? '',
      contactEmail: item.contactEmail ?? '',
      contactPhone: item.contactPhone ?? '',
      contactWebsite: item.contactWebsite ?? '',
      description: item.description ?? '',
      opportunityTypeIds: item.opportunityTypeIds ?? [],
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
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-name">
              Name *
            </label>
            <Input
              id="org-name"
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              required
              placeholder="e.g., Science Foundation"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-website">
              Website
            </label>
            <Input
              id="org-website"
              value={formState.website}
              onChange={(event) => setFormState((prev) => ({ ...prev, website: event.target.value }))}
              placeholder="https://example.com"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-address">
              Address
            </label>
            <Textarea
              id="org-address"
              value={formState.address}
              onChange={(event) => setFormState((prev) => ({ ...prev, address: event.target.value }))}
              placeholder="123 Main St, Anytown, USA"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-foundation-year">
              Foundation Year
            </label>
            <Input
              id="org-foundation-year"
              type="number"
              value={formState.foundationYear}
              onChange={(event) => setFormState((prev) => ({ ...prev, foundationYear: event.target.value }))}
              placeholder="e.g., 1990"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-type">
              Type
            </label>
            <select
              id="org-type"
              value={formState.type}
              onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value as any }))}
              className="h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
            >
              <option value="other">Other</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="ngo">NGO</option>
              <option value="international">International</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-shortname">
              Short Name / Abbreviation
            </label>
            <Input
              id="org-shortname"
              value={formState.shortName}
              onChange={(event) => setFormState((prev) => ({ ...prev, shortName: event.target.value }))}
              placeholder="e.g., SF"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-logo">
              Logo URL
            </label>
            <div className="flex flex-col gap-2">
              <Input
                id="org-logo"
                value={formState.logoUrl}
                onChange={(event) => setFormState((prev) => ({ ...prev, logoUrl: event.target.value }))}
                placeholder="https://example.com/logo.png"
                className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
              />
              <Input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    const res = await fetch('/api/admin/upload', {
                      method: 'POST',
                      body: formData,
                    });
                    if (!res.ok) throw new Error('Upload failed');
                    const data = await res.json();
                    setFormState(prev => ({ ...prev, logoUrl: data.url }));
                  } catch (err) {
                    console.error(err);
                    setError('Failed to upload image');
                  }
                }}
                className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-contact">
              Contact / Support URL
            </label>
            <Input
              id="org-contact"
              value={formState.contactUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, contactUrl: event.target.value }))}
              placeholder="https://example.com/contact"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-description">
              Description
            </label>
            <Textarea
              id="org-description"
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Detailed description of the organization..."
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-contact-email">
              Contact Email
            </label>
            <Input
              id="org-contact-email"
              type="email"
              value={formState.contactEmail}
              onChange={(event) => setFormState((prev) => ({ ...prev, contactEmail: event.target.value }))}
              placeholder="info@example.com"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-contact-phone">
              Contact Phone
            </label>
            <Input
              id="org-contact-phone"
              value={formState.contactPhone}
              onChange={(event) => setFormState((prev) => ({ ...prev, contactPhone: event.target.value }))}
              placeholder="+91-XXXXXXXXXX"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-contact-website">
              Contact Website
            </label>
            <Input
              id="org-contact-website"
              value={formState.contactWebsite}
              onChange={(event) => setFormState((prev) => ({ ...prev, contactWebsite: event.target.value }))}
              placeholder="https://example.com/support"
              className="bg-card/80 dark:bg-white/5 text-foreground dark:text-white"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white">
              Opportunity Types They Conduct (Multi-select)
            </label>
            <div className="rounded-lg border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-3 space-y-2 max-h-48 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories available</p>
              ) : (
                categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={formState.opportunityTypeIds.includes(category.id)}
                      onChange={(event) => {
                        setFormState((prev) => {
                          const ids = new Set(prev.opportunityTypeIds);
                          if (event.target.checked) {
                            ids.add(category.id);
                          } else {
                            ids.delete(category.id);
                          }
                          return { ...prev, opportunityTypeIds: Array.from(ids) };
                        });
                      }}
                      className="h-4 w-4 rounded border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5 text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
                    />
                    <span className="text-sm text-foreground dark:text-white">{category.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-visibility">
              Visibility
            </label>
            <select
              id="org-visibility"
              value={formState.visibility}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, visibility: event.target.value as 'public' | 'private' }))
              }
              className="h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="org-verified"
              type="checkbox"
              className="h-4 w-4 rounded border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5 text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60"
              checked={formState.isVerified}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, isVerified: event.target.checked }))
              }
            />
            <label className="text-sm font-medium text-foreground dark:text-white" htmlFor="org-verified">
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
        <p className="mt-1 text-sm text-muted-foreground">
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
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No organizers found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className="hover:bg-card/80 dark:bg-white/5">
                  <TableCell className="font-medium text-foreground dark:text-white">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.website || 'â€”'}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{item.type}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {item.visibility ?? 'public'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.isVerified ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {[item.city, item.state, item.country].filter(Boolean).join(', ') || 'â€”'}
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




