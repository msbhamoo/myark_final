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
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { Upload, Key, X, Plus } from 'lucide-react';

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
  // New fields
  numberOfStudents?: number | null;
  facilities?: string[];
  type?: string;
  principalName?: string;
  principalContact?: string;
  affiliationNumber?: string;
  loginEnabled?: boolean;
  linkedUserId?: string | null;
}

const SCHOOL_TYPES = [
  { value: '', label: 'Select Type' },
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private' },
  { value: 'aided', label: 'Aided' },
  { value: 'central', label: 'Central (KV/NV)' },
  { value: 'international', label: 'International' },
  { value: 'other', label: 'Other' },
];

const FACILITY_OPTIONS = [
  'Library',
  'Computer Lab',
  'Science Lab',
  'Sports Ground',
  'Auditorium',
  'Cafeteria',
  'Swimming Pool',
  'Transportation',
  'Hostel',
  'Smart Classrooms',
  'Music Room',
  'Art Room',
];

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
  numberOfStudents: '',
  facilities: [] as string[],
  type: '',
  principalName: '',
  principalContact: '',
  affiliationNumber: '',
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'bulk'>('form');
  const [creatingLogin, setCreatingLogin] = useState<string | null>(null);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.admin.schools);
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
        fetch(API_ENDPOINTS.admin.countries),
        fetch(API_ENDPOINTS.admin.states),
        fetch(API_ENDPOINTS.admin.cities),
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
        numberOfStudents: formState.numberOfStudents ? Number(formState.numberOfStudents) : null,
      };
      const endpoint = editingId
        ? API_ENDPOINTS.admin.schoolById(editingId)
        : API_ENDPOINTS.admin.schools;

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
      handleReset();
      setSuccessMessage(editingId ? 'School updated successfully' : 'School created successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
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
      numberOfStudents: item.numberOfStudents?.toString() ?? '',
      facilities: item.facilities ?? [],
      type: item.type ?? '',
      principalName: item.principalName ?? '',
      principalContact: item.principalContact ?? '',
      affiliationNumber: item.affiliationNumber ?? '',
    });
    setActiveTab('form');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this school?')) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.admin.schoolById(id), { method: 'DELETE' });
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

  const handleCreateLogin = async (school: School) => {
    if (!school.email) {
      setError('School must have an email to create login');
      return;
    }
    if (!confirm(`Create login credentials for ${school.name}? An email will be sent to ${school.email}`)) return;

    setCreatingLogin(school.id);
    setError(null);
    try {
      const response = await fetch('/api/admin/schools/create-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: school.id }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to create login');
      }
      const data = await response.json();
      await loadItems();

      // Show credentials in alert so admin can copy them
      if (data.credentials) {
        alert(`Login created successfully!\n\nEmail: ${data.credentials.email}\nTemporary Password: ${data.credentials.tempPassword}\n\nPlease save these credentials and share with the school.`);
      }

      setSuccessMessage(`Login created for ${school.name}. Email: ${school.email}`);
      setTimeout(() => setSuccessMessage(null), 10000);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setCreatingLogin(null);
    }
  };

  const handleResetPassword = async (school: School) => {
    const customPassword = prompt(`Reset password for ${school.name}\n\nLeave empty to auto-generate, or enter custom password:`);

    // User cancelled
    if (customPassword === null) return;

    setCreatingLogin(school.id);
    setError(null);
    try {
      const response = await fetch('/api/admin/schools/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: school.id,
          newPassword: customPassword || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to reset password');
      }

      // Show new credentials
      if (data.credentials) {
        alert(`Password reset successfully!\n\nEmail: ${data.credentials.email}\nNew Password: ${data.credentials.password}\n\nPlease share these credentials with the school.`);
      }

      setSuccessMessage(`Password reset for ${school.name}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setCreatingLogin(null);
    }
  };

  const toggleFacility = (facility: string) => {
    setFormState(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const filteredStates = states.filter(s => s.countryId === formState.countryId);
  const filteredCities = cities.filter(c => c.stateId === formState.stateId);

  return (
    <div className='space-y-8'>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60 dark:border-white/10">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'form'
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
          onClick={() => setActiveTab('form')}
        >
          {editingId ? 'Edit School' : 'Add School'}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'bulk'
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
          onClick={() => setActiveTab('bulk')}
        >
          <Upload className="h-4 w-4" />
          Bulk Import
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4 text-green-600 dark:text-green-400">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Form Tab */}
      {activeTab === 'form' && (
        <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
          <h2 className='text-lg font-semibold text-foreground dark:text-white'>{editingId ? 'Edit school' : 'Create school'}</h2>
          <form onSubmit={handleSubmit} className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Basic Info */}
            <div className='md:col-span-2 lg:col-span-3 space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-name'>
                School Name *
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

            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-type'>
                School Type
              </label>
              <select
                id='school-type'
                value={formState.type}
                onChange={(e) => setFormState(prev => ({ ...prev, type: e.target.value }))}
                className='w-full bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
              >
                {SCHOOL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-affiliation'>
                Affiliation Number
              </label>
              <Input
                id='school-affiliation'
                value={formState.affiliationNumber}
                onChange={(event) => setFormState((prev) => ({ ...prev, affiliationNumber: event.target.value }))}
                placeholder='e.g., CBSE 1234567'
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-students'>
                Number of Students
              </label>
              <Input
                id='school-students'
                type='number'
                value={formState.numberOfStudents}
                onChange={(event) => setFormState((prev) => ({ ...prev, numberOfStudents: event.target.value }))}
                placeholder='e.g., 1500'
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>

            {/* Principal Info */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-principal'>
                Principal Name
              </label>
              <Input
                id='school-principal'
                value={formState.principalName}
                onChange={(event) => setFormState((prev) => ({ ...prev, principalName: event.target.value }))}
                placeholder='Dr. John Doe'
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-principal-contact'>
                Principal Contact
              </label>
              <Input
                id='school-principal-contact'
                value={formState.principalContact}
                onChange={(event) => setFormState((prev) => ({ ...prev, principalContact: event.target.value }))}
                placeholder='+91 98765 43210'
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>

            {/* Logo */}
            <div className='md:col-span-2 lg:col-span-3 space-y-2'>
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
                      const res = await fetch(API_ENDPOINTS.admin.upload, {
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

            {/* Address */}
            <div className='md:col-span-2 lg:col-span-3 space-y-2'>
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

            {/* Location */}
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='school-country'>
                Country
              </label>
              <select
                id='school-country'
                value={formState.countryId}
                onChange={(e) => setFormState(prev => ({ ...prev, countryId: e.target.value, stateId: '', cityId: '' }))}
                className='w-full bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
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
                className='w-full bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
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
                className='w-full bg-card/80 dark:bg-white/5 text-foreground dark:text-white h-10 rounded-md border border-border/60 dark:border-white/10 px-3 text-sm'
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

            {/* Contact */}
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

            {/* Facilities */}
            <div className='md:col-span-2 lg:col-span-3 space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white'>
                Facilities
              </label>
              <div className='flex flex-wrap gap-2'>
                {FACILITY_OPTIONS.map(facility => (
                  <button
                    key={facility}
                    type='button'
                    onClick={() => toggleFacility(facility)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${formState.facilities.includes(facility)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card/80 dark:bg-white/10 text-foreground dark:text-white border border-border/60 dark:border-white/20 hover:bg-primary/10'
                      }`}
                  >
                    {formState.facilities.includes(facility) && <span className="mr-1">✓</span>}
                    {facility}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification */}
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

            {/* Actions */}
            <div className='md:col-span-2 lg:col-span-3 flex items-center gap-3 pt-4 border-t border-border/60 dark:border-white/10'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update School' : 'Create School'}
              </Button>
              {editingId && (
                <Button type='button' variant='ghost' onClick={handleReset} disabled={isSubmitting}>
                  Cancel edit
                </Button>
              )}
            </div>
          </form>
        </section>
      )}

      {/* Bulk Import Tab */}
      {activeTab === 'bulk' && (
        <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
          <h2 className='text-lg font-semibold text-foreground dark:text-white'>Bulk Import Schools</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Upload a CSV file to import multiple schools at once.
          </p>

          <div className='mt-6 space-y-4'>
            <div className='flex gap-4'>
              <a
                href='/api/admin/schools/template'
                className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium'
              >
                <Upload className='h-4 w-4' />
                Download CSV Template
              </a>
            </div>

            <div className='border-2 border-dashed border-border/60 dark:border-white/20 rounded-xl p-8 text-center'>
              <Upload className='h-12 w-12 mx-auto text-muted-foreground' />
              <p className='mt-4 text-sm text-muted-foreground'>
                Drag and drop your CSV file here, or click to browse
              </p>
              <input
                type='file'
                accept='.csv'
                className='mt-4 w-full max-w-xs mx-auto'
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    setIsSubmitting(true);
                    const res = await fetch('/api/admin/schools/bulk-import', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error ?? 'Import failed');

                    setSuccessMessage(`Successfully imported ${data.imported} schools. ${data.errors?.length || 0} errors.`);
                    loadItems();
                  } catch (err) {
                    console.error(err);
                    setError((err as Error).message);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Schools Table */}
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
                <TableHead>Type</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className='text-center text-muted-foreground'>
                    No schools found.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id} className='hover:bg-card/80 dark:hover:bg-white/5'>
                  <TableCell className='font-medium text-foreground dark:text-white'>
                    <div className='flex items-center gap-3'>
                      {item.schoolLogoUrl && (
                        <img
                          src={item.schoolLogoUrl}
                          alt={item.name}
                          className='h-8 w-8 rounded-lg object-cover'
                        />
                      )}
                      <div>
                        <p>{item.name}</p>
                        {item.affiliationNumber && (
                          <p className='text-xs text-muted-foreground'>{item.affiliationNumber}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground capitalize'>{item.type || '—'}</TableCell>
                  <TableCell className='text-muted-foreground'>{item.numberOfStudents ?? '—'}</TableCell>
                  <TableCell className='text-muted-foreground'>{cities.find(c => c.id === item.cityId)?.name || '—'}</TableCell>
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
                  <TableCell>
                    {item.loginEnabled ? (
                      <div className="flex items-center gap-2">
                        <Badge variant='outline' className='border-blue-500/40 text-blue-500'>
                          Active
                        </Badge>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleResetPassword(item)}
                          disabled={creatingLogin === item.id}
                          className='text-xs'
                          title='Reset password for this school'
                        >
                          <Key className='h-3 w-3 mr-1' />
                          {creatingLogin === item.id ? 'Resetting...' : 'Reset'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleCreateLogin(item)}
                        disabled={creatingLogin === item.id || !item.email || !item.isVerified}
                        className='text-xs'
                        title={!item.email ? 'Add email first' : !item.isVerified ? 'Verify school first' : 'Create login'}
                      >
                        <Key className='h-3 w-3 mr-1' />
                        {creatingLogin === item.id ? 'Creating...' : 'Create'}
                      </Button>
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
