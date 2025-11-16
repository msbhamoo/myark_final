'use client';

import { useContext } from 'react';
import type { AuthModalContextType } from '@/context/AuthModalContext';
import { AuthModalContext } from '@/context/AuthModalContext';

export function useAuthModal(): AuthModalContextType {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}

