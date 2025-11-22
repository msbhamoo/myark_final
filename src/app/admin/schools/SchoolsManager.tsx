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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Country, State, City } from '@/types/masters';


interface School {
  id: string;
  name: string;
  address: string;
  cityId: string;
  stateId: string;
  countryId: string;
  pincode: string;
  website: string;
  email: string;
  phone: string;
  foundationYear: number | null;
  isVerified: boolean;
  city?: City;
  state?: State;
  country?: Country;
  schoolLogoUrl?: string;
}

const defaultForm = {
  name: '',
  address: '',
  cityId: '',
  stateId: '',
  countryId: '',
  pincode: '',
  website: '',
  email: '',
  phone: '',
  foundationYear: '',
  isVerified: false,
  schoolLogoUrl: '',
};

export function SchoolsManager() {
  const [items, setItems] = useState<School[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [formState, setFormState] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/schools');
      if (!response.ok) {
        throw new Error('Failed to load schools');
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

  const loadLocations = async () => {
    try {
      const [countriesRes, statesRes, citiesRes] = await Promise.all([
        fetch('/api/admin/countries'),
        fetch('/api/admin/states'),
        fetch('/api/admin/cities'),
      ]);
      if (countriesRes.ok) {
        const payload = await countriesRes.json();
        setCountries(payload.items ?? []);
      }
      if (statesRes.ok) {
        const payload = await statesRes.json();
        setStates(payload.items ?? []);
      }
      if (citiesRes.ok) {
        const payload = await citiesRes.json();
        setCities(payload.items ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems();
    loadLocations();
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
      const payload = {
        ...formState,
        foundationYear: formState.foundationYear ? Number(formState.foundationYear) : null,
      };
      const response = await fetch(editingId ? `/api/admin/schools/${editingId}` : '/api/admin/schools', {
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

  const handleEdit = (item: School) => {
    setEditingId(item.id);
    setFormState({
      name: item.name,
      address: item.address,
      cityId: item.cityId,
      stateId: item.stateId,
      countryId: item.countryId,
      pincode: item.pincode,
      website: item.website,
      email: item.email,
      phone: item.phone,
      foundationYear: item.foundationYear?.toString() ?? '',
      isVerified: item.isVerified,
      schoolLogoUrl: item.schoolLogoUrl ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this school?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/schools/${id}`, { method: 'DELETE' });
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

  const filteredStates = states.filter(s => s.countryId === formState.countryId);
  const filteredCities = cities.filter(c => c.stateId === formState.stateId);

  return (
    <div className='space-y-8'>
      <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
        <h2 className='text-lg font-semibold text-foreground dark:text-white'>{editingId ? 'Edit school' : 'Create school'}</h2>
        <form onSubmit={handleSubmit} className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='md:col-span-2 space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-name'>
              Name *
            </label>
            <Input
              id='school-name'
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              required
              placeholder='Example School'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='md:col-span-2 space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-logo'>
              School Logo URL
            </label>
            <div className="flex flex-col gap-2">
              <Input
                id='school-logo'
                value={formState.schoolLogoUrl}
                onChange={(event) => setFormState((prev) => ({ ...prev, schoolLogoUrl: event.target.value }))}
                placeholder='https://example.com/logo.png'
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
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
                    setFormState(prev => ({ ...prev, schoolLogoUrl: data.url }));
                  } catch (err) {
                    console.error(err);
                    setError('Failed to upload image');
                  }
                }}
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
              />
            </div>
          </div>
          <div className='md:col-span-2 space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-address'>
              Address
            </label>
            <Textarea
              id='school-address'
              value={formState.address}
              onChange={(event) => setFormState((prev) => ({ ...prev, address: event.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-country'>
              Country
            </label>
            <select
              id='school-country'
              value={formState.countryId}
              onChange={(e) => setFormState(prev => ({ ...prev, countryId: e.target.value, stateId: '', cityId: '' }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
            >
              <option value=''>Select Country</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-state'>
              State
            </label>
            <select
              id='school-state'
              value={formState.stateId}
              onChange={(e) => setFormState(prev => ({ ...prev, stateId: e.target.value, cityId: '' }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
              disabled={!formState.countryId}
            >
              <option value=''>Select State</option>
              {filteredStates.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-city'>
              City
            </label>
            <select
              id='school-city'
              value={formState.cityId}
              onChange={(e) => setFormState(prev => ({ ...prev, cityId: e.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
              disabled={!formState.stateId}
            >
              <option value=''>Select City</option>
              {filteredCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-pincode'>
              Pincode
            </label>
            <Input
              id='school-pincode'
              value={formState.pincode}
              onChange={(event) => setFormState((prev) => ({ ...prev, pincode: event.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-website'>
              Website
            </label>
            <Input
              id='school-website'
              value={formState.website}
              onChange={(event) => setFormState((prev) => ({ ...prev, website: event.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-email'>
              Email
            </label>
            <Input
              id='school-email'
              type='email'
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-phone'>
              Phone
            </label>
            <Input
              id='school-phone'
              value={formState.phone}
              onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-foundation-year'>
              Foundation Year
            </label>
            <Input
              id='school-foundation-year'
              type='number'
              value={formState.foundationYear}
              onChange={(event) => setFormState((prev) => ({ ...prev, foundationYear: event.target.value }))}
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-verified'>
              Verification
            </label>
            <div className='flex items-center gap-2 text-sm text-foreground dark:text-white'>
              <input
                id='school-verified'
                type='checkbox'
                checked={formState.isVerified}
                onChange={(event) => setFormState((prev) => ({ ...prev, isVerified: event.target.checked }))}
                className='h-4 w-4 rounded border border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5'
              />
              <span>Verified</span>
            </div>
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

      <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-foreground dark:text-white'>Schools</h2>
          <Button variant='outline' size='sm' onClick={loadItems} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <p className='mt-1 text-sm text-muted-foreground'>
          {isLoading ? 'Loading schools...' : `Showing ${items.length} record(s).`}
        </p>
        <div className='mt-4 overflow-hidden rounded-xl border border-border/60 dark:border-white/10'>
          <Table>
            <TableHeader>
              <TableRow className='bg-card/80 dark:bg-white/5 hover:bg-card/80 dark:bg-white/5'>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center text-muted-foreground'>
                    No schools found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className='hover:bg-card/80 dark:bg-white/5'>
                  <TableCell className='font-medium text-foreground dark:text-white'>{item.name}</TableCell>
                  <TableCell className='text-muted-foreground'>{cities.find(c => c.id === item.cityId)?.name || 'â€”'}</TableCell>
                  <TableCell className='text-muted-foreground'>{states.find(s => s.id === item.stateId)?.name || 'â€”'}</TableCell>
                  <TableCell className='text-muted-foreground'>{countries.find(c => c.id === item.countryId)?.name || 'â€”'}</TableCell>
                  <TableCell>
                    {item.isVerified ? (
                      <Badge variant='outline' className='border-[#58CC02]/40 text-primary'>
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant='outline' className='border-white/20 text-foreground dark:text-white'>
                        Pending
                      </Badge>
                    )}
                  </TableCell>
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




