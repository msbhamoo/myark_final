import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import type { Opportunity, OpportunityResource, OpportunityTimelineEvent, OpportunityTimelineStatus } from '@/types/opportunity';

export const formatDate = (value?: string | null, fallback = 'TBA') => {
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

export const calculateCountdown = (deadline?: string) => {
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

export const formatFee = (opportunity: Opportunity) => {
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

export const normalizeModeLabel = (mode?: Opportunity['mode']) => {
    if (mode === 'online') return 'Online';
    if (mode === 'offline') return 'Offline';
    if (mode === 'hybrid') return 'Hybrid';
    return 'Online';
};

export const toTitleCase = (value: string) => {
    return value
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
        .join(' ');
};

export const normalizeText = (value?: string | null) => {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim().toLowerCase();
};

export const getOpportunityIdentity = (opportunity: Opportunity) =>
    normalizeText(opportunity.slug) || normalizeText(opportunity.id);

export const normalizeMode = (mode?: Opportunity['mode']): Opportunity['mode'] => {
    if (mode === 'offline' || mode === 'hybrid') {
        return mode;
    }
    return 'online';
};

export const toTokenSet = (inputs: Array<string | undefined | null>): Set<string> => {
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

export const extractGradeTokens = (value?: string) => {
    const tokens = toTokenSet([value]);
    if (!value) {
        return tokens;
    }
    const numericMatches = value.match(/\d+/g);
    numericMatches?.forEach((match) => tokens.add(match));
    return tokens;
};

export const intersectionSize = (a: Set<string>, b: Set<string>) => {
    let count = 0;
    a.forEach((item) => {
        if (b.has(item)) {
            count += 1;
        }
    });
    return count;
};

export const parseDateSafe = (value?: string | null) => {
    if (!value) {
        return null;
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const computeSimilarityScore = (target: Opportunity, candidate: Opportunity) => {
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

export const rankCandidates = (target: Opportunity, candidates: Opportunity[], limit = 3) => {
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

export const buildQueryUrl = (params: Record<string, string | number | undefined>) => {
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

export const collectCandidateOpportunities = async (opportunity: Opportunity) => {
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

export const normalizeUrl = (value?: string | null): string | null => {
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

export const extractUrlFromText = (value?: string): string | null => {
    if (!value) {
        return null;
    }
    const match = value.match(/https?:\/\/[^\s)]+/i);
    if (!match) {
        return null;
    }
    return match[0].replace(/[.,]$/, '');
};

export type TimelineCallToAction = {
    label: string;
    event: string;
    status: OpportunityTimelineStatus;
};

export type ResourceDisplayItem = OpportunityResource & {
    type: 'pdf' | 'video' | 'link';
    typeLabel: string;
    Icon: typeof FileText;
    url: string;
};

export const CTA_KEYWORDS: Array<{ pattern: RegExp; label: string }> = [
    { pattern: /admit card/i, label: 'Download admit card' },
    { pattern: /hall ticket/i, label: 'Download hall ticket' },
    { pattern: /answer key/i, label: 'View answer key' },
    { pattern: /result/i, label: 'View results' },
    { pattern: /interview/i, label: 'View interview details' },
];

export const deriveTimelineCta = (timeline?: OpportunityTimelineEvent[]): TimelineCallToAction | null => {
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
