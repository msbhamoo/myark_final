'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModalProvider } from '@/context/AuthModalContext';
import { ThemeProvider } from './ThemeProvider';
import AuthModalRoot from '../AuthModalRoot';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider>
          <AuthModalRoot />
          {children}
        </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
