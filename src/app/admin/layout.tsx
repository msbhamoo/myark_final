export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminSession';
import { LogoutButton } from './_components/LogoutButton';

// Navigation configuration with icon names (resolved in client component)
const navSections = [
  {
    title: 'Main',
    items: [
      { href: '/admin', label: 'Dashboard', iconName: 'LayoutDashboard' },
      { href: '/admin/opportunities', label: 'Opportunities', iconName: 'FileText' },
      { href: '/admin/opportunities/quizzes', label: 'Quizzes', iconName: 'HelpCircle' },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/hosts', label: 'Hosts', iconName: 'Building2' },
      { href: '/admin/home', label: 'Home Layout', iconName: 'Home' },
      { href: '/admin/blogs', label: 'Blogs', iconName: 'BookOpen' },
      { href: '/admin/bulk', label: 'Bulk Uploads', iconName: 'Upload' },
    ],
  },
  {
    title: 'Management',
    items: [
      { href: '/admin/schools', label: 'Schools', iconName: 'School' },
      { href: '/admin/users', label: 'Users', iconName: 'Users' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/admin/theme', label: 'Theme', iconName: 'Palette' },
      { href: '/admin/settings', label: 'Settings', iconName: 'Settings' },
    ],
  },
];

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AdminSidebar } from './_components/AdminSidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = verifyAdminSession(sessionCookie);

  // If not authenticated, allow only the login page content to render
  if (!isAdmin) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  // Show admin layout only for authenticated users
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 border-b border-border/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
                M
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  MyArk
                </span>
                <span className="text-[10px] font-medium text-muted-foreground -mt-1">
                  Admin Panel
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                A
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
          {/* Collapsible Sidebar */}
          <AdminSidebar navSections={navSections} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}



