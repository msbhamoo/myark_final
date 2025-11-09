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
import { City, State } from '@/types/masters';

const defaultForm = {
  name: '',
  stateId: '',
};

export function CitiesManager() {
  const [items, setItems] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/cities');
      if (!response.ok) {
        throw new Error('Failed to load cities');
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

  const loadStates = async () => {
    try {
      const response = await fetch('/api/admin/states');
      if (!response.ok) {
        throw new Error('Failed to load states');
      }
      const payload = await response.json();
      setStates(payload.items ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems();
    loadStates();
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
      const response = await fetch(editingId ? `/api/admin/cities/${editingId}` : '/api/admin/cities', {
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

  const handleEdit = (item: City) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      stateId: item.stateId,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this city?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
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
        <h2 className='text-lg font-semibold text-white'>{editingId ? 'Edit city' : 'Create city'}</h2>
        <form onSubmit={handleSubmit} className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-200' htmlFor='city-name'>
              Name *
            </label>
            <Input
              id='city-name'
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              required
              placeholder='e.g., San Francisco'
              className='bg-slate-900/70 text-slate-100'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-slate-200' htmlFor='city-state'>
              State *
            </label>
            <select
              id='city-state'
              value={formState.stateId}
              onChange={(event) => setFormState((prev) => ({ ...prev, stateId: event.target.value }))}
              required
              className='h-10 rounded-md border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100'
            >
              <option value=''>Select a state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className='md:col-span-2 flex items-center gap-3'>
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
            <p className='md:col-span-2 text-sm text-red-400' role='alert'>
              {error}
            </p>
          )}
        </form>
      </section>

      <section className='rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>Existing Cities</h2>
          <Button variant='outline' size='sm' onClick={loadItems} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <p className='mt-1 text-sm text-slate-300'>
          {isLoading ? 'Loading cities...' : `Showing ${items.length} record(s).`}
        </p>
        <div className='mt-4 overflow-hidden rounded-xl border border-white/10'>
          <Table>
            <TableHeader>
              <TableRow className='bg-white/5 hover:bg-white/5'>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={3} className='text-center text-slate-400'>
                    No cities found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className='hover:bg-white/5'>
                  <TableCell className='font-medium text-slate-100'>{item.name}</TableCell>
                  <TableCell className='text-slate-300'>{states.find(s => s.id === item.stateId)?.name || 'N/A'}</TableCell>
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
