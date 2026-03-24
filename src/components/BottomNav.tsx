'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CategoryDrawer } from './CategoryDrawer';
import { AuthDrawer } from './AuthDrawer';

export function BottomNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for myark_student cookie
    const checkAuth = () => {
      const isLogged = document.cookie.split('; ').find(row => row.startsWith('myark_student='));
      setUser(isLogged ? { id: isLogged.split('=')[1] } : null);
      setIsLoading(false);
    };

    checkAuth();
    // Also listen for cookie changes (if possible) or just re-check on focus
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-white dark:bg-[#0a0f0a] border-t border-gray-100 dark:border-white/5 md:hidden z-50 px-4 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <nav className="flex items-center h-full max-w-lg mx-auto">
          
          {/* Categories */}
          <button 
            onClick={() => setIsCategoriesOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 group transition-all active:scale-95 ${
              isCategoriesOpen ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span className="text-[10px] font-bold tracking-tight">Explore</span>
          </button>

          {/* Careers */}
          <Link 
            href="/careers" 
            className={`flex-1 flex flex-col items-center justify-center gap-1 group transition-all active:scale-95 ${
              isActive('/careers') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span className="text-[10px] font-bold tracking-tight">Careers</span>
          </Link>

          {/* Opportunities */}
          <Link 
            href="/opportunities" 
            className={`flex-1 flex flex-col items-center justify-center gap-1 group transition-all active:scale-95 ${
              isActive('/opportunities') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="text-[10px] font-bold tracking-tight leading-none text-center">Opportunities</span>
          </Link>

          {/* Profile */}
          <button 
            onClick={() => {
              if (isLoading) return;
              if (user) {
                window.location.href = '/student/dashboard';
              } else {
                setIsAuthOpen(true);
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 group transition-all active:scale-95 ${
              isActive('/student/dashboard') ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="text-[10px] font-bold tracking-tight">Profile</span>
          </button>

        </nav>
      </div>

      <CategoryDrawer 
        isOpen={isCategoriesOpen} 
        onClose={() => setIsCategoriesOpen(false)} 
      />

      {/* Auth Bottom Sheet */}
      <AuthDrawer 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}
