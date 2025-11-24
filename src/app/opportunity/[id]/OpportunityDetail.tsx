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
import OpportunityCard from '@/components/OpportunityCard';
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
} from 'lucide-react';

const formatDate = (value?: string | null, fallback = 'TBA') => {
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

const normalizeText = (value?: string | null) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase();
};

const getOpportunityIdentity = (opportunity: Opportunity) =>
  normalizeText(opportunity.slug) || normalizeText(opportunity.id);

const normalizeMode = (mode?: Opportunity['mode']): Opportunity['mode'] => {
  if (mode === 'offline' || mode === 'hybrid') {
    return mode;
  }
  return 'online';
};

const toTokenSet = (inputs: Array<string | undefined | null>): Set<string> => {
  const tokens = new Set<string>();
  inputs.forEach((input) => {
    if (!input) {
      return;
    }
    input
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .map((token) => token.trim())
      .filter((token) => token.length > 1)
      .forEach((token) => tokens.add(token));
  });
  return tokens;
};

const extractGradeTokens = (value?: string) => {
  const tokens = toTokenSet([value]);
  if (!value) {
    return tokens;
  }
  const numericMatches = value.match(/\d+/g);
  numericMatches?.forEach((match) => tokens.add(match));
  return tokens;
};

const intersectionSize = (a: Set<string>, b: Set<string>) => {
  let count = 0;
  a.forEach((item) => {
    if (b.has(item)) {
      count += 1;
    }
  });
  return count;
};

const parseDateSafe = (value?: string | null) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const computeSimilarityScore = (target: Opportunity, candidate: Opportunity) => {
  let score = 0;

  const targetCategory = normalizeText(target.categoryName || target.category);
  const candidateCategory = normalizeText(candidate.categoryName || candidate.category);
  if (targetCategory && candidateCategory) {
    if (targetCategory === candidateCategory) {
      score += 45;
    } else if (candidateCategory.includes(targetCategory) || targetCategory.includes(candidateCategory)) {
      score += 25;
    }
  }

  const targetSegments = toTokenSet(target.segments ?? []);
  const candidateSegments = toTokenSet(candidate.segments ?? []);
  const sharedSegments = intersectionSize(targetSegments, candidateSegments);
  if (sharedSegments > 0) {
    score += sharedSegments * 18;
  }

  const targetKeywordTokens = toTokenSet(target.searchKeywords ?? []);
  const candidateKeywordTokens = toTokenSet(candidate.searchKeywords ?? []);
  const sharedKeywordCount = intersectionSize(targetKeywordTokens, candidateKeywordTokens);
  if (sharedKeywordCount > 0) {
    score += Math.min(sharedKeywordCount, 3) * 10;
  }

  const targetGrade = normalizeText(target.gradeEligibility);
  const candidateGrade = normalizeText(candidate.gradeEligibility);
  if (targetGrade && candidateGrade) {
    if (targetGrade === candidateGrade) {
      score += 24;
    } else if (targetGrade.includes(candidateGrade) || candidateGrade.includes(targetGrade)) {
      score += 14;
    } else {
      const targetGradeTokens = extractGradeTokens(target.gradeEligibility);
      const candidateGradeTokens = extractGradeTokens(candidate.gradeEligibility);
      const gradeOverlap = intersectionSize(targetGradeTokens, candidateGradeTokens);
      if (gradeOverlap > 0) {
        score += Math.min(gradeOverlap * 6, 18);
      }
    }
  }

  const titleOverlap = intersectionSize(
    toTokenSet([target.title]),
    toTokenSet([candidate.title]),
  );
  if (titleOverlap > 0) {
    score += Math.min(titleOverlap * 3, 12);
  }

  if (normalizeMode(candidate.mode) === normalizeMode(target.mode)) {
    score += 6;
  }

  const normalizedOrganizer = normalizeText(candidate.organizerName || candidate.organizer);
  const targetOrganizer = normalizeText(target.organizerName || target.organizer);
  if (normalizedOrganizer && targetOrganizer && normalizedOrganizer === targetOrganizer) {
    score += 10;
  }

  const candidateStatus = normalizeText(candidate.status);
  if (candidateStatus) {
    if (['approved', 'published', 'active', 'upcoming'].includes(candidateStatus)) {
      score += 8;
    }
    if (['closed', 'expired', 'archived'].includes(candidateStatus)) {
      score -= 12;
    }
  }

  const now = Date.now();
  const targetDeadline = parseDateSafe(target.registrationDeadline ?? target.endDate);
  const candidateDeadline = parseDateSafe(candidate.registrationDeadline ?? candidate.endDate);
  if (candidateDeadline) {
    if (candidateDeadline.getTime() >= now) {
      score += 10;
    } else if (candidateDeadline.getTime() >= now - 3 * 24 * 60 * 60 * 1000) {
      score += 4;
    } else {
      score -= 12;
    }
  }
  if (candidateDeadline && targetDeadline) {
    const diffDays = Math.abs(candidateDeadline.getTime() - targetDeadline.getTime()) / (1000 * 60 * 60 * 24);
    const closeness = Math.max(0, 12 - Math.min(12, diffDays));
    score += closeness;
  }

  if (candidate.image) {
    score += 2;
  }

  return score;
};

const rankCandidates = (target: Opportunity, candidates: Opportunity[], limit = 3) => {
  const identity = getOpportunityIdentity(target);
  const enriched = candidates
    .filter((candidate) => getOpportunityIdentity(candidate) !== identity)
    .map((candidate) => {
      const score = computeSimilarityScore(target, candidate);
      const deadline = parseDateSafe(candidate.registrationDeadline ?? candidate.endDate);
      const deadlineValue = deadline ? deadline.getTime() : Number.MAX_SAFE_INTEGER;
      const isExpired = Boolean(deadline && deadline.getTime() < Date.now() - 3 * 24 * 60 * 60 * 1000);
      return {
        candidate,
        score,
        deadlineValue,
        isExpired,
      };
    });

  enriched.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.deadlineValue - b.deadlineValue;
  });

  const shortlisted: Opportunity[] = [];

  enriched.forEach((entry) => {
    if (shortlisted.length >= limit) {
      return;
    }
    if (entry.score <= 0) {
      return;
    }
    if (entry.isExpired) {
      return;
    }
    shortlisted.push(entry.candidate);
  });

  if (shortlisted.length < limit) {
    enriched.forEach((entry) => {
      if (shortlisted.length >= limit) {
        return;
      }
      if (shortlisted.includes(entry.candidate)) {
        return;
      }
      if (entry.score <= 0) {
        return;
      }
      shortlisted.push(entry.candidate);
    });
  }

  if (shortlisted.length < limit) {
    enriched.forEach((entry) => {
      if (shortlisted.length >= limit) {
        return;
      }
      if (shortlisted.includes(entry.candidate)) {
        return;
      }
      shortlisted.push(entry.candidate);
    });
  }

  return shortlisted.slice(0, limit);
};

const buildQueryUrl = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value === 'number') {
      if (Number.isFinite(value)) {
        searchParams.set(key, String(Math.max(0, Math.floor(value))));
      }
      return;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    searchParams.set(key, trimmed);
  });
  return `/api/opportunities?${searchParams.toString()}`;
};

const collectCandidateOpportunities = async (opportunity: Opportunity) => {
  const queries = new Set<string>();
  const segments = (opportunity.segments ?? [])
    .map((segment) => segment?.trim())
    .filter((segment): segment is string => Boolean(segment))
    .slice(0, 3);

  segments.forEach((segment) => {
    queries.add(buildQueryUrl({ segment, limit: 30 }));
  });

  const categoryCandidates = [
    opportunity.category,
    opportunity.categoryName,
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  categoryCandidates.forEach((category) => {
    queries.add(buildQueryUrl({ category, limit: 30 }));
  });

  const keywordCandidates = (opportunity.searchKeywords ?? [])
    .map((keyword) => keyword?.trim())
    .filter((keyword): keyword is string => Boolean(keyword))
    .slice(0, 3);
  keywordCandidates.forEach((keyword) => {
    queries.add(buildQueryUrl({ search: keyword, limit: 24 }));
  });

  const gradeTokens = Array.from(extractGradeTokens(opportunity.gradeEligibility)).slice(0, 2);
  gradeTokens.forEach((token) => {
    queries.add(buildQueryUrl({ search: token, limit: 20 }));
  });

  queries.add(buildQueryUrl({ limit: 60 }));

  const settled = await Promise.allSettled(
    Array.from(queries).map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }
      const payload = (await response.json().catch(() => ({}))) as {
        opportunities?: Opportunity[];
        items?: Opportunity[];
      };
      return payload.opportunities ?? payload.items ?? [];
    }),
  );

  const seen = new Map<string, Opportunity>();
  settled.forEach((result) => {
    if (result.status !== 'fulfilled') {
      return;
    }
    result.value.forEach((item) => {
      const identity = getOpportunityIdentity(item);
      if (!identity || identity === getOpportunityIdentity(opportunity)) {
        return;
      }
      if (!seen.has(identity)) {
        seen.set(identity, item);
      }
    });
  });

  return Array.from(seen.values());
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

const renderCustomTabContent = (content: CustomTabContent) => {
  switch (content.type) {
    case 'rich-text':
      return (
        <div
          className="text-slate-600 dark:text-slate-100 leading-relaxed prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content.html }}
        />
      );
    case 'list':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.items.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:border-primary/20 transition-colors"
            >
              <div className="mt-1">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              </div>
              <span className="text-slate-600 dark:text-slate-100">{item}</span>
            </div>
          ))}
        </div>
      );
    case 'structured-data':
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
          <table className="w-full text-sm text-left min-w-[300px]">
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {Object.entries(content.schema).map(([key, value], index) => (
                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground dark:text-white w-1/3">{key}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'custom-json':
      return (
        <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-auto text-xs">
          {JSON.stringify(content.data, null, 2)}
        </pre>
      );
    default:
      return null;
  }
};

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

  // Track opportunity view for logged-in users
  useEffect(() => {
    const trackView = async () => {
      if (!user || !opportunityId) return;

      try {
        const token = await getIdToken();
        if (!token) return;

        await fetch(`/api/opportunities/${opportunityId}/track-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
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
        {/* Cover Image Section */}
        <div className="relative w-full bg-slate-100 dark:bg-slate-800">
          <div className="container mx-auto px-0 md:px-6 lg:px-8 xl:px-16 max-w-[1920px]">
            <div className="relative w-full aspect-[21/9] md:aspect-[21/7] lg:rounded-2xl overflow-hidden">
              <img
                src={heroImage}
                alt={title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Primary Information Card */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px] -mt-8 md:-mt-12 relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-8">
            <div className="flex flex-col gap-4">
              {/* Category Badge */}
              <div>
                <Badge className="border border-accent bg-accent/50 text-accent-foreground dark:border-primary/20 dark:bg-primary/10 dark:text-accent text-xs font-semibold">
                  {categoryLabel}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-white leading-tight">
                {title}
              </h1>

              {/* Organizer and Meta Info */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <img
                      src={opportunity.organizerLogo || 'https://via.placeholder.com/96x96.png?text=Org'}
                      alt={organizerLabel}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Organized by</p>
                    <p className="font-semibold text-foreground dark:text-white">{organizerLabel}</p>
                  </div>
                </div>
              </div>

              {/* Tags and Info Pills */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                  <Calendar className="h-4 w-4 text-pink-500 dark:text-pink-300" />
                  <span className="text-slate-700 dark:text-slate-200">{dateDisplay}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                  <Globe className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                  <span className="text-slate-700 dark:text-slate-200">{modeLabel}</span>
                </div>
                {opportunity.state && (
                  <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                    <span className="text-slate-700 dark:text-slate-200">{opportunity.state}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-sm">
                  <Clock className="h-4 w-4 text-primary dark:text-accent" />
                  <span className="text-slate-700 dark:text-slate-200">Updated: {formatDate((opportunity as any).updatedAt || (opportunity as any).createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              {(() => {
                // Determine which tabs have content
                const hasOverview = Boolean(opportunity.description?.trim()) || (opportunity.benefits && opportunity.benefits.length > 0);
                const hasEligibility = opportunity.eligibility && opportunity.eligibility.length > 0;
                const hasTimeline = timelineEntries && timelineEntries.length > 0;
                const hasRegistration = (opportunity.registrationProcess && opportunity.registrationProcess.length > 0) ||
                  Boolean(contactInfo.email || contactInfo.phone || contactInfo.website);
                const hasExamPattern = (() => {
                  // Check new exam patterns array
                  if (opportunity.examPatterns && opportunity.examPatterns.length > 0) {
                    return opportunity.examPatterns.some(pattern =>
                      (pattern.totalQuestions && pattern.totalQuestions > 0) ||
                      (pattern.sections && pattern.sections.length > 0)
                    );
                  }
                  // Check legacy exam pattern
                  if (examPattern.totalQuestions && examPattern.totalQuestions > 0) {
                    return true;
                  }
                  if (examSections && examSections.length > 0) {
                    return true;
                  }
                  return false;
                })();
                const hasResources = resourceItems.length > 0;

                // Build custom tabs
                const customTabs: TabItem[] = (opportunity.customTabs || [])
                  .sort((a, b) => a.order - b.order)
                  .map((tab) => ({
                    value: tab.id,
                    label: tab.label,
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          {tab.label}
                        </h2>
                        {renderCustomTabContent(tab.content)}
                      </Card>
                    ),
                  }));

                // Build full tabs array
                const allTabs: TabItem[] = [
                  {
                    value: 'overview',
                    label: 'Overview',
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-lg md:text-2xl font-bold mb-4 text-foreground dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                              About This Opportunity
                            </h2>
                            <div
                              className="text-slate-600 dark:text-slate-100 leading-relaxed prose dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: opportunity.description || 'Detailed description will be available soon.' }}
                            />
                          </div>

                          <Separator className="bg-white/80 dark:bg-slate-800/70" />

                          <div>
                            <h3 className="text-base md:text-xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-chart-2 animate-pulse"></span>
                              Key Benefits
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {(opportunity.benefits ?? []).map((benefit, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:border-primary/20 transition-colors"
                                >
                                  <div className="mt-1">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                      <CheckCircle2 className="h-4 w-4 text-primary" />
                                    </div>
                                  </div>
                                  <span className="text-slate-600 dark:text-slate-100">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ),
                  },
                  {
                    value: 'eligibility',
                    label: 'Eligibility',
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          Eligibility Criteria
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(opportunity.eligibility ?? []).map((criterion, index) => (
                            <div
                              key={index}
                              className="group flex items-start gap-3 p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/20 transition-all duration-300"
                            >
                              <div className="mt-1">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <AlertCircle className="h-5 w-5 text-primary" />
                                </div>
                              </div>
                              <span className="text-slate-600 dark:text-slate-100 leading-relaxed">{criterion}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ),
                  },
                  {
                    value: 'timeline',
                    label: 'Timeline',
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg md:text-2xl font-bold mb-8 text-foreground dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primaryDark animate-pulse"></span>
                          Important Timeline
                        </h2>
                        <div className="relative pl-4 md:pl-8 space-y-0">
                          {/* Continuous Vertical Line */}
                          <div className="absolute left-[27px] md:left-[43px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

                          {timelineEntries.map((item, index) => {
                            const isLast = index === timelineEntries.length - 1;
                            const isFirst = index === 0;

                            // Determine icon and color based on event content and status
                            let Icon = Calendar;
                            let colorClass = "text-slate-500 dark:text-slate-400";
                            let bgClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                            let iconBgClass = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";

                            const lowerEvent = item.event.toLowerCase();
                            if (lowerEvent.includes('registration')) {
                              Icon = PenTool;
                              if (item.status === 'active') {
                                colorClass = "text-blue-500 dark:text-blue-400";
                                bgClass = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
                                iconBgClass = "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700";
                              }
                            } else if (lowerEvent.includes('admit card') || lowerEvent.includes('hall ticket')) {
                              Icon = Download;
                              if (item.status === 'active') {
                                colorClass = "text-purple-500 dark:text-purple-400";
                                bgClass = "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
                                iconBgClass = "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-700";
                              }
                            } else if (lowerEvent.includes('exam') || lowerEvent.includes('test')) {
                              Icon = FileText;
                              if (item.status === 'active') {
                                colorClass = "text-primary dark:text-accent";
                                bgClass = "bg-accent/30 dark:bg-primary/20 border-accent dark:border-primary/40";
                                iconBgClass = "bg-accent dark:bg-primary/40 border-accent dark:border-primary/70";
                              }
                            } else if (lowerEvent.includes('result') || lowerEvent.includes('announcement')) {
                              Icon = Trophy;
                              if (item.status === 'active' || item.status === 'completed') {
                                colorClass = "text-emerald-500 dark:text-emerald-400";
                                bgClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
                                iconBgClass = "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700";
                              }
                            }

                            // Override for active status generic
                            if (item.status === 'active' && bgClass.includes('slate')) {
                              colorClass = "text-primaryDark dark:text-accent";
                              bgClass = "bg-accent/30 dark:bg-primaryDark/20 border-accent dark:border-primaryDark/40";
                              iconBgClass = "bg-accent dark:bg-primaryDark/40 border-accent dark:border-primaryDark/70";
                            }

                            // Override for completed status generic
                            if (item.status === 'completed' && !lowerEvent.includes('result')) {
                              colorClass = "text-slate-400 dark:text-slate-500";
                              bgClass = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-80";
                              iconBgClass = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                              Icon = CheckCircle2;
                            }


                            return (
                              <div key={index} className="relative flex gap-6 md:gap-8 group pb-8 last:pb-0">
                                {/* Timeline Node */}
                                <div className="relative z-10 flex-shrink-0">
                                  <div className={`h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 ${iconBgClass} ${item.status === 'active' ? 'scale-110 ring-4 ring-white dark:ring-slate-900' : ''}`}>
                                    <Icon className={`h-3 w-3 md:h-4 md:w-4 ${colorClass}`} />
                                  </div>
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 rounded-xl border p-4 md:p-5 transition-all duration-300 hover:shadow-md ${bgClass} ${item.status === 'active' ? 'shadow-md transform translate-x-1' : ''}`}>
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <h3 className={`font-bold text-sm md:text-lg ${item.status === 'completed' ? 'text-slate-500 dark:text-slate-400 line-through decoration-slate-400' : 'text-foreground dark:text-white'}`}>
                                      {item.event}
                                    </h3>
                                    {item.status === 'active' && (
                                      <Badge className="w-fit bg-gradient-to-r from-primary to-primaryDark border-0 text-white text-xs px-2 py-0.5 shadow-sm animate-pulse">
                                        Live Now
                                      </Badge>
                                    )}
                                    {item.status === 'upcoming' && (
                                      <Badge variant="outline" className="w-fit border-slate-300 text-slate-500 text-xs px-2 py-0.5">
                                        Upcoming
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] md:text-sm text-slate-600 dark:text-slate-300">
                                    <Clock className="h-4 w-4 opacity-70" />
                                    <span className="font-medium">{formatDate(item.date)}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    ),
                  },
                  {
                    value: 'registration',
                    label: 'Registration',
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                              How to Register
                            </h2>
                            <div className="space-y-4">
                              {(opportunity.registrationProcess ?? []).map((step, index) => (
                                <div key={index} className="group flex items-start gap-4 p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/20 transition-all duration-300">
                                  <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primaryDark/20 text-primary flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-slate-600 dark:text-slate-100">{step}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primaryDark animate-pulse"></span>
                              Contact Information
                            </h3>
                            <div className="space-y-4">
                              <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl group hover:border-pink-500/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Mail className="h-5 w-5 text-pink-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-300">Email</p>
                                    <p className="text-slate-700 dark:text-white">{contactInfo.email ?? 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl group hover:border-purple-500/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Phone className="h-5 w-5 text-purple-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-300">Phone</p>
                                    <p className="text-slate-700 dark:text-white">{contactInfo.phone ?? 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl group hover:border-blue-500/20 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Globe className="h-5 w-5 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-300">Website</p>
                                    <p className="text-slate-700 dark:text-white">{contactInfo.website ?? 'Not provided'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ),
                  },
                  {
                    value: 'exam-pattern',
                    label: 'Exam Pattern',
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg md:text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          Examination Pattern
                        </h2>

                        {(opportunity.examPatterns && opportunity.examPatterns.length > 0) ? (
                          <div className="space-y-6">
                            {/* Pattern Selection Tabs */}
                            {opportunity.examPatterns.length > 1 && (
                              <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                                {opportunity.examPatterns.map((pattern, index) => {
                                  let tabLabel = `Pattern ${index + 1}`;
                                  if (pattern.classSelection?.type === 'single') {
                                    tabLabel = `Class ${pattern.classSelection.selectedClasses[0]}`;
                                  } else if (pattern.classSelection?.type === 'multiple') {
                                    tabLabel = `Classes ${pattern.classSelection.selectedClasses.join(', ')}`;
                                  } else if (pattern.classSelection?.type === 'range') {
                                    tabLabel = `Classes ${pattern.classSelection.rangeStart}-${pattern.classSelection.rangeEnd}`;
                                  }

                                  return (
                                    <button
                                      key={index}
                                      onClick={() => setActivePatternIndex(index)}
                                      className={`
                                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                        ${activePatternIndex === index
                                          ? 'bg-primary text-white border-primary shadow-md'
                                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary/30 dark:hover:border-primary/70'
                                        }
                                      `}
                                    >
                                      {tabLabel}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Active Pattern Content */}
                            {(() => {
                              const pattern = opportunity.examPatterns[activePatternIndex] || opportunity.examPatterns[0];
                              const durationLabel = typeof pattern.durationMinutes === 'number'
                                ? `${Math.floor(pattern.durationMinutes / 60)}h ${pattern.durationMinutes % 60}m`
                                : 'Not specified';
                              const negativeMarkingLabel = pattern.negativeMarking
                                ? (typeof pattern.negativeMarksPerQuestion === 'number'
                                  ? `Yes (-${pattern.negativeMarksPerQuestion})`
                                  : 'Yes')
                                : 'No';

                              return (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                  {/* Key Stats Grid */}
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
                                    <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                          <BookOpen className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Questions</span>
                                      </div>
                                      <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{pattern.totalQuestions ?? '—'}</p>
                                    </div>

                                    <div className="p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primaryDark/10 flex items-center justify-center">
                                          <Timer className="h-4 w-4 text-primaryDark" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</span>
                                      </div>
                                      <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{durationLabel}</p>
                                    </div>

                                    <div className="col-span-2 md:col-span-1 p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl">
                                      <div className="flex items-center gap-3 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                          <AlertCircle className="h-4 w-4 text-red-500" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Neg. Marking</span>
                                      </div>
                                      <p className="text-xl md:text-2xl font-bold text-foreground dark:text-white">{negativeMarkingLabel}</p>
                                    </div>
                                  </div>

                                  {/* Section-wise Distribution */}
                                  <div>
                                    <h3 className="text-lg font-bold mb-4 text-foreground dark:text-white flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-primaryDark"></span>
                                      Section-wise Distribution
                                    </h3>

                                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                                      <table className="w-full text-sm text-left min-w-[300px]">
                                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                                          <tr>
                                            <th className="px-4 py-3">Section</th>
                                            <th className="px-4 py-3 text-center">Ques</th>
                                            <th className="px-4 py-3 text-center">Marks</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                          {(pattern.sections ?? []).map((section, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                              <td className="px-4 py-3 font-medium text-foreground dark:text-white">{section.name}</td>
                                              <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{section.questions ?? '-'}</td>
                                              <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{section.marks ?? '-'}</td>
                                            </tr>
                                          ))}
                                          {(!pattern.sections || pattern.sections.length === 0) && (
                                            <tr>
                                              <td colSpan={3} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 italic">
                                                No section details available
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          /* Legacy Single Pattern Fallback */
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                              <div className="group p-6 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/20 transition-all duration-300">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primaryDark/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-3xl font-bold text-foreground dark:text-white mb-1">{examPattern.totalQuestions ?? '—'}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-300">Total Questions</p>
                              </div>
                              <div className="group p-6 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-pink-500/20 transition-all duration-300">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primaryDark/20 to-primaryDarker/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <Timer className="h-6 w-6 text-primaryDark" />
                                </div>
                                <p className="text-3xl font-bold text-foreground dark:text-white mb-1">{durationLabel}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-300">Duration</p>
                              </div>
                              <div className="group p-6 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-red-500/20 transition-all duration-300">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                  <AlertCircle className="h-6 w-6 text-red-400" />
                                </div>
                                <p className="text-3xl font-bold text-foreground dark:text-white mb-1">{negativeMarkingLabel}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-300">Negative Marking</p>
                              </div>
                            </div>

                            <h3 className="text-xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primaryDark animate-pulse"></span>
                              Section-wise Distribution
                            </h3>
                            <div className="space-y-4">
                              {examSections.map((section, index) => (
                                <div
                                  key={index}
                                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/20 transition-all duration-300"
                                >
                                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primaryDark/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className="font-semibold text-foreground dark:text-white">{section.name}</span>
                                  </div>
                                  <div className="flex gap-6 text-sm">
                                    <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/50 shadow-sm border border-slate-200 dark:border-slate-700">
                                      <span className="text-slate-500 dark:text-slate-300">Questions: </span>
                                      <strong className="text-slate-700 dark:text-white">{section.questions ?? '-'}</strong>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/50 shadow-sm border border-slate-200 dark:border-slate-700">
                                      <span className="text-slate-500 dark:text-slate-300">Marks: </span>
                                      <strong className="text-slate-700 dark:text-white">{section.marks ?? '-'}</strong>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </Card>
                    ),
                  },
                  ...customTabs,
                  {
                    value: 'resources',
                    label: 'Resources',
                    content: (
                      <Card className="p-6 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-foreground dark:text-white">Resources</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-300">
                              Curated links, documents, and videos to help you prepare.
                            </p>
                          </div>
                          {resourceItems.length > 0 && (
                            <Badge
                              variant="outline"
                              className="border-accent bg-accent/50 text-[#1A2A33] dark:border-primary/40 dark:bg-primary/10 dark:text-accent"
                            >
                              {resourceItems.length} resource{resourceItems.length === 1 ? '' : 's'}
                            </Badge>
                          )}
                        </div>

                        <Separator className="my-6 bg-white/80 dark:bg-slate-800/70" />

                        {resourceItems.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/50 shadow-sm p-6 text-center text-slate-600 dark:text-slate-100">
                            <p className="text-sm">
                              Organizers haven&apos;t shared supporting resources yet. Check back soon!
                            </p>
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {resourceItems.map((resource) => (
                              <div
                                key={resource.id}
                                className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/50 shadow-sm p-4 transition hover:border-primary/40 hover:bg-white dark:hover:bg-background/10 md:flex-row md:items-center md:justify-between"
                              >
                                <div className="flex flex-1 items-start gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                    <resource.Icon className="h-6 w-6" />
                                  </div>
                                  <div className="space-y-1">
                                    <Badge
                                      variant="outline"
                                      className="border-accent bg-accent/50 px-2.5 py-0.5 text-xs font-semibold text-[#1A2A33] dark:border-white/20 dark:bg-slate-800/70 dark:text-white"
                                    >
                                      {resource.typeLabel}
                                    </Badge>
                                    <p className="text-lg font-semibold text-foreground dark:text-white">{resource.title}</p>
                                    {resource.description && (
                                      <p className="text-sm text-slate-500 dark:text-slate-300">{resource.description}</p>
                                    )}
                                    <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                                      {resource.url}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 self-stretch md:self-auto">
                                  <Button
                                    variant="outline"
                                    className="border-accent text-primary hover:bg-accent/20 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                    onClick={() => handleResourcePreview(resource)}
                                  >
                                    Preview
                                  </Button>
                                  <Button
                                    asChild
                                    variant="outline"
                                    className="border-slate-200 text-slate-700 hover:bg-white/90 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                  >
                                    <a href={resource.url} target="_blank" rel="noreferrer">
                                      <Globe className="mr-2 h-4 w-4" />
                                      Open tab
                                    </a>
                                  </Button>
                                  {resource.type === 'pdf' && (
                                    <Button
                                      asChild
                                      variant="outline"
                                      className="border-slate-200 text-slate-700 hover:bg-white/90 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                    >
                                      <a href={resource.url} download rel="noreferrer">
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
                    ),
                  },
                  {
                    value: 'faq',
                    label: 'FAQ',
                    content: (
                      <Card className="p-8 bg-white/90 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold mb-6 text-foreground dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                          Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                          {[
                            {
                              q: `What is the deadline for ${title}?`,
                              a: formattedDeadline !== 'TBA'
                                ? `The registration deadline is ${formattedDeadline}. Make sure to apply before this date.`
                                : `The deadline has not been announced yet. Please keep checking for updates.`
                            },
                            {
                              q: `Who is eligible to apply?`,
                              a: opportunity.gradeEligibility
                                ? `This opportunity is open to ${opportunity.gradeEligibility}. Please check the eligibility section for more details.`
                                : `Eligibility details are available in the eligibility section.`
                            },
                            {
                              q: `Is there a registration fee?`,
                              a: displayFee === 'FREE'
                                ? `No, this opportunity is free to register.`
                                : `Yes, the registration fee is ${displayFee}.`
                            },
                            {
                              q: `How do I register?`,
                              a: `You can register by clicking the "Register Now" button on this page. If it's an external registration, you'll be redirected to the official website.`
                            },
                            {
                              q: `When does the event start?`,
                              a: formattedStartDate !== 'TBA'
                                ? `The event is scheduled to start on ${formattedStartDate}.`
                                : `The start date has not been announced yet.`
                            }
                          ].map((faq, index) => (
                            <div key={index} className="p-4 rounded-xl bg-white/85 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                              <h3 className="font-semibold text-foreground dark:text-white flex items-start gap-2 mb-2">
                                <HelpCircle className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                                {faq.q}
                              </h3>
                              <p className="text-slate-600 dark:text-slate-300 pl-7">
                                {faq.a}
                              </p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ),
                  },
                ];

                // Filter tabs based on content availability
                const visibleTabs = allTabs.filter(tab => {
                  if (tab.value === 'overview') return hasOverview;
                  if (tab.value === 'eligibility') return hasEligibility;
                  if (tab.value === 'timeline') return hasTimeline;
                  if (tab.value === 'registration') return hasRegistration;
                  if (tab.value === 'exam-pattern') return hasExamPattern;
                  if (tab.value === 'resources') return hasResources;
                  if (tab.value === 'faq') return true; // FAQ is always visible
                  return true;
                });

                // Determine the default tab (first visible tab)
                const defaultTab = visibleTabs.length > 0 ? visibleTabs[0].value : 'overview';

                return (
                  <StickyTabBar
                    defaultValue={defaultTab}
                    tabs={visibleTabs}
                  />
                );
              })()}
            </div>

            {/* Sidebar - Sticky on Desktop, Hidden on Mobile */}
            <div className="hidden lg:block lg:sticky lg:top-[140px] lg:self-start space-y-6">
              {/* Main Action Card */}
              <Card className="p-6 bg-gradient-to-br from-accent/30 to-primaryDark/10 border-slate-200 dark:border-slate-700 backdrop-blur-sm">
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

                {/* Main Actions */}
                <div className="space-y-3">
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
                      <p className="text-sm text-slate-500 dark:text-slate-300">Grade Eligibility</p>
                      <p className="font-semibold text-foreground dark:text-white">{opportunity.gradeEligibility || 'All Grades'}</p>
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
          </div>
        </div>
        <section className="border-t border-slate-200 bg-white/[0.04] dark:border-slate-700">
          <div className="container mx-auto max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
            <h2 className="text-2xl font-bold text-foreground dark:text-white md:text-3xl">Related opportunities picked for you</h2>
            <p className="mt-2 text-sm text-muted-foreground dark:text-white/70 md:text-base">
              Tailored suggestions that weigh category, grade fit, segments, and timeline recency from this listing.
            </p>
            {relatedLoading ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white/80 shadow-sm dark:border-slate-700 dark:bg-slate-800/50"
                  />
                ))}
              </div>
            ) : relatedError ? (
              <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200">
                {relatedError}
              </p>
            ) : relatedOpportunities.length === 0 ? (
              <div className="mt-6 rounded-xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                We are still gathering the closest matches. Explore the full listings to discover more programs right away.
                <div className="mt-4">
                  <Button asChild variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                    <Link href="/opportunities">Browse all opportunities</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedOpportunities.map((item) => {
                  const opportunityIdOrSlug = item.slug || item.id;
                  const category = item.categoryName || item.category || 'Opportunity';
                  const organizerName = item.organizerName || item.organizer || 'Organizer';
                  const deadline = item.registrationDeadline || item.endDate || '';
                  return (
                    <OpportunityCard
                      key={opportunityIdOrSlug}
                      id={opportunityIdOrSlug}
                      title={item.title}
                      category={category}
                      gradeEligibility={item.gradeEligibility || 'All Grades'}
                      organizer={organizerName}
                      registrationDeadline={deadline}
                      mode={normalizeMode(item.mode)}
                      fee={item.fee}
                      className="border-slate-200 bg-white/95 dark:border-slate-700 dark:bg-slate-800/50"
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

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



