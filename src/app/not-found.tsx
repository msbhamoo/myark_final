import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-bg">
      <Logo size="lg" className="mb-8" />
      
      <h1 className="text-[64px] md:text-[96px] font-heading font-extrabold text-heading leading-none mb-4 tracking-tight">
        404
      </h1>
      <h2 className="text-[20px] md:text-[24px] font-heading font-bold text-heading mb-3">
        Page not found
      </h2>
      <p className="text-[15px] text-muted max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. 
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-white font-bold text-[14px] hover:opacity-90 transition-opacity shadow-sm"
        >
          Go to Homepage
        </Link>
        <Link 
          href="/opportunities" 
          className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-surface border border-default text-heading font-bold text-[14px] hover:bg-[var(--color-bg)] transition-colors"
        >
          Browse Opportunities
        </Link>
      </div>

      <div className="mt-16 flex flex-wrap justify-center gap-6 text-[13px] text-muted">
        <Link href="/olympiads" className="hover:text-primary transition-colors">Olympiads</Link>
        <Link href="/careers" className="hover:text-primary transition-colors">Careers</Link>
        <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}
