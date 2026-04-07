'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';
import { CategoryDrawer } from './CategoryDrawer';
import { AuthDrawer } from './AuthDrawer';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLogged = document.cookie.split('; ').find(row => row.startsWith('myark_student='));
      setUser(isLogged ? { id: isLogged.split('=')[1] } : null);
      setIsLoading(false);
    };
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === '/';

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full bg-white dark:bg-[#0a0f0a] border-b border-slate-100 dark:border-white/10 backdrop-blur-md`}>
        <div className="container-main max-w-[1240px]">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-8">

            {/* Logo */}
            <Link href="/" className="shrink-0 focus:outline-none block transition-transform active:scale-95">
              <Logo size="sm" showPulse={false} variant="light" />
            </Link>

            {/* Desktop Navigation & Actions */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6 mr-2">
                 {[
                   { label: 'Explore', href: '/opportunities' },
                   { label: 'Scholarships', href: '/opportunities?category=scholarship' },
                   { label: 'Olympiads', href: '/opportunities?category=olympiad' },
                 ].map((link) => (
                    <Link 
                      key={link.label}
                      href={link.href}
                      className={`text-[13px] font-bold tracking-tight transition-all hover:opacity-100 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors`}
                    >
                     {link.label}
                   </Link>
                 ))}
              </nav>

              <div className="h-3.5 w-[1px] bg-white/10 mx-1"></div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isHome 
                    ? 'text-white/40 hover:text-white hover:bg-white/5' 
                    : 'text-muted hover:text-primary hover:bg-primary/5'
                }`}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </button>
              {user ? (
                <Link href="/student/dashboard" className="h-10 px-5 rounded-xl bg-primary text-white font-bold text-[13px] flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all">
                  My Profile
                </Link>
              ) : (
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  disabled={isLoading}
                  className="h-10 px-5 rounded-xl bg-primary text-white font-bold text-[13px] flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Actions */}
            <div className="md:hidden flex items-center gap-3">
               <button 
                 onClick={toggleTheme} 
                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all text-slate-400 dark:text-slate-500`}
               >
                  {theme === 'dark' ? '☀' : '🌙'}
               </button>
               <button 
                 onClick={() => setIsDrawerOpen(true)}
                 className={`h-9 px-4 rounded-[10px] font-black text-[12px] flex items-center transition-all active:scale-95 bg-primary/5 text-primary border-2 border-primary/10 hover:bg-primary/10`}
               >
                  Categories
               </button>
            </div>

          </div>
        </div>
      </nav>
      
      <CategoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <AuthDrawer 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}
