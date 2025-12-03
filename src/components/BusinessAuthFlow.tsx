'use client';

import React, { FormEvent, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft, Loader2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    type AuthFlowState,
    type AccountCheckResponse,
    detectIdentifierType,
    validateEmail,
    validatePassword,
    getIdentifierLabel,
    getIdentifierPlaceholder,
    formatPhoneDisplay,
} from '@/lib/authHelpers';

export default function BusinessAuthFlow() {
    const router = useRouter();
    const { refreshProfile, user, loading } = useAuth();

    // Flow state management
    const [flowState, setFlowState] = useState<AuthFlowState>('initial');
    const [identifier, setIdentifier] = useState('');
    const [identifierType, setIdentifierType] = useState<'email' | 'phone' | null>(null);
    const [authEmail, setAuthEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [organizationDetails, setOrganizationDetails] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.push('/host');
        }
    }, [user, loading, router]);

    // Detect identifier type
    useEffect(() => {
        const type = detectIdentifierType(identifier);
        setIdentifierType(type);
    }, [identifier]);

    const handleBack = () => {
        setError(null);
        if (flowState === 'forgot-password') {
            setFlowState('existing-user');
        } else if (flowState === 'existing-user' || flowState === 'new-user') {
            setFlowState('initial');
            setPassword('');
            setConfirmPassword('');
            setFullName('');
            setOrganizationName('');
            setOrganizationDetails('');
        }
    };

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
            router.push('/host');
        } catch (loginError: any) {
            console.error('Login failed:', loginError);

            if (loginError.code === 'auth/wrong-password' || loginError.code === 'auth/invalid-credential') {
                setError('Incorrect password. Please try again.');
            } else if (loginError.code === 'auth/user-disabled') {
                setError('This account has been disabled. Please contact support.');
            } else {
                setError('Failed to sign in. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!organizationName.trim()) {
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

        if (identifierType === 'phone' && recoveryEmail && !validateEmail(recoveryEmail)) {
            setError('Please enter a valid email address for account recovery.');
            return;
        }

        setIsSubmitting(true);

        try {
            const auth = getFirebaseAuth();
            const credential = await createUserWithEmailAndPassword(auth, authEmail, password);
            const token = await credential.user.getIdToken(true);

            const profileData: Record<string, unknown> = {
                accountType: 'organization',
                displayName: fullName.trim(),
                organizationName: organizationName.trim(),
                organizationDetails: organizationDetails.trim(),
                email: identifierType === 'email' ? identifier.trim() : (recoveryEmail.trim() || authEmail),
            };

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
                throw new Error('Failed to create organization profile');
            }

            await refreshProfile();
            setFlowState('success');
            router.push('/host');
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

    const handleForgotPassword = () => {
        setError(null);
        setFlowState('forgot-password');
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

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

    const renderTitle = () => {
        switch (flowState) {
            case 'initial':
                return 'Business Account';
            case 'existing-user':
                return 'Welcome back!';
            case 'new-user':
                return 'Create Business Account';
            case 'forgot-password':
                return 'Reset Password';
            default:
                return 'Sign In';
        }
    };

    const renderSubtitle = () => {
        switch (flowState) {
            case 'initial':
                return 'Sign in or create an account to host opportunities';
            case 'existing-user':
                return 'Enter your password to continue';
            case 'new-user':
                return 'Share your programs with students across India';
            case 'forgot-password':
                return 'We\'ll send you a link to reset your password';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:bg-slate-900/80"
                    >
                        <img
                            src="/myark-logo.png"
                            alt="Myark"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-lg">
                    {/* Card */}
                    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900/80">
                        {/* Header */}
                        <div className="border-b border-slate-200/60 bg-gradient-to-r from-primary/5 to-chart-2/5 px-6 py-6 dark:border-slate-700/60 dark:from-primary/10 dark:to-chart-2/10">
                            <div className="flex items-center gap-3 mb-3">
                                {flowState !== 'initial' && (
                                    <button
                                        onClick={handleBack}
                                        disabled={isSubmitting}
                                        className="flex-shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/60 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
                                        aria-label="Go back"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-white/80 p-3 shadow-sm dark:bg-white/10">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-foreground dark:text-white">
                                            {renderTitle()}
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground dark:text-slate-400">
                                {renderSubtitle()}
                            </p>
                        </div>

                        {/* Form Content */}
                        <div className="px-6 py-6 space-y-5">
                            {/* Initial State */}
                            {flowState === 'initial' && (
                                <form onSubmit={handleContinue} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="identifier" className="text-sm font-semibold">
                                            {identifierType ? getIdentifierLabel(identifierType) : 'Email or Mobile Number'}
                                        </Label>
                                        <Input
                                            id="identifier"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            placeholder={getIdentifierPlaceholder(identifierType)}
                                            inputMode={identifierType === 'phone' ? 'tel' : identifierType === 'email' ? 'email' : 'text'}
                                            autoCapitalize="none"
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 text-base"
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
                                        className="h-11 w-full text-base"
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

                            {/* Existing User */}
                            {flowState === 'existing-user' && (
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            {getIdentifierLabel(identifierType!)}
                                        </Label>
                                        <Input
                                            value={identifierType === 'phone' ? formatPhoneDisplay(identifier) : identifier}
                                            disabled
                                            className="h-11 bg-slate-50 dark:bg-slate-800/30"
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
                                                className="text-xs font-semibold text-primary hover:text-primaryDark"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 text-base"
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
                                        className="h-11 w-full text-base"
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

                            {/* New User */}
                            {flowState === 'new-user' && (
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            {getIdentifierLabel(identifierType!)}
                                        </Label>
                                        <Input
                                            value={identifierType === 'phone' ? formatPhoneDisplay(identifier) : identifier}
                                            disabled
                                            className="h-11 bg-slate-50 dark:bg-slate-800/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm font-semibold">
                                            Your Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organizationName" className="text-sm font-semibold">
                                            Organization Name
                                        </Label>
                                        <Input
                                            id="organizationName"
                                            value={organizationName}
                                            onChange={(e) => setOrganizationName(e.target.value)}
                                            placeholder="Your Organization"
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="organizationDetails" className="text-sm font-semibold">
                                            Organization Overview (Optional)
                                        </Label>
                                        <Textarea
                                            id="organizationDetails"
                                            value={organizationDetails}
                                            onChange={(e) => setOrganizationDetails(e.target.value)}
                                            placeholder="Tell us about your organization..."
                                            disabled={isSubmitting}
                                            className="min-h-20 text-base resize-none"
                                        />
                                    </div>

                                    {identifierType === 'phone' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="recovery-email" className="text-sm font-semibold">
                                                Email (Optional)
                                            </Label>
                                            <Input
                                                id="recovery-email"
                                                type="email"
                                                value={recoveryEmail}
                                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                disabled={isSubmitting}
                                                className="h-11 text-base"
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
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a password"
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 text-base"
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
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your password"
                                            required
                                            disabled={isSubmitting}
                                            className="h-11 text-base"
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
                                        className="h-11 w-full text-base"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            'Create Business Account'
                                        )}
                                    </Button>

                                    <p className="text-center text-xs text-muted-foreground">
                                        By creating an account, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </form>
                            )}

                            {/* Password Recovery */}
                            {flowState === 'forgot-password' && (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold">
                                            {getIdentifierLabel(identifierType!)}
                                        </Label>
                                        <Input
                                            value={identifierType === 'phone' ? formatPhoneDisplay(identifier) : identifier}
                                            disabled
                                            className="h-11 bg-slate-50 dark:bg-slate-800/30"
                                        />
                                    </div>

                                    {identifierType === 'phone' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="reset-email" className="text-sm font-semibold">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                value={recoveryEmail}
                                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                disabled={isSubmitting}
                                                className="h-11 text-base"
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
                                        className="h-11 w-full text-base"
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
                    </div>
                </div>
            </main>
        </>
    );
}
