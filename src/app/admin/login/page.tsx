export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminSession';
import { LoginForm } from './_components/LoginForm';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const isAdmin = verifyAdminSession(sessionCookie);

  // If already authenticated, redirect to admin dashboard
  if (isAdmin) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-slate-900/70 p-8 shadow-xl shadow-slate-950/30 backdrop-blur">
        <h1 className="text-2xl font-semibold text-slate-100">Admin Sign In</h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter the admin password to access the control panel.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
