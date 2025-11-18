/**
 * Hook: useCommunityCounts
 * Fetches aggregated community counts for an opportunity
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CommunityCounts } from '@/types/community';

export const useCommunityCounts = (opportunityId: string, pollInterval?: number) => {
  const [counts, setCounts] = useState<CommunityCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        opportunityId,
      });

      const response = await fetch(`/api/community/counts?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch community counts');
      }

      const data = (await response.json()) as CommunityCounts;
      setCounts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Failed to fetch community counts', err);
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  // Initial fetch
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Poll for updates if interval is specified
  useEffect(() => {
    if (pollInterval && pollInterval > 0) {
      const interval = setInterval(() => {
        fetchCounts();
      }, pollInterval);

      return () => clearInterval(interval);
    }
  }, [pollInterval, fetchCounts]);

  return {
    counts,
    loading,
    error,
    refetch: fetchCounts,
  };
};
