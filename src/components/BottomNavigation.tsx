'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { cn } from '@/lib/utils';
import { Home, Briefcase, BookOpen, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/categories', label: 'Categories', icon: BookOpen },
  { href: '/parent-guide', label: 'Career', icon: Briefcase },
  { href: null, label: 'Profile', icon: User, requiresAuth: true }, // Profile needs special handling
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleProfileClick = () => {
    if (loading) return; // Don't navigate while auth is loading

    if (!user) {
      // User not logged in - show login modal
      openAuthModal({ mode: 'login' });
      return;
    }

    // User is logged in - redirect to appropriate dashboard
    const accountType = user.accountType || 'user'; // Default to user if type not set

    if (accountType === 'organization') {
      router.push('/dashboard'); // Organization dashboard
    } else {
      router.push('/dashboard'); // Student dashboard
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50 md:hidden">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          let isActive = false;

          if (item.href) {
            isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
          }

          if (item.requiresAuth && item.label === 'Profile') {
            // Special handling for profile - only active on dashboard pages
            const isProfileActive = pathname.startsWith('/dashboard');
            return (
              <button
                key={item.label}
                onClick={handleProfileClick}
                disabled={loading}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 transition-colors',
                  loading
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                  isProfileActive ? 'text-orange-600 dark:text-orange-400' : ''
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          }

          // Regular nav items
          return (
            <a
              key={item.href}
              href={item.href || '#'}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 transition-colors',
                isActive
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
