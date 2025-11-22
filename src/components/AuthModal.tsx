'use client';

import React, { FormEvent, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getFirebaseAuth } from '@/lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import {
  type AuthFlowState,
  type AccountCheckResponse,
  detectIdentifierType,
  validateEmail,
  validatePassword,
  getIdentifierLabel,
  getIdentifierPlaceholder,
  formatPhoneDisplay,
  generateSyntheticEmail,
} from '@/lib/authHelpers';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'register';  // Kept for backward compatibility but not used in new flow
  defaultAccountType?: 'organization' | 'user';
  onSuccess?: () => void;
  redirectUrl?: string;
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultAccountType = 'user',
  onSuccess,
  redirectUrl = '/dashboard',
}: AuthModalProps) {
  const { refreshProfile } = useAuth();

  const accountType = defaultAccountType; // Business or Student
  const isBusiness = accountType === 'organization';

  // Flow state management
  const [flowState, setFlowState] = useState<AuthFlowState>('initial');
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone' | null>(null);
  const [authEmail, setAuthEmail] = useState(''); // Actual or synthetic email for Firebase auth
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationDetails, setOrganizationDetails] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState(''); // For phone accounts during password reset

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFlowState('initial');
        setIdentifier('');
        setIdentifierType(null);
        setAuthEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setOrganizationName('');
        setOrganizationDetails('');
        setRecoveryEmail('');
        setError(null);
      }, 200);
    }
  }, [open]);

  // Detect identifier type as user types
  useEffect(() => {
    const type = detectIdentifierType(identifier);
    setIdentifierType(type);
  }, [identifier]);

  // Auto-check account existence when user stops typing (debounced)
  useEffect(() => {
    if (!identifier.trim() || !identifierType || flowState !== 'initial') return;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/auth/check-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: identifier.trim() }),
        });

        const data: AccountCheckResponse = await response.json();

        if (response.ok) {
          setAuthEmail(data.authEmail || '');
          if (data.exists) {
            setFlowState('existing-user');
          }
        }
      } catch (err) {
        // Silent fail - user can still click Continue
        console.error('Auto account check failed:', err);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timer);
  }, [identifier, identifierType, flowState]);

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
    }
  };

  const handleBack = () => {
    setError(null);
    if (flowState === 'forgot-password') {
      setFlowState('existing-user');
    } else if (flowState === 'existing-user' || flowState === 'new-user') {
      setFlowState('initial');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
    }
  };

  // Step 1: Check if account exists
  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifierType) {
      setError('Please enter a valid email address or mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/check-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data: AccountCheckResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to check account');
        return;
      }

      setAuthEmail(data.authEmail || '');

      if (data.exists) {
        setFlowState('existing-user');
      } else {
        setFlowState('new-user');
      }
    } catch (err) {
      console.error('Account check failed:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2a: Sign in existing user
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, authEmail, password);
      await refreshProfile();

      setFlowState('success');
      onOpenChange(false);
      onSuccess?.();

      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    } catch (loginError: any) {
      console.error('Login failed:', loginError);

      if (loginError.code === 'auth/wrong-password' || loginError.code === 'auth/invalid-credential') {
        setError('Incorrect password. Please try again or use "Forgot Password".');
      } else if (loginError.code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2b: Create new account
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // Business accounts need organization name
    if (isBusiness && !organizationName.trim()) {
      setError('Please enter your organization name.');
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

    // For phone signups, optionally collect email
    if (identifierType === 'phone' && recoveryEmail && !validateEmail(recoveryEmail)) {
      setError('Please enter a valid email address for account recovery.');
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = getFirebaseAuth();

      // Create Firebase account with authEmail (actual or synthetic)
      const credential = await createUserWithEmailAndPassword(auth, authEmail, password);

      // Get ID token for API calls
      const token = await credential.user.getIdToken(true);

      // Store user profile in Firestore
      const profileData: Record<string, unknown> = {
        accountType: defaultAccountType,
        displayName: fullName.trim(),
        email: identifierType === 'email' ? identifier.trim() : (recoveryEmail.trim() || authEmail),
      };

      // Add business details
      if (isBusiness) {
        profileData.organizationName = organizationName.trim();
        profileData.organizationDetails = organizationDetails.trim();
      }

      // Add mobileNumber if signing up with phone
      if (identifierType === 'phone') {
        profileData.mobileNumber = identifier.trim();
      }

      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      await refreshProfile();

      setFlowState('success');
      onOpenChange(false);
      onSuccess?.();

      if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
      }
    } catch (registerError: any) {
      console.error('Registration failed:', registerError);

      if (registerError.code === 'auth/email-already-in-use') {
        setError('This account already exists. Please sign in instead.');
      } else if (registerError.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Password recovery
  const handleForgotPassword = () => {
    setError(null);
    setFlowState('forgot-password');
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // For phone accounts, require recovery email
    if (identifierType === 'phone' && !recoveryEmail) {
      setError('Please enter your email address to receive the password reset link.');
      return;
    }

    if (identifierType === 'phone' && !validateEmail(recoveryEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          emailFallback: identifierType === 'phone' ? recoveryEmail.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send password reset email');
        return;
      }

      // Show success message
      alert('Password reset email sent! Please check your inbox.');
      setFlowState('existing-user');
      setPassword('');
    } catch (err) {
      console.error('Password reset failed:', err);
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different UI based on flow state
  // Render different UI based on flow state
  const renderTitle = () => {
    switch (flowState) {
      case 'initial':
        return isBusiness ? 'Partner with Myark' : 'Welcome to Myark';
      case 'existing-user':
        return `Welcome back${identifierType === 'phone' ? ', ' + formatPhoneDisplay(identifier) : ''}!`;
      case 'new-user':
        return isBusiness ? 'Register Organization' : 'Create your account';
      case 'forgot-password':
        return 'Reset your password';
      default:
        return 'Sign In';
    }
  };

  const renderSubtitle = () => {
    switch (flowState) {
      case 'initial':
        return isBusiness
          ? 'Sign in or register your school/organization'
          : 'Sign in or create an account to continue';
      case 'existing-user':
        return 'Enter your password to continue';
      case 'new-user':
        return isBusiness
          ? 'Enter your organization details to get started'
          : 'Just a few details to get started';
      case 'forgot-password':
        return 'We\'ll send you a link to reset your password';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="h-auto max-h-[95vh] w-[96vw] max-w-md overflow-y-auto border-0 bg-gradient-to-b from-white to-slate-50 p-0 shadow-2xl dark:from-slate-900 dark:to-slate-950 rounded-xl sm:rounded-2xl sm:w-full"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-slate-200/60 bg-gradient-to-r from-primary/5 to-chart-2/5 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-700/60 dark:from-primary/10 dark:to-chart-2/10">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {flowState !== 'initial' && (
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-shrink-0 rounded-lg p-1 text-slate-500 transition-colors hover:bg-white/60 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-foreground dark:text-white truncate">
                  {renderTitle()}
                </h2>
                <p className="mt-1 text-xs sm:text-xs text-muted-foreground dark:text-slate-400 line-clamp-2">
                  {renderSubtitle()}
                </p>
              </div>
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

        {/* Content */}
        <div className="px-4 py-5 sm:px-6 sm:py-6 space-y-4 sm:space-y-5">
          {/* Initial: Email/Phone Input */}
          {flowState === 'initial' && (
            <form onSubmit={handleContinue} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-semibold">
                  {identifierType ? getIdentifierLabel(identifierType) : 'Email or Mobile Number'}
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={getIdentifierPlaceholder(identifierType)}
                  inputMode={identifierType === 'phone' ? 'tel' : identifierType === 'email' ? 'email' : 'text'}
                  autoCapitalize="none"
                  className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
                {identifierType && (
                  <p className="text-xs text-muted-foreground">
                    {identifierType === 'email' ? '✓ Email format detected' : '✓ Indian mobile number detected'}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/70 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !identifierType}
                className="h-11 w-full rounded-lg text-base bg-gradient-to-r from-chart-1 to-chart-2 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:from-chart-2 hover:to-chart-3 hover:shadow-primary/30 disabled:opacity-70 dark:shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          )}

          {/* Existing User: Password Input */}
          {flowState === 'existing-user' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier-display" className="text-sm font-semibold">
                  {getIdentifierLabel(identifierType!)}
                </Label>
                <Input
                  id="identifier-display"
                  value={identifierType === 'phone' ? formatPhoneDisplay(identifier) : identifier}
                  disabled
                  className="h-11 text-base rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold text-primary hover:text-primaryDark dark:text-primary dark:hover:text-primaryDark"
                  >
                    Forgot Password?
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/70 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg text-base bg-gradient-to-r from-chart-1 to-chart-2 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:from-chart-2 hover:to-chart-3 hover:shadow-primary/30 disabled:opacity-70 dark:shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          )}

          {/* New User: Sign Up Form */}
          {flowState === 'new-user' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier-signup" className="text-sm font-semibold">
                  {getIdentifierLabel(identifierType!)}
                </Label>
                <Input
                  id="identifier-signup"
                  value={identifierType === 'phone' ? formatPhoneDisplay(identifier) : identifier}
                  disabled
                  className="h-11 text-base rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {isBusiness && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-sm font-semibold">
                      Organization Name
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      autoComplete="organization"
                      required
                      disabled={isSubmitting}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Enter your school or organization name"
                      className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationDetails" className="text-sm font-semibold">
                      Organization Details (Optional)
                    </Label>
                    <Input
                      id="organizationDetails"
                      name="organizationDetails"
                      type="text"
                      disabled={isSubmitting}
                      value={organizationDetails}
                      onChange={(e) => setOrganizationDetails(e.target.value)}
                      placeholder="Role, department, or other details"
                      className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                    />
                  </div>
                </>
              )}

              {identifierType === 'phone' && (
                <div className="space-y-2">
                  <Label htmlFor="recovery-email" className="text-sm font-semibold">
                    Email (Optional)
                  </Label>
                  <Input
                    id="recovery-email"
                    name="recoveryEmail"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended for password recovery
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-semibold">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50/70 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg text-base bg-gradient-to-r from-chart-1 to-chart-2 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:from-chart-2 hover:to-chart-3 hover:shadow-primary/30 disabled:opacity-70 dark:shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground dark:text-slate-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}

          {/* Password Recovery */}
          {flowState === 'forgot-password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier-reset" className="text-sm font-semibold">
                  {getIdentifierLabel(identifierType!)}
                </Label>
                <Input
                  id="identifier-reset"
                  value={identifierType === 'phone' ? formatPhoneDisplay(identifier) : identifier}
                  disabled
                  className="h-11 text-base rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-400"
                />
              </div>

              {identifierType === 'phone' && (
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="reset-email"
                    name="resetEmail"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-11 text-base rounded-lg border border-slate-200 bg-white/70 text-foreground placeholder:text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send the password reset link to this email
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-50/70 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-lg text-base bg-gradient-to-r from-chart-1 to-chart-2 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:from-chart-2 hover:to-chart-3 hover:shadow-primary/30 disabled:opacity-70 dark:shadow-primary/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
