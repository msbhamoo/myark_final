import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoriesCarousel from "@/components/StoriesCarousel";
import Categories from "@/components/Categories";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";
import GameSection from "@/components/GameSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = constructMetadata({
    title: "Home",
});

// Server Component (Default)
export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
            <Navbar />
            <main>
                <Hero />
                <StoriesCarousel />
                <Categories />
                <Suspense fallback={<div className="h-48 flex items-center justify-center">Loading Featured...</div>}>
                    <FeaturedOpportunities />
                </Suspense>
                <GameSection />
                <BlogSection />
            </main>
            <Footer />
        </div>
    );
}
