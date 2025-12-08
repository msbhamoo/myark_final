export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XR6CQ3CKJZ';

// https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// https://developers.google.com/analytics/devguides/collection/ga4/events?client_type=gtag
export const event = ({
    action,
    category,
    label,
    value,
    ...rest
}: {
    action: string;
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
            ...rest,
        });
    }
};

// ============================================
// Custom Event Tracking Helpers
// ============================================

/**
 * Track when a user views an opportunity
 */
export const trackOpportunityView = (opportunityId: string, title: string, category?: string) => {
    event({
        action: 'view_opportunity',
        category: 'engagement',
        label: title,
        opportunity_id: opportunityId,
        opportunity_category: category,
    });
};

/**
 * Track when a user clicks Apply/Register button
 */
export const trackApplyClick = (opportunityId: string, title: string, source: 'detail_page' | 'card' | 'deadline_section') => {
    event({
        action: 'apply_click',
        category: 'conversion',
        label: title,
        opportunity_id: opportunityId,
        click_source: source,
    });
};

/**
 * Track search queries
 */
export const trackSearch = (query: string, resultsCount: number) => {
    event({
        action: 'search',
        category: 'engagement',
        label: query,
        search_term: query,
        results_count: resultsCount,
    });
};

/**
 * Track filter usage
 */
export const trackFilterUsage = (filterType: 'category' | 'segment' | 'grade' | 'mode', filterValue: string) => {
    event({
        action: 'filter_applied',
        category: 'engagement',
        label: `${filterType}: ${filterValue}`,
        filter_type: filterType,
        filter_value: filterValue,
    });
};

/**
 * Track registration for quizzes
 */
export const trackQuizRegistration = (quizId: string, quizTitle: string) => {
    event({
        action: 'quiz_registration',
        category: 'conversion',
        label: quizTitle,
        quiz_id: quizId,
    });
};

/**
 * Track blog post views
 */
export const trackBlogView = (postId: string, title: string, tags?: string[]) => {
    event({
        action: 'view_blog',
        category: 'engagement',
        label: title,
        post_id: postId,
        post_tags: tags?.join(','),
    });
};

/**
 * Track share actions
 */
export const trackShare = (contentType: 'opportunity' | 'blog' | 'quiz', contentId: string, platform: string) => {
    event({
        action: 'share',
        category: 'engagement',
        label: `${contentType}_${contentId}`,
        content_type: contentType,
        share_platform: platform,
    });
};
