'use client';

import { useState } from 'react';
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

const NAV_LINKS = [
  { href: '/opportunities', label: 'For Students' },
  { href: '/faq', label: 'Support' },
];

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [searchValue, setSearchValue] = useState('');

  const handleHostClick = () => {
    if (!user) {
      openAuthModal({
        mode: 'register',
        accountType: 'organization',
        redirectUrl: '/host',
      });
      return;
    }
    router.push('/host');
  };

  const handleLoginClick = () => {
    openAuthModal({ mode: 'login' });
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
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
          'text-sm font-semibold text-slate-600 transition-colors hover:text-orange-500 dark:text-slate-300 dark:hover:text-orange-300',
          linkClassName,
        )}
      >
        {item.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-slate-700 dark:bg-slate-900/50">
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
                    {renderNavLinks('text-slate-700 hover:text-orange-500')}
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
              className="flex items-center gap-2 rounded-2xl border border-orange-100/50 bg-white/90 px-3 py-2 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-orange-300/20 dark:bg-slate-900/80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 text-lg font-bold text-white shadow-md shadow-orange-400/30">
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
            <form className="relative w-full" onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search scholarships, olympiads, entrance exams..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full rounded-xl border border-border/60 bg-card/70 pl-10 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/40"
                aria-label="Search opportunities"
              />
              <button type="submit" aria-hidden="true" className="hidden" />
            </form>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">{renderNavLinks()}</nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle className="hidden lg:flex" size="sm" />
            <Button
              className="hidden whitespace-nowrap rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 lg:inline-flex"
              onClick={handleHostClick}
            >
              Host with Us
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden rounded-full border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-orange-500 transition hover:border-orange-300 hover:bg-orange-50 sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-orange-200"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-600"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="rounded-full border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-orange-300/40 dark:bg-slate-900 dark:text-orange-200"
                onClick={handleLoginClick}
                disabled={loading}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          <form className="relative w-full" onSubmit={handleSearchSubmit}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scholarships, olympiads, entrance exams..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-xl border border-border/60 bg-card/70 pl-10 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/40"
              aria-label="Search opportunities"
            />
            <button type="submit" aria-hidden="true" className="hidden" />
          </form>
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

