'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import type { Opportunity } from '@/types/opportunity';
import { format } from 'date-fns';

const NAV_LINKS = [
  { href: '/for-schools', label: 'For Schools' },
  { href: '/faq', label: 'Support' },
];

const formatDate = (value?: string) => {
  if (!value) return 'TBA';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return format(date, 'MMM dd, yyyy');
  } catch {
    return value;
  }
};

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Opportunity[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHostClick = () => {
    // If user is already logged in with organization account, go directly to host dashboard
    if (user && user.accountType === 'organization') {
      router.push('/host');
    } else {
      router.push('/for-schools?openAuth=true');
    }
  };

  const handleLoginClick = () => {
    openAuthModal({ mode: 'login' });
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Live search handler with debounce
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchResults(true);

    try {
      const response = await fetch(`/api/opportunities/search?q=${encodeURIComponent(query)}&limit=8`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(Array.isArray(data.opportunities) ? data.opportunities : []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchValue.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchValue);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue, handleSearch]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    setShowSearchResults(false);
    if (trimmed.length === 0) {
      router.push('/opportunities');
      return;
    }
    router.push(`/opportunities?search=${encodeURIComponent(trimmed)}`);
  };

  const renderNavLinks = (linkClassName?: string) =>
    NAV_LINKS.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          'text-sm font-semibold text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary',
          linkClassName,
        )}
      >
        {item.label}
      </Link>
    ));



  return (
    <header className="sticky -top-[64px] lg:top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-left text-lg font-semibold text-foreground">
                    Browse Myark
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <nav className="flex flex-col gap-3 text-lg font-semibold text-slate-700">
                    {renderNavLinks('text-slate-700 hover:text-primary')}
                  </nav>
                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
                    <Button variant="outline" onClick={handleHostClick}>
                      Host an opportunity
                    </Button>
                    {user ? (
                      <>
                        <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                          Dashboard
                        </Button>
                        <Button onClick={handleLogout}>Logout</Button>
                      </>
                    ) : (
                      <Button onClick={handleLoginClick} disabled={loading}>
                        Login
                      </Button>
                    )}
                    <SheetClose asChild>
                      <ThemeToggle className="self-start lg:hidden" />
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-2xl border border-accent/50 bg-white/90 px-3 py-2 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-primary/20 dark:bg-slate-900/80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 text-lg font-bold text-white shadow-md shadow-primary/30">
                M
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Myark</span>
            </Link>
            {/* <div className="hidden flex-col leading-tight lg:flex">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Trusted Families</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">Inspiring young achievers</span>
            </div> */}
          </div>

          <div className="hidden flex-1 lg:flex">
            <div className="relative w-full">
              <form className="w-full" onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                <Input
                  type="search"
                  placeholder="Search scholarships, olympiads, entrance exams..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="w-full rounded-xl border border-border/60 bg-card/70 pl-10 pr-10 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/40"
                  aria-label="Search opportunities"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('');
                      setShowSearchResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button type="submit" aria-hidden="true" className="hidden" />
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50">
                  <div className="rounded-xl border border-slate-200 bg-white shadow-2xl max-h-[400px] overflow-y-auto dark:border-slate-700 dark:bg-slate-900">
                    {searchLoading ? (
                      <div className="p-6 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-2">
                        {searchResults.map((opportunity) => (
                          <Link
                            key={opportunity.id}
                            href={`/opportunity/${opportunity.id}`}
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchValue('');
                            }}
                            className="flex gap-3 p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-primary/5 transition border border-transparent hover:border-accent/30 dark:hover:border-primary/30"
                          >
                            {opportunity.image && (
                              <img
                                src={opportunity.image}
                                alt={opportunity.title}
                                className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                {opportunity.title}
                              </h4>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                {opportunity.organizer}
                              </p>
                              <div className="flex gap-1.5 mt-1.5">
                                <span className="text-xs rounded-full bg-accent/20 dark:bg-primary/20 px-2 py-0.5 text-slate-700 dark:text-slate-200">
                                  {opportunity.category}
                                </span>
                                {opportunity.registrationDeadline && (
                                  <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-blue-700 dark:text-blue-200">
                                    {formatDate(opportunity.registrationDeadline)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          No results for "{searchValue}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">{renderNavLinks()}</nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle className="hidden lg:flex" size="sm" />
            <Button
              className="hidden whitespace-nowrap rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primaryDark lg:inline-flex"
              onClick={handleHostClick}
            >
              Host with Us
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden rounded-full border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-accent/20 sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-primary"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-primary dark:hover:bg-primaryDark"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="rounded-full border-accent bg-white px-5 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-accent/20 dark:border-primary/40 dark:bg-slate-900 dark:text-accent"
                onClick={handleLoginClick}
                disabled={loading}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          <div className="relative">
            <form className="w-full" onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
              <Input
                type="search"
                placeholder="Search scholarships, olympiads, entrance exams..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/70 pl-10 pr-10 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/40"
                aria-label="Search opportunities"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('');
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button type="submit" aria-hidden="true" className="hidden" />
            </form>

            {/* Mobile Search Results */}
            {showSearchResults && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50">
                <div className="rounded-xl border border-slate-200 bg-white shadow-2xl max-h-[300px] overflow-y-auto dark:border-slate-700 dark:bg-slate-900">
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((opportunity) => (
                        <Link
                          key={opportunity.id}
                          href={`/opportunity/${opportunity.id}`}
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchValue('');
                          }}
                          className="flex gap-2 p-2 rounded-lg hover:bg-accent/10 dark:hover:bg-primary/5 transition"
                        >
                          {opportunity.image && (
                            <img
                              src={opportunity.image}
                              alt={opportunity.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {opportunity.title}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                              {opportunity.organizer}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        No results
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
              <span className="font-medium text-slate-700 dark:text-slate-100">Quick links:</span>
              <div className="flex items-center gap-2">
                <Link href="/opportunities" className="underline-offset-4 hover:underline">
                  All
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/opportunities?mode=online" className="underline-offset-4 hover:underline">
                  Online
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/opportunities?mode=offline" className="underline-offset-4 hover:underline">
                  Offline
                </Link>
                <span aria-hidden="true">•</span>
                <Link href="/opportunities?grades=7-9" className="underline-offset-4 hover:underline">
                  Browse grades
                </Link>
              </div>
            </div>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
}

