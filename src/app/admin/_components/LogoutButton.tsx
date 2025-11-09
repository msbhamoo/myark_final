"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    try {
      setIsPending(true);
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to sign out');
      }
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
