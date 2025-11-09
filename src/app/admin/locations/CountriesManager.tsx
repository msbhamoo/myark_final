'use client';

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
import { Country } from '@/types/masters';

const defaultForm = {
  name: '',
};

export function CountriesManager() {
  const [items, setItems] = useState<Country[]>([]);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/countries');
      if (!response.ok) {
        throw new Error('Failed to load countries');
      }
      const payload = await response.json();
      setItems(payload.items ?? []);
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
      const response = await fetch(editingId ? `/api/admin/countries/${editingId}` : '/api/admin/countries', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
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

  const handleEdit = (item: Country) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this country?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/countries/${id}`, { method: 'DELETE' });
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
    <div className='space-y-8'>
      <section className='rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur'>
        <h2 className='text-lg font-semibold text-white'>{editingId ? 'Edit country' : 'Create country'}</h2>
        <form onSubmit={handleSubmit} className='mt-6 grid grid-cols-1 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-200' htmlFor='country-name'>
              Name *
            </label>
            <Input
              id='country-name'
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              required
              placeholder='e.g., India'
              className='bg-slate-900/70 text-slate-100'
            />
          </div>
          <div className='flex items-center gap-3'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </Button>
            {editingId && (
              <Button type='button' variant='ghost' onClick={handleReset} disabled={isSubmitting}>
                Cancel edit
              </Button>
            )}
          </div>
          {error && (
            <p className='text-sm text-red-400' role='alert'>
              {error}
            </p>
          )}
        </form>
      </section>

      <section className='rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>Existing Countries</h2>
          <Button variant='outline' size='sm' onClick={loadItems} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <p className='mt-1 text-sm text-slate-300'>
          {isLoading ? 'Loading countries...' : `Showing ${items.length} record(s).`}
        </p>
        <div className='mt-4 overflow-hidden rounded-xl border border-white/10'>
          <Table>
            <TableHeader>
              <TableRow className='bg-white/5 hover:bg-white/5'>
                <TableHead>Name</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={2} className='text-center text-slate-400'>
                    No countries found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className='hover:bg-white/5'>
                  <TableCell className='font-medium text-slate-100'>{item.name}</TableCell>
                  <TableCell className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(item)}
                      disabled={isSubmitting && editingId === item.id}
                    >
                      Edit
                    </Button>
                    <Button variant='destructive' size='sm' onClick={() => handleDelete(item.id)} disabled={isSubmitting}>
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
