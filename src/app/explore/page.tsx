import { Suspense } from "react";
import Explore from "@/components/modules/Explore";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Opportunities | MyArk",
    description: "Browse scholarships, competitions, and more.",
};

export default function ExplorePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Explore />
        </Suspense>
    );
}
