'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OpportunityRegistrationRecord } from '@/types/opportunity';

export default function RegistrationsPage() {
  const params = useParams();
  const opportunityId = typeof params?.id === 'string' ? params.id : '';
  const [registrations, setRegistrations] = useState<OpportunityRegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRegistrations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/opportunities/${opportunityId}/registrations`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load registrations');
      }
      const payload = await response.json();
      setRegistrations(payload.items ?? []);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opportunityId) {
      loadRegistrations();
    }
  }, [opportunityId]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Registrations</h2>
          <Button variant="outline" size="sm" onClick={loadRegistrations} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? 'Loading registrations...' : `Showing ${registrations.length} record(s).`}
        </p>
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
                      <TableHead className="w-[25%] font-semibold">Student Name</TableHead>
                      <TableHead className="w-[25%] font-semibold">Email</TableHead>
                      <TableHead className="w-[15%] font-semibold">Class</TableHead>
                      <TableHead className="w-[20%] font-semibold">School</TableHead>
                      <TableHead className="w-[15%] text-right font-semibold">Registered At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                            <p>No registrations found for this opportunity.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    {registrations.map((registration) => (
                      <TableRow key={registration.studentUid} className="group border-b hover:bg-muted/50">
                        <TableCell>{registration.studentName}</TableCell>
                        <TableCell>{registration.studentEmail}</TableCell>
                        <TableCell>{registration.className}</TableCell>
                        <TableCell>{registration.schoolName}</TableCell>
                        <TableCell className="text-right">{new Date(registration.registeredAt).toLocaleString()}</TableCell>
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
