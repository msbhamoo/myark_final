'use client';

import React, { createContext, useState, ReactNode, useCallback } from 'react';

type AuthMode = 'login' | 'register';
type AccountType = 'organization' | 'user';

export interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthMode;
  accountType: AccountType;
  redirectUrl: string;
  onOpenChange: (open: boolean) => void;
  openAuthModal: (options?: {
    mode?: AuthMode;
    accountType?: AccountType;
    redirectUrl?: string;
  }) => void;
  closeAuthModal: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [accountType, setAccountType] = useState<AccountType>('user');
  const [redirectUrl, setRedirectUrl] = useState('/dashboard');

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const openAuthModal = useCallback((options?: {
    mode?: AuthMode;
    accountType?: AccountType;
    redirectUrl?: string;
  }) => {
    if (options?.mode) setMode(options.mode);
    if (options?.accountType) setAccountType(options.accountType);
    if (options?.redirectUrl) setRedirectUrl(options.redirectUrl);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        accountType,
        redirectUrl,
        onOpenChange,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}
