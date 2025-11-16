'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  X,
  MapPin,
  Users,
  BookOpen,
  Shield,
  ChevronRight,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type School = {
  id: string;
  name: string;
  state: string;
  city: string;
  board: string;
  medium: string;
  grades: string;
  studentsCount: number;
  established: number;
  image?: string;
  verified: boolean;
  rating: number;
  fees: string;
  facilities: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  affiliation?: string;
  topAchievers?: Array<{ name: string; achievement: string; year: number }>;
};

// Fallback mock data in case API fails
const FALLBACK_SCHOOLS: School[] = [
  {
    id: '1',
    name: 'Delhi Public School, New Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    board: 'CBSE',
    medium: 'English',
    grades: '1-12',
    studentsCount: 2500,
    established: 1995,
    image: 'https://images.unsplash.com/photo-1427504494785-cdae8ddc60c7?w=500&h=300&fit=crop',
    verified: true,
    rating: 4.8,
    fees: '2,50,000 - 5,00,000',
    facilities: ['Library', 'Sports', 'Lab', 'AI Center'],
  },
  {
    id: '2',
    name: 'Cathedral School, Mumbai',
    state: 'Maharashtra',
    city: 'Mumbai',
    board: 'ICSE',
    medium: 'English',
    grades: '1-12',
    studentsCount: 2000,
    established: 1988,
    image: 'https://images.unsplash.com/photo-1577720643272-265f434885f5?w=500&h=300&fit=crop',
    verified: true,
    rating: 4.7,
    fees: '3,00,000 - 6,00,000',
    facilities: ['Library', 'Swimming Pool', 'Lab', 'Music Room'],
  },
  {
    id: '3',
    name: 'Vidyapith Academy, Bangalore',
    state: 'Karnataka',
    city: 'Bangalore',
    board: 'State Board',
    medium: 'Kannada, English',
    grades: '1-10',
    studentsCount: 1500,
    established: 2005,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=300&fit=crop',
    verified: true,
    rating: 4.5,
    fees: '80,000 - 2,00,000',
    facilities: ['Lab', 'Computer Center', 'Playground'],
  },
  {
    id: '4',
    name: 'St. Marys Convent, Kolkata',
    state: 'West Bengal',
    city: 'Kolkata',
    board: 'ICSE',
    medium: 'English',
    grades: '1-12',
    studentsCount: 1800,
    established: 1992,
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=300&fit=crop',
    verified: true,
    rating: 4.6,
    fees: '1,50,000 - 4,00,000',
    facilities: ['Library', 'Sports', 'Lab', 'Art Room'],
  },
  {
    id: '5',
    name: 'Modern School, Chennai',
    state: 'Tamil Nadu',
    city: 'Chennai',
    board: 'CBSE',
    medium: 'English',
    grades: '1-12',
    studentsCount: 2200,
    established: 1998,
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b0e5d?w=500&h=300&fit=crop',
    verified: true,
    rating: 4.7,
    fees: '2,00,000 - 4,50,000',
    facilities: ['Library', 'Lab', 'Sports Complex', 'Auditorium'],
  },
];

const STATES = ['Delhi', 'Maharashtra', 'Karnataka', 'West Bengal', 'Tamil Nadu'];
const CITIES = ['New Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai'];
const BOARDS = ['CBSE', 'ICSE', 'State Board'];
const MEDIUMS = ['English', 'Kannada', 'Marathi', 'Hindi'];
const GRADES = ['1-5', '6-8', '9-10', '11-12'];

interface SchoolFilters {
  search: string;
  state: string;
  city: string;
  board: string;
  medium: string;
  grade: string;
}

function SchoolCard({ school }: { school: School }) {
  return (
    <Link href={`/schools/${school.id}`}>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={school.image || 'https://images.unsplash.com/photo-1427504494785-cdae8ddc60c7?w=500&h=300&fit=crop'}
            alt={school.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {school.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-green-500/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Shield className="h-3.5 w-3.5" />
              <span>Verified</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-4">
          {/* School Name & Rating */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 transition group-hover:text-orange-600 dark:text-white line-clamp-2">
              {school.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-500">
                ★ {school.rating}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">({school.studentsCount} students)</span>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
              <p className="text-slate-600 dark:text-slate-400">Board</p>
              <p className="font-semibold text-slate-900 dark:text-white">{school.board}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
              <p className="text-slate-600 dark:text-slate-400">Grades</p>
              <p className="font-semibold text-slate-900 dark:text-white">{school.grades}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
              <p className="text-slate-600 dark:text-slate-400">Medium</p>
              <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{school.medium}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
              <p className="text-slate-600 dark:text-slate-400">Fees</p>
              <p className="font-semibold text-slate-900 dark:text-white text-[10px]">{school.fees}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{school.city}, {school.state}</span>
          </div>

          {/* Facilities */}
          <div className="flex flex-wrap gap-1.5">
            {school.facilities.slice(0, 2).map((facility: string) => (
              <Badge
                key={facility}
                variant="outline"
                className="text-xs border-slate-200 dark:border-slate-700"
              >
                {facility}
              </Badge>
            ))}
            {school.facilities.length > 2 && (
              <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700">
                +{school.facilities.length - 2} more
              </Badge>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-gradient-to-r from-orange-50/50 to-pink-50/50 px-3 py-2 text-sm font-semibold text-orange-600 dark:border-slate-700 dark:from-orange-500/10 dark:to-pink-500/10 dark:text-orange-400 group-hover:shadow-md">
            <span>View Profile</span>
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SchoolsPageClient() {
  const [filters, setFilters] = useState<SchoolFilters>({
    search: '',
    state: '',
    city: '',
    board: '',
    medium: '',
    grade: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [allSchools, setAllSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schools from API on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/schools');
        if (!response.ok) {
          throw new Error('Failed to fetch schools');
        }
        const data = await response.json();
        const schools = Array.isArray(data.items) ? data.items : [];
        setAllSchools(schools);
      } catch (err) {
        console.error('Failed to fetch schools:', err);
        setError('Failed to load schools. Showing fallback data.');
        setAllSchools(FALLBACK_SCHOOLS);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const filteredSchools = useMemo(() => {
    return allSchools.filter((school: School) => {
      const matchesSearch =
        filters.search === '' ||
        school.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        school.city.toLowerCase().includes(filters.search.toLowerCase());

      const matchesState = filters.state === '' || school.state === filters.state;
      const matchesCity = filters.city === '' || school.city === filters.city;
      const matchesBoard = filters.board === '' || school.board === filters.board;
      const matchesMedium = filters.medium === '' || school.medium.includes(filters.medium);
      const matchesGrade = filters.grade === '' || school.grades.includes(filters.grade);

      return matchesSearch && matchesState && matchesCity && matchesBoard && matchesMedium && matchesGrade;
    });
  }, [filters, allSchools]);

  const handleFilterChange = (key: keyof SchoolFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== '').length;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 to-pink-50 px-4 py-12 dark:from-orange-500/10 dark:to-pink-500/10 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Find the Best School for Your Child
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Explore verified schools across India. Compare boards, fees, facilities, and more to make the best choice for your family.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by school name or city..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="border-b border-slate-200 px-4 py-6 dark:border-slate-700 sm:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() =>
                    setFilters({ search: '', state: '', city: '', board: '', medium: '', grade: '' })
                  }
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {/* State */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      State
                    </label>
                    <select
                      value={filters.state}
                      onChange={(e) => handleFilterChange('state', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="">All States</option>
                      {STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      City
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="">All Cities</option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Board */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Board
                    </label>
                    <select
                      value={filters.board}
                      onChange={(e) => handleFilterChange('board', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="">All Boards</option>
                      {BOARDS.map((board) => (
                        <option key={board} value={board}>
                          {board}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Medium */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Medium
                    </label>
                    <select
                      value={filters.medium}
                      onChange={(e) => handleFilterChange('medium', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="">All Mediums</option>
                      {MEDIUMS.map((medium) => (
                        <option key={medium} value={medium}>
                          {medium}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Grades */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Grades
                    </label>
                    <select
                      value={filters.grade}
                      onChange={(e) => handleFilterChange('grade', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                    >
                      <option value="">All Grades</option>
                      {GRADES.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Schools Grid */}
        <section className="px-4 py-12 sm:py-16 pb-20 md:pb-12">
          <div className="mx-auto max-w-7xl">
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <LoadingSpinner />
                <p className="text-slate-600 dark:text-slate-400">Loading schools...</p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {filteredSchools.length} {filteredSchools.length === 1 ? 'School' : 'Schools'} Found
                  </h2>
                </div>

                {filteredSchools.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredSchools.map((school: School) => (
                      <SchoolCard key={school.id} school={school} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 px-8 py-16 text-center dark:border-slate-700">
                    <GraduationCap className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                      No schools found
                    </h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                      Try adjusting your filters to find more schools.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}
