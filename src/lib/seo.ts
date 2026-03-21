import { Opportunity, FAQ } from './types';
import { SITE_NAME, SITE_URL, CURRENT_YEAR } from './constants';

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
