'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasProfile, setHasProfile] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/opportunities?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface border-b border-default">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          
          {/* Logo */}
          <Link href="/" className="shrink-0 group flex items-center gap-1.5 focus:outline-none">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-heading">
              My<span className="text-primary">ark</span>
            </span>
          </Link>

          {/* Search Bar Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="coding competition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-[#e5e5e5] hover:border-[#d1d1d1] focus:border-primary focus:ring-1 focus:ring-primary rounded-md py-2.5 pl-10 pr-4 text-sm outline-none transition-colors text-heading"
              />
            </form>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/opportunities" className="btn btn-outline border-none text-[15px] font-medium text-heading hover:bg-[#f3f4f6]">
              Explore
            </Link>
            {hasProfile ? (
              <Link href="/student/dashboard" className="btn bg-[#1b5e28] text-white hover:bg-[#14461e] text-[15px] font-medium px-5">
                My Profile
              </Link>
            ) : null}
          </div>

          {/* Mobile Actions */}
          <div className="sm:hidden flex items-center gap-2">
            <Link href="/opportunities" className="text-sm font-medium border border-[#e5e7eb] text-heading rounded-lg px-3 py-1.5 bg-white shadow-sm">
              Explore
            </Link>
            {hasProfile && (
              <Link href="/student/dashboard" className="text-sm font-medium bg-[#1b5e28] text-white rounded-lg px-4 py-1.5 shadow-sm">
                Profile
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
