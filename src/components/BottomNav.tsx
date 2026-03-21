'use client';
import Link from 'next/link';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-surface border-t border-[#e5e5e5] md:hidden z-50 px-4 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <nav className="flex items-center justify-between h-full max-w-sm mx-auto">
        <Link href="/" className="flex flex-col items-center justify-center w-16 gap-1 group">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[10px] font-semibold text-primary">Explore</span>
        </Link>
        <Link href="/opportunities" className="flex flex-col items-center justify-center w-16 gap-1 group text-[#9ca3af] hover:text-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span className="text-[10px] font-medium">Deadlines</span>
        </Link>
        <Link href="/student/dashboard" className="flex flex-col items-center justify-center w-16 gap-1 group text-[#9ca3af] hover:text-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 0 0 1 2 2v16z"></path></svg>
          <span className="text-[10px] font-medium">Saved</span>
        </Link>
        <Link href="/student/dashboard" className="flex flex-col items-center justify-center w-16 gap-1 group text-[#9ca3af] hover:text-heading">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
