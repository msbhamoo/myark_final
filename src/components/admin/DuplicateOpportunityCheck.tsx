'use client';

import { useState, useEffect } from 'react';
import { checkDuplicateOpportunity } from '@/app/admin/opportunities/actions';

export function DuplicateOpportunityCheck({ title, excludeId }: { title: string, excludeId?: string }) {
  const [loading, setLoading] = useState(false);
  const [duplicateData, setDuplicateData] = useState<{exists: boolean, matches: { id: string, title: string }[]}>({ exists: false, matches: [] });

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!title || title.length < 5) {
        setDuplicateData({ exists: false, matches: [] });
        return;
      }

      setLoading(true);
      try {
        const result = await checkDuplicateOpportunity(title, excludeId);
        setDuplicateData(result);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, excludeId]);

  if (!duplicateData.exists && !loading) return null;

  return (
    <div className={`mt-2 p-3 rounded-lg border text-xs transition-all ${
      loading ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-500 italic' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20 text-red-700 dark:text-red-400'
    }`}>
      {loading ? (
        <span className="flex items-center gap-2">
           <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           Checking for duplicates...
        </span>
      ) : (
        <div className="space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            ⚠️ Potentially {duplicateData.matches.length > 1 ? 'Multiple Duplicates' : 'Already Exists'} Found
          </p>
          <ul className="list-disc ml-4 mt-1 opacity-90">
            {duplicateData.matches.map(m => (
              <li key={m.id}>
                <strong>{m.title}</strong>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] opacity-70 italic border-t border-red-200 dark:border-red-900/10 pt-1">
            Ensure this is a truly unique entry before proceeding.
          </p>
        </div>
      )}
    </div>
  );
}
