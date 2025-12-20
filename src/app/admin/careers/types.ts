import { CareerRoadmapStep, SalaryRange } from '@/constants/careers';

export interface CareerFormState {
    slug: string;
    title: string;
    category: string;
    categoryColor: string;
    shortDescription: string;
    fullDescription: string;
    keywordsText: string;
    roadmapText: string;
    salaryMin: string;
    salaryMax: string;
    salaryNote: string;
    examsText: string;
    collegesIndiaText: string;
    collegesGlobalText: string;
    degreesText: string;
    relatedCareersText: string;
    didYouKnowText: string;
    goodStuffText: string;
    challengesText: string;
    images: string[];
}
