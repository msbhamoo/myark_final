'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import StudentPortfolioDashboard from './student/StudentPortfolioDashboard';

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

export default function DashboardPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<SubmittedOpportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOpportunities = useCallback(async () => {
    if (!user || user.accountType !== 'organization') {
      setOpportunities([]);
      return;
    }

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
      setError(
        loadError instanceof Error ? loadError.message : 'Failed to load your submissions',
      );
    } finally {
      setIsLoadingOpportunities(false);
    }
  }, [getIdToken, user]);

  useEffect(() => {
    if (user?.accountType === 'organization') {
      loadOpportunities();
    }
  }, [loadOpportunities, user?.accountType]);

  const pendingCount = useMemo(
    () =>
      opportunities.filter((opportunity) =>
        ['pending', 'in_review'].includes(opportunity.status?.toLowerCase?.() ?? ''),
      ).length,
    [opportunities],
  );
  const approvedCount = useMemo(
    () =>
      opportunities.filter((opportunity) =>
        ['approved', 'published'].includes(opportunity.status?.toLowerCase?.() ?? ''),
      ).length,
    [opportunities],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-white/70">Preparing your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
        <h1 className="text-3xl font-semibold">You&apos;re not signed in</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Sign in to manage your opportunities and personalize your MyArk experience.
        </p>
        <Button
          className="mt-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          onClick={() => router.push('/login?redirect=/dashboard')}
        >
          Go to login
        </Button>
      </div>
    );
  }

  if (user.accountType !== 'organization') {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl space-y-10">
          <StudentPortfolioDashboard
            user={user}
            getIdToken={getIdToken}
            signOut={signOut}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
              Account Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Welcome back{user.displayName ? `, ${user.displayName}` : ''}!
            </h1>
            <p className="mt-3 text-white/70">
              Review the status of your submitted opportunities and keep details up to date.
            </p>
          </div>
          <Button variant="outline" className="border-white/10 text-white" onClick={() => signOut()}>
            Logout
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Total submissions</p>
            <p className="mt-3 text-3xl font-semibold">{opportunities.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Pending review</p>
            <p className="mt-3 text-3xl font-semibold text-yellow-300">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Published</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-300">{approvedCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Next steps</p>
            <Button
              asChild
              className="mt-3 w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <Link href="/host">Submit new opportunity</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Recent submissions</h2>
              <p className="text-sm text-white/60">
                Track the status of opportunities sent for admin review.
              </p>
            </div>
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

          <div className="mt-6 space-y-4">
            {isLoadingOpportunities ? (
              <p className="text-sm text-white/60">Loading submissions...</p>
            ) : opportunities.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                You haven&apos;t submitted any opportunities yet. Share your first program to
                reach the MyArk community.
              </div>
            ) : (
              opportunities.map((item) => (
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
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
