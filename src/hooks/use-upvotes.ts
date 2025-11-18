/**
 * Hook: useUpvotes
 * Manages upvote state and mutations for an opportunity
 * Handles loading, error states, and automatic polling
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { UpvoteStats } from '@/types/community';
import { useAuth } from '@/context/AuthContext';

export const useUpvotes = (opportunityId: string, pollInterval?: number) => {
  const { user, getIdToken } = useAuth();
  const [stats, setStats] = useState<UpvoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch upvote stats
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        opportunityId,
      });

      if (user?.uid) {
        params.append('userId', user.uid);
      }

      const response = await fetch(`/api/community/upvotes?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch upvote stats');
      }

      const data = (await response.json()) as UpvoteStats;
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Failed to fetch upvote stats', err);
    } finally {
      setLoading(false);
    }
  }, [opportunityId, user?.uid]);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Poll for updates if interval is specified
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      pollIntervalRef.current = setInterval(() => {
        fetchStats();
      }, pollInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [pollInterval, fetchStats]);

  // Toggle upvote
  const toggleUpvote = useCallback(
    async (action: 'upvote' | 'remove') => {
      if (!user) {
        setError('You must be logged in to upvote');
        return false;
      }

      setIsToggling(true);
      try {
        setError(null);
        const token = await getIdToken();

        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        const response = await fetch('/api/community/upvotes/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId,
            action,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as Record<string, unknown>;
          throw new Error(
            typeof errorData.error === 'string'
              ? errorData.error
              : 'Failed to update upvote',
          );
        }

        const data = (await response.json()) as { upvoteStats: UpvoteStats };
        setStats(data.upvoteStats);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Failed to toggle upvote', err);
        return false;
      } finally {
        setIsToggling(false);
      }
    },
    [opportunityId, user, getIdToken],
  );

  // Convenience methods
  const upvote = useCallback(() => toggleUpvote('upvote'), [toggleUpvote]);
  const removeUpvote = useCallback(() => toggleUpvote('remove'), [toggleUpvote]);

  return {
    stats,
    loading,
    error,
    isToggling,
    upvote,
    removeUpvote,
    refetch: fetchStats,
  };
};
