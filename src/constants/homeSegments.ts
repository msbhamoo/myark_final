export interface HomeSegmentDefinition {
  id: string;
  title: string;
  subtitle?: string;
  segmentKey: string;
  limit: number;
  order: number;
  highlight?: boolean;
}

export const FALLBACK_HOME_SEGMENTS: HomeSegmentDefinition[] = [
  {
    id: 'featured-default',
    title: 'Featured Opportunities',
    subtitle: 'Curated picks from leading organizations',
    segmentKey: 'featured',
    limit: 8,
    order: 0,
    highlight: true,
  },
  {
    id: 'trending-default',
    title: 'Trending Competitions',
    subtitle: 'What students are exploring right now',
    segmentKey: 'trending',
    limit: 8,
    order: 1,
  },
  {
    id: 'scholarships-default',
    title: 'Scholarships to Watch',
    subtitle: 'Financial aid programs worth exploring',
    segmentKey: 'scholarships',
    limit: 8,
    order: 2,
  },
];
