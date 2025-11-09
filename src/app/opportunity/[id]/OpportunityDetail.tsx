'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { Opportunity, OpportunityResource, OpportunityTimelineEvent, OpportunityTimelineStatus } from '@/types/opportunity';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  MapPin,
  Users,
  Bookmark,
  Clock,
  Award,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Share2,
  Download,
  Trophy,
  Target,
  BookOpen,
  Timer,
  FileText,
  Video,
  MessageSquare,
  StickyNote,
  PenTool,
  Mail,
  Phone,
  Globe,
  ArrowRight
} from 'lucide-react';

const formatDate = (value?: string, fallback = 'TBA') => {
  if (!value) {
    return fallback;
  }

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return format(date, 'PPP');
  } catch {
    return value;
  }
};

const calculateCountdown = (deadline?: string) => {
  if (!deadline) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const target = new Date(deadline).getTime();
  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes };
};

const formatFee = (opportunity: Opportunity) => {
  const trimmedFee = opportunity.fee?.trim() ?? '';
  const numeric = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const hasNumericValue = Number.isFinite(numeric);
  const isFree =
    !trimmedFee ||
    trimmedFee.toLowerCase() === 'free' ||
    (hasNumericValue && numeric <= 0);

  if (isFree) {
    return 'FREE';
  }

  if (hasNumericValue) {
    const fractionDigits = Number.isInteger(numeric) ? 0 : 2;
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(numeric);
    } catch {
      return `₹${numeric.toFixed(fractionDigits)}`;
    }
  }

  return trimmedFee;
};

const normalizeModeLabel = (mode?: Opportunity['mode']) => {
  if (mode === 'online') return 'Online';
  if (mode === 'offline') return 'Offline';
  if (mode === 'hybrid') return 'Hybrid';
  return 'Online';
};

const toTitleCase = (value: string) => {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
};

const normalizeUrl = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const extractUrlFromText = (value?: string): string | null => {
  if (!value) {
    return null;
  }
  const match = value.match(/https?:\/\/[^\s)]+/i);
  if (!match) {
    return null;
  }
  return match[0].replace(/[.,]$/, '');
};

type TimelineCallToAction = {
  label: string;
  event: string;
  status: OpportunityTimelineStatus;
};

type ResourceDisplayItem = OpportunityResource & {
  type: 'pdf' | 'video' | 'link';
  typeLabel: string;
  Icon: typeof FileText;
  url: string;
};

type InternalLinkSuggestion = {
  href: string;
  label: string;
  description: string;
};

const CTA_KEYWORDS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /admit card/i, label: 'Download admit card' },
  { pattern: /hall ticket/i, label: 'Download hall ticket' },
  { pattern: /answer key/i, label: 'View answer key' },
  { pattern: /result/i, label: 'View results' },
  { pattern: /interview/i, label: 'View interview details' },
];

const deriveTimelineCta = (timeline?: OpportunityTimelineEvent[]): TimelineCallToAction | null => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const sorted = [...timeline]
    .filter((item): item is OpportunityTimelineEvent => Boolean(item))
    .sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return (Number.isNaN(aTime) ? 0 : aTime) - (Number.isNaN(bTime) ? 0 : bTime);
    });

  const candidate =
    sorted.find((item) => item.status === 'active') ??
    sorted.find((item) => item.status === 'upcoming') ??
    sorted.find((item) => {
      const time = new Date(item.date).getTime();
      return !Number.isNaN(time) && time >= Date.now();
    }) ??
    null;

  if (!candidate || !candidate.event) {
    return null;
  }

  const match = CTA_KEYWORDS.find(({ pattern }) => pattern.test(candidate.event));
  if (!match) {
    return null;
  }

  return {
    label: match.label,
    event: candidate.event,
    status: candidate.status,
  };
};

export default function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const router = useRouter();
  const { user, loading: authLoading, getIdToken } = useAuth();
  const params = useParams();
  const rawId = params?.['id'];
  const opportunityId = Array.isArray(rawId) ? rawId[0] : rawId ?? '';

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!opportunityId || !user) {
      setIsBookmarked(false);
      return;
    }

    let isCurrent = true;

    const checkSavedState = async () => {
      try {
        const token = await getIdToken();
        if (!token) {
          return;
        }
        const response = await fetch(`/api/opportunities/${opportunityId}/bookmark`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { isSaved?: boolean };
        if (isCurrent) {
          setIsBookmarked(Boolean(payload.isSaved));
        }
      } catch (bookmarkStateError) {
        if (isCurrent) {
          console.error('Failed to load saved opportunity state', bookmarkStateError);
        }
      }
    };

    checkSavedState();

    return () => {
      isCurrent = false;
    };
  }, [authLoading, getIdToken, opportunityId, user]);

  useEffect(() => {
    setActionMessage(null);
    setBookmarkError(null);
  }, [opportunityId]);

  const detailPath = opportunityId ? `/opportunity/${opportunityId}` : '/opportunities';

  const registrationClosed = useMemo(() => {
    if (!opportunity?.registrationDeadline) {
      return false;
    }
    const deadlineDate = new Date(opportunity.registrationDeadline);
    if (Number.isNaN(deadlineDate.getTime())) {
      return false;
    }
    const endOfDay = new Date(deadlineDate);
    endOfDay.setHours(23, 59, 59, 999);
    return Date.now() > endOfDay.getTime();
  }, [opportunity?.registrationDeadline]);

  const registerUrl = useMemo(() => {
    const direct = opportunity?.contactInfo?.website?.trim();
    if (direct) {
      return direct;
    }
    const steps = opportunity?.registrationProcess ?? [];
    for (const step of steps) {
      if (typeof step === 'string') {
        const extracted = extractUrlFromText(step);
        if (extracted) {
          return extracted;
        }
      }
    }
    return null;
  }, [opportunity?.contactInfo?.website, opportunity?.registrationProcess]);

  const normalizedRegisterUrl = useMemo(() => normalizeUrl(registerUrl), [registerUrl]);

  const timelineCTA = useMemo(
    () => deriveTimelineCta(opportunity?.timeline),
    [opportunity?.timeline],
  );

  const countdown = useMemo(
    () =>
      registrationClosed
        ? { days: 0, hours: 0, minutes: 0 }
        : calculateCountdown(opportunity?.registrationDeadline),
    [opportunity?.registrationDeadline, registrationClosed],
  );

  const handleToggleBookmark = async () => {
    if (!opportunityId) {
      return;
    }
    if (!user) {
      setActionMessage('Please log in to save opportunities.');
      router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
      return;
    }

    try {
      setBookmarkLoading(true);
      setBookmarkError(null);
      const token = await getIdToken();
      if (!token) {
        throw new Error('Missing auth token');
      }
      const response = await fetch(`/api/opportunities/${opportunityId}/bookmark`, {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Failed to update bookmark');
      }
      setIsBookmarked(!isBookmarked);
      setActionMessage(
        isBookmarked
          ? 'Removed from your saved opportunities.'
          : 'Saved to your dashboard.',
      );
    } catch (bookmarkErr) {
      console.error('Failed to toggle bookmark', bookmarkErr);
      setBookmarkError(
        bookmarkErr instanceof Error ? bookmarkErr.message : 'Failed to update bookmark',
      );
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (registrationClosed) {
      return;
    }
    if (!user) {
      setActionMessage('Please log in to register for this opportunity.');
      router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
      return;
    }
    if (normalizedRegisterUrl) {
      setActionMessage('Opening the registration page in a new tab.');
      window.open(normalizedRegisterUrl, '_blank', 'noopener,noreferrer');
    } else {
      setActionMessage('Registration link not available. Please use the organizer contact information below.');
    }
  };

  const handleTimelineAction = () => {
    if (!timelineCTA) {
      return;
    }
    if (!user) {
      setActionMessage('Please log in to follow timeline updates for this opportunity.');
      router.push(`/login?redirect=${encodeURIComponent(detailPath)}`);
      return;
    }
    if (normalizedRegisterUrl) {
      setActionMessage(`Opening link for "${timelineCTA.event}".`);
      window.open(normalizedRegisterUrl, '_blank', 'noopener,noreferrer');
    } else {
      setActionMessage('Additional details are not available online. Please reach out to the organizer.');
    }
  };

  const formattedStartDate = formatDate(opportunity.startDate);
  const formattedEndDate = formatDate(opportunity.endDate);
  const formattedDeadline = formatDate(opportunity.registrationDeadline);
  const modeLabel = normalizeModeLabel(opportunity.mode);
  const displayFee = formatFee(opportunity);
  const timelineEntries: OpportunityTimelineEvent[] = (opportunity.timeline ?? []).map((item) => ({
    ...item,
    date: item.date ?? '',
  }));
  const dateDisplay =
    formattedEndDate !== 'TBA' && formattedEndDate !== formattedStartDate
      ? `${formattedStartDate} - ${formattedEndDate}`
      : formattedStartDate;
  const examPattern = opportunity.examPattern ?? {};
  const examSections = examPattern.sections ?? [];
  const contactInfo = opportunity.contactInfo ?? {};
  const durationLabel =
    typeof examPattern.durationMinutes === 'number'
      ? `${Math.floor(examPattern.durationMinutes / 60)}h ${examPattern.durationMinutes % 60}m`
      : 'Not specified';
  const negativeMarkingLabel = examPattern.negativeMarking
    ? (typeof examPattern.negativeMarksPerQuestion === 'number'
        ? `Yes (-${examPattern.negativeMarksPerQuestion} per question)`
        : 'Yes')
    : 'No';
  const heroImage =
    opportunity.image ||
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80';
  const categoryLabel = (opportunity.categoryName || opportunity.category || 'opportunity').toUpperCase();
  const title = opportunity.title || 'Opportunity Details';
  const organizerLabel = opportunity.organizerName || opportunity.organizer || 'Unknown Organizer';
  const resourceItems = useMemo<ResourceDisplayItem[]>(() => {
    if (!Array.isArray(opportunity.resources)) {
      return [];
    }

    return opportunity.resources
      .map((resource) => {
        if (!resource || !resource.id || !resource.title || !resource.url) {
          return null;
        }
        const normalizedType: 'pdf' | 'video' | 'link' =
          resource.type === 'video' ? 'video' : resource.type === 'pdf' ? 'pdf' : 'link';
        const normalizedUrl = normalizeUrl(resource.url) ?? resource.url;
        const Icon = normalizedType === 'pdf' ? FileText : normalizedType === 'video' ? Video : Globe;
        const typeLabel =
          normalizedType === 'pdf'
            ? 'PDF / Document'
            : normalizedType === 'video'
            ? 'Video'
            : 'External Link';

        return {
          ...resource,
          type: normalizedType,
          url: normalizedUrl,
          typeLabel,
          Icon,
        };
      })
      .filter((item): item is ResourceDisplayItem => Boolean(item));
  }, [opportunity.resources]);

  const seoLinkTargets = useMemo<InternalLinkSuggestion[]>(() => {
    const entries: InternalLinkSuggestion[] = [];
    const addEntry = (suggestion: InternalLinkSuggestion) => {
      if (!suggestion.href || !suggestion.label) {
        return;
      }
      if (entries.some((existing) => existing.href === suggestion.href)) {
        return;
      }
      entries.push(suggestion);
    };

    const categoryValue = opportunity.category?.trim() ?? '';
    if (categoryValue) {
      const categoryLabel = toTitleCase(opportunity.categoryName || opportunity.category || 'Student');
      addEntry({
        href: `/opportunities?category=${encodeURIComponent(categoryValue)}`,
        label: `More ${categoryLabel} opportunities`,
        description: `Browse ${categoryLabel.toLowerCase()} programs curated for learners across India.`,
      });
    }

    const segments = Array.from(
      new Set(
        (opportunity.segments ?? [])
          .map((segment) => (typeof segment === 'string' ? segment.trim() : ''))
          .filter((segment): segment is string => Boolean(segment)),
      ),
    ).slice(0, 4);

    segments.forEach((segment) => {
      addEntry({
        href: `/opportunities?segment=${encodeURIComponent(segment)}`,
        label: `${toTitleCase(segment)} opportunities in India`,
        description: `Explore the latest ${segment.toLowerCase()} updates handpicked by Myark.`,
      });
    });

    const organizerName = (opportunity.organizerName || opportunity.organizer || '').trim();
    if (organizerName) {
      addEntry({
        href: `/opportunities?search=${encodeURIComponent(organizerName)}`,
        label: `Programs from ${organizerName}`,
        description: `Find scholarships, exams, and workshops organised by ${organizerName}.`,
      });
    }

    const gradeEligibility = opportunity.gradeEligibility?.trim();
    if (gradeEligibility) {
      addEntry({
        href: `/opportunities?search=${encodeURIComponent(gradeEligibility)}`,
        label: `${gradeEligibility} student programs`,
        description: `Discover competitions and entrance exams tailored for ${gradeEligibility.toLowerCase()} students.`,
      });
    }

    addEntry({
      href: '/opportunities',
      label: 'All opportunities on Myark',
      description: 'See every exam, scholarship, and workshop available for Indian students.',
    });

    return entries;
  }, [
    opportunity.category,
    opportunity.categoryName,
    opportunity.segments,
    opportunity.organizer,
    opportunity.organizerName,
    opportunity.gradeEligibility,
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[#071045]">
        {/* Hero Banner */}
        <div className="relative h-96 bg-gradient-to-br from-[#071045] to-[#0a1a5d] overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full opacity-50 blur-3xl animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"></div>
          </div>
          
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt={title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071045] via-[#071045]/80 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px]">
              <div className="max-w-4xl">
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 backdrop-blur-sm mb-4 animate-fade-in">
                  {categoryLabel}
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in animation-delay-150">
                  {title}
                </h1>
                <div className="flex flex-wrap gap-6 text-gray-300 animate-fade-in animation-delay-300">
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Users className="h-5 w-5 text-orange-400" />
                    <span>{organizerLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Calendar className="h-5 w-5 text-pink-400" />
                    <span>{dateDisplay}</span>
                  </div>
                  {opportunity.state && (
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <MapPin className="h-5 w-5 text-purple-400" />
                      <span>{opportunity.state}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Globe className="h-5 w-5 text-cyan-300" />
                    <span>{modeLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-wrap bg-white/5 backdrop-blur-sm rounded-xl p-1">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="eligibility"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300"
                  >
                    Eligibility
                  </TabsTrigger>
                  <TabsTrigger 
                    value="timeline"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300"
                  >
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger 
                    value="registration"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300"
                  >
                    Registration
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pattern"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300"
                  >
                    Exam Pattern
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resources"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300"
                  >
                    Resources
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                          About This Opportunity
                        </h2>
                        <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                          {opportunity.description || 'Detailed description will be available soon.'}
                        </p>
                      </div>

                      <Separator className="bg-white/10" />

                      <div>
                        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                          Key Benefits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(opportunity.benefits ?? []).map((benefit, index) => (
                            <div 
                              key={index} 
                              className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm hover:border-orange-500/20 transition-colors"
                            >
                              <div className="mt-1">
                                <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-orange-400" />
                                </div>
                              </div>
                              <span className="text-gray-300">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="eligibility" className="mt-6">
                  <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                    <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                      Eligibility Criteria
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(opportunity.eligibility ?? []).map((criterion, index) => (
                        <div 
                          key={index} 
                          className="group flex items-start gap-3 p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-orange-500/20 transition-all duration-300"
                        >
                          <div className="mt-1">
                            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <AlertCircle className="h-5 w-5 text-orange-400" />
                            </div>
                          </div>
                          <span className="text-gray-300 leading-relaxed">{criterion}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                  <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                    <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                      Important Timeline
                    </h2>
                    <div className="space-y-6">
                      {timelineEntries.map((item, index) => (
                        <div key={index} className="relative flex gap-6 group">
                          <div className="flex flex-col items-center">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300
                              ${item.status === 'active' 
                                ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/30 group-hover:border-orange-500/50' 
                                : item.status === 'completed'
                                ? 'bg-white/5 border-white/20'
                                : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 group-hover:border-blue-500/50'
                              }`}
                            >
                              {item.status === 'active' ? (
                                <Clock className="h-6 w-6 text-orange-400" />
                              ) : (
                                <Calendar className="h-6 w-6 text-pink-400" />
                              )}
                            </div>
                            {index < timelineEntries.length - 1 && (
                              <div className="w-0.5 h-16 bg-gradient-to-b from-white/10 to-transparent"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 group-hover:border-orange-500/20 transition-all duration-300">
                              <p className="font-semibold text-white mb-1">{item.event}</p>
                              <p className="text-sm text-gray-400">{formatDate(item.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="registration" className="mt-6">
                  <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                          How to Register
                        </h2>
                        <div className="space-y-4">
                          {(opportunity.registrationProcess ?? []).map((step, index) => (
                            <div key={index} className="group flex items-start gap-4 p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-orange-500/20 transition-all duration-300">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-300">{step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl group hover:border-pink-500/20 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="h-5 w-5 text-pink-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white">{contactInfo.email ?? 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl group hover:border-purple-500/20 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="h-5 w-5 text-purple-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Phone</p>
                                <p className="text-white">{contactInfo.phone ?? 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl group hover:border-blue-500/20 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Globe className="h-5 w-5 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Website</p>
                                <p className="text-white">{contactInfo.website ?? 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="pattern" className="mt-6">
                  <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
                    <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                      Examination Pattern
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="group p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-orange-500/20 transition-all duration-300">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <BookOpen className="h-6 w-6 text-orange-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{examPattern.totalQuestions ?? '—'}</p>
                        <p className="text-sm text-gray-400">Total Questions</p>
                      </div>
                      <div className="group p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-pink-500/20 transition-all duration-300">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Timer className="h-6 w-6 text-pink-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{durationLabel}</p>
                        <p className="text-sm text-gray-400">Duration</p>
                      </div>
                      <div className="group p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-red-500/20 transition-all duration-300">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <AlertCircle className="h-6 w-6 text-red-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{negativeMarkingLabel}</p>
                        <p className="text-sm text-gray-400">Negative Marking</p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                      Section-wise Distribution
                    </h3>
                    <div className="space-y-4">
                      {examSections.map((section, index) => (
                        <div 
                          key={index} 
                          className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl hover:border-orange-500/20 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-3 sm:mb-0">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BookOpen className="h-5 w-5 text-orange-400" />
                            </div>
                            <span className="font-semibold text-white">{section.name}</span>
                          </div>
                          <div className="flex gap-6 text-sm">
                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                              <span className="text-gray-400">Questions: </span>
                              <strong className="text-white">{section.questions ?? '—'}</strong>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                              <span className="text-gray-400">Marks: </span>
                              <strong className="text-white">{section.marks ?? '—'}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Resources</h2>
                        <p className="text-sm text-gray-400">
                          Curated links, documents, and videos to help you prepare.
                        </p>
                      </div>
                      {resourceItems.length > 0 && (
                        <Badge
                          variant="outline"
                          className="border-orange-400/40 bg-orange-500/10 text-orange-200"
                        >
                          {resourceItems.length} resource{resourceItems.length === 1 ? '' : 's'}
                        </Badge>
                      )}
                    </div>

                    <Separator className="my-6 bg-white/10" />

                    {resourceItems.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-gray-300">
                        <p className="text-sm">
                          Organizers haven&apos;t shared supporting resources yet. Check back soon!
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {resourceItems.map((resource) => (
                          <div
                            key={resource.id}
                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-400/40 hover:bg-white/10 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex flex-1 items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-200">
                                <resource.Icon className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                <Badge variant="outline" className="border-white/20 bg-white/10 text-gray-200">
                                  {resource.typeLabel}
                                </Badge>
                                <p className="text-lg font-semibold text-white">{resource.title}</p>
                                {resource.description && (
                                  <p className="text-sm text-gray-400">{resource.description}</p>
                                )}
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200"
                                >
                                  <Globe className="h-4 w-4" />
                                  {resource.url}
                                </a>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-stretch md:self-auto">
                              <Button
                                asChild
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <a href={resource.url} target="_blank" rel="noreferrer">
                                  Open
                                </a>
                              </Button>
                              {resource.type === 'pdf' && (
                                <Button
                                  asChild
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  <a href={resource.url} target="_blank" rel="noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </TabsContent>


              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Main Action Card */}
              <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-white/10 backdrop-blur-sm">
                {/* Price and Registration */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Registration Fee</p>
                    <p className="text-2xl font-bold text-green-400">{displayFee}</p>
                  </div>
                  <div>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {modeLabel}
                    </Badge>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4 text-orange-400" />
                    Registration Status
                  </h3>
                  {registrationClosed ? (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-center text-red-200">
                      Registrations are closed.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold text-orange-400">{countdown.days}</div>
                        <div className="text-xs text-gray-300">Days</div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold text-pink-400">{countdown.hours}</div>
                        <div className="text-xs text-gray-300">Hours</div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm">
                        <div className="text-3xl font-bold text-purple-400">{countdown.minutes}</div>
                        <div className="text-xs text-gray-300">Mins</div>
                      </div>
                    </div>
                  )}
                  <p className="mt-3 text-center text-xs text-gray-400">Deadline: {formattedDeadline}</p>
                </div>

                {/* Main Actions */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="h-14 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-lg font-semibold text-white hover:from-orange-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleRegisterClick}
                    disabled={registrationClosed}
                  >
                    {registrationClosed ? 'Registrations Closed' : 'Register Now'}
                  </Button>
                  {timelineCTA && (
                    <div className="space-y-1">
                  <Button
                    variant="outline"
                    className="w-full border-orange-400/40 text-orange-100 hover:bg-orange-500/10 disabled:opacity-50"
                    onClick={handleTimelineAction}
                    disabled={!normalizedRegisterUrl}
                  >
                    {timelineCTA.label}
                  </Button>
                  <p className="text-center text-xs text-orange-200/80">{timelineCTA.event}</p>
                  {!normalizedRegisterUrl && (
                    <p className="text-center text-[11px] text-orange-200/60">
                      No link available—contact the organizer for this update.
                    </p>
                  )}
                </div>
              )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleToggleBookmark}
                      disabled={bookmarkLoading}
                    >
                      <Bookmark
                        className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current text-orange-400' : ''}`}
                      />
                      {bookmarkLoading ? 'Saving...' : isBookmarked ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/5">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/5">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {(bookmarkError || actionMessage) && (
                    <p
                      className={`text-center text-xs ${bookmarkError ? 'text-red-300' : 'text-orange-200'}`}
                    >
                      {bookmarkError ?? actionMessage}
                    </p>
                  )}
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                  Quick Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                    <Trophy className="h-5 w-5 text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Grade Eligibility</p>
                      <p className="font-semibold text-white">{opportunity.gradeEligibility || 'All Grades'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                    <Calendar className="h-5 w-5 text-pink-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Event Date</p>
                      <p className="font-semibold text-white">{formattedStartDate}</p>
                    </div>
                  </div>
                  {opportunity.state && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                      <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Primary Location</p>
                        <p className="font-semibold text-white">{opportunity.state}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Organizer Info */}
              <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
                <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  Organized By
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/20">
                    <img 
                      src={opportunity.organizerLogo || 'https://via.placeholder.com/96x96.png?text=Org'}
                      alt={opportunity.organizer || 'Organizer'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg mb-1">{organizerLabel}</p>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      Verified Organizer
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/5">
                  View Profile
                </Button>
              </Card>
            </div>
        </div>
      </div>
      {seoLinkTargets.length > 0 && (
        <section className="border-t border-white/10 bg-white/[0.04]">
          <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Keep exploring on Myark</h2>
            <p className="mt-2 text-sm text-white/70 md:text-base">
              Jump to curated collections so you never miss a competition, scholarship, or exam update.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {seoLinkTargets.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-orange-400/60 hover:bg-orange-500/10"
                >
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-white md:text-lg">{link.label}</p>
                    <p className="text-sm text-white/70">{link.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-orange-300 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>

    <Footer />
  </div>
);
}
