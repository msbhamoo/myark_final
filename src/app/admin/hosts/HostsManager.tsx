'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type HostRecord = {
  id: string;
  email: string;
  accountType: string;
  role: string;
  displayName: string;
  organizationName: string;
  organizationDetails?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  organizer: {
    name: string;
    overview?: string;
    contactEmail?: string;
    visibility: 'public' | 'private';
    isVerified: boolean;
    updatedAt?: string | null;
  };
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
};

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export function HostsManager() {
  const [hosts, setHosts] = useState<HostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadHosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/hosts');
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to load hosts');
      }
      const payload = await response.json();
      setHosts(payload.items ?? []);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHosts();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<HostRecord['organizer']>) => {
    setUpdatingId(id);
    setError(null);
    try {
      const response = await fetch('/api/admin/hosts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to update host');
      }
      const payload = await response.json();
      setHosts((prev) =>
        prev.map((host) =>
          host.id === id
            ? {
                ...host,
                organizer: {
                  ...host.organizer,
                  visibility: payload.visibility ?? host.organizer.visibility,
                  isVerified:
                    payload.isVerified === undefined ? host.organizer.isVerified : payload.isVerified,
                  updatedAt: payload.updatedAt ?? host.organizer.updatedAt,
                },
              }
            : host,
        ),
      );
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const renderStatsBadge = (label: string, value: number, colorClass: string) => (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>{label}: {value}</span>
  );

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-semibold text-white'>Host Accounts</h2>
        <p className='text-sm text-white/60'>
          Review all organization accounts created through the public portal. Toggle verification and
          visibility to control what appears on the site.
        </p>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm' onClick={loadHosts} disabled={isLoading}>
            Refresh
          </Button>
          {isLoading && <span className='text-xs text-white/60'>Loading hosts...</span>}
        </div>
        {error && (
          <p className='text-sm text-red-400' role='alert'>
            {error}
          </p>
        )}
      </div>

      <div className='space-y-4'>
        <div className='grid gap-4 md:hidden'>
          {hosts.map((host) => (
            <div
              key={host.id}
              className='rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm shadow-slate-950/20'
            >
              <div className='flex flex-col gap-3'>
                <div>
                  <h3 className='text-base font-semibold text-white'>
                    {host.organizationName || host.displayName || host.email}
                  </h3>
                  <p className='text-xs text-white/60'>{host.email}</p>
                </div>
                <div className='flex flex-wrap gap-2 text-xs text-white/60'>
                  <Badge className='bg-orange-500/20 text-orange-200 border border-orange-500/40'>
                    Host
                  </Badge>
                  <Badge variant='outline' className='border-white/20 text-slate-200'>
                    {host.organizer.visibility === 'public' ? 'Public' : 'Private'}
                  </Badge>
                  <Badge
                    className={
                      host.organizer.isVerified
                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                        : 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40'
                    }
                  >
                    {host.organizer.isVerified ? 'Verified' : 'Pending review'}
                  </Badge>
                </div>
                <div className='space-y-1 text-xs text-white/60'>
                  <div>
                    <span className='font-medium text-white/70'>Joined:</span> {formatDate(host.createdAt)}
                  </div>
                  <div>
                    <span className='font-medium text-white/70'>Submissions:</span>{' '}
                    {host.stats.total} (approved {host.stats.approved}, pending {host.stats.pending})
                  </div>
                  {host.organizationDetails && (
                    <p className='text-white/70'>{host.organizationDetails}</p>
                  )}
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      handleUpdate(host.id, {
                        isVerified: !host.organizer.isVerified,
                      })
                    }
                    disabled={updatingId === host.id}
                  >
                    {host.organizer.isVerified ? 'Mark as Unverified' : 'Mark as Verified'}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      handleUpdate(host.id, {
                        visibility: host.organizer.visibility === 'public' ? 'private' : 'public',
                      })
                    }
                    disabled={updatingId === host.id}
                  >
                    Set {host.organizer.visibility === 'public' ? 'Private' : 'Public'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {hosts.length === 0 && !isLoading && (
            <div className='rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60'>
              No host accounts recorded yet.
            </div>
          )}
        </div>

        <div className='hidden rounded-xl border border-white/10 bg-slate-900/40 md:block'>
          <div className='w-full overflow-x-auto'>
            <Table className='min-w-[1100px]'>
              <TableHeader>
                <TableRow className='bg-white/5 hover:bg-white/5'>
                  <TableHead className='w-72'>Host</TableHead>
                  <TableHead className='w-60'>Contact</TableHead>
                  <TableHead className='w-40 text-center'>Visibility</TableHead>
                  <TableHead className='w-40 text-center'>Verification</TableHead>
                  <TableHead className='w-56 text-center'>Submissions</TableHead>
                  <TableHead className='w-40 text-center'>Joined</TableHead>
                  <TableHead className='w-60 text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hosts.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center text-white/50'>
                      No host accounts recorded yet.
                    </TableCell>
                  </TableRow>
                )}
                {hosts.map((host) => (
                  <TableRow key={host.id} className='hover:bg-white/5'>
                    <TableCell>
                      <div className='space-y-1'>
                        <p className='font-medium text-white'>
                          {host.organizationName || host.displayName || host.email}
                        </p>
                        <p className='text-xs text-white/60'>{host.organizer.overview || host.organizationDetails || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell className='text-sm text-white/70'>
                      <div className='space-y-1'>
                        <p>{host.email}</p>
                        <p className='text-xs text-white/50'>Contact: {host.organizer.contactEmail || 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge variant='outline' className='border-white/20 text-slate-200'>
                        {host.organizer.visibility === 'public' ? 'Public' : 'Private'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Badge
                        className={
                          host.organizer.isVerified
                            ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                            : 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40'
                        }
                      >
                        {host.organizer.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center text-xs text-white/70'>
                      <div className='flex flex-col gap-1 items-center'>
                        {renderStatsBadge('Total', host.stats.total, 'bg-white/10')}
                        {renderStatsBadge('Approved', host.stats.approved, 'bg-emerald-500/15 text-emerald-200')}
                        {renderStatsBadge('Pending', host.stats.pending, 'bg-yellow-500/15 text-yellow-200')}
                      </div>
                    </TableCell>
                    <TableCell className='text-center text-xs text-white/60'>
                      {formatDate(host.createdAt)}
                    </TableCell>
                    <TableCell className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          handleUpdate(host.id, {
                            isVerified: !host.organizer.isVerified,
                          })
                        }
                        disabled={updatingId === host.id}
                      >
                        {host.organizer.isVerified ? 'Mark Unverified' : 'Mark Verified'}
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          handleUpdate(host.id, {
                            visibility: host.organizer.visibility === 'public' ? 'private' : 'public',
                          })
                        }
                        disabled={updatingId === host.id}
                      >
                        Set {host.organizer.visibility === 'public' ? 'Private' : 'Public'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
