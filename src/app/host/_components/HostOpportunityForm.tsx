'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { INDIAN_STATES, INDIAN_STATES_SET } from '@/constants/india';

type Category = {
  id: string;
  name?: string;
};

type FormState = {
  title: string;
  summary: string;
  description: string;
  eligibility: string;
  benefits: string;
  registrationProcess: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  mode: 'online' | 'offline' | 'hybrid';
  registrationMode: 'external' | 'internal';
  segments: string;
  categoryId: string;
  applicationUrl: string;
  fee: string;
  state: string;
  currency: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
};

const defaultState: FormState = {
  title: '',
  summary: '',
  description: '',
  eligibility: '',
  benefits: '',
  registrationProcess: '',
  registrationDeadline: '',
  startDate: '',
  endDate: '',
  mode: 'online',
  registrationMode: 'external',
  segments: '',
  categoryId: '',
  applicationUrl: '',
  fee: '',
  state: '',
  currency: 'INR',
  contactEmail: '',
  contactPhone: '',
  contactWebsite: '',
};

const parseList = (value: string): string[] =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const parseSegments = (value: string): string[] =>
  value
    .split(/[,|\n]/g)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

const formatDate = (value: string): string => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString();
};

const fieldClassName =
  'bg-white/95 text-slate-900 placeholder:text-slate-400 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-white/50';

export default function HostOpportunityForm() {
  const { user, loading, getIdToken } = useAuth();
  const [formState, setFormState] = useState<FormState>({ ...defaultState });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const redirectAccountType = params.get('accountType');
    if (redirectAccountType === 'organization' && user?.accountType === 'organization') {
      // Already an organization, no additional handling required.
    }
  }, [params, user]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/opportunity-categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = (await response.json()) as { categories?: Category[] };
        setCategories(data.categories ?? []);
      } catch (fetchError) {
        console.error('Failed to load categories', fetchError);
      }
    };

    loadCategories();
  }, []);

  const categoryName = useMemo(() => {
    if (!formState.categoryId) return undefined;
    return categories.find((item: Category) => item.id === formState.categoryId)?.name;
  }, [categories, formState.categoryId]);

  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      router.push('/login?redirect=/host&accountType=organization');
      return;
    }

    if (user.accountType !== 'organization') {
      setError('Only organization accounts can submit new opportunities.');
      return;
    }

    if (formState.registrationMode === 'external' && !formState.applicationUrl.trim()) {
      setError('Application link is required when using the external registration flow.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      const response = await fetch('/api/opportunities/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formState.title,
          summary: formState.summary,
          description: formState.description,
          eligibility: parseList(formState.eligibility),
          benefits: parseList(formState.benefits),
          registrationProcess: parseList(formState.registrationProcess),
          registrationDeadline: formatDate(formState.registrationDeadline),
          startDate: formatDate(formState.startDate),
          endDate: formatDate(formState.endDate),
          mode: formState.mode,
          registrationMode: formState.registrationMode,
          segments: parseSegments(formState.segments),
          categoryId: formState.categoryId || undefined,
          categoryName,
          applicationUrl:
            formState.registrationMode === 'external' ? formState.applicationUrl : '',
          fee: formState.fee,
          state: INDIAN_STATES_SET.has(formState.state as typeof INDIAN_STATES[number]) ? formState.state : '',
          currency: 'INR',
          contactEmail: formState.contactEmail,
          contactPhone: formState.contactPhone,
          contactWebsite: formState.contactWebsite,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Submission failed');
      }

      setSuccess('Opportunity submitted successfully. Our admin team will review it shortly.');
      setFormState({ ...defaultState });
    } catch (submitError) {
      console.error('Failed to submit opportunity', submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to submit opportunity. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-slate-200 bg-white/90 p-12 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
        Loading your account…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/95 px-8 py-12 text-center shadow-lg shadow-orange-100/40 dark:border-slate-700 dark:bg-slate-800/50">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Host an opportunity on MyArk</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-100">
          Sign in or create an organization account to submit new opportunities for review. Once approved by our admin team, your program will appear on the public portal.
        </p>
        <Button
          className="mt-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          onClick={() => router.push('/login?redirect=/host&accountType=organization')}
        >
          Continue to login
        </Button>
      </div>
    );
  }

  if (user.accountType !== 'organization') {
    return (
      <div className="rounded-3xl border border-amber-200 bg-white/95 px-8 py-12 text-center shadow-lg shadow-orange-100/40 dark:border-amber-600/40 dark:bg-slate-800/50">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Organization account required</h1>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-100">
          Hosting opportunities is limited to organization accounts. Switch to the organizer profile linked to your email or reach out to support for help.
        </p>
        <Button
          className="mt-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          onClick={() => router.push('/login?redirect=/host&accountType=organization')}
        >
          Switch to organization account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-lg shadow-orange-100/30 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="inline-flex rounded-full border border-orange-200 px-3 py-1 text-xs uppercase tracking-wide text-orange-500 dark:border-orange-400/40 dark:text-orange-200">
          Host Opportunity
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl dark:text-white">
          Submit a new opportunity for review
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600 dark:text-slate-100">
          Share program details so the MyArk team can review and publish your opportunity. Required fields are marked below.
        </p>
      </header>

      <form
        className="space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-xl shadow-orange-100/30 dark:border-slate-700 dark:bg-slate-800/50"
        onSubmit={handleSubmit}
      >
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Opportunity title *</Label>
            <Input
              id="title"
              required
              value={formState.title}
              onChange={handleChange('title')}
              placeholder="e.g. National Innovation Challenge 2025"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Short summary</Label>
            <Input
              id="summary"
              value={formState.summary}
              onChange={handleChange('summary')}
              placeholder="In one sentence, describe the opportunity."
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Detailed description *</Label>
            <Textarea
              id="description"
              required
              value={formState.description}
              onChange={handleChange('description')}
              placeholder="Include objectives, structure, and important information."
              className={`min-h-[180px] ${fieldClassName}`}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="eligibility">Eligibility (one per line) *</Label>
            <Textarea
              id="eligibility"
              required
              value={formState.eligibility}
              onChange={handleChange('eligibility')}
              placeholder="List eligibility criteria, one per line."
              className={`min-h-[140px] ${fieldClassName}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationDeadline">Application deadline *</Label>
            <Input
              id="registrationDeadline"
              type="date"
              required
              value={formState.registrationDeadline}
              onChange={handleChange('registrationDeadline')}
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Mode</Label>
            <Select
              value={formState.mode}
              onValueChange={(value: FormState['mode']) =>
                setFormState((prev) => ({ ...prev, mode: value }))
              }
            >
              <SelectTrigger className={fieldClassName}>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label>How should students register?</Label>
            <RadioGroup
              value={formState.registrationMode}
              onValueChange={(value) =>
                setFormState((prev) => ({
                  ...prev,
                  registrationMode: (value as FormState['registrationMode']) ?? 'external',
                }))
              }
              className="grid gap-3 md:grid-cols-2"
            >
              <label
                htmlFor="registration-mode-external"
                className="flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-left text-sm text-slate-600 shadow-sm transition hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
              >
                <RadioGroupItem id="registration-mode-external" value="external" className="mt-1" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Use an external application link</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/60">
                    Redirect students to your own form or website. Provide the link below.
                  </p>
                </div>
              </label>
              <label
                htmlFor="registration-mode-internal"
                className="flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-left text-sm text-slate-600 shadow-sm transition hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
              >
                <RadioGroupItem id="registration-mode-internal" value="internal" className="mt-1" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Collect registrations on Myark</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/60">
                    Students register with their Myark profile. Their details and counts appear in your dashboard.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formState.state}
              onValueChange={(value) => setFormState((prev) => ({ ...prev, state: value }))}
            >
              <SelectTrigger className={fieldClassName}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input
              id="startDate"
              type="date"
              value={formState.startDate}
              onChange={handleChange('startDate')}
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End date</Label>
            <Input
              id="endDate"
              type="date"
              value={formState.endDate}
              onChange={handleChange('endDate')}
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="segments">Tags / Segments</Label>
            <Input
              id="segments"
              value={formState.segments}
              onChange={handleChange('segments')}
              placeholder="e.g. STEM, scholarship, leadership"
              className={fieldClassName}
            />
            <p className="text-xs text-muted-foreground dark:text-white/50">Separate with commas.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formState.categoryId}
              onValueChange={(value) => setFormState((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger className={fieldClassName}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name ?? category.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formState.registrationMode === 'external' ? (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="applicationUrl">Application link *</Label>
              <Input
                id="applicationUrl"
                type="url"
                value={formState.applicationUrl}
                onChange={handleChange('applicationUrl')}
                placeholder="https://"
                required
                className={fieldClassName}
              />
              <p className="text-xs text-muted-foreground dark:text-white/50">
                Students will be redirected to this link to complete their application.
              </p>
            </div>
          ) : (
            <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
              Registrations will be handled on Myark. We automatically capture student names, contact details,
              grade, and school information from their profiles. You can review every registrant from your organizer dashboard.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="fee">Fee</Label>
            <Input
              id="fee"
              value={formState.fee}
              onChange={handleChange('fee')}
              placeholder="e.g. 100"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={formState.currency}
              readOnly
              aria-readonly="true"
              className={`${fieldClassName} text-muted-foreground dark:text-slate-100`}
            />
            <p className="text-xs text-muted-foreground dark:text-white/50">All submissions are listed in Indian Rupees (INR).</p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="benefits">Benefits (one per line)</Label>
            <Textarea
              id="benefits"
              value={formState.benefits}
              onChange={handleChange('benefits')}
              placeholder="Describe key benefits or rewards."
              className={`min-h-[120px] ${fieldClassName}`}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="registrationProcess">Registration process (one per line)</Label>
            <Textarea
              id="registrationProcess"
              value={formState.registrationProcess}
              onChange={handleChange('registrationProcess')}
              placeholder="Outline important steps."
              className={`min-h-[120px] ${fieldClassName}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formState.contactEmail}
              onChange={handleChange('contactEmail')}
              placeholder="info@organization.org"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact phone</Label>
            <Input
              id="contactPhone"
              value={formState.contactPhone}
              onChange={handleChange('contactPhone')}
              placeholder="+1 555 123 4567"
              className={fieldClassName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactWebsite">Website</Label>
            <Input
              id="contactWebsite"
              type="url"
              value={formState.contactWebsite}
              onChange={handleChange('contactWebsite')}
              placeholder="https://organization.org"
              className={fieldClassName}
            />
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground dark:text-white/50">
            Submissions are reviewed within 48 hours. You will receive an email notification once
            approved or if additional information is required.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            {isSubmitting ? 'Submitting…' : 'Submit for review'}
          </Button>
        </div>
      </form>
    </div>
  );
}
