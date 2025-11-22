/**
 * Sample Categories for Myark Platform
 * These are pre-configured categories to demonstrate the category grid functionality
 */

export const SAMPLE_CATEGORIES = [
  {
    name: 'Olympiads',
    description: 'STEM competitions and knowledge challenges',
    displayOrder: 1,
    isActive: true,
  },
  {
    name: 'Scholarships',
    description: 'Educational grants and financial aid for deserving students',
    displayOrder: 2,
    isActive: true,
  },
  {
    name: 'Bootcamps',
    description: 'Intensive skill-building programs and coding challenges',
    displayOrder: 3,
    isActive: true,
  },
  {
    name: 'Internships',
    description: 'Real-world work experience and career exploration',
    displayOrder: 4,
    isActive: true,
  },
  {
    name: 'Workshops',
    description: 'Hands-on learning sessions and skill development',
    displayOrder: 5,
    isActive: true,
  },
  {
    name: 'Sports Events',
    description: 'Athletic competitions and sporting events',
    displayOrder: 6,
    isActive: true,
  },
  {
    name: 'Coding Challenges',
    description: 'Programming competitions and hackathons',
    displayOrder: 7,
    isActive: true,
  },
  {
    name: 'Summer Camps',
    description: 'Summer programs for personal and academic growth',
    displayOrder: 8,
    isActive: true,
  },
  {
    name: 'Hiring Challenges',
    description: 'Job opportunities and recruitment drives',
    displayOrder: 9,
    isActive: true,
  },
  {
    name: 'Quizzes',
    description: 'Knowledge testing and trivia competitions',
    displayOrder: 10,
    isActive: true,
  },
  {
    name: 'Conferences',
    description: 'Professional conferences and seminars',
    displayOrder: 11,
    isActive: true,
  },
  {
    name: 'Cultural Events',
    description: 'Arts, culture, and creative expression events',
    displayOrder: 12,
    isActive: true,
  },
];

/**
 * Color mapping for categories
 * Each category gets a unique gradient for visual appeal
 */
export const CATEGORY_COLOR_MAP = {
  scholarships: { from: 'from-emerald-400', to: 'to-green-500' },
  olympiad: { from: 'from-purple-400', to: 'to-pink-500' },
  olympiads: { from: 'from-purple-400', to: 'to-pink-500' },
  workshop: { from: 'from-cyan-400', to: 'to-blue-500' },
  workshops: { from: 'from-cyan-400', to: 'to-blue-500' },
  bootcamp: { from: 'from-rose-400', to: 'to-red-500' },
  bootcamps: { from: 'from-rose-400', to: 'to-red-500' },
  summercamp: { from: 'from-emerald-400', to: 'to-green-500' },
  summercamps: { from: 'from-emerald-400', to: 'to-green-500' },
  internship: { from: 'from-indigo-400', to: 'to-purple-500' },
  internships: { from: 'from-indigo-400', to: 'to-purple-500' },
  hackathon: { from: 'from-violet-400', to: 'to-purple-500' },
  hackathons: { from: 'from-violet-400', to: 'to-purple-500' },
  hiring: { from: 'from-blue-400', to: 'to-indigo-500' },
  hiringchallenges: { from: 'from-blue-400', to: 'to-indigo-500' },
  quiz: { from: 'from-blue-400', to: 'to-cyan-500' },
  quizzes: { from: 'from-blue-400', to: 'to-cyan-500' },
  conference: { from: 'from-slate-400', to: 'to-slate-600' },
  conferences: { from: 'from-slate-400', to: 'to-slate-600' },
  competition: { from: 'from-fuchsia-400', to: 'to-pink-500' },
  competitions: { from: 'from-fuchsia-400', to: 'to-pink-500' },
  cultural: { from: 'from-violet-400', to: 'to-purple-500' },
  culturalevents: { from: 'from-violet-400', to: 'to-purple-500' },
  sports: { from: 'from-red-500', to: 'to-rose-600' },
  sportsevents: { from: 'from-red-500', to: 'to-rose-600' },
  coding: { from: 'from-green-400', to: 'to-emerald-500' },
  codingchallenges: { from: 'from-green-400', to: 'to-emerald-500' },
  design: { from: 'from-pink-400', to: 'to-rose-500' },
  business: { from: 'from-cyan-400', to: 'to-blue-500' },
  other: { from: 'from-slate-400', to: 'to-slate-600' },
};

/**
 * Emoji mapping for categories
 */
export const CATEGORY_EMOJI_MAP = {
  scholarships: '🎓',
  olympiad: '🧠',
  olympiads: '🧠',
  workshop: '🔨',
  workshops: '🔨',
  bootcamp: '🚀',
  bootcamps: '🚀',
  summercamp: '☀️',
  summercamps: '☀️',
  internship: '💼',
  internships: '💼',
  hackathon: '💻',
  hackathons: '💻',
  hiring: '👥',
  hiringchallenges: '👥',
  quiz: '❓',
  quizzes: '❓',
  conference: '🎤',
  conferences: '🎤',
  competition: '🏆',
  competitions: '🏆',
  cultural: '🎭',
  culturalevents: '🎭',
  sports: '⚽',
  sportsevents: '⚽',
  coding: '👨‍💻',
  codingchallenges: '👨‍💻',
  design: '🎨',
  business: '💰',
  other: '✨',
};
