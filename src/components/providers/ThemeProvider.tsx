'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme-preference"
      disableTransitionOnChange={false}
      enableColorScheme={false}
      themes={['light', 'dark']}
    >
      {children}
    </NextThemeProvider>
  );
}

