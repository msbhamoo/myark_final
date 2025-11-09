'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AppUserProfile } from '@/context/AuthContext';

type SubmittedOpportunity = {
  id: string;
  title: string;
  status: string;
  registrationDeadline: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  mode?: string;
  approval?: {
    status?: string;
    reviewedAt?: string | null;
    reviewedBy?: string | null;
  } | null;
};

const formatDate = (value: string | null): string => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

type OrganizationDashboardProps = {
  user: AppUserProfile;
  signOut: () => Promise<void>;
  getIdToken: (force?: boolean) => Promise<string | null>;
};

export default function OrganizationDashboard({
  user,
  signOut,
  getIdToken,
}: OrganizationDashboardProps) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<SubmittedOpportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOpportunities = useCallback(async () => {
    setIsLoadingOpportunities(true);
    setError(null);
    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error('Missing auth token');
      }

      const response = await fetch('/api/opportunities/mine', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Failed to load opportunities');
      }

      const data = (await response.json()) as { items?: SubmittedOpportunity[] };
      setOpportunities(data.items ?? []);
    } catch (loadError) {
      console.error('Failed to load submitted opportunities', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Failed to load your submissions');
    } finally {
      setIsLoadingOpportunities(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (user.accountType === 'organization') {
      loadOpportunities().catch((err) => {
        console.error('Failed to load opportunities', err);
      });
    }
  }, [loadOpportunities, user.accountType]);

  const statusBreakdown = useMemo(() => {
    const breakdown = new Map<string, number>();
    opportunities.forEach((item) => {
      const status = (item.status || 'draft').toLowerCase();
      breakdown.set(status, (breakdown.get(status) ?? 0) + 1);
    });
    return breakdown;
  }, [opportunities]);

  const statusCards = useMemo(
    () => [
      { key: 'published', label: 'Published' },
      { key: 'pending', label: 'Pending review' },
      { key: 'draft', label: 'Draft' },
      { key: 'rejected', label: 'Requires updates' },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur">
        <div className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-white/60">Organization dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Hello {user.displayName || user.email || 'there'} 👋
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Monitor the opportunities you submit, track their approval status, and share new programs with the MyArk community.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push('/admin/opportunities')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-pink-600"
            >
              Submit opportunity
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statusCards.map((status) => (
            <div
              key={status.key}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70"
            >
              <p className="text-sm uppercase tracking-wide text-white/50">{status.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {statusBreakdown.get(status.key) ?? 0}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Submitted opportunities</h2>
            <Button
              variant="ghost"
              className="border border-white/10 text-white"
              onClick={() => loadOpportunities()}
              disabled={isLoadingOpportunities}
            >
              Refresh
            </Button>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
              {error}
            </p>
          )}

          {isLoadingOpportunities ? (
            <p className="mt-6 text-sm text-white/60">Loading submissions…</p>
          ) : opportunities.length === 0 ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
              You haven&apos;t submitted any opportunities yet. Share your first programme to reach the MyArk community.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {opportunities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 md:flex md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-white/60">
                      <span>
                        Submitted: <strong>{formatDate(item.createdAt)}</strong>
                      </span>
                      <span>
                        Deadline: <strong>{formatDate(item.registrationDeadline)}</strong>
                      </span>
                      <span>
                        Updated: <strong>{formatDate(item.updatedAt)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 md:mt-0">
                    <Badge variant="outline" className="border-white/30 text-white">
                      {item.status}
                    </Badge>
                    {item.approval?.status === 'pending' && (
                      <span className="text-xs text-white/60">Awaiting admin review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
