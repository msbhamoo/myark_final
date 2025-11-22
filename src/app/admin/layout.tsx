export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminSession';
import { LogoutButton } from './_components/LogoutButton';

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/opportunities', label: 'Opportunities' },
  { href: '/admin/hosts', label: 'Hosts' },
  { href: '/admin/home', label: 'Home Layout' },
  { href: '/admin/blogs', label: 'Blogs' },
  { href: '/admin/bulk', label: 'Bulk Uploads' },
  { href: '/admin/schools', label: 'Schools' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/theme', label: 'Theme' },
  { href: '/admin/settings', label: 'Settings' },
];

import { ThemeProvider } from '@/components/providers/ThemeProvider';

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
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/40">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/admin" className="text-lg font-semibold tracking-tight">
              MyArk Admin
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl gap-6 px-6 py-10">
          <aside className="w-60 shrink-0 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}


