'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { OpportunityCategory, Organizer } from '@/types/masters';
import type { OpportunityResource } from '@/types/opportunity';
import { X } from 'lucide-react';
import { INDIAN_STATES, INDIAN_STATES_SET } from '@/constants/india';

type TimelineItem = {
  date: string | null;
  event: string;
  status: string;
};

type ExamSection = {
  name: string;
  questions: number | null;
  marks: number | null;
};

type ExamPattern = {
  totalQuestions: number | null;
  durationMinutes: number | null;
  negativeMarking: boolean;
  negativeMarksPerQuestion: number | null;
  sections: ExamSection[];
};

type HomeSegmentOption = {
  id: string | null;
  segmentKey: string;
  title: string;
  isVisible: boolean;
  order: number;
};

type OpportunityItem = {
  id: string;
  title: string;
  categoryId: string;
  categoryName?: string;
  organizerId: string;
  organizerName?: string;
  category?: {
    id: string;
    name: string;
  };
  organizer?: {
    id: string;
    name: string;
  };
  organizerLogo: string;
  gradeEligibility: string;
  mode: string;
  state?: string;
  status: string;
  fee: string;
  currency: string;
  registrationDeadline: string | null;
  startDate: string | null;
  endDate: string | null;
  segments: string[];
  image: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  registrationProcess: string[];
  timeline: TimelineItem[];
  examPattern: ExamPattern;
  contactInfo: {
    email: string;
    phone: string;
    website: string;
  };
  resources: OpportunityResource[];
  source?: string;
  submittedBy?: string | null;
  approval?: {
    status?: string;
    reviewedAt?: string | null;
    reviewedBy?: string | null;
  } | null;
  registrationMode?: 'internal' | 'external';
  applicationUrl?: string;
  registrationCount?: number;
  externalRegistrationClickCount?: number;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

type OpportunityFormState = {
  title: string;
  categoryId: string;
  organizerId: string;
  organizerLogo: string;
  gradeEligibility: string;
  mode: string;
  state: '' | 'Andhra Pradesh' | 'Arunachal Pradesh' | 'Assam' | 'Bihar' | 'Chhattisgarh' | 'Goa' | 'Gujarat' | 'Haryana' | 'Himachal Pradesh' | 'Jharkhand' | 'Karnataka' | 'Kerala' | 'Madhya Pradesh' | 'Maharashtra' | 'Manipur' | 'Meghalaya' | 'Mizoram' | 'Nagaland' | 'Odisha' | 'Punjab' | 'Rajasthan' | 'Sikkim' | 'Tamil Nadu' | 'Telangana' | 'Tripura' | 'Uttar Pradesh' | 'Uttarakhand' | 'West Bengal' | 'Andaman and Nicobar Islands' | 'Chandigarh' | 'Dadra and Nagar Haveli and Daman and Diu' | 'Lakshadweep' | 'Delhi' | 'Puducherry';
  status: string;
  fee: string;
  currency: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  selectedSegments: string[];
  image: string;
  description: string;
  eligibilityText: string;
  benefitsText: string;
  registrationProcessText: string;
  timelineText: string;
  examTotalQuestions: string;
  examDurationMinutes: string;
  examNegativeMarking: boolean;
  examNegativeMarksPerQuestion: string;
  examSectionsText: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
  registrationMode: 'internal' | 'external';
  applicationUrl: string;
};

type ResourceDraft = {
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'link';
  description: string;
};

const defaultForm: OpportunityFormState = {
  title: '',
  categoryId: '',
  organizerId: '',
  organizerLogo: '',
  gradeEligibility: '',
  mode: 'online',
  state: '',
  status: 'draft',
  fee: '',
  currency: 'INR',
  registrationDeadline: '',
  startDate: '',
  endDate: '',
  selectedSegments: [],
  image: '',
  description: '',
  eligibilityText: '',
  benefitsText: '',
  registrationProcessText: '',
  timelineText: '',
  examTotalQuestions: '',
  examDurationMinutes: '',
  examNegativeMarking: false,
  examNegativeMarksPerQuestion: '',
  examSectionsText: '',
  contactEmail: '',
  contactPhone: '',
  contactWebsite: '',
  registrationMode: 'internal',
  applicationUrl: '',
};

const modeOptions = ['online', 'offline', 'hybrid'];
const statusOptions = ['pending', 'draft', 'approved', 'published', 'archived', 'rejected'];

const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const joinLines = (values: string[]) => values.join('\n');

const timelineToText = (timeline: TimelineItem[]) =>
  timeline
    .map((item) => `${item.date ?? ''}|${item.event}|${item.status}`)
    .join('\n');

const textToTimeline = (text: string): TimelineItem[] =>
  splitLines(text).map((line) => {
    const [date = '', event = '', status = 'upcoming'] = line.split('|').map((token) => token.trim());
    return {
      date: date || null,
      event,
      status: status || 'upcoming',
    };
  });

const sectionsToText = (sections: ExamSection[]) =>
  sections
    .map((section) => `${section.name}|${section.questions ?? ''}|${section.marks ?? ''}`)
    .join('\n');

const textToSections = (text: string): ExamSection[] =>
  splitLines(text).map((line) => {
    const [name = '', questions = '', marks = ''] = line.split('|').map((token) => token.trim());
    const parsedQuestions = Number.parseInt(questions, 10);
    const parsedMarks = Number.parseInt(marks, 10);
    return {
      name,
      questions: Number.isFinite(parsedQuestions) ? parsedQuestions : null,
      marks: Number.isFinite(parsedMarks) ? parsedMarks : null,
    };
  });

const toNumberOrNull = (value: string) => {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const isValidState = (value: string): value is OpportunityFormState['state'] => {
  return INDIAN_STATES_SET.has(value as any) || value === '';
};

  export function OpportunitiesManager() {
    const router = useRouter();
    const [items, setItems] = useState<OpportunityItem[]>([]);
    const [categories, setCategories] = useState<OpportunityCategory[]>([]);
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [availableSegments, setAvailableSegments] = useState<HomeSegmentOption[]>([]);
    const [segmentsLoading, setSegmentsLoading] = useState(false);
    const [formState, setFormState] = useState<OpportunityFormState>(defaultForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actioningId, setActioningId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const segmentOptionLookup = useMemo(
      () => new Map(availableSegments.map((option) => [option.segmentKey, option])),
      [availableSegments],
    );

    const selectedSegmentOptions = useMemo(
      () =>
        formState.selectedSegments.map((segmentKey) => {
          const option = segmentOptionLookup.get(segmentKey);
          if (option) {
            return option;
          }
          return {
            id: null,
            segmentKey,
            title: segmentKey,
            isVisible: true,
            order: 0,
          } satisfies HomeSegmentOption;
        }),
      [formState.selectedSegments, segmentOptionLookup],
    );
  const [activeTab, setActiveTab] = useState<'opportunities' | 'resources'>('opportunities');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('');
  const [resourceDraft, setResourceDraft] = useState<ResourceDraft>({
    title: '',
    url: '',
    type: 'link',
    description: '',
  });
  const [isResourceSubmitting, setIsResourceSubmitting] = useState(false);

  const normalizeOrganizer = (entry: Record<string, unknown>): Organizer => {
    const rawYear =
      typeof entry.foundationYear === 'number'
        ? entry.foundationYear
        : typeof entry.foundationYear === 'string'
          ? Number(entry.foundationYear)
          : null;
    const foundationYear =
      typeof rawYear === 'number' && Number.isFinite(rawYear) ? rawYear : null;
    const allowedTypes: Organizer['type'][] = ['government', 'private', 'ngo', 'international', 'other'];
    const rawType = typeof entry.type === 'string' ? entry.type : 'other';
    const type = (allowedTypes.includes(rawType as Organizer['type']) ? rawType : 'other') as Organizer['type'];

    const idCandidate =
      entry.id === undefined || entry.id === null ? '' : String(entry.id).trim();
    const id =
      idCandidate && idCandidate !== 'undefined' && idCandidate !== 'null' ? idCandidate : '';
    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    const normalizedName = name || 'Unnamed organizer';

    return {
      id,
      name: normalizedName,
      shortName: typeof entry.shortName === 'string' ? entry.shortName.trim() : '',
      address: typeof entry.address === 'string' ? entry.address : '',
      website: typeof entry.website === 'string' ? entry.website : '',
      foundationYear,
      type,
      visibility: entry.visibility === 'private' ? 'private' : 'public',
      isVerified: Boolean(entry.isVerified),
      logoUrl: typeof entry.logoUrl === 'string' ? entry.logoUrl : '',
      contactUrl: typeof entry.contactUrl === 'string' ? entry.contactUrl : '',
      contactEmail: typeof entry.contactEmail === 'string' ? entry.contactEmail : '',
      contactPhone: typeof entry.contactPhone === 'string' ? entry.contactPhone : '',
      contactWebsite: typeof entry.contactWebsite === 'string' ? entry.contactWebsite : '',
      description: typeof entry.description === 'string' ? entry.description : '',
      opportunityTypeIds: Array.isArray(entry.opportunityTypeIds) ? entry.opportunityTypeIds : [],
    };
  };

  const handleQuickApprove = async (item: OpportunityItem, publish = false) => {
    if (item.status === (publish ? 'published' : 'approved')) {
      return;
    }
    setActioningId(item.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/opportunities/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: publish ? 'published' : 'approved',
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to update status');
      }
      await loadItems();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setActioningId(null);
    }
  };

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/opportunities');
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load opportunities');
      }
      const payload = await response.json();
      const incoming = Array.isArray(payload.items) ? payload.items : [];
      const normalized = incoming.map((item: any) => ({
        ...item,
        state: (() => {
          const rawState = typeof item.state === 'string' ? item.state.trim() : '';
          return INDIAN_STATES_SET.has(rawState) ? rawState : '';
        })(),
        currency: 'INR',
        segments: Array.isArray(item.segments)
          ? item.segments
              .map((segment: any) => (typeof segment === 'string' ? segment.trim() : ''))
              .filter((segment: any): segment is string => segment.length > 0)
          : [],
        resources: Array.isArray(item.resources) ? item.resources : [],
      }));
      setItems(normalized);
      setOrganizers((previous) => {
        const byId = new Map(previous.map((org) => [org.id, org]));
        const additions: Organizer[] = [];
        normalized.forEach((item: any) => {
          if (!item.organizerId) {
            return;
          }
          if (byId.has(item.organizerId)) {
            return;
          }
          const normalized = normalizeOrganizer({
            id: item.organizerId,
            name: item.organizerName ?? item.organizer?.name ?? 'Private organizer',
            visibility: 'private',
            isVerified: false,
          });
          if (normalized.id) {
            additions.push(normalized);
            byId.set(normalized.id, normalized);
          }
        });
        if (additions.length === 0) {
          return previous;
        }
        return [...previous, ...additions];
      });
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [catRes, orgRes] = await Promise.all([
          fetch('/api/admin/opportunity-categories'),
          fetch('/api/admin/organizers'),
        ]);
        if (catRes.ok) {
          const catPayload = await catRes.json();
          setCategories(catPayload.items ?? []);
        }
        if (orgRes.ok) {
          const orgPayload = await orgRes.json();
          const records: Organizer[] = (orgPayload.items ?? []).map((item: Record<string, unknown>) => normalizeOrganizer(item));
          setOrganizers((prev) => {
            const merged = new Map(prev.map((entry) => [entry.id, entry]));
            records.forEach((record) => {
              if (!record.id) {
                return;
              }
              const existing = merged.get(record.id);
              merged.set(record.id, existing ? { ...existing, ...record } : record);
            });
            return Array.from(merged.values());
          });
        }
      } catch (err) {
        console.error('Failed to load master data', err);
      }
    };
    const loadHomeSegments = async () => {
      setSegmentsLoading(true);
      try {
        const response = await fetch('/api/admin/home-segments');
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? 'Failed to load home segments');
        }
        const payload = await response.json();
        const options: HomeSegmentOption[] = Array.isArray(payload.items)
          ? payload.items
              .map((item: Record<string, unknown>) => {
                const segmentKey =
                  typeof item.segmentKey === 'string' ? item.segmentKey.trim() : '';
                if (!segmentKey) {
                  return null;
                }
                const title =
                  typeof item.title === 'string' && item.title.trim()
                    ? item.title.trim()
                    : segmentKey;
                const isVisible = item.isVisible !== false;
                const order =
                  typeof item.order === 'number' && Number.isFinite(item.order)
                    ? item.order
                    : 0;
                return {
                  id: typeof item.id === 'string' ? item.id : null,
                  segmentKey,
                  title,
                  isVisible,
                  order,
                };
              })
              .filter((option: HomeSegmentOption | null): option is HomeSegmentOption => Boolean(option))
          : [];
        options.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
        setAvailableSegments(options);
      } catch (err) {
        console.error('Failed to load home segments', err);
      } finally {
        setSegmentsLoading(false);
      }
    };
    loadItems();
    loadMasters();
    loadHomeSegments();
  }, []);

  useEffect(() => {
    if (activeTab === 'resources' && !selectedOpportunityId && items.length > 0) {
      setSelectedOpportunityId(items[0].id);
    }
  }, [activeTab, items, selectedOpportunityId]);

  const selectedOpportunity = useMemo(
    () => items.find((item) => item.id === selectedOpportunityId) ?? null,
    [items, selectedOpportunityId],
  );

  const handleReset = () => {
    setEditingId(null);
    setFormState(defaultForm);
  };

  const handleOrganizerChange = async (organizerId: string) => {
    setFormState((prev) => ({ ...prev, organizerId }));
    
    if (!organizerId) {
      // Clear organizer-related fields
      setFormState((prev) => ({
        ...prev,
        organizerLogo: '',
        contactEmail: '',
        contactPhone: '',
        contactWebsite: '',
      }));
      return;
    }

    // Fetch organizer details and populate fields
    try {
      const response = await fetch(`/api/admin/organizers/${organizerId}`);
      if (response.ok) {
        const organizer = await response.json();
        setFormState((prev) => ({
          ...prev,
          organizerLogo: organizer.logoUrl || prev.organizerLogo || '',
          contactEmail: organizer.contactEmail || prev.contactEmail || '',
          contactPhone: organizer.contactPhone || prev.contactPhone || '',
          contactWebsite: organizer.contactWebsite || prev.contactWebsite || '',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch organizer details:', err);
    }
  };

  const handleEdit = (item: OpportunityItem) => {
    setEditingId(item.id);
    const validatedState: OpportunityFormState['state'] = isValidState(item.state ?? '') ? (item.state as OpportunityFormState['state']) : '';
    setFormState({
      title: item.title,
      categoryId: item.categoryId,
      organizerId: item.organizerId,
      organizerLogo: item.organizerLogo ?? '',
      gradeEligibility: item.gradeEligibility,
      mode: item.mode,
      state: validatedState,
      status: item.status,
      fee: item.fee ?? '',
      currency: 'INR',
      registrationDeadline: item.registrationDeadline ?? '',
      startDate: item.startDate ?? '',
      endDate: item.endDate ?? '',
      selectedSegments: item.segments,
      image: item.image ?? '',
      description: item.description ?? '',
      eligibilityText: joinLines(item.eligibility ?? []),
      benefitsText: joinLines(item.benefits ?? []),
      registrationProcessText: joinLines(item.registrationProcess ?? []),
      timelineText: timelineToText(item.timeline ?? []),
      examTotalQuestions: item.examPattern?.totalQuestions?.toString() ?? '',
      examDurationMinutes: item.examPattern?.durationMinutes?.toString() ?? '',
      examNegativeMarking: Boolean(item.examPattern?.negativeMarking),
      examNegativeMarksPerQuestion: item.examPattern?.negativeMarksPerQuestion?.toString() ?? '',
      examSectionsText: sectionsToText(item.examPattern?.sections ?? []),
      contactEmail: item.contactInfo?.email ?? '',
      contactPhone: item.contactInfo?.phone ?? '',
      contactWebsite: item.contactInfo?.website ?? '',
      registrationMode: item.registrationMode ?? 'internal',
      applicationUrl: item.applicationUrl ?? '',
    });
  };

  const toggleSegmentSelection = (segmentKey: string) => {
    setFormState((prev) => {
      const exists = prev.selectedSegments.includes(segmentKey);
      const nextSegments = exists
        ? prev.selectedSegments.filter((key) => key !== segmentKey)
        : [...prev.selectedSegments, segmentKey];
      return { ...prev, selectedSegments: nextSegments };
    });
  };

  const removeSegmentSelection = (segmentKey: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedSegments: prev.selectedSegments.filter((key) => key !== segmentKey),
    }));
  };

  const buildPayload = () => {
      const selectedOrganizer = organizers.find((entry) => entry.id === formState.organizerId);
      const selectedCategory = categories.find((entry) => entry.id === formState.categoryId);
    const fallbackOrganizerName =
      selectedOrganizer?.name?.trim() ||
      items.find((item) => item.organizerId === formState.organizerId)?.organizerName ||
      items.find((item) => item.organizerId === formState.organizerId)?.organizer?.name ||
      '';
    const fallbackCategoryName =
      selectedCategory?.name?.trim() ||
      items.find((item) => item.categoryId === formState.categoryId)?.categoryName ||
      items.find((item) => item.categoryId === formState.categoryId)?.category?.name ||
      '';
    const segments = Array.from(
      new Set(formState.selectedSegments.map((segment) => segment.trim()).filter(Boolean)),
    );
    const eligibility = splitLines(formState.eligibilityText);
    const benefits = splitLines(formState.benefitsText);
    const registrationProcess = splitLines(formState.registrationProcessText);
    const timeline = textToTimeline(formState.timelineText);
    const examSections = textToSections(formState.examSectionsText);

    const normalizedState: OpportunityFormState['state'] = formState.state && INDIAN_STATES_SET.has(formState.state) ? (formState.state as OpportunityFormState['state']) : '';

    return {
      title: formState.title,
      categoryId: formState.categoryId || null,
      categoryName: fallbackCategoryName,
      category: fallbackCategoryName,
      organizerId: formState.organizerId || null,
      organizerName: fallbackOrganizerName,
      organizer: fallbackOrganizerName,
      organizerLogo: formState.organizerLogo,
      gradeEligibility: formState.gradeEligibility,
      mode: formState.mode,
      state: normalizedState,
      status: formState.status,
      fee: formState.fee,
      currency: 'INR',
      registrationDeadline: formState.registrationDeadline || null,
      startDate: formState.startDate || null,
      endDate: formState.endDate || null,
      segments,
      image: formState.image,
      description: formState.description,
      eligibility,
      benefits,
      registrationProcess,
      timeline,
      examPattern: {
        totalQuestions: toNumberOrNull(formState.examTotalQuestions),
        durationMinutes: toNumberOrNull(formState.examDurationMinutes),
        negativeMarking: formState.examNegativeMarking,
        negativeMarksPerQuestion: toNumberOrNull(formState.examNegativeMarksPerQuestion),
        sections: examSections,
      },
      contactInfo: {
        email: formState.contactEmail,
        phone: formState.contactPhone,
        website: formState.contactWebsite,
      },
      registrationMode: formState.registrationMode,
      applicationUrl: formState.registrationMode === 'external' ? formState.applicationUrl : '',
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    if (!formState.categoryId) {
      setError('Category is required');
      setIsSubmitting(false);
      return;
    }
    if (!formState.organizerId) {
      setError('Organizer is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = buildPayload();
      const response = await fetch(
        editingId ? `/api/admin/opportunities/${editingId}` : '/api/admin/opportunities',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this opportunity?')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/opportunities/${id}`, { method: 'DELETE' });
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

  const createResourceId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `res_${Math.random().toString(36).slice(2, 10)}`;
  };

  const normalizeResourceUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const handleResourceSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOpportunity) {
      setError('Select an opportunity to add a resource.');
      return;
    }

    const title = resourceDraft.title.trim();
    const url = normalizeResourceUrl(resourceDraft.url);
    const description = resourceDraft.description.trim();

    if (!title) {
      setError('Resource title is required.');
      return;
    }

    if (!url) {
      setError('Resource URL is required.');
      return;
    }

    setIsResourceSubmitting(true);
    setError(null);
    try {
      const newResource: OpportunityResource = {
        id: createResourceId(),
        title,
        url,
        type: resourceDraft.type,
        description: description || undefined,
      };
      const existingResources = selectedOpportunity.resources ?? [];
      const response = await fetch(`/api/admin/opportunities/${selectedOpportunity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resources: [...existingResources, newResource] }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to save resource');
      }
      await loadItems();
      setResourceDraft({
        title: '',
        url: '',
        type: 'link',
        description: '',
      });
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsResourceSubmitting(false);
    }
  };

  const handleResourceRemove = async (resourceId: string) => {
    if (!selectedOpportunity) {
      return;
    }
    if (!confirm('Remove this resource?')) {
      return;
    }
    setIsResourceSubmitting(true);
    setError(null);
    try {
      const filteredResources = (selectedOpportunity.resources ?? []).filter(
        (resource) => resource.id !== resourceId,
      );
      const response = await fetch(`/api/admin/opportunities/${selectedOpportunity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resources: filteredResources }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to remove resource');
      }
      await loadItems();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsResourceSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('opportunities');
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === 'opportunities'
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
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeTab === 'resources'
              ? 'bg-orange-500 text-foreground dark:text-white shadow-lg shadow-orange-500/30'
              : 'text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10'
          }`}
        >
          Resources
        </button>
      </div>

      {activeTab === 'opportunities' ? (
        <>
      <section className="rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur">
        <h2 className="text-lg font-semibold text-foreground dark:text-white">
          {editingId ? 'Edit opportunity' : 'Create opportunity'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide core details and supporting metadata. Arrays accept newline separated values.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className='md:col-span-2 space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-title'>
              Title *
            </label>
            <Input
              id='op-title'
              value={formState.title}
              onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
              required
              placeholder='National Science Olympiad'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-category'>
              Category *
            </label>
            <select
              id='op-category'
              value={formState.categoryId}
              onChange={(event) => setFormState((prev) => ({ ...prev, categoryId: event.target.value }))}
              required
              className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
            >
              <option value=''>Select a category</option>
              {formState.categoryId &&
                !categories.some((category) => category.id === formState.categoryId) && (
                  <option value={formState.categoryId}>
                    {items.find((item) => item.categoryId === formState.categoryId)?.categoryName ??
                      'Current category'}
                  </option>
                )}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-organizer'>
              Organizer *
            </label>
            <select
              id='op-organizer'
              value={formState.organizerId}
              onChange={(event) => handleOrganizerChange(event.target.value)}
              required
              className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
            >
              <option value=''>Select an organizer</option>
              {formState.organizerId &&
                !organizers.some((organizer) => organizer.id === formState.organizerId) && (
                  <option value={formState.organizerId}>
                    {items.find((item) => item.organizerId === formState.organizerId)?.organizerName ??
                      'Current organizer (private)'}
                  </option>
                )}
              {organizers.map((organizer) => (
                <option key={organizer.id} value={organizer.id}>
                  {organizer.name}
                  {organizer.visibility === 'private' ? ' (Private)' : ''}
                  {organizer.isVerified ? '' : ' (Unverified)'}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-organizer-logo'>
              Organizer logo URL
            </label>
            <Input
              id='op-organizer-logo'
              value={formState.organizerLogo}
              onChange={(event) => setFormState((prev) => ({ ...prev, organizerLogo: event.target.value }))}
              placeholder='https://...'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-grade'>
              Grade eligibility
            </label>
            <Input
              id='op-grade'
              value={formState.gradeEligibility}
              onChange={(event) => setFormState((prev) => ({ ...prev, gradeEligibility: event.target.value }))}
              placeholder='6-12'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-mode'>
              Mode
            </label>
            <select
              id='op-mode'
              value={formState.mode}
              onChange={(event) => setFormState((prev) => ({ ...prev, mode: event.target.value }))}
              className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
            >
              {modeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-state'>
              State
            </label>
            <select
              id='op-state'
              value={formState.state}
              onChange={(event) => {
                const value = event.target.value;
                if (isValidState(value)) {
                  setFormState((prev) => ({ ...prev, state: value }));
                }
              }}
              className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
            >
              <option value=''>Select state</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-status'>
              Status
            </label>
            <select
              id='op-status'
              value={formState.status}
              onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
              className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration-mode'>
              Registration Mode
            </label>
            <select
              id='op-registration-mode'
              value={formState.registrationMode}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  registrationMode: event.target.value as 'internal' | 'external',
                }))
              }
              className='h-10 rounded-md border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 text-sm text-foreground dark:text-white'
            >
              <option value='internal'>Internal</option>
              <option value='external'>External</option>
            </select>
          </div>

          {formState.registrationMode === 'external' && (
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-application-url'>
                Application URL
              </label>
              <Input
                id='op-application-url'
                value={formState.applicationUrl}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, applicationUrl: event.target.value }))
                }
                placeholder='https://example.com/apply'
                className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>
          )}

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-fee'>
              Fee
            </label>
            <Input
              id='op-fee'
              value={formState.fee}
              onChange={(event) => setFormState((prev) => ({ ...prev, fee: event.target.value }))}
              placeholder='50'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-currency'>
              Currency
            </label>
            <Input
              id='op-currency'
              value={formState.currency}
              readOnly
              aria-readonly='true'
              className='bg-card/60 dark:bg-white/5 text-muted-foreground'
            />
            <p className='text-xs text-muted-foreground'>All opportunities are shown in Indian Rupees (INR).</p>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration'>
              Registration deadline
            </label>
            <Input
              id='op-registration'
              value={formState.registrationDeadline}
              onChange={(event) => setFormState((prev) => ({ ...prev, registrationDeadline: event.target.value }))}
              placeholder='2024-02-28'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-start'>
              Start date
            </label>
            <Input
              id='op-start'
              value={formState.startDate}
              onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
              placeholder='2024-03-15'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-end'>
              End date
            </label>
            <Input
              id='op-end'
              value={formState.endDate}
              onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
              placeholder='2024-03-16'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-image'>
              Cover image URL
            </label>
            <Input
              id='op-image'
              value={formState.image}
              onChange={(event) => setFormState((prev) => ({ ...prev, image: event.target.value }))}
              placeholder='https://...'
              className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='md:col-span-2 space-y-3'>
            <div className='flex items-center justify-between gap-2'>
              <label className='text-sm font-medium text-foreground dark:text-white'>
                Segments
              </label>
              <a
                href='/admin/home'
                className='text-xs text-orange-300 hover:text-orange-200'
              >
                Manage segments
              </a>
            </div>
            <p className='text-xs text-muted-foreground'>
              Opportunities only appear on the home page sections you select below. Hidden segments from the home layout are shown with a warning.
            </p>

            <div className='min-h-[42px] rounded-lg border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-2'>
              {selectedSegmentOptions.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No segments selected yet.
                </p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {selectedSegmentOptions.map((segment) => (
                    <span
                      key={`selected-${segment.segmentKey}`}
                      className='inline-flex items-center gap-1 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-100'
                    >
                      <span className='flex items-center gap-1'>
                        {segment.title}
                        {!segment.isVisible && (
                          <span className='rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-[1px] text-[10px] font-semibold uppercase tracking-wide text-yellow-200'>
                            Hidden
                          </span>
                        )}
                      </span>
                      <button
                        type='button'
                        className='text-orange-200/80 hover:text-orange-100'
                        onClick={() => removeSegmentSelection(segment.segmentKey)}
                        aria-label={`Remove ${segment.title}`}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className='rounded-lg border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5'>
              <div className='flex items-center justify-between border-b border-border/60 dark:border-white/10 px-3 py-2'>
                <p className='text-xs font-medium text-foreground dark:text-white uppercase tracking-wide'>Available segments</p>
                {segmentsLoading && <span className='text-[11px] text-muted-foreground'>Loading...</span>}
              </div>
              <div className='max-h-64 overflow-y-auto px-3 py-2 space-y-2'>
                {segmentsLoading ? (
                  <p className='text-sm text-muted-foreground'>Fetching segments...</p>
                ) : availableSegments.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No segments configured yet. Use the Home Page Segments section to add some.
                  </p>
                ) : (
                  availableSegments.map((segment) => {
                    const checked = formState.selectedSegments.includes(segment.segmentKey);
                    return (
                      <label
                        key={segment.segmentKey}
                        className='flex items-start justify-between gap-3 rounded-md px-2 py-2 text-sm text-foreground dark:text-white hover:bg-card/80 dark:bg-white/5'
                      >
                        <div className='flex items-center gap-2'>
                          <input
                            type='checkbox'
                            checked={checked}
                            onChange={() => toggleSegmentSelection(segment.segmentKey)}
                            className='h-4 w-4 rounded border border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5 text-orange-500 focus:ring-orange-500'
                          />
                          <div>
                            <p className='font-medium text-foreground dark:text-white'>{segment.title}</p>
                            <p className='text-xs text-muted-foreground'>{segment.segmentKey}</p>
                          </div>
                        </div>
                        {!segment.isVisible && (
                          <span className='rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-[11px] font-medium text-yellow-200'>
                            Hidden
                          </span>
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className='md:col-span-2 space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-description'>
              Description
            </label>
            <Textarea
              id='op-description'
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              placeholder='Narrative describing the opportunity...'
              className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-eligibility'>
                Eligibility (one per line)
              </label>
              <Textarea
                id='op-eligibility'
                value={formState.eligibilityText}
                onChange={(event) => setFormState((prev) => ({ ...prev, eligibilityText: event.target.value }))}
                className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-benefits'>
                Benefits (one per line)
              </label>
              <Textarea
                id='op-benefits'
                value={formState.benefitsText}
                onChange={(event) => setFormState((prev) => ({ ...prev, benefitsText: event.target.value }))}
                className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-registration-process'>
                Registration steps (one per line)
              </label>
              <Textarea
                id='op-registration-process'
                value={formState.registrationProcessText}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, registrationProcessText: event.target.value }))
                }
                className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>
          </div>

          <div className='md:col-span-2 space-y-2'>
            <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='op-timeline'>
              Timeline (one per line as <code>date|event|status</code>)
            </label>
            <Textarea
              id='op-timeline'
              value={formState.timelineText}
              onChange={(event) => setFormState((prev) => ({ ...prev, timelineText: event.target.value }))}
              placeholder='2024-02-01|Registration Opens|completed'
              className='min-h-[120px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
            />
          </div>

          <div className='md:col-span-2 rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4'>
            <h3 className='text-sm font-semibold text-foreground dark:text-white'>Exam pattern</h3>
            <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-4'>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-exam-questions'>
                  Total questions
                </label>
                <Input
                  id='op-exam-questions'
                  value={formState.examTotalQuestions}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, examTotalQuestions: event.target.value }))
                  }
                  placeholder='100'
                  className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-exam-duration'>
                  Duration (minutes)
                </label>
                <Input
                  id='op-exam-duration'
                  value={formState.examDurationMinutes}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, examDurationMinutes: event.target.value }))
                  }
                  placeholder='120'
                  className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-exam-negative'>
                  Negative marking?
                </label>
                <div className='flex items-center gap-2 text-sm text-foreground dark:text-white'>
                  <input
                    id='op-exam-negative'
                    type='checkbox'
                    checked={formState.examNegativeMarking}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, examNegativeMarking: event.target.checked }))
                    }
                    className='h-4 w-4 rounded border border-border/50 dark:border-white/20 bg-card/80 dark:bg-white/5'
                  />
                  <span>Enabled</span>
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-exam-penalty'>
                  Penalty per question
                </label>
                <Input
                  id='op-exam-penalty'
                  value={formState.examNegativeMarksPerQuestion}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, examNegativeMarksPerQuestion: event.target.value }))
                  }
                  placeholder='0.25'
                  className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                />
              </div>
            </div>
            <div className='mt-4 space-y-2'>
              <label className='text-xs text-muted-foreground' htmlFor='op-exam-sections'>
                Sections (one per line as <code>name|questions|marks</code>)
              </label>
              <Textarea
                id='op-exam-sections'
                value={formState.examSectionsText}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, examSectionsText: event.target.value }))
                }
                placeholder='Physics|25|25'
                className='min-h-[100px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
              />
            </div>
          </div>

          <div className='md:col-span-2 rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4'>
            <h3 className='text-sm font-semibold text-foreground dark:text-white'>Contact information</h3>
            <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-contact-email'>
                  Email
                </label>
                <Input
                  id='op-contact-email'
                  value={formState.contactEmail}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, contactEmail: event.target.value }))
                  }
                  placeholder='info@example.org'
                  className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-contact-phone'>
                  Phone
                </label>
                <Input
                  id='op-contact-phone'
                  value={formState.contactPhone}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, contactPhone: event.target.value }))
                  }
                  placeholder='+1-800-123-4567'
                  className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground' htmlFor='op-contact-website'>
                  Website
                </label>
                <Input
                  id='op-contact-website'
                  value={formState.contactWebsite}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, contactWebsite: event.target.value }))
                  }
                  placeholder='https://example.org'
                  className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                />
              </div>
            </div>
          </div>

          <div className='md:col-span-2 flex items-center gap-3'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Update opportunity' : 'Create opportunity'}
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
          <h2 className='text-lg font-semibold text-foreground dark:text-white'>Existing opportunities</h2>
          <Button variant='outline' size='sm' onClick={loadItems} disabled={isLoading}>
            Refresh
          </Button>
        </div>
        <p className='mt-1 text-sm text-muted-foreground'>
          {isLoading ? 'Loading... opportunities...' : `Showing ${items.length} record(s).`}
        </p>

        <div className="mt-4">
          <div className="grid gap-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm overflow-hidden">
              <div className="w-full overflow-x-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-white/10 to-white/5 hover:bg-card/70 dark:bg-white/10 border-b border-border/60 dark:border-white/10">
                      <TableHead className="w-[25%] text-foreground dark:text-white font-semibold">Title & Info</TableHead>
                      <TableHead className="w-[15%] text-foreground dark:text-white font-semibold">Category & Mode</TableHead>
                      <TableHead className="w-[20%] text-foreground dark:text-white font-semibold">Organizer</TableHead>
                      <TableHead className="w-[15%] text-foreground dark:text-white font-semibold text-center">Status & Source</TableHead>
                      <TableHead className="w-[25%] text-foreground dark:text-white font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                            <div className="h-12 w-12 rounded-xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 flex items-center justify-center">
                              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                            </div>
                            <p>No opportunities available</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {items.map((item) => (
                      <TableRow key={item.id} className="group border-b border-border/70 dark:border-white/5 hover:bg-card/80 dark:bg-white/5">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-foreground dark:text-white group-hover:text-orange-400 transition-colors">
                              {item.title}
                            </div>
                            <div className="flex flex-col space-y-1">
                              <span className="text-xs text-muted-foreground">
                                Added {formatDate(item.startDate)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Deadline: {formatDate(item.registrationDeadline)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Badge 
                              variant="outline" 
                              className="border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                            >
                              {item.category?.name || item.categoryName || 'N/A'}
                            </Badge>
                            <div className="flex items-center">
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs capitalize bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10">
                                {item.mode}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 overflow-hidden flex-shrink-0">
                              <img 
                                src={item.organizerLogo || 'https://via.placeholder.com/40'} 
                                alt={item.organizer?.name || item.organizerName || 'Organizer'} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-foreground dark:text-white truncate">
                                {item.organizer?.name || item.organizerName || 'N/A'}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.segments.slice(0, 2).map((segment, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10"
                                  >
                                    {segment}
                                  </span>
                                ))}
                                {item.segments.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{item.segments.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-2 flex flex-col items-center">
                            {item.registrationMode === 'internal' ? (
                              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                                {item.registrationCount ?? 0} Registrations
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-gray-500/30 bg-gray-500/10 text-gray-400">
                                External
                              </Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`
                                ${item.status === 'published' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                                  item.status === 'approved' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                  item.status === 'rejected' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                                  'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                              `}
                            >
                              {item.status}
                            </Badge>
                            {item.source === 'organization-submission' ? (
                              <Badge className="border-orange-500/40 bg-orange-500/20 text-orange-200">
                                Host
                              </Badge>
                            ) : (
                              <Badge className="border-blue-500/40 bg-blue-500/20 text-blue-200">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            {item.registrationMode === 'internal' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/opportunities/${item.id}/registrations`)}
                              className="border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                            >
                              View Registrations
                            </Button>
                            )}
                            {item.registrationMode === 'external' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/opportunities/${item.id}/external-clicks`)}
                              className="border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                            >
                              View Clicks
                            </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              disabled={isSubmitting && editingId === item.id}
                              className="border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickApprove(item, false)}
                              disabled={Boolean(actioningId) || item.status === 'approved' || item.status === 'published'}
                              className="border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickApprove(item, true)}
                              disabled={Boolean(actioningId) || item.status === 'published'}
                              className="border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            >
                              Publish
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              disabled={isSubmitting}
                              className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-4 hover:border-orange-500/20 transition-colors"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground dark:text-white truncate">{item.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Added {formatDate(item.startDate)}</p>
                      </div>
                      <div className="h-10 w-10 rounded-lg border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 overflow-hidden flex-shrink-0">
                        <img 
                          src={item.organizerLogo || 'https://via.placeholder.com/40'} 
                          alt={item.organizer?.name || item.organizerName || 'Organizer'}
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge 
                          variant="outline" 
                          className="border-orange-500/20 bg-orange-500/10 text-orange-400"
                        >
                          {item.category?.name || item.categoryName || 'N/A'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Organizer:</span>
                        <span className="text-foreground dark:text-white">
                          {item.organizer?.name || item.organizerName || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Mode:</span>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs capitalize bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10">
                          {item.mode}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${item.status === 'published' ? 'border-green-500/30 bg-green-500/10 text-green-400' :
                              item.status === 'approved' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                              item.status === 'rejected' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                              'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'}
                          `}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="text-foreground dark:text-white">{formatDate(item.registrationDeadline)}</span>
                      </div>
                    </div>

                    {/* Segments */}
                    <div className="flex flex-wrap gap-1">
                      {item.segments.map((segment, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-card/80 dark:bg-white/5 text-muted-foreground border border-border/60 dark:border-white/10"
                        >
                          {segment}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/60 dark:border-white/10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        disabled={isSubmitting && editingId === item.id}
                        className="flex-1 border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={isSubmitting}
                        className="flex-1 border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickApprove(item, true)}
                        disabled={Boolean(actioningId) || item.status === 'published'}
                        className="flex-1 border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      >
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length === 0 && !isLoading && (
                <div className="col-span-full rounded-2xl border border-border/60 dark:border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                    <div className="h-12 w-12 rounded-xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 flex items-center justify-center">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">No opportunities available</p>
                    <p className="text-sm text-slate-500">Create your first opportunity to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
        </>
      ) : (
        <section className='rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 backdrop-blur'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <h2 className='text-lg font-semibold text-foreground dark:text-white'>Opportunity resources</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Add helpful links, PDFs, or videos for the selected opportunity.
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={loadItems}
              disabled={isLoading || isResourceSubmitting}
              className='border-white/20 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10'
            >
              Refresh
            </Button>
          </div>

          <div className='mt-6 space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='resource-opportunity'>
                Opportunity
              </label>
              <select
                id='resource-opportunity'
                value={selectedOpportunityId}
                onChange={(event) => setSelectedOpportunityId(event.target.value)}
                className='w-full rounded-lg border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 py-2 text-sm text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50'
              >
                <option value=''>Select an opportunity</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            {!selectedOpportunity ? (
              <div className='rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-6 text-center text-sm text-muted-foreground'>
                Choose an opportunity to manage its resources.
              </div>
            ) : (
              <div className='grid gap-6 lg:grid-cols-2'>
                <div className='space-y-4'>
                  <div className='rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4'>
                    <div className='flex flex-col gap-2'>
                      <p className='text-xs uppercase tracking-wide text-muted-foreground'>Selected opportunity</p>
                      <h3 className='text-lg font-semibold text-foreground dark:text-white'>{selectedOpportunity.title}</h3>
                      <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                        <Badge variant='outline' className='border-orange-500/30 bg-orange-500/10 text-orange-300'>
                          {selectedOpportunity.category?.name || selectedOpportunity.categoryName || 'Uncategorized'}
                        </Badge>
                        <span className='rounded-full border border-border/60 dark:border-white/10 px-2 py-0.5 text-muted-foreground'>
                          {selectedOpportunity.mode}
                        </span>
                        <span className='rounded-full border border-border/60 dark:border-white/10 px-2 py-0.5 text-muted-foreground'>
                          {selectedOpportunity.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-sm font-semibold text-foreground dark:text-white'>Existing resources</h3>
                      <span className='text-xs text-muted-foreground'>
                        {selectedOpportunity.resources.length} item(s)
                      </span>
                    </div>
                    <div className='mt-3 space-y-3'>
                      {selectedOpportunity.resources.length === 0 ? (
                        <div className='rounded-xl border border-dashed border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-6 text-center text-sm text-muted-foreground'>
                          No resources added yet.
                        </div>
                      ) : (
                        selectedOpportunity.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className='rounded-xl border border-border/60 dark:border-white/10 bg-card/60 dark:bg-white/5 p-4 transition hover:border-orange-500/30'
                          >
                            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <Badge variant='outline' className='border-white/20 bg-card/70 dark:bg-white/10 text-foreground dark:text-white'>
                                    {resource.type.toUpperCase()}
                                  </Badge>
                                  <a
                                    href={resource.url}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='text-sm font-medium text-orange-300 hover:text-orange-200 hover:underline'
                                  >
                                    {resource.title}
                                  </a>
                                </div>
                                {resource.description && (
                                  <p className='text-sm text-muted-foreground'>{resource.description}</p>
                                )}
                                <p className='break-all text-xs text-slate-500'>{resource.url}</p>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='border-white/20 text-foreground dark:text-white hover:bg-card/70 dark:bg-white/10'
                                  asChild
                                >
                                  <a href={resource.url} target='_blank' rel='noreferrer'>
                                    Open
                                  </a>
                                </Button>
                                <Button
                                  type='button'
                                  variant='outline'
                                  size='sm'
                                  onClick={() => handleResourceRemove(resource.id)}
                                  disabled={isResourceSubmitting}
                                  className='border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div>
                    <h3 className='text-sm font-semibold text-foreground dark:text-white'>Add new resource</h3>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      Provide a descriptive title and link. URLs will automatically include https:// if missing.
                    </p>
                  </div>
                  <form className='space-y-4' onSubmit={handleResourceSubmit}>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='resource-title'>
                        Title
                      </label>
                      <Input
                        id='resource-title'
                        value={resourceDraft.title}
                        onChange={(event) =>
                          setResourceDraft((prev) => ({ ...prev, title: event.target.value }))
                        }
                        placeholder='Official sample paper'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='resource-url'>
                        URL
                      </label>
                      <Input
                        id='resource-url'
                        value={resourceDraft.url}
                        onChange={(event) =>
                          setResourceDraft((prev) => ({ ...prev, url: event.target.value }))
                        }
                        placeholder='https://example.com/resource.pdf'
                        className='bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                      />
                    </div>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='resource-type'>
                          Type
                        </label>
                        <select
                          id='resource-type'
                          value={resourceDraft.type}
                          onChange={(event) =>
                            setResourceDraft((prev) => ({
                              ...prev,
                              type: event.target.value as ResourceDraft['type'],
                            }))
                          }
                          className='w-full rounded-lg border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 px-3 py-2 text-sm text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50'
                        >
                          <option value='link'>Reference link</option>
                          <option value='pdf'>PDF / document</option>
                          <option value='video'>Video</option>
                        </select>
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-foreground dark:text-white' htmlFor='resource-description'>
                          Notes (optional)
                        </label>
                        <Textarea
                          id='resource-description'
                          value={resourceDraft.description}
                          onChange={(event) =>
                            setResourceDraft((prev) => ({ ...prev, description: event.target.value }))
                          }
                          placeholder='Share why this resource is helpful...'
                          className='min-h-[80px] bg-card/80 dark:bg-white/5 text-foreground dark:text-white'
                        />
                      </div>
                    </div>
                    {error && (
                      <p className='text-sm text-red-400' role='alert'>
                        {error}
                      </p>
                    )}
                    <div className='flex items-center gap-3'>
                      <Button type='submit' disabled={isResourceSubmitting || isLoading}>
                        {isResourceSubmitting ? 'Saving...' : 'Add resource'}
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        disabled={isResourceSubmitting}
                        onClick={() =>
                          setResourceDraft({
                            title: '',
                            url: '',
                            type: 'link',
                            description: '',
                          })
                        }
                      >
                        Reset
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}









