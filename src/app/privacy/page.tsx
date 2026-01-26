export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-4xl font-bold font-display mb-8">Privacy Policy</h1>
                <p className="text-muted-foreground mb-6">Last Updated: January 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, update your profile, or use our services.</p>

                    <h2 className="text-2xl font-bold">2. How We Use Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>

                    <h2 className="text-2xl font-bold">3. Information Sharing</h2>
                    <p>We do not share your personal information with third parties except as described in this policy.</p>
                </section>

                <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <p className="text-sm">For more help with privacy questions, please contact us at <span className="text-primary">support@myark.in</span></p>
                </div>
            </div>
        </div>
    );
}
