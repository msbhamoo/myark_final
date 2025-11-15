'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'login' | 'register';
type AccountType = 'organization' | 'user';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  organization: 'Business / Organization Account',
  user: 'User Account',
};

const validateEmail = (value: string): boolean => /\S+@\S+\.\S+/.test(value);
const validatePassword = (value: string): boolean => value.length >= 8;

export default function LoginPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');

  // default safe values; we'll overwrite from window.location.search in useEffect
  const [accountType, setAccountType] = useState<AccountType>('user');
  const [redirectUrl, setRedirectUrl] = useState<string>('/dashboard');

  // client-only: read query params from window.location to avoid useSearchParams ISR/SSR issues
  useEffect(() => {
    try {
      const qp = new URLSearchParams(window.location.search);
      const acct = qp.get('accountType');
      setAccountType(acct === 'organization' ? 'organization' : 'user');

      const redirect = qp.get('redirect') ?? '/dashboard';
      setRedirectUrl(redirect);
    } catch (err) {
      // ignore if URLSearchParams is unavailable for any reason
      setAccountType('user');
      setRedirectUrl('/dashboard');
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      await refreshProfile();
      router.replace(redirectUrl);
    } catch (loginError) {
      console.error('Login failed', loginError);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');
    const fullName = String(formData.get('fullName') ?? '').trim();
    const organizationName = String(formData.get('organizationName') ?? '').trim();
    const organizationDetails = String(formData.get('organizationDetails') ?? '').trim();

    if (!validateEmail(email)) {
      setError('Please provide a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }
    if (!fullName) {
      setError('Please provide your full name.');
      setIsSubmitting(false);
      return;
    }
    if (accountType === 'organization' && !organizationName) {
      setError('Organization name is required for organization accounts.');
      setIsSubmitting(false);
      return;
    }

    try {
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, {
        displayName: accountType === 'organization' ? organizationName : fullName,
      });

      const token = await credential.user.getIdToken(true);
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountType,
          displayName: fullName,
          organizationName: accountType === 'organization' ? organizationName : undefined,
          organizationDetails,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to persist profile');
      }

      await refreshProfile();
      router.replace(redirectUrl);
    } catch (registerError) {
      console.error('Registration failed', registerError);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-foreground dark:text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 md:flex-row">
        <div className="flex-1 space-y-6">
          <p className="inline-flex rounded-full border border-border/60 dark:border-slate-700 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground dark:text-slate-100">
            MyArk Opportunities Portal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground dark:text-white md:text-5xl">
            Access opportunities or host new programs with one secure account.
          </h1>
          <p className="text-lg text-muted-foreground dark:text-slate-100">
            Sign in to manage your dashboard, or create a business account to publish opportunities
            for review by the MyArk admin team.
          </p>
          <div className="rounded-2xl border border-border/60 dark:border-slate-700 bg-card/80 dark:bg-slate-800/50 p-6 backdrop-blur">
            <h2 className="text-lg font-medium text-foreground dark:text-white">Need help?</h2>
            <p className="mt-2 text-sm text-muted-foreground dark:text-slate-100">
              Business accounts can review submission guidelines inside the dashboard after
              onboarding. Students, parents, and faculty members can save favourite opportunities
              once signed in.
            </p>
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-border/60 dark:border-slate-700 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur md:p-8">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as AuthMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-card/80 dark:bg-slate-800/50">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-5">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="accountType" className="text-sm text-muted-foreground dark:text-slate-100">
                    Account type
                  </Label>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAccountType(value)}
                        className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                          accountType === value
                            ? 'border-orange-400/60 bg-orange-500/10 text-foreground dark:text-white'
                            : 'border-white/10 bg-card/80 dark:bg-slate-800/50 text-muted-foreground dark:text-slate-100 hover:border-border/40 dark:hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span className="block text-sm font-medium">
                          {ACCOUNT_TYPE_LABELS[value]}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground dark:text-white/60">
                          {value === 'organization'
                            ? 'Share detailed programs to reach the MyArk community.'
                            : 'Save opportunities and get personalized updates.'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <TabsContent value="login" className="mt-0">
                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                    />
                  </div>
                  {error && mode === 'login' && (
                    <p className="text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    {isSubmitting ? 'Signing in…' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form className="space-y-5" onSubmit={handleRegister}>
                  <div className="space-y-2">
                    <Label htmlFor="register-full-name">Full name</Label>
                    <Input
                      id="register-full-name"
                      name="fullName"
                      required
                      placeholder="Alex Johnson"
                      className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                    />
                  </div>

                  {accountType === 'organization' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="register-organization-name">Organization name</Label>
                        <Input
                          id="register-organization-name"
                          name="organizationName"
                          required
                          placeholder="Bright Future Foundation"
                          className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-organization-details">
                          Organization overview
                        </Label>
                        <Textarea
                          id="register-organization-details"
                          name="organizationDetails"
                          placeholder="Tell us briefly what your organization does."
                          className="min-h-[120px] bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      required
                      placeholder="Create a secure password"
                      className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                    />
                    <p className="text-xs text-muted-foreground dark:text-white/50">Must be at least 8 characters.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm password</Label>
                    <Input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="Confirm your password"
                      className="bg-card/70 dark:bg-white/10 text-foreground dark:text-white placeholder:text-white/50"
                    />
                  </div>
                  {error && mode === 'register' && (
                    <p className="text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    {isSubmitting ? 'Creating account…' : 'Create account'}
                  </Button>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}