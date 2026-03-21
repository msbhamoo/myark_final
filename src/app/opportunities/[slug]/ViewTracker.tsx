'use client';

import { useEffect } from 'react';
import { logOpportunityView } from '../../student/actions';

export function ViewTracker({ opportunityId }: { opportunityId: string }) {
  useEffect(() => {
    // Small delay to ensure it's a real view, not just a bounce
    const timer = setTimeout(() => {
      logOpportunityView(opportunityId);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [opportunityId]);

  return null; // Invisible component
}
