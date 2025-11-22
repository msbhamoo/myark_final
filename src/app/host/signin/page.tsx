import BusinessAuthFlow from '@/components/BusinessAuthFlow';

export const metadata = {
    title: 'Business Sign In | Myark',
    description: 'Sign in or create a business account to host opportunities on Myark',
};

export default function BusinessSignInPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-accent/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <BusinessAuthFlow />
        </div>
    );
}
