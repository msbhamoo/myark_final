import { ClassRange } from './types';

export const CLASS_RANGES: ClassRange[] = [
  { slug: 'class-1-5', label: 'Class 1–5', classes: [1, 2, 3, 4, 5] },
  { slug: 'class-6-8', label: 'Class 6–8', classes: [6, 7, 8] },
  { slug: 'class-9-10', label: 'Class 9–10', classes: [9, 10] },
  { slug: 'class-11-12', label: 'Class 11–12', classes: [11, 12] },
];

export const SITE_NAME = 'Myark';
export const SITE_URL = 'https://myark.in';
export const SITE_TAGLINE = 'Make your Mark.';
export const SITE_DESCRIPTION =
  "India's most comprehensive directory of K-12 competitions, scholarships, olympiads, and exchange programs. Discover what you're eligible for — before the deadline passes.";

export const CURRENT_YEAR = 2026;

// Default category colors as fallback if DB values missing
export const DEFAULT_CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  olympiad: { bg: '#eaf3de', text: '#27500a' },
  scholarship: { bg: '#e0eaf6', text: '#0c447c' },
  coding: { bg: '#ede0f8', text: '#3c3489' },
  robotics: { bg: '#faece7', text: '#712b13' },
  exchange: { bg: '#faeeda', text: '#633806' },
  writing: { bg: '#fbeaf0', text: '#72243e' },
  quiz: { bg: '#e1f5ee', text: '#085041' },
  innovation: { bg: '#f1efe8', text: '#444441' },
  art: { bg: '#fdf3e0', text: '#7a4800' },
  sports: { bg: '#e6f1fb', text: '#1a3c6e' },
};

export const CATEGORY_ICONS: Record<string, string> = {
  olympiad: '🏅',
  scholarship: '🎓',
  coding: '💻',
  robotics: '🤖',
  exchange: '✈️',
  writing: '✍️',
  quiz: '🧠',
  innovation: '💡',
  art: '🎨',
  sports: '⚽',
};
