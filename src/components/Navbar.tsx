'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';

export function Navbar() {
  const pathname = usePathname();
    const [hasProfile, setHasProfile] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isStudent = document.cookie.includes('myark_student=');
      setHasProfile(isStudent);
    }
  }, []);

  // Protect admin routes visually? Not really needed for rendering standard Navbar.
  if (pathname.startsWith('/admin')) {
    return null; // Admin has its own layout
  }



  return (
    <nav className="sticky top-0 z-50 w-full bg-surface border-b border-default">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">

          {/* Logo */}
          <Link href="/" className="shrink-0 focus:outline-none block">
            <Logo size="md" showPulse={true} />
          </Link>



          {/* Action Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-heading hover:bg-[var(--color-bg)] transition-colors"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>

            <Link href="/opportunities" className="btn btn-outline border-none text-[15px] font-medium text-heading hover:bg-[var(--color-bg)]">
              Explore
            </Link>
            {hasProfile ? (
              <Link href="/student/dashboard" className="btn bg-primary text-white hover:bg-[var(--color-primary-hover)] text-[15px] font-medium px-5">
                My Profile
              </Link>
            ) : (
              <Link href="/student/auth" className="btn bg-primary text-white hover:bg-[var(--color-primary-hover)] text-[15px] font-medium px-5">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden flex items-center gap-2">
            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-heading transition-colors"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>
            <Link href="/opportunities" className="text-sm font-medium border border-[var(--color-border-default)] text-heading rounded-lg px-3 py-1.5 bg-surface shadow-sm">
              Explore
            </Link>
            {hasProfile ? (
              <Link href="/student/dashboard" className="text-sm font-medium bg-primary text-white rounded-lg px-4 py-1.5 shadow-sm">
                Profile
              </Link>
            ) : (
              <Link href="/student/auth" className="text-sm font-medium bg-primary text-white rounded-lg px-4 py-1.5 shadow-sm">
                Login
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
