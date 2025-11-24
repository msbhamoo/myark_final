"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Failed to sign in');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="admin-identifier" className="mb-2 block text-sm font-medium text-slate-200">
          Username or Email
        </label>
        <Input
          id="admin-identifier"
          type="text"
          required
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="admin or email@example.com"
          className="bg-slate-900/80 text-slate-100"
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-200">
          Password
        </label>
        <Input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          className="bg-slate-900/80 text-slate-100"
        />
      </div>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
