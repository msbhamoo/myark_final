import type { Metadata } from 'next';
import Script from 'next/script';
import { getOpportunityByIdOrSlug } from '@/lib/opportunityService';
import type { Opportunity } from '@/types/opportunity';
import OpportunityDetail from './OpportunityDetail';

const SITE_HOST = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myark.in';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80';

const normalizeLabel = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const cleaned = value.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return undefined;
  }
  return cleaned
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ');
};

const toIsoDate = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const formatDateForDescription = (value?: string) => {
  if (!value) {
    return undefined;
  }
  try {
    const formatter = new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' });
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : formatter.format(parsed);
  } catch {
    return undefined;
  }
};

const sanitizeText = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const buildMetaDescription = (opportunity: Opportunity) => {
  const organizer = opportunity.organizerName || opportunity.organizer;
  const category = normalizeLabel(opportunity.categoryName || opportunity.category) ?? 'student program';
  const grade = opportunity.gradeEligibility ? opportunity.gradeEligibility.trim() : '';
  const deadline = formatDateForDescription(opportunity.registrationDeadline);
  const fragments = [
    `${opportunity.title} by ${organizer || 'leading organizers'} on Myark.`,
    `Discover this ${category.toLowerCase()} for students across India${grade ? `, ideal for ${grade.toLowerCase()} learners` : ''}.`,
    deadline ? `Applications close on ${deadline}.` : '',
    'Compare eligibility, benefits, and how to apply today.',
  ]
    .map((fragment) => fragment.trim())
    .filter(Boolean);

  const description = fragments.join(' ');
  return description.length > 320 ? `${description.slice(0, 317)}...` : description;
};

const collectKeywords = (opportunity: Opportunity) => {
  const keywordSet = new Set<string>();

  const push = (keyword?: string) => {
    const trimmed = keyword?.trim();
    if (trimmed) {
      keywordSet.add(trimmed);
    }
  };

  push(opportunity.title);
  push(opportunity.organizerName || opportunity.organizer);
  push(`${opportunity.title} scholarship`);
  push(`${opportunity.title} exam`);
  push(`${opportunity.title} application`);
  push(`${opportunity.category ?? ''} opportunities in India`);
  push(`${opportunity.category ?? ''} for students`);
  push(opportunity.gradeEligibility ? `${opportunity.gradeEligibility} students` : '');
  (opportunity.segments ?? []).forEach((segment) => push(`${segment} opportunities`));
  (opportunity.searchKeywords ?? []).forEach((keyword) => push(keyword));
  [
    'scholarships in india',
    'student competitions india',
    'olympiads for students',
    'school entrance exams india',
    'student workshops india',
    'myark opportunities',
  ].forEach((keyword) => push(keyword));

  return Array.from(keywordSet);
};

const resolveCanonicalUrl = (opportunity: Opportunity, idParam: string) => {
  const identifier = opportunity.slug || opportunity.id || idParam;
  const detailPath = `/opportunity/${identifier}`;
  try {
    return new URL(detailPath, SITE_HOST).toString();
  } catch {
    return `${SITE_HOST.replace(/\/$/, '')}${detailPath}`;
  }
};

const eventStatusMap: Record<string, string> = {
  completed: 'https://schema.org/EventCompleted',
  active: 'https://schema.org/EventScheduled',
  upcoming: 'https://schema.org/EventScheduled',
  closed: 'https://schema.org/EventCancelled',
};

const attendanceModeMap: Record<string, string> = {
  online: 'https://schema.org/OnlineEventAttendanceMode',
  offline: 'https://schema.org/OfflineEventAttendanceMode',
  hybrid: 'https://schema.org/MixedEventAttendanceMode',
};

const buildStructuredData = (opportunity: Opportunity, canonicalUrl: string) => {
  const attendanceMode =
    attendanceModeMap[opportunity.mode] ?? 'https://schema.org/OnlineEventAttendanceMode';
  const eventStatus =
    eventStatusMap[(opportunity.status ?? '').toLowerCase()] ??
    'https://schema.org/EventScheduled';
  const image = opportunity.image || FALLBACK_IMAGE;
  const organizerName = opportunity.organizerName || opportunity.organizer || 'Myark Partner';
  const organizerUrl = (() => {
    const website = opportunity.contactInfo?.website?.trim();
    if (website) {
      const normalized = website.match(/^https?:\/\//i) ? website : `https://${website}`;
      return normalized;
    }
    const email = opportunity.contactInfo?.email?.trim();
    if (email) {
      return `mailto:${email}`;
    }
    const phone = opportunity.contactInfo?.phone?.trim();
    if (phone) {
      return `tel:${phone.replace(/\s+/g, '')}`;
    }
    return undefined;
  })();

  const trimmedFee = opportunity.fee?.trim() ?? '';
  const priceValue = trimmedFee ? Number(trimmedFee) : Number.NaN;
  const hasNumericPrice = Number.isFinite(priceValue) && priceValue >= 0;
  const priceCurrency = 'INR';

  const structuredTimeline: Array<{
    '@type': string;
    '@id': string;
    name: string | undefined;
    startDate: string;
    eventStatus: string;
  }> = (opportunity.timeline ?? [])
    .filter((item) => item?.event && item?.date)
    .map((item, index) => {
      const timelineDate = toIsoDate(item.date);
      return timelineDate
        ? {
          '@type': 'EducationEvent',
          '@id': `${canonicalUrl}#timeline-${index}`,
          name: sanitizeText(item.event),
          startDate: timelineDate,
          eventStatus:
            eventStatusMap[item.status?.toLowerCase() ?? ''] ??
            'https://schema.org/EventScheduled',
        }
        : null;
    })
    .filter((entry): entry is Exclude<typeof structuredTimeline[number], null> => Boolean(entry));

  const audienceDescription = opportunity.gradeEligibility
    ? `Students in ${opportunity.gradeEligibility}`
    : 'Students in India';

  // Determine specific schema type based on category
  let schemaType = 'EducationEvent';
  const categoryLower = (opportunity.category || '').toLowerCase();
  if (categoryLower.includes('scholarship')) {
    schemaType = 'Scholarship'; // Note: Scholarship is often modeled as FinancialProduct or similar, but EducationEvent is safer for generic events. 
    // However, Google recommends 'Event' for deadlines. 
    // For actual scholarships, 'FinancialProduct' or 'Grant' might be used, but 'EducationEvent' covers the *application* period well.
    // Let's stick to EducationEvent but add specific keywords.
  } else if (categoryLower.includes('competition') || categoryLower.includes('contest') || categoryLower.includes('olympiad')) {
    schemaType = 'EducationEvent'; // Competitions are events.
  }

  // FAQ Schema Generation
  const faqs = [
    {
      question: `What is the deadline for ${opportunity.title}?`,
      answer: opportunity.registrationDeadline
        ? `The registration deadline for ${opportunity.title} is ${formatDateForDescription(opportunity.registrationDeadline)}.`
        : `The deadline for ${opportunity.title} has not been specified yet. Please check the official website for updates.`
    },
    {
      question: `Who is eligible for ${opportunity.title}?`,
      answer: opportunity.gradeEligibility
        ? `${opportunity.title} is open to ${opportunity.gradeEligibility}.`
        : `Eligibility criteria for ${opportunity.title} are detailed in the official guidelines.`
    },
    {
      question: `Is there a fee to apply for ${opportunity.title}?`,
      answer: hasNumericPrice && priceValue > 0
        ? `Yes, the application fee is ₹${priceValue}.`
        : `The application for ${opportunity.title} is free or the fee details are not listed.`
    },
    {
      question: `How can I apply for ${opportunity.title}?`,
      answer: `You can apply for ${opportunity.title} through the Myark platform or the official organizer's website. Click the 'Register Now' button to proceed.`
    }
  ];

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const mainEntity = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: opportunity.title,
    description:
      sanitizeText(opportunity.description) ||
      `Learn more about ${opportunity.title}, an opportunity curated by Myark for learners in India.`,
    startDate: toIsoDate(opportunity.startDate),
    endDate: toIsoDate(opportunity.endDate),
    eventAttendanceMode: attendanceMode,
    eventStatus,
    image: [image],
    organizer: {
      '@type': 'Organization',
      name: organizerName,
      url: organizerUrl ? sanitizeText(organizerUrl) : undefined,
      logo: opportunity.organizerLogo ? {
        '@type': 'ImageObject',
        url: opportunity.organizerLogo
      } : undefined
    },
    location:
      opportunity.mode === 'offline'
        ? {
          '@type': 'Place',
          name: 'Across India',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN',
          },
        }
        : {
          '@type': 'VirtualLocation',
          url: canonicalUrl,
        },
    offers: [
      {
        '@type': 'Offer',
        url: canonicalUrl,
        price: hasNumericPrice ? priceValue.toFixed(2) : '0.00',
        priceCurrency,
        availabilityEnds:
          toIsoDate(opportunity.registrationDeadline) ?? toIsoDate(opportunity.endDate),
        category: 'https://schema.org/Registration',
        validFrom: toIsoDate(opportunity.startDate)
      },
    ],
    audience: {
      '@type': 'EducationalAudience',
      audienceType: audienceDescription,
      geographicArea: {
        '@type': 'AdministrativeArea',
        name: 'India',
      },
    },
    keywords: collectKeywords(opportunity).join(', '),
    subjectOf: structuredTimeline.length > 0 ? structuredTimeline : undefined,
    inLanguage: 'en-IN',
    performer: {
      '@type': 'Organization',
      name: organizerName
    }
  };

  return [mainEntity, faqSchema];
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  const opportunity = await getOpportunityByIdOrSlug(id);

  if (!opportunity) {
    return {
      title: 'Opportunity unavailable | Myark',
      description:
        'This opportunity is no longer available. Explore live scholarships, olympiads, and entrance exams curated for Indian students on Myark.',
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: new URL(`/opportunity/${id}`, SITE_HOST).toString(),
      },
    };
  }

  const categoryLabel =
    normalizeLabel(opportunity.categoryName || opportunity.category) ?? 'student opportunity';
  const title = `${opportunity.title} | ${categoryLabel} in India | Myark`;
  const description = buildMetaDescription(opportunity);
  const keywords = collectKeywords(opportunity);
  const canonicalUrl = resolveCanonicalUrl(opportunity, id);
  const image = opportunity.image || FALLBACK_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      siteName: 'Myark',
      locale: 'en_IN',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${opportunity.title} – ${categoryLabel}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    other: {
      'geo.region': 'IN',
    },
  };
}

export default async function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Array.isArray(idParam) ? idParam[0] : idParam ?? '';
  const opportunity = await getOpportunityByIdOrSlug(id);

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-[#071045] flex items-center justify-center px-4">
          <div className="max-w-xl bg-card/70 dark:bg-white/10 border-border/50 dark:border-white/20 text-foreground dark:text-white p-10 text-center space-y-6">
            <div className="text-3xl font-semibold">Opportunity unavailable</div>
            <p className="text-white/80">We couldn&apos;t find details for this opportunity.</p>
          </div>
        </main>
      </div>
    );
  }

  const canonicalUrl = resolveCanonicalUrl(opportunity, id);
  const structuredData = buildStructuredData(opportunity, canonicalUrl);

  return (
    <>
      <Script id={`opportunity-${opportunity.id}-schema`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(structuredData)}
      </Script>
      <OpportunityDetail opportunity={opportunity} />
    </>
  );
}



