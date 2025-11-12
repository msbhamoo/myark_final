'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OpportunitiesSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? '';
  const initialSegment = searchParams.get('segment') ?? '';
  const initialSearch = searchParams.get('search') ?? '';

  const [searchValue, setSearchValue] = useState(initialSearch);

  const activeFilters = useMemo(() => {
    const filters: Array<{ label: string; value: string }> = [];
    if (initialSegment.trim()) {
      filters.push({ label: 'Segment', value: initialSegment.trim() });
    }
    if (initialCategory.trim()) {
      const formattedCategory = initialCategory
        .replace(/[-_]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      filters.push({ label: 'Category', value: formattedCategory });
    }
    if (initialSearch.trim()) {
      filters.push({ label: 'Search', value: initialSearch.trim() });
    }
    return filters;
  }, [initialSegment, initialCategory, initialSearch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSearch = searchValue.trim();
    const params = new URLSearchParams();
    if (initialCategory.trim()) {
      params.set('category', initialCategory.trim());
    }
    if (initialSegment.trim()) {
      params.set('segment', initialSegment.trim());
    }
    if (trimmedSearch) {
      params.set('search', trimmedSearch);
    }
    router.push(params.size > 0 ? `/opportunities?${params.toString()}` : '/opportunities');
  };

  const handleClearFilters = () => {
    setSearchValue('');
    router.push('/opportunities');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-border/60 dark:border-white/10 bg-card/80 dark:bg-white/5 p-4 backdrop-blur"
      >
        <div className="space-y-3">
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by title, organizer, or keywords"
            className="h-12 bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
            aria-label="Search opportunities"
          />
          <div className="flex items-center gap-3">
            <Button type="submit" className="flex-1">
              Search
            </Button>
            <Button type="button" variant="ghost" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </form>

      {activeFilters.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground dark:text-white/60">
          {activeFilters.map((filter) => (
            <span
              key={`${filter.label}-${filter.value}`}
              className="inline-flex items-center gap-1 rounded-full border border-border/50 dark:border-white/20 bg-card/70 dark:bg-white/10 px-3 py-1 capitalize"
            >
              <span className="text-white/50">{filter.label}:</span>
              <span className="text-white">{filter.value}</span>
            </span>
          ))}
        </div>
      )}
    </>
  );
}




