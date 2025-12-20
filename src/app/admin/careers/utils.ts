import { Career, CareerRoadmapStep } from '@/constants/careers';
import { CareerFormState } from './types';

export const splitLines = (value: string) =>
    value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

export const joinLines = (values: string[]) => values.join('\n');

export const roadmapToText = (roadmap: CareerRoadmapStep[]) =>
    roadmap
        .map((step) => `${step.title}|${step.description}`)
        .join('\n');

export const textToRoadmap = (text: string): CareerRoadmapStep[] =>
    splitLines(text).map((line) => {
        const [title = '', description = ''] = line.split('|').map((token) => token.trim());
        return { title, description };
    });

export const defaultCareerForm: CareerFormState = {
    slug: '',
    title: '',
    category: '',
    categoryColor: 'bg-blue-100 text-blue-800',
    shortDescription: '',
    fullDescription: '',
    keywordsText: '',
    roadmapText: '',
    salaryMin: '',
    salaryMax: '',
    salaryNote: '',
    examsText: '',
    collegesIndiaText: '',
    collegesGlobalText: '',
    degreesText: '',
    relatedCareersText: '',
    didYouKnowText: '',
    goodStuffText: '',
    challengesText: '',
    images: [],
};

/**
 * Parse legacy salary string (e.g., "4-8 LPA", "4 LPA", "50+ LPA") to number
 */
const parseSalaryString = (str: string | undefined): number => {
    if (!str) return 0;
    // Extract first number from string like "4-8 LPA" -> 4, or "50+ LPA" -> 50
    const match = str.match(/(\d+)/);
    if (!match) return 0;
    const num = parseInt(match[1], 10);
    // If it looks like LPA, convert to annual
    if (str.toLowerCase().includes('lpa')) {
        return num * 100000;
    }
    // If it's a Cr value
    if (str.toLowerCase().includes('cr')) {
        return num * 10000000;
    }
    return num;
};

export const careerToFormState = (career: Career): CareerFormState => {
    // Use numeric values if available, otherwise parse from legacy string format
    let salaryMin = career.salary?.min;
    let salaryMax = career.salary?.max;

    if (!salaryMin && career.salary?.entry) {
        salaryMin = parseSalaryString(career.salary.entry);
    }
    if (!salaryMax && career.salary?.senior) {
        salaryMax = parseSalaryString(career.salary.senior);
    }

    return {
        slug: career.slug,
        title: career.title,
        category: career.category,
        categoryColor: career.categoryColor,
        shortDescription: career.shortDescription,
        fullDescription: career.fullDescription,
        keywordsText: joinLines(career.keywords || []),
        roadmapText: roadmapToText(career.roadmap || []),
        salaryMin: salaryMin?.toString() ?? '',
        salaryMax: salaryMax?.toString() ?? '',
        salaryNote: career.salaryNote ?? '',
        examsText: joinLines(career.exams || []),
        collegesIndiaText: joinLines(career.collegesIndia || []),
        collegesGlobalText: joinLines(career.collegesGlobal || []),
        degreesText: joinLines(career.degrees || []),
        relatedCareersText: joinLines(career.relatedCareers || []),
        didYouKnowText: joinLines(career.didYouKnow || []),
        goodStuffText: joinLines(career.goodStuff || []),
        challengesText: joinLines(career.challenges || []),
        images: career.images ?? [],
    };
};

export const formStateToCareer = (state: CareerFormState): Career => {
    // Parse and validate salary values
    const rawMin = parseInt(state.salaryMin) || 0;
    const rawMax = parseInt(state.salaryMax) || 0;

    // Ensure min <= max, and both are non-negative
    const minSalary = Math.max(0, Math.min(rawMin, rawMax || rawMin));
    const maxSalary = Math.max(0, Math.max(rawMin, rawMax));

    // Format salary to LPA string (e.g., "6" for 600000)
    const toLPA = (value: number): string => {
        if (value <= 0) return '0';
        if (value >= 10000000) return `${Math.round(value / 10000000)}`;
        if (value >= 100000) return `${Math.round(value / 100000)}`;
        return `${Math.round(value / 1000)}K`; // For values like 50000 -> "50K"
    };

    // Format salary range strings (e.g., "6-10 LPA" or "40+ LPA")
    const formatSalaryRange = (low: number, high: number): string => {
        if (low <= 0 && high <= 0) return 'Variable';
        if (low <= 0) low = 0;
        if (high <= 0) high = low;

        const lowLPA = toLPA(low);
        const highLPA = toLPA(high);

        // If same value or very close, show single with "+" suffix
        if (low === high || low >= high) return `${lowLPA}+ LPA`;

        return `${lowLPA}-${highLPA} LPA`;
    };

    // Calculate approximate salary tiers (only if we have valid values)
    let entry: string, mid: string, senior: string;

    if (minSalary === 0 && maxSalary === 0) {
        entry = 'Variable';
        mid = 'Variable';
        senior = 'Variable';
    } else if (minSalary === maxSalary) {
        // Single value - same for all levels
        entry = formatSalaryRange(minSalary, minSalary);
        mid = formatSalaryRange(minSalary, minSalary);
        senior = formatSalaryRange(minSalary, maxSalary);
    } else {
        const entryMax = minSalary + Math.round((maxSalary - minSalary) * 0.3);
        const midMax = minSalary + Math.round((maxSalary - minSalary) * 0.7);

        entry = formatSalaryRange(minSalary, entryMax);
        mid = formatSalaryRange(entryMax, midMax);
        senior = formatSalaryRange(midMax, maxSalary);
    }

    return {
        slug: state.slug,
        title: state.title,
        category: state.category,
        categoryColor: state.categoryColor,
        shortDescription: state.shortDescription,
        fullDescription: state.fullDescription,
        keywords: splitLines(state.keywordsText),
        roadmap: textToRoadmap(state.roadmapText),
        salary: {
            min: minSalary,
            max: maxSalary,
            currency: 'INR',
            entry,
            mid,
            senior,
        },
        salaryNote: state.salaryNote,
        exams: splitLines(state.examsText),
        collegesIndia: splitLines(state.collegesIndiaText),
        collegesGlobal: splitLines(state.collegesGlobalText),
        degrees: splitLines(state.degreesText),
        relatedCareers: splitLines(state.relatedCareersText),
        didYouKnow: splitLines(state.didYouKnowText),
        goodStuff: splitLines(state.goodStuffText),
        challenges: splitLines(state.challengesText),
        images: state.images,
    };
};
