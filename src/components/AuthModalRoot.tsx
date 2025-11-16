'use client';

import { useAuthModal } from '@/hooks/use-auth-modal';
import AuthModal from '@/components/AuthModal';

export default function AuthModalRoot() {
  const { isOpen, onOpenChange, mode, accountType, redirectUrl } = useAuthModal();

  return (
    <AuthModal
      open={isOpen}
      onOpenChange={onOpenChange}
      defaultMode={mode}
      defaultAccountType={accountType}
      redirectUrl={redirectUrl}
    />
  );
}
