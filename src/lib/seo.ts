import { Opportunity, FAQ } from './types';
import { SITE_NAME, SITE_URL, CURRENT_YEAR } from './constants';
import { formatClassRange } from './utils';

// ── Meta Description Generator ──────────────────────────────────────
export function generateMetaDescription(opp: Opportunity): string {
  const orgName = opp.organiser?.name || 'leading organiser';
  const eligibility = opp.eligibility_text || 'K-12 students';
  const hook = opp.deadline
    ? `Apply before the deadline.`
    : `Open registration.`;
  const desc = `${opp.title} by ${orgName}. Open to ${eligibility}. ${hook}`;
  return desc.length > 155 ? desc.slice(0, 152) + '...' : desc;
}

// ── Page Title Generators ───────────────────────────────────────────
export function opportunityPageTitle(name: string): string {
  return `${name} ${CURRENT_YEAR} — Eligibility, Dates & How to Apply | ${SITE_NAME}`;
}

export function categoryPageTitle(categoryLabel: string): string {
  return `K-12 ${categoryLabel} Opportunities in India ${CURRENT_YEAR} — ${SITE_NAME}`;
}

export function classPageTitle(classLabel: string): string {
  return `Competitions & Scholarships for ${classLabel} Students India ${CURRENT_YEAR} | ${SITE_NAME}`;
}

// ── OG + Full Metadata for Opportunity Detail ───────────────────────
export function generateOpportunityMetadata(opp: Opportunity) {
  const title = opportunityPageTitle(opp.title);
  const description = generateMetaDescription(opp);
  const url = `${SITE_URL}/opportunities/${opp.slug}`;
  const classRange = formatClassRange(opp.eligibility_classes);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${opp.title} — ${classRange} | ${SITE_NAME}`,
      description,
      url,
      type: 'article' as const,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${opp.title} — ${classRange} | ${SITE_NAME}`,
      description,
    },
  };
}

// ── OG + Full Metadata for Olympiad Detail ──────────────────────────
export function generateOlympiadMetadata(name: string, slug: string, shortDesc?: string) {
  const title = `${name} ${CURRENT_YEAR} — Eligibility, Registration, Dates & How to Apply | ${SITE_NAME}`;
  const description = shortDesc
    ? (shortDesc.length > 155 ? shortDesc.slice(0, 152) + '...' : shortDesc)
    : `Complete guide to ${name}. Learn about eligibility, registration process, important dates, and preparation tips for school students.`;
  const url = `${SITE_URL}/olympiads/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${name} — Complete Guide for Students | ${SITE_NAME}`,
      description,
      url,
      type: 'article' as const,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${name} | ${SITE_NAME}`,
      description,
    },
  };
}

// ── JSON-LD: Event Schema ───────────────────────────────────────────
export function generateEventJsonLd(opp: Opportunity) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: opp.title,
    description: opp.description?.slice(0, 300),
    startDate: opp.registration_opens || undefined,
    endDate: opp.deadline || undefined,
    url: `${SITE_URL}/opportunities/${opp.slug}`,
    organizer: opp.organiser
      ? {
          '@type': 'Organization',
          name: opp.organiser.name,
          url: opp.organiser.website_url || undefined,
        }
      : undefined,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${SITE_URL}/opportunities/${opp.slug}`,
    },
    offers: opp.fee_text?.toLowerCase().includes('free')
      ? {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/opportunities/${opp.slug}`,
        }
      : undefined,
  };
}

// ── JSON-LD: FAQPage Schema ─────────────────────────────────────────
export function generateFaqJsonLd(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ── JSON-LD: BreadcrumbList Schema ──────────────────────────────────
export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`,
    })),
  };
}

