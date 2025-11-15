'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type ExternalClickRecord = {
  opportunityId: string;
  clickedAt: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
};

export default function ExternalClicksPage() {
  const params = useParams();
  const opportunityId = typeof params?.id === 'string' ? params.id : '';
  const [clicks, setClicks] = useState<ExternalClickRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClicks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/opportunities/${opportunityId}/external-clicks`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load clicks');
      }
      const payload = await response.json();
      setClicks(payload.items ?? []);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opportunityId) {
      loadClicks();
    }
  }, [opportunityId]);

  const uniqueUsers = useMemo(() => {
    const userIds = new Set<string>();
    clicks.forEach((click) => {
      if (click.userId) {
        userIds.add(click.userId);
      }
    });
    return userIds.size;
  }, [clicks]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">External Registration Clicks</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Total Clicks: {clicks.length} | Unique Users: {uniqueUsers}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadClicks} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-4">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="w-[25%] font-semibold">User Name</TableHead>
                      <TableHead className="w-[25%] font-semibold">Email</TableHead>
                      <TableHead className="w-[50%] font-semibold">Clicked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clicks.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                            <p>No clicks found for this opportunity.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {clicks.map((click, index) => (
                      <TableRow key={index} className="group border-b hover:bg-muted/50">
                        <TableCell>{click.userName || 'Anonymous'}</TableCell>
                        <TableCell>{click.userEmail || 'N/A'}</TableCell>
                        <TableCell>{new Date(click.clickedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
