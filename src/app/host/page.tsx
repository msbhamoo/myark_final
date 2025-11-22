'use client';

import { Suspense, ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HostOpportunityForm from './_components/HostOpportunityForm';

const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/30 via-white to-primary/10 dark:bg-[#050b3a]">
    <Header />
    <main className="flex-1">
      <div className="container mx-auto max-w-4xl px-4 py-20 md:px-6">{children}</div>
    </main>
    <Footer />
  </div>
);

const FormContent = () => (
  <Suspense
    fallback={
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-slate-200 bg-white/90 p-12 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100">
        Loading your account…
      </div>
    }
  >
    <HostOpportunityForm />
  </Suspense>
);

export default function HostOpportunityPage() {
  return (
    <PageShell>
      <FormContent />
    </PageShell>
  );
}




