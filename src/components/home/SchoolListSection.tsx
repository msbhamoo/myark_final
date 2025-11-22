'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Shield, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type School = {
  id: string;
  name: string;
  state?: string;
  city?: string;
  board?: string;
  medium?: string;
  grades?: string;
  studentsCount?: number;
  established?: number;
  image?: string;
  verified?: boolean;
  rating?: number;
  fees?: string;
  facilities?: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  principalName?: string;
  affiliation?: string;
  topAchievers?: Array<{ name: string; achievement: string; year: number }>;
};

export default function SchoolListSection() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const schoolsList = Array.isArray(data.items) ? data.items : [];
        setSchools(schoolsList.slice(0, 6)); // Show first 6 schools
      } catch (err) {
        console.error('Failed to fetch schools:', err);
        setError('Failed to load schools');
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <LoadingSpinner />
        <p className="text-slate-600 dark:text-slate-400">Loading schools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700 dark:bg-red-500/10 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
        <p className="text-slate-600 dark:text-slate-400">No schools available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Schools Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <Link
            key={school.id}
            href={`/schools/${school.id}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={
                  school.image ||
                  'https://images.unsplash.com/photo-1427504494785-cdae8ddc60c7?w=500&h=300&fit=crop'
                }
                alt={school.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              {school.verified && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-green-500/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <Shield className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-3 sm:p-4">
              {/* Name & Rating */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 transition group-hover:text-primary dark:text-white line-clamp-2 text-sm sm:text-base">
                  {school.name}
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-yellow-500">
                    <Star className="h-3 w-3 fill-yellow-500" />
                    {school.rating || 'N/A'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {school.studentsCount ? `(${Number(school.studentsCount).toLocaleString()} students)` : '(N/A)'}
                  </span>
                </div>
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/50">
                  <p className="text-slate-600 dark:text-slate-400">Board</p>
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {school.board || 'N/A'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/50">
                  <p className="text-slate-600 dark:text-slate-400">Grades</p>
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {school.grades || 'N/A'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/50">
                  <p className="text-slate-600 dark:text-slate-400">Medium</p>
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {school.medium || 'N/A'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/50">
                  <p className="text-slate-600 dark:text-slate-400">Fees</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-[10px] truncate">
                    {school.fees || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {school.city || school.state ? `${school.city || 'Location'}, ${school.state || 'India'}` : 'Location N/A'}
                </span>
              </div>

              {/* Facilities */}
              <div className="flex flex-wrap gap-1">
                {(school.facilities || []).slice(0, 2).map((facility) => (
                  <Badge
                    key={facility}
                    variant="outline"
                    className="text-xs border-slate-200 dark:border-slate-700 px-2 py-0.5"
                  >
                    {facility}
                  </Badge>
                ))}
                {(school.facilities || []).length > 2 && (
                  <Badge variant="outline" className="text-xs border-slate-200 dark:border-slate-700 px-2 py-0.5">
                    +{(school.facilities || []).length - 2}
                  </Badge>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200/60 bg-gradient-to-r from-accent/50 to-chart-2/10 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-primary dark:border-slate-700 dark:from-primary/10 dark:to-chart-2/10 dark:text-accent group-hover:shadow-md">
                <span>View Details</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Schools Button */}
      <div className="pt-2">
        <Link
          href="/schools"
          className="inline-flex items-center gap-2 rounded-full border border-accent bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-accent/20 dark:border-primary/40 dark:bg-slate-900 dark:text-accent dark:hover:bg-primary/10"
        >
          Browse All Schools
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
