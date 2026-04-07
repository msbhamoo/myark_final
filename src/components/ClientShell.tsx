'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { RegisterModal } from './RegisterModal';
import { OpportunityQuickView } from './OpportunityQuickView';
import { Opportunity } from '@/lib/types';

export function ClientShell({ 
  children,
  navbar,
  footer,
  bottomNav
}: { 
  children: ReactNode;
  navbar: ReactNode;
  footer: ReactNode;
  bottomNav: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [authOpp, setAuthOpp] = useState<Opportunity | null>(null);
  const [quickViewOpp, setQuickViewOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    const handleOpenRegister = (e: Event) => {
      setAuthOpp((e as CustomEvent).detail);
    };
    
    const handleOpenQuickView = (e: Event) => {
      setQuickViewOpp((e as CustomEvent).detail);
    };

    window.addEventListener('openRegisterModal', handleOpenRegister);
    window.addEventListener('openQuickViewModal', handleOpenQuickView);
    
    return () => {
      window.removeEventListener('openRegisterModal', handleOpenRegister);
      window.removeEventListener('openQuickViewModal', handleOpenQuickView);
    };
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-grow">{children}</main>
      {footer}
      {bottomNav}
       {authOpp && (
        <RegisterModal 
          opportunity={authOpp}
          isOpen={true}
          onClose={() => setAuthOpp(null)}
        />
      )}
      {quickViewOpp && (
        <OpportunityQuickView 
          opportunity={quickViewOpp}
          isOpen={true}
          onClose={() => setQuickViewOpp(null)}
        />
      )}
    </>
  );
}
