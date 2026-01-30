"use client";

import { Suspense } from "react";
import InshortsFeed from "@/components/inshorts/InshortsFeed";

const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-medium">Loading the vibes...</p>
        </div>
    </div>
);

export default function BetaFeedClient() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <InshortsFeed />
        </Suspense>
    );
}
