'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { cn } from '@/lib/utils';
import { Home, Briefcase, BookOpen, User } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/opportunities', label: 'Explore', icon: Briefcase },
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-950/50 md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
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
                  'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-all duration-300',
                  loading
                    ? 'text-slate-400 cursor-not-allowed'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
                  isProfileActive && 'text-primary dark:text-primary'
                )}
              >
                {/* Active pill indicator */}
                <span
                  className={cn(
                    'absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary transition-all duration-300',
                    isProfileActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-2 rounded-xl bg-primary/10 transition-all duration-300',
                    isProfileActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  )}
                />
                <Icon className={cn(
                  'relative h-5 w-5 transition-transform duration-300',
                  isProfileActive && 'scale-110'
                )} />
                <span className={cn(
                  'relative text-[10px] font-semibold transition-all duration-300',
                  isProfileActive && 'text-primary font-bold'
                )}>{item.label}</span>
              </button>
            );
          }

          // Regular nav items
          return (
            <a
              key={item.href}
              href={item.href || '#'}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-all duration-300',
                isActive
                  ? 'text-primary dark:text-primary'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              {/* Active pill indicator */}
              <span
                className={cn(
                  'absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary transition-all duration-300',
                  isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                )}
              />
              <span
                className={cn(
                  'absolute inset-2 rounded-xl bg-primary/10 transition-all duration-300',
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                )}
              />
              <Icon className={cn(
                'relative h-5 w-5 transition-transform duration-300',
                isActive && 'scale-110'
              )} />
              <span className={cn(
                'relative text-[10px] font-semibold transition-all duration-300',
                isActive && 'text-primary font-bold'
              )}>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

