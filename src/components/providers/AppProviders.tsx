"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { StudentAuthProvider } from "@/lib/studentAuth";
import { AuthModal } from "@/components/auth";
import CommunitySignals from "@/components/CommunitySignals";
import { useState } from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <StudentAuthProvider>
                    <TooltipProvider>
                        {children}
                        <Toaster />
                        <Sonner />
                        <AuthModal />
                        <CommunitySignals />
                    </TooltipProvider>
                </StudentAuthProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
