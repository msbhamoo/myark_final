'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

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

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-grow">{children}</main>
      {footer}
      {bottomNav}
    </>
  );
}
