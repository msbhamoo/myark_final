export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
