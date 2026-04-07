'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-bg">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      
      <h1 className="text-[24px] md:text-[32px] font-heading font-extrabold text-heading mb-3">
        Something went wrong
      </h1>
      <p className="text-[15px] text-muted max-w-md mb-8 leading-relaxed">
        We encountered an unexpected error. This has been reported automatically. 
        Please try again or head back to the homepage.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white font-bold text-[14px] hover:opacity-90 transition-opacity shadow-sm"
        >
          Try Again
        </button>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-surface border border-default text-heading font-bold text-[14px] hover:bg-[var(--color-bg)] transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
