'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Shield, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';

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

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.id as string;

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchool = async () => {
      if (!schoolId) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/admin/schools?id=${schoolId}`);
        if (!response.ok) {
          throw new Error('School not found');
        }
        const data = await response.json();
        // Handle both direct school object and array response
        const schoolData = data.items ? data.items[0] : data;
        if (!schoolData) {
          throw new Error('School not found');
        }
        setSchool(schoolData);
      } catch (err) {
        console.error('Failed to fetch school:', err);
        setError('Failed to load school details');
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pb-20 md:pb-0">
        <LoadingSpinner />
        <p className="text-slate-600 dark:text-slate-400">Loading school details...</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen flex flex-col gap-4 pb-20 md:pb-0">
        <div className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/95 px-3 sm:px-4 py-3 dark:border-slate-700 dark:bg-slate-900/95">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-orange-600 dark:text-white dark:hover:text-orange-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error || 'School not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/95 px-3 sm:px-4 py-3 dark:border-slate-700 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-orange-600 dark:text-white dark:hover:text-orange-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="flex-1 mx-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            School Details
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero Image & Basic Info */}
        <div className="rounded-2xl overflow-hidden border border-slate-200/60 bg-white dark:border-slate-700 dark:bg-slate-900 mb-4 sm:mb-6 shadow-sm">
          {/* Image */}
          <div className="relative h-48 sm:h-64 bg-slate-100 dark:bg-slate-800">
            <img
              src={
                school.image ||
                'https://images.unsplash.com/photo-1427504494785-cdae8ddc60c7?w=800&h=400&fit=crop'
              }
              alt={school.name}
              className="w-full h-full object-cover"
            />
            {school.verified && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {school.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                      {school.rating || 'N/A'}
                    </span>
                  </div>
                  {school.studentsCount && (
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{Number(school.studentsCount).toLocaleString()} students</span>
                    </div>
                  )}
                  {school.established && (
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Est. {school.established}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              {(school.city || school.state || school.address) && (
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    {school.address && <p className="text-sm font-medium text-slate-900 dark:text-white">{school.address}</p>}
                    {(school.city || school.state) && (
                      <p className="text-sm">
                        {school.city && school.state
                          ? `${school.city}, ${school.state}`
                          : school.city || school.state}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 mb-4 sm:mb-6">
          {/* Board */}
          {school.board && (
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Board
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">{school.board}</p>
            </div>
          )}

          {/* Medium */}
          {school.medium && (
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Medium
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">{school.medium}</p>
            </div>
          )}

          {/* Grades */}
          {school.grades && (
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Grades
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">{school.grades}</p>
            </div>
          )}

          {/* Fees */}
          {school.fees && (
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Fees
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{school.fees}</p>
            </div>
          )}

          {/* Affiliation */}
          {school.affiliation && (
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Affiliation
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white">{school.affiliation}</p>
            </div>
          )}

          {/* Principal */}
          {school.principalName && (
            <div className="rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                Principal
              </p>
              <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{school.principalName}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900 mb-4 sm:mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Information</h3>
          <div className="space-y-3">
            {school.phone && (
              <a
                href={`tel:${school.phone}`}
                className="flex items-center gap-3 text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition"
              >
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">{school.phone}</span>
              </a>
            )}
            {school.email && (
              <a
                href={`mailto:${school.email}`}
                className="flex items-center gap-3 text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition"
              >
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">{school.email}</span>
              </a>
            )}
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition"
              >
                <Globe className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base truncate">{school.website}</span>
              </a>
            )}
            {!school.phone && !school.email && !school.website && (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No contact information available</p>
            )}
          </div>
        </div>

        {/* Facilities */}
        {school.facilities && school.facilities.length > 0 && (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900 mb-4 sm:mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Facilities</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {school.facilities.map((facility, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Achievers */}
        {school.topAchievers && school.topAchievers.length > 0 && (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-900 mb-4 sm:mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Top Achievers</h3>
            <div className="space-y-3">
              {school.topAchievers.map((achiever, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-lg border border-slate-200/60 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{achiever.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{achiever.achievement}</p>
                  {achiever.year && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Year: {achiever.year}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/schools"
            className="block w-full text-center rounded-xl border border-slate-200/60 bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            Back to Schools
          </Link>
          <Link
            href="/contact"
            className="block w-full text-center rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Get More Info
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
