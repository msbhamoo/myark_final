'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { Opportunity, OpportunityResource, OpportunityTimelineEvent, OpportunityTimelineStatus } from '@/types/opportunity';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpportunityCard, { getEligibilityDisplay } from '@/components/OpportunityCard';
import { OpportunityHero } from './components/OpportunityHero';
import { OpportunityTabs } from './components/OpportunityTabs';
import { SimilarOpportunities } from './components/SimilarOpportunities';
import { MobileFloatingCTA } from '@/components/MobileFloatingCTA';
import { StickyTabBar, type TabItem } from '@/components/StickyTabBar';
import { CustomTab, CustomTabContent } from '@/types/customTab';
import { CommentSection, UpvoteButton, ShareButton } from '@/components/community';
import * as gtag from '@/lib/gtag';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  HelpCircle,
  Eye,
} from 'lucide-react';
import {
  formatDate,
  calculateCountdown,
  formatFee,
  normalizeModeLabel,
  toTitleCase,
  normalizeText,
  getOpportunityIdentity,
  normalizeMode,
  toTokenSet,
  extractGradeTokens,
  intersectionSize,
  parseDateSafe,
  computeSimilarityScore,
  rankCandidates,
  buildQueryUrl,
  collectCandidateOpportunities,
  normalizeUrl,
  extractUrlFromText,
  deriveTimelineCta,
  type TimelineCallToAction,
  type ResourceDisplayItem,
} from '@/lib/opportunity-utils';





export default function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const router = useRouter();
  const { user, loading: authLoading, getIdToken } = useAuth();
  const { openAuthModal } = useAuthModal();
  const params = useParams();
  const rawId = params?.['id'];
  const opportunityId = Array.isArray(rawId) ? rawId[0] : rawId ?? '';

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeResource, setActiveResource] = useState<ResourceDisplayItem | null>(null);
  const [organizerModalOpen, setOrganizerModalOpen] = useState(false);
  const [organizerOpportunities, setOrganizerOpportunities] = useState<Opportunity[]>([]);
  const [organizerLoading, setOrganizerLoading] = useState(false);
  const [organizerError, setOrganizerError] = useState<string | null>(null);
  const [organizerFetched, setOrganizerFetched] = useState(false);
  const [relatedOpportunities, setRelatedOpportunities] = useState<Opportunity[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredAt, setRegisteredAt] = useState<string | null>(null);
  const [registrationCheckLoading, setRegistrationCheckLoading] = useState(false);
  const [showExternalConfirmation, setShowExternalConfirmation] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user || !opportunityId) return;

      try {
        setRegistrationCheckLoading(true);
        const token = await getIdToken();
        if (!token) return;

        const response = await fetch(`/api/opportunities/${opportunityId}/register`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsRegistered(data.isRegistered);
          setRegisteredAt(data.registeredAt);
        }
      } catch (error) {
        console.error('Error checking registration status:', error);
      } finally {
        setRegistrationCheckLoading(false);
      }
    };

    checkRegistrationStatus();
  }, [user, opportunityId, getIdToken]);

  useEffect(() => {
    if (opportunityId && opportunity) {
      gtag.event({
        action: 'opportunity_view',
        category: 'engagement',
        label: opportunity.title,
        value: 1,
        id: opportunityId,
        organizer: opportunity.organizerName || opportunity.organizer,
      });
    }
  }, [opportunityId, opportunity]);

  const [viewCount, setViewCount] = useState(opportunity.views || 0);

  useEffect(() => {
    const trackView = async () => {
      if (!opportunityId) return;

      try {
        let headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (user) {
          const token = await getIdToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        const response = await fetch(`/api/opportunities/${opportunityId}/track-view`, {
          method: 'POST',
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.viewIncremented) {
            setViewCount(prev => prev + 1);
          }
        }
      } catch (error) {
        // Silently fail - tracking is not critical
        console.error('Failed to track opportunity view:', error);
      }
    };

    trackView();
  }, [user, opportunityId, getIdToken]);

  const closeResourcePreview = () => setActiveResource(null);


  const normalizeVideoEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtube.com')) {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
      }
      if (parsed.hostname === 'youtu.be') {
        const videoId = parsed.pathname.replace('/', '');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
      }
      return url;
    } catch {
      return url;
    }
  };

  const handleResourcePreview = (resource: ResourceDisplayItem) => {
    setActiveResource(resource);
  };

  const renderResourcePreview = (resource: ResourceDisplayItem) => {
    if (resource.type === 'video') {
      const embedUrl = normalizeVideoEmbedUrl(resource.url);
      return (
        <iframe
          src={embedUrl}
          title={resource.title}
          className="h-[60vh] w-full rounded-2xl border border-slate-200"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (resource.type === 'pdf') {
      return (
        <iframe
          src={`${resource.url}#toolbar=0`}
          title={resource.title}
          className="h-[60vh] w-full rounded-2xl border border-slate-200"
        />
      );
    }

    return (
      <iframe
        src={resource.url}
        title={resource.title}
        className="h-[60vh] w-full rounded-2xl border border-slate-200"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    );
  };

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
      openAuthModal({
        mode: 'login',
        redirectUrl: detailPath,
      });
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

  const handleRegisterClick = async () => {
    gtag.event({
      action: 'registration_click',
      category: 'conversion',
      label: opportunity.title,
      id: opportunityId,
    });

    console.log('Register clicked - registrationClosed:', registrationClosed);
    console.log('Register clicked - user:', user);
    console.log('Register clicked - authLoading:', authLoading);

    if (registrationClosed) {
      return;
    }

    // Wait for auth to load if it's still loading
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }

    if (!user) {
      console.log('No user found, opening auth modal');
      setActionMessage('Please log in to register for this opportunity.');
      openAuthModal({
        mode: 'login',
        redirectUrl: detailPath,
      });
      return;
    }

    console.log('User found, proceeding with registration');
    console.log('Registration mode:', opportunity.registrationMode);

    if (opportunity.registrationMode === 'external') {
      setActionMessage('Opening the registration page in a new tab.');
      try {
        const token = await getIdToken();
        const url = token
          ? `/api/opportunities/${opportunityId}/register/external?token=${encodeURIComponent(token)}`
          : `/api/opportunities/${opportunityId}/register/external`;
        window.open(url, '_blank', 'noopener,noreferrer');
        setTimeout(() => setShowExternalConfirmation(true), 1000);
      } catch (error) {
        console.error('Error getting token:', error);
        window.open(`/api/opportunities/${opportunityId}/register/external`, '_blank', 'noopener,noreferrer');
        setTimeout(() => setShowExternalConfirmation(true), 1000);
      }
    } else {
      await handleInternalRegistration();
    }
  };

  const [activePatternIndex, setActivePatternIndex] = useState(0);

  const handleExternalConfirmation = async (confirmed: boolean) => {
    setShowExternalConfirmation(false);
    if (!confirmed) return;

    try {
      setActionMessage('Confirming your registration...');
      const token = await getIdToken();
      if (!token) throw new Error('Authentication token not available.');

      const response = await fetch(`/api/opportunities/${opportunityId}/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'external_confirmed' }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to confirm registration.');
      }

      setActionMessage('Registration confirmed!');
      setIsRegistered(true);
      setRegisteredAt(new Date().toISOString());
    } catch (err) {
      console.error('External registration confirmation error:', err);
      setActionMessage((err as Error).message);
    }
  };

  const handleInternalRegistration = async () => {
    try {
      setActionMessage('Processing your registration...');
      const token = await getIdToken();
      if (!token) {
        throw new Error('Authentication token not available.');
      }
      const response = await fetch(`/api/opportunities/${opportunityId}/register`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Registration failed. Please try again.');
      }

      setActionMessage('You have been successfully registered for this opportunity!');
      setIsRegistered(true);
      setRegisteredAt(new Date().toISOString());
    } catch (err) {
      console.error('Internal registration error:', err);
      setActionMessage((err as Error).message);
    }
  };

  const handleTimelineAction = () => {
    if (!timelineCTA) {
      return;
    }
    if (!user) {
      setActionMessage('Please log in to follow timeline updates for this opportunity.');
      openAuthModal({
        mode: 'login',
        redirectUrl: detailPath,
      });
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
  const timelineEntries: OpportunityTimelineEvent[] = (() => {
    const rawEvents = (opportunity.timeline ?? []).map((item) => ({
      ...item,
      title: item.event,
      date: item.date ?? '',
    }));

    // Sort by date
    const sortedEvents = rawEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return (Number.isNaN(dateA) ? 0 : dateA) - (Number.isNaN(dateB) ? 0 : dateB);
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only, ignore time for "passed" check

    let hasSetNextActive = false;

    return sortedEvents.map((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      let status: OpportunityTimelineStatus = 'upcoming';

      if (Number.isNaN(eventDate.getTime())) {
        // Invalid date, keep as upcoming or original? Default upcoming.
        status = 'upcoming';
      } else if (eventDate.getTime() < now.getTime()) {
        status = 'completed';
      } else {
        // Future or Today
        if (!hasSetNextActive) {
          status = 'active';
          hasSetNextActive = true;
        } else {
          status = 'upcoming';
        }
      }

      return {
        ...event,
        status
      };
    });
  })();
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

  const relatedSignature = useMemo(
    () =>
      JSON.stringify({
        id: opportunity.id,
        slug: opportunity.slug,
        category: opportunity.category,
        categoryName: opportunity.categoryName,
        grade: opportunity.gradeEligibility,
        mode: opportunity.mode,
        deadline: opportunity.registrationDeadline ?? opportunity.endDate ?? '',
        segments: opportunity.segments ?? [],
        keywords: opportunity.searchKeywords ?? [],
        organizer: opportunity.organizerName || opportunity.organizer,
      }),
    [
      opportunity.id,
      opportunity.slug,
      opportunity.category,
      opportunity.categoryName,
      opportunity.gradeEligibility,
      opportunity.mode,
      opportunity.registrationDeadline,
      opportunity.endDate,
      opportunity.segments,
      opportunity.searchKeywords,
      opportunity.organizer,
      opportunity.organizerName,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    const loadRelatedOpportunities = async () => {
      setRelatedLoading(true);
      setRelatedError(null);
      try {
        const candidates = await collectCandidateOpportunities(opportunity);
        const ranked = rankCandidates(opportunity, candidates, 3);
        if (!cancelled) {
          setRelatedOpportunities(ranked);
        }
      } catch (error) {
        console.error('Failed to load related opportunities', error);
        if (!cancelled) {
          setRelatedError('We could not suggest similar opportunities at the moment.');
          setRelatedOpportunities([]);
        }
      } finally {
        if (!cancelled) {
          setRelatedLoading(false);
        }
      }
    };

    loadRelatedOpportunities();

    return () => {
      cancelled = true;
    };
  }, [opportunity, relatedSignature]);

  const organizerDisplayName = organizerLabel?.trim();

  const fetchOrganizerOpportunities = async () => {
    if (!organizerDisplayName) {
      return;
    }
    setOrganizerLoading(true);
    setOrganizerError(null);
    try {
      const response = await fetch(
        `/api/opportunities?search=${encodeURIComponent(organizerDisplayName)}&limit=20`,
      );
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        opportunities?: Opportunity[];
        items?: Opportunity[];
      };
      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to fetch organizer opportunities');
      }
      const list = payload.opportunities ?? payload.items ?? [];
      setOrganizerOpportunities(list.filter((item) => item.id !== opportunity.id));
      setOrganizerFetched(true);
    } catch (error) {
      console.error('Failed to load organizer opportunities', error);
      setOrganizerError(
        error instanceof Error ? error.message : 'Unable to load organizer details right now.',
      );
    } finally {
      setOrganizerLoading(false);
    }
  };

  const handleOrganizerProfileOpen = async () => {
    setOrganizerModalOpen(true);
    if (!organizerFetched) {
      await fetchOrganizerOpportunities();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-br from-accent/30 via-white to-accent/10 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 pb-32 md:pb-0">
        <OpportunityHero
          heroImage={heroImage}
          title={title}
          categoryLabel={categoryLabel}
          organizerLabel={organizerLabel}
          opportunity={opportunity}
          viewCount={viewCount}
          dateDisplay={dateDisplay}
          modeLabel={modeLabel}
        />

        {/* Mobile Quick Actions - Show only on mobile */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] mt-6 lg:hidden relative z-10">
          <Card className="p-4 bg-gradient-to-br from-accent/30 to-primary/10 dark:from-slate-800 dark:to-slate-900 border-accent dark:border-slate-700 relative">
            {/* Price */}
            <div className="mb-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Registration Fee</p>
              <p className="text-xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-300">{displayFee}</p>
            </div>

            {/* Countdown Timer */}
            {!registrationClosed && (
              <div className="mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 text-center flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Time Remaining
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-accent dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-primary">{countdown.days}</div>
                    <div className="text-[10px] md:text-xs text-slate-600 dark:text-slate-300">Days</div>
                  </div>
                  <div className="rounded-xl border border-accent dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-chart-2">{countdown.hours}</div>
                    <div className="text-[10px] md:text-xs text-slate-600 dark:text-slate-300">Hours</div>
                  </div>
                  <div className="rounded-xl border border-accent dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-chart-3">{countdown.minutes}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">Mins</div>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">Deadline: {formattedDeadline}</p>
              </div>
            )}

            {registrationClosed && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                Registrations are closed
              </div>
            )}

            {/* Register Button or Registered Status */}
            {isRegistered ? (
              <div className="mb-3 text-center">
                <div className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="h-5 w-5" />
                  Registered
                </div>
                {registeredAt && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Registered on {formatDate(registeredAt)}
                  </p>
                )}
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleRegisterClick}
                disabled={registrationClosed}
                className="w-full h-12 bg-gradient-to-r from-chart-1 to-chart-2 text-white text-base font-semibold hover:from-chart-2 hover:to-chart-3 disabled:opacity-60 disabled:cursor-not-allowed mb-3 relative z-10"
              >
                {registrationClosed ? 'Registration Closed' : 'Register Now'}
              </Button>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
                className="flex-1 border-slate-200 dark:border-slate-700"
              >
                <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current text-primary' : ''}`} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <ShareButton opportunityId={opportunityId} opportunityTitle={title} />
            </div>
          </Card>
        </div>


        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <OpportunityTabs
                opportunity={opportunity}
                timelineEntries={timelineEntries}
                formattedDeadline={formattedDeadline}
                displayFee={displayFee}
                formattedStartDate={formattedStartDate}
                resourceItems={resourceItems}
                onResourcePreview={handleResourcePreview}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Main Actions */}
              <Card className="p-6 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <div className="space-y-3">
                  {/* Price and Registration */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-300">Registration Fee</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{displayFee}</p>
                    </div>
                    <div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {modeLabel}
                      </Badge>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                      <Clock className="h-4 w-4 text-primary" />
                      Registration Status
                    </h3>
                    {registrationClosed ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                        Registrations are closed.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div className="text-3xl font-bold text-primary">{countdown.days}</div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Days</div>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div className="text-3xl font-bold text-primaryDark">{countdown.hours}</div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Hours</div>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div className="text-3xl font-bold text-primaryDarker">{countdown.minutes}</div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Mins</div>
                        </div>
                      </div>
                    )}
                    <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-300">Deadline: {formattedDeadline}</p>
                  </div>
                  {isRegistered ? (
                    <div className="space-y-2">
                      <div className="h-14 w-full flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-500/30">
                        <CheckCircle2 className="h-6 w-6" />
                        <span className="text-lg">Registered</span>
                      </div>
                      {registeredAt && (
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                          Registered on {formatDate(registeredAt)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="h-14 w-full bg-gradient-to-r from-primary to-primaryDark text-lg font-semibold text-foreground dark:text-white hover:from-primaryDark hover:to-primaryDarker disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleRegisterClick}
                      disabled={registrationClosed}
                    >
                      {registrationClosed ? 'Registrations Closed' : 'Register Now'}
                    </Button>
                  )}
                  {timelineCTA && (
                    <div className="space-y-1">
                      <Button
                        variant="outline"
                        className="w-full border-accent text-primary hover:bg-accent/20 disabled:opacity-50 dark:border-primary/40 dark:text-accent dark:hover:bg-primary/10"
                        onClick={handleTimelineAction}
                        disabled={!normalizedRegisterUrl}
                      >
                        {timelineCTA.label}
                      </Button>
                      <p className="text-center text-xs text-primary dark:text-accent/80">
                        {timelineCTA.event}
                      </p>
                      {!normalizedRegisterUrl && (
                        <p className="text-center text-[11px] text-primary/70 dark:text-accent/60">
                          No link available; contact the organizer for this update.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-border/50 dark:border-white/20 text-foreground dark:text-white hover:bg-white/90 dark:bg-slate-800/50 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleToggleBookmark}
                      disabled={bookmarkLoading}
                    >
                      <Bookmark
                        className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current text-primary' : ''}`}
                      />
                      {bookmarkLoading ? 'Saving...' : isBookmarked ? 'Saved' : 'Save'}
                    </Button>
                    <UpvoteButton opportunityId={opportunityId} />
                    <ShareButton opportunityId={opportunityId} opportunityTitle={title} />
                    <Button variant="outline" className="text-foreground border-border/50 dark:border-white/20 hover:bg-white/90 dark:bg-slate-800/50 shadow-sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {(bookmarkError || actionMessage) && (
                    <p
                      className={`text-center text-xs ${bookmarkError ? 'text-red-300' : 'text-accent'}`}
                    >
                      {bookmarkError ?? actionMessage}
                    </p>
                  )}
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-6 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-4 text-foreground dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
                  Quick Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <Trophy className="h-5 w-5 text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 dark:text-slate-300">Eligibility</p>
                      <p className="font-semibold text-foreground dark:text-white">{getEligibilityDisplay({
                        gradeEligibility: opportunity.gradeEligibility || '',
                        eligibilityType: opportunity.eligibilityType,
                        ageEligibility: opportunity.ageEligibility,
                        registrationDeadline: opportunity.registrationDeadline || ''
                      } as any)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <Calendar className="h-5 w-5 text-pink-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-500 dark:text-slate-300">Event Date</p>
                      <p className="font-semibold text-foreground dark:text-white">{formattedStartDate}</p>
                    </div>
                  </div>
                  {opportunity.state && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-300">Primary Location</p>
                        <p className="font-semibold text-foreground dark:text-white">{opportunity.state}</p>
                      </div>
                    </div>
                  )}
                  {/* Target Audience */}
                  {opportunity.targetAudience && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-300">Target Audience</p>
                        <p className="font-semibold text-foreground dark:text-white">{opportunity.targetAudience}</p>
                      </div>
                    </div>
                  )}


                  {/* Participation Type */}
                  {opportunity.participationType && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-500 dark:text-slate-300">Team</p>
                        <p className="font-semibold text-foreground dark:text-white">
                          {opportunity.participationType}
                          {opportunity.participationType === 'team' && opportunity.minTeamSize && opportunity.maxTeamSize && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              ({opportunity.minTeamSize}-{opportunity.maxTeamSize} members)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Organizer Info */}
              <Card className="p-6 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-4 text-foreground dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                  Organized By
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border border-border/50 dark:border-white/20">
                    <img
                      src={opportunity.organizerLogo || 'https://via.placeholder.com/96x96.png?text=Org'}
                      alt={opportunity.organizer || 'Organizer'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground dark:text-white text-lg mb-1">{organizerLabel}</p>
                    <Badge variant="outline" className="border-emerald-300 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-200">
                      Verified Organizer
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOrganizerProfileOpen}
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 shadow-sm"
                >
                  View Profile
                </Button>
              </Card>
            </div>
          </div >
        </div >
        <SimilarOpportunities
          relatedLoading={relatedLoading}
          relatedError={relatedError}
          relatedOpportunities={relatedOpportunities}
        />

        <section className="border-t border-slate-200 bg-white/[0.04] dark:border-slate-700">
          <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
            <h2 className="text-2xl font-bold text-foreground dark:text-white md:text-3xl">Community Discussion</h2>
            <p className="mt-2 text-sm text-muted-foreground dark:text-white/70 md:text-base">
              Join the conversation with other students interested in this opportunity.
            </p>
            <div className="mt-8">
              <CommentSection opportunityId={opportunityId} />
            </div>
          </div>
        </section>
      </main >

      <Dialog open={organizerModalOpen} onOpenChange={(open) => setOrganizerModalOpen(open)}>
        <DialogContent className="max-w-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/90">
          <DialogHeader>
            <DialogTitle>{organizerDisplayName || 'Organizer details'}</DialogTitle>
            <DialogDescription>
              Learn more about this organiser and browse the latest programmes they host on Myark.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                <img
                  src={opportunity.organizerLogo || 'https://via.placeholder.com/96x96.png?text=Org'}
                  alt={organizerDisplayName || 'Organizer'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-300">
                  Verified listing on Myark. Details are shared by the organiser.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Contact information
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Email:{' '}
                  <span className="font-medium text-foreground dark:text-white">
                    {contactInfo.email ?? 'Not provided'}
                  </span>
                </p>
                <p>
                  Phone:{' '}
                  <span className="font-medium text-foreground dark:text-white">
                    {contactInfo.phone ?? 'Not provided'}
                  </span>
                </p>
                <p>
                  Website:{' '}
                  {contactInfo.website ? (
                    <Link
                      href={normalizeUrl(contactInfo.website) ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-orange-600 hover:underline dark:text-orange-300"
                    >
                      {contactInfo.website}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground dark:text-white">Not provided</span>
                  )}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white">
                More opportunities from {organizerDisplayName || 'this organiser'}
              </h3>
              <div className="mt-3">
                {organizerLoading ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">Loading opportunities…</p>
                ) : organizerError ? (
                  <p className="text-sm text-red-600 dark:text-red-300">{organizerError}</p>
                ) : organizerOpportunities.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    No additional opportunities from this organiser are live right now.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {organizerOpportunities.map((item) => (
                      <Link
                        key={item.id}
                        href={`/opportunity/${item.slug || item.id}`}
                        className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/95 p-4 text-slate-700 shadow-sm transition hover:border-orange-400/50 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100"
                      >
                        <span className="line-clamp-2 font-semibold text-foreground dark:text-white">{item.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-300">
                          Grade: {item.gradeEligibility || 'All Grades'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-300">
                          Deadline: {formatDate(item.registrationDeadline)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(activeResource)} onOpenChange={(open) => (!open ? closeResourcePreview() : undefined)}>
        <DialogContent className="max-w-4xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900/90">
          {activeResource && (
            <>
              <DialogHeader>
                <DialogTitle>{activeResource.title}</DialogTitle>
                <DialogDescription>{activeResource.typeLabel}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {activeResource.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-300">{activeResource.description}</p>
                )}
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                  {renderResourcePreview(activeResource)}
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-white/90 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                    onClick={closeResourcePreview}
                  >
                    Close
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
                  >
                    <a href={activeResource.url} target="_blank" rel="noreferrer">
                      Open in new tab
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showExternalConfirmation} onOpenChange={setShowExternalConfirmation}>
        <DialogContent className="max-w-md border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Did you complete the registration?</DialogTitle>
            <DialogDescription>
              We noticed you visited the external registration page. Please confirm if you successfully registered so we can update your status.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => handleExternalConfirmation(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              No, not yet
            </Button>
            <Button
              onClick={() => handleExternalConfirmation(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
            >
              Yes, I registered
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MobileFloatingCTA
        opportunity={opportunity}
        deadline={formattedDeadline}
        fee={displayFee}
        registrationClosed={registrationClosed}
        onRegisterClick={handleRegisterClick}
        onBookmarkClick={handleToggleBookmark}
        isBookmarked={isBookmarked}
        bookmarkLoading={bookmarkLoading}
        isRegistered={isRegistered}
        registeredAt={registeredAt}
      />

      <Footer />
    </div >
  );
}



