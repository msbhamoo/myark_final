/**
 * Utility functions for blog features
 */

/**
 * Calculate estimated reading time for content
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
    // Strip HTML tags if present
    const textContent = content.replace(/<[^>]*>/g, '');
    // Count words
    const words = textContent.trim().split(/\s+/).filter(Boolean).length;
    // Calculate minutes (minimum 1 minute)
    return Math.max(1, Math.ceil(words / 200));
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
    return `${minutes} min read`;
}

/**
 * Extract headings from HTML content for Table of Contents
 */
export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
    const headingRegex = /<h([1-3])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/gi;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1], 10);
        const existingId = match[2];
        const text = match[3].replace(/<[^>]*>/g, '').trim();
        const id = existingId || `heading-${index}`;

        if (text) {
            headings.push({ id, text, level });
            index++;
        }
    }

    return headings;
}

/**
 * Add IDs to headings in HTML content for anchor links
 */
export function addHeadingIds(content: string): string {
    let index = 0;
    return content.replace(
        /<h([1-3])([^>]*)>(.*?)<\/h\1>/gi,
        (match, level, attrs, text) => {
            // Check if already has an id
            if (attrs.includes('id="')) {
                return match;
            }
            const id = `heading-${index++}`;
            return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
        }
    );
}
