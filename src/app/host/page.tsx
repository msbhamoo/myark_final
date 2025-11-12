'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function HostOpportunityPage() {
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
    return categories.find((item) => item.id === formState.categoryId)?.name;
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
          segments: parseSegments(formState.segments),
          categoryId: formState.categoryId || undefined,
          categoryName,
          applicationUrl: formState.applicationUrl,
          fee: formState.fee,
          state: INDIAN_STATES_SET.has(formState.state) ? formState.state : '',
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-foreground dark:text-white">
        <p className="text-white/70">Loading your account…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-foreground dark:text-white">
        <h1 className="text-3xl font-semibold">Host an opportunity on MyArk</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground dark:text-white/70">
          Sign in or create an organization account to submit new opportunities for review. Once
          approved by our admin team, your program will appear on the public portal.
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-foreground dark:text-white">
        <h1 className="text-3xl font-semibold">Organization account required</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground dark:text-white/70">
          Hosting opportunities is currently limited to organization accounts. Switch to an
          organization profile or contact support for assistance.
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
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-foreground dark:text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-4">
          <p className="inline-flex rounded-full border border-border/60 dark:border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground dark:text-white/70">
            Host Opportunity
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground dark:text-white md:text-5xl">
            Submit a new opportunity for review
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground dark:text-white/70">
            Share program details so the MyArk admin team can review and publish your opportunity.
            Required fields are marked below.
          </p>
        </header>

        <form
          className="space-y-8 rounded-3xl border border-border/60 dark:border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/30 backdrop-blur"
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
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="summary">Short summary</Label>
              <Input
                id="summary"
                value={formState.summary}
                onChange={handleChange('summary')}
                placeholder="In one sentence, describe the opportunity."
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
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
                className="min-h-[180px] bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
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
                className="min-h-[140px] bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
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
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
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
                <SelectTrigger className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-foreground dark:text-white">
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={formState.state}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, state: value }))}
              >
                <SelectTrigger className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-slate-900 text-foreground dark:text-white">
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
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                type="date"
                value={formState.endDate}
                onChange={handleChange('endDate')}
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="segments">Tags / Segments</Label>
              <Input
                id="segments"
                value={formState.segments}
                onChange={handleChange('segments')}
                placeholder="e.g. STEM, scholarship, leadership"
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
              <p className="text-xs text-muted-foreground dark:text-white/50">Separate with commas.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formState.categoryId}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-slate-900 text-foreground dark:text-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name ?? category.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationUrl">Application link</Label>
              <Input
                id="applicationUrl"
                type="url"
                value={formState.applicationUrl}
                onChange={handleChange('applicationUrl')}
                placeholder="https://"
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Fee</Label>
              <Input
                id="fee"
                value={formState.fee}
                onChange={handleChange('fee')}
                placeholder="e.g. 100"
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={formState.currency}
                readOnly
                aria-readonly="true"
                className="bg-card/70 dark:bg-white/10 text-muted-foreground dark:text-white/70"
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
                className="min-h-[120px] bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="registrationProcess">Registration process (one per line)</Label>
              <Textarea
                id="registrationProcess"
                value={formState.registrationProcess}
                onChange={handleChange('registrationProcess')}
                placeholder="Outline important steps."
                className="min-h-[120px] bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
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
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact phone</Label>
              <Input
                id="contactPhone"
                value={formState.contactPhone}
                onChange={handleChange('contactPhone')}
                placeholder="+1 555 123 4567"
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
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
                className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
              />
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-200">
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
    </div>
  );
}




