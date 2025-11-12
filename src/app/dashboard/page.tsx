'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StudentPortfolioDashboard from './student/StudentPortfolioDashboard';
import OrganizationDashboard from './OrganizationDashboard';

export default function DashboardPage() {
  const { user, loading, getIdToken, signOut } = useAuth();
  const router = useRouter();

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-slate-600 dark:text-white/70">Preparing your dashboard…</p>
      </div>
    );
  } else if (!user) {
    content = (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">You&apos;re not signed in</h1>
        <p className="max-w-2xl text-slate-600 dark:text-white/70">
          Sign in to manage opportunities and personalise your Myark experience.
        </p>
        <Button
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600"
          onClick={() => router.push('/login?redirect=/dashboard')}
        >
          Go to login
        </Button>
      </div>
    );
  } else if (user.accountType === 'organization') {
    content = (
      <OrganizationDashboard user={user} getIdToken={getIdToken} signOut={signOut} />
    );
  } else {
    content = (
      <StudentPortfolioDashboard user={user} getIdToken={getIdToken} signOut={signOut} />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-orange-50 via-white to-sky-50 dark:from-[#050b3a] dark:via-[#050b3a] dark:to-[#071045]">
      <Header />
      <main className="flex-1 px-4 py-12 text-slate-900 sm:px-6 lg:px-10 dark:text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">{content}</div>
      </main>
      <Footer />
    </div>
  );
}
