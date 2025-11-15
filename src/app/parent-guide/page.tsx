'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Target, 
  TrendingUp, 
  ChevronDown,
  GraduationCap,
  Trophy,
  Zap,
  Lightbulb,
} from 'lucide-react';
import Link from 'next/link';
import type { Opportunity } from '@/types/opportunity';
import { cn } from '@/lib/utils';

interface ParentGuideSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const CareerPathOption = ({ 
  title, 
  description, 
  opportunities 
}: { 
  title: string; 
  description: string; 
  opportunities: number;
}) => (
  <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80">
    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h4>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    <p className="mt-3 inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs dark:bg-orange-500/20">
        {opportunities}
      </span>
      <span className="ml-2">opportunities</span>
    </p>
  </div>
);

export default function ParentGuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guide' | 'opportunities'>('guide');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    scholarships: true,
    olympiads: false,
    workshops: false,
  });

  const grades = [
    { value: '4-6', label: 'Grades 4-6' },
    { value: '7-9', label: 'Grades 7-9' },
    { value: '10-12', label: 'Grades 10-12' },
  ];

  const categories = [
    { value: 'scholarships', label: '🎓 Scholarships', color: 'from-amber-50' },
    { value: 'olympiad', label: '🧠 Olympiads', color: 'from-purple-50' },
    { value: 'workshop', label: '🔨 Workshops', color: 'from-cyan-50' },
    { value: 'bootcamp', label: '🚀 Bootcamps', color: 'from-rose-50' },
    { value: 'summercamp', label: '☀️ Summer Camps', color: 'from-emerald-50' },
    { value: 'internship', label: '💼 Internships', color: 'from-indigo-50' },
  ];

  const careerPaths = [
    {
      title: 'STEM & Technology',
      description: 'For students interested in science, technology, engineering, and mathematics',
      skills: ['Problem-solving', 'Coding', 'Innovation'],
      exams: ['STEM Olympiad', 'Competitive Programming'],
      opportunities: 45,
    },
    {
      title: 'Commerce & Business',
      description: 'For students interested in business, finance, and entrepreneurship',
      skills: ['Analytical thinking', 'Leadership', 'Communication'],
      exams: ['Business Quiz', 'Entrepreneurship Challenge'],
      opportunities: 32,
    },
    {
      title: 'Humanities & Social Sciences',
      description: 'For students interested in history, geography, literature, and social studies',
      skills: ['Research', 'Writing', 'Critical thinking'],
      exams: ['Literature Contest', 'History Olympiad'],
      opportunities: 28,
    },
    {
      title: 'Arts & Design',
      description: 'For students interested in visual arts, graphic design, and creative pursuits',
      skills: ['Creativity', 'Visual thinking', 'Design'],
      exams: ['Design Challenge', 'Art Exhibition'],
      opportunities: 24,
    },
  ];

  // Fetch opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/opportunities');
        if (response.ok) {
          const data = await response.json();
          setOpportunities(data.opportunities || []);
        }
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filter opportunities based on search and selected filters
  useEffect(() => {
    let filtered = opportunities;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.organizer?.toLowerCase().includes(query) ||
          opp.category?.toLowerCase().includes(query)
      );
    }

    // Filter by grades
    if (selectedGrades.length > 0) {
      filtered = filtered.filter((opp) => {
        const gradeStr = opp.gradeEligibility?.toLowerCase() || '';
        return selectedGrades.some((g) => gradeStr.includes(g));
      });
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((opp) =>
        selectedCategories.some((cat) =>
          opp.category?.toLowerCase().includes(cat)
        )
      );
    }

    setFilteredOpportunities(filtered);
  }, [opportunities, searchQuery, selectedGrades, selectedCategories]);

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade)
        ? prev.filter((g) => g !== grade)
        : [...prev, grade]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-200/70 via-blue-100 to-purple-100 px-4 pt-20 pb-16 text-slate-900 sm:px-6 lg:pb-24 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-[0.08] mix-blend-soft-light dark:opacity-[0.04]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/30 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200/70 backdrop-blur dark:bg-slate-800/80 dark:text-blue-200 dark:ring-blue-300/40">
              <Sparkles className="h-4 w-4" />
              Parent's Guide to Student Opportunities
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl dark:text-white">
              Discover the Perfect Path for Your Child
            </h1>

            <p className="mt-4 text-lg text-slate-700 dark:text-slate-100/80">
              Explore career paths, find suitable opportunities, and guide your child's learning journey with our curated programs and resources.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Button
                onClick={() => setActiveTab('opportunities')}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Opportunities
              </Button>

              <Button
                variant="outline"
                className="inline-flex items-center justify-center rounded-full border-2 border-blue-200 bg-white/70 px-7 py-3 text-base font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-white dark:border-blue-300/70 dark:bg-slate-900 dark:text-blue-200"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Explore Career Paths
              </Button>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="sticky top-16 z-40 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('guide')}
                className={cn(
                  'border-b-2 px-1 py-4 text-sm font-semibold transition',
                  activeTab === 'guide'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                )}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Career Paths</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('opportunities')}
                className={cn(
                  'border-b-2 px-1 py-4 text-sm font-semibold transition',
                  activeTab === 'opportunities'
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                )}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Available Opportunities</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'guide' ? (
          // Career Paths Section
          <section className="bg-gradient-to-br from-blue-50/40 via-white to-purple-50/40 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Find Your Child's Path
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Explore different career paths and find opportunities that match your child's interests and goals.
                </p>
              </div>

              {/* Career Paths Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
                {careerPaths.map((path, idx) => (
                  <CareerPathOption
                    key={idx}
                    title={path.title}
                    description={path.description}
                    opportunities={path.opportunities}
                  />
                ))}
              </div>

              {/* Educational Resources */}
              <div className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-sky-50 p-8 dark:border-blue-400/20 dark:from-blue-950/20 dark:to-sky-950/20">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  📚 Resources for Parents
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Exam Guide */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50">
                    <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                      Competition Prep Guide
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Learn about popular competitions, exam formats, and preparation strategies for Olympiads and other contests.
                    </p>
                    <Button className="mt-4 h-auto w-full rounded-lg bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500">
                      View Guide
                    </Button>
                  </div>

                  {/* Scholarship Tips */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50">
                    <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                      Scholarship Tips
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Discover how to help your child prepare for scholarship opportunities and financial aid programs.
                    </p>
                    <Button className="mt-4 h-auto w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500">
                      View Tips
                    </Button>
                  </div>

                  {/* Skill Development */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50">
                    <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                      Skill Development
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Find workshops, bootcamps, and training programs to help your child develop valuable skills.
                    </p>
                    <Button className="mt-4 h-auto w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500">
                      Explore Skills
                    </Button>
                  </div>

                  {/* Internship Guide */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50">
                    <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <h4 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                      Internship Opportunities
                    </h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Explore real-world work experience opportunities to build professional skills early on.
                    </p>
                    <Button className="mt-4 h-auto w-full rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500">
                      View Internships
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          // Opportunities Section
          <section className="py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Search and Filters */}
              <div className="mb-12 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search opportunities by name, organizer, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    <Filter className="mr-2 inline h-4 w-4" />
                    Filter by Grade Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {grades.map((grade) => (
                      <button
                        key={grade.value}
                        onClick={() => toggleGrade(grade.value)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-semibold transition',
                          selectedGrades.includes(grade.value)
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'border border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300'
                        )}
                      >
                        {grade.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Filter by Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => toggleCategory(cat.value)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-semibold transition',
                          selectedCategories.includes(cat.value)
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                            : 'border border-slate-300 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300'
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedGrades.length > 0 || selectedCategories.length > 0 || searchQuery) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGrades([]);
                      setSelectedCategories([]);
                    }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Results */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  <p className="mt-4 text-slate-600 dark:text-slate-400">Loading opportunities...</p>
                </div>
              ) : filteredOpportunities.length > 0 ? (
                <div>
                  <p className="mb-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Found {filteredOpportunities.length} opportunity{filteredOpportunities.length !== 1 ? 'ies' : ''}
                  </p>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOpportunities.map((opp) => {
                      // Determine if opportunity is closed
                      const isClosed = 
                        opp.status?.toLowerCase() === 'closed' ||
                        (opp.registrationDeadline && new Date(opp.registrationDeadline) < new Date());
                      
                      return (
                        <OpportunityCard
                          key={opp.id}
                          id={opp.id}
                          title={opp.title}
                          category={opp.category}
                          gradeEligibility={opp.gradeEligibility || 'All Grades'}
                          organizer={opp.organizer || 'Unknown Organizer'}
                          registrationDeadline={opp.registrationDeadline ?? ''}
                          mode={opp.mode as 'online' | 'offline' | 'hybrid'}
                          fee={opp.fee}
                          status={isClosed ? 'closed' : 'active'}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="text-slate-600 dark:text-slate-300">
                    No opportunities found matching your filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
