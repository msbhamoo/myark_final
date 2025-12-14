import { CAREERS, Career, INTEREST_CHIPS } from '@/constants/careers';

/**
 * Search careers by query string
 * Matches against keywords, title, category, and descriptions
 */
export function searchCareers(query: string): Career[] {
    if (!query || query.trim().length < 2) {
        return CAREERS;
    }

    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

    const scoredCareers = CAREERS.map((career) => {
        let score = 0;

        searchTerms.forEach((term) => {
            // Title match (highest priority)
            if (career.title.toLowerCase().includes(term)) {
                score += 10;
            }

            // Category match
            if (career.category.toLowerCase().includes(term)) {
                score += 5;
            }

            // Keywords match
            career.keywords.forEach((keyword) => {
                if (keyword.includes(term) || term.includes(keyword)) {
                    score += 3;
                }
            });

            // Description match
            if (career.shortDescription.toLowerCase().includes(term)) {
                score += 2;
            }

            if (career.fullDescription.toLowerCase().includes(term)) {
                score += 1;
            }
        });

        return { career, score };
    });

    return scoredCareers
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ career }) => career);
}

/**
 * Get career by slug
 */
export function getCareerBySlug(slug: string): Career | undefined {
    return CAREERS.find((career) => career.slug === slug);
}

/**
 * Get careers by category
 */
export function getCareersByCategory(category: string): Career[] {
    return CAREERS.filter(
        (career) => career.category.toLowerCase() === category.toLowerCase()
    );
}

/**
 * Get related careers by slugs
 */
export function getRelatedCareers(slugs: string[]): Career[] {
    return slugs
        .map((slug) => CAREERS.find((c) => c.slug === slug))
        .filter((c): c is Career => c !== undefined);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
    return [...new Set(CAREERS.map((c) => c.category))];
}

/**
 * Get careers matching interest chip
 */
export function getCareersByInterest(interestLabel: string): Career[] {
    const chip = INTEREST_CHIPS.find(
        (c) => c.label.toLowerCase() === interestLabel.toLowerCase()
    );

    if (!chip) return [];

    return searchCareers(chip.keywords.join(' '));
}

/**
 * Generate personalized match message
 */
export function generateMatchMessage(career: Career, query: string): string {
    const queryLower = query.toLowerCase();

    if (career.keywords.some((k) => queryLower.includes(k))) {
        const matchedKeyword = career.keywords.find((k) => queryLower.includes(k));
        return `Your interest in "${matchedKeyword}" makes ${career.title} a fantastic path for you!`;
    }

    if (career.category.toLowerCase().includes(queryLower)) {
        return `Since you're interested in ${career.category}, ${career.title} could be an excellent fit.`;
    }

    return `Based on your interests, ${career.title} aligns perfectly with what you're looking for.`;
}
