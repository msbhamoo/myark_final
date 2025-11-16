'use client';

import React, { FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: AuthMode;
  defaultAccountType?: AccountType;
  onSuccess?: () => void;
  redirectUrl?: string;
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultMode = 'login',
  defaultAccountType = 'user',
  onSuccess,
  redirectUrl = '/dashboard',
}: AuthModalProps) {
  const { refreshProfile } = useAuth();
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [accountType, setAccountType] = useState<AccountType>(defaultAccountType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) {
        setError(null);
      }
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get('email') ?? '').trim();
      const password = String(formData.get('password') ?? '');

      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      await refreshProfile();
      
      onOpenChange(false);
      onSuccess?.();
      
      // Navigate after modal is closed
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
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

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get('email') ?? '').trim();
      const password = String(formData.get('password') ?? '');
      const confirmPassword = String(formData.get('confirmPassword') ?? '');
      const fullName = String(formData.get('fullName') ?? '').trim();
      const organizationName = String(formData.get('organizationName') ?? '').trim();
      const organizationDetails = String(formData.get('organizationDetails') ?? '').trim();

      if (!validateEmail(email)) {
        setError('Please provide a valid email address.');
        return;
      }
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!fullName) {
        setError('Please provide your full name.');
        return;
      }
      if (accountType === 'organization' && !organizationName) {
        setError('Organization name is required for organization accounts.');
        return;
      }

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
      
      onOpenChange(false);
      onSuccess?.();
      
      // Navigate after modal is closed
      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    } catch (registerError) {
      console.error('Registration failed', registerError);
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="h-[90vh] max-h-[90vh] w-[95vw] max-w-md overflow-y-auto border-0 bg-gradient-to-b from-white to-slate-50 p-0 shadow-2xl dark:from-slate-900 dark:to-slate-950 rounded-2xl sm:h-auto sm:max-h-none sm:w-full"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-slate-200/60 bg-gradient-to-r from-orange-500/5 to-pink-500/5 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-700/60 dark:from-orange-500/10 dark:to-pink-500/10">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-foreground dark:text-white truncate">
                {mode === 'login' ? 'Welcome back!' : 'Join MyArk'}
              </h2>
              <p className="mt-1 text-xs sm:text-xs text-muted-foreground dark:text-slate-400 line-clamp-2">
                {mode === 'login'
                  ? 'Access your opportunities and dashboard'
                  : 'Start discovering amazing opportunities'}
              </p>
            </div>
            <button
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
              className="mt-0.5 flex-shrink-0 rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/60 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="sticky top-14 sm:top-16 z-10 flex border-b border-slate-200/60 bg-white/50 px-4 pt-3 pb-0 sm:px-6 sm:pt-4 dark:border-slate-700/60 dark:bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => handleModeChange('login')}
            className={`flex-1 px-2 pb-3 text-center text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              mode === 'login'
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-muted-foreground hover:text-foreground dark:hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleModeChange('register')}
            className={`flex-1 px-2 pb-3 text-center text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              mode === 'register'
                ? 'border-b-2 border-pink-500 text-pink-600 dark:text-pink-400'
                : 'text-muted-foreground hover:text-foreground dark:hover:text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-5 sm:px-6 sm:py-6 space-y-4 sm:space-y-5">
          {/* Account Type Selection for Register */}
          {mode === 'register' && (
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-xs font-semibold text-muted-foreground dark:text-slate-400">
                I want to register as:
              </Label>
              <div className="space-y-2 sm:space-y-2">
                {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAccountType(value)}
                    className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all duration-200 ${
                      accountType === value
                        ? 'border-orange-400 bg-orange-50/50 dark:border-orange-400/40 dark:bg-orange-500/10'
                        : 'border-slate-200 bg-slate-50/50 hover:border-orange-200 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-orange-400/30'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm font-semibold text-foreground dark:text-white truncate">
                      {ACCOUNT_TYPE_LABELS[value]}
                    </span>
                    <span className="mt-0.5 sm:mt-1 block text-[10px] sm:text-xs text-muted-foreground dark:text-slate-400 line-clamp-1">
                      {value === 'organization'
                        ? 'Share programs and reach students'
                        : 'Find opportunities and learn'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="login-email" className="text-xs sm:text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  placeholder="you@company.com"
                  className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="login-password" className="text-xs sm:text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/70 p-2.5 sm:p-3 text-xs sm:text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 sm:h-10 w-full rounded-lg text-sm sm:text-base bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-pink-600 hover:shadow-orange-500/30 disabled:opacity-70 dark:shadow-orange-500/10"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="register-full-name" className="text-xs sm:text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="register-full-name"
                  name="fullName"
                  required
                  disabled={isSubmitting}
                  placeholder="Alex Johnson"
                  className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {accountType === 'organization' && (
                <>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="register-organization-name" className="text-xs sm:text-sm font-semibold">
                      Organization Name
                    </Label>
                    <Input
                      id="register-organization-name"
                      name="organizationName"
                      required
                      disabled={isSubmitting}
                      placeholder="Your Organization"
                      className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="register-organization-details" className="text-xs sm:text-sm font-semibold">
                      Organization Overview
                    </Label>
                    <Textarea
                      id="register-organization-details"
                      name="organizationDetails"
                      placeholder="Tell us about your organization..."
                      disabled={isSubmitting}
                      className="min-h-16 sm:min-h-20 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 resize-none"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="register-email" className="text-xs sm:text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  placeholder="you@company.com"
                  className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="register-password" className="text-xs sm:text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  disabled={isSubmitting}
                  placeholder="Create a secure password"
                  className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground dark:text-slate-500">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="register-confirm-password" className="text-xs sm:text-sm font-semibold">
                  Confirm Password
                </Label>
                <Input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={isSubmitting}
                  placeholder="Confirm your password"
                  className="h-9 sm:h-10 text-sm rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/70 p-2.5 sm:p-3 text-xs sm:text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 sm:h-10 w-full rounded-lg text-sm sm:text-base bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-pink-600 hover:shadow-orange-500/30 disabled:opacity-70 dark:shadow-orange-500/10"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>

              <p className="text-center text-[10px] sm:text-xs text-muted-foreground dark:text-slate-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-200/60 bg-slate-50/50 px-4 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-xs text-muted-foreground dark:border-slate-700/60 dark:bg-slate-800/30 dark:text-slate-400">
          {mode === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => handleModeChange('register')}
                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => handleModeChange('login')}
                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
