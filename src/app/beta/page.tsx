import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import BetaFeedClient from "./BetaFeedClient";

export const metadata: Metadata = constructMetadata({
    title: "Myark Beta | Swipe Through Opportunities – Fast, Fun & Fire 🔥",
    description: "Experience opportunities in a whole new way! Swipe through scholarships, competitions, and more. No cap, this is the future of discovering your next big W.",
    url: "https://myark.in/beta",
    keywords: ["opportunities", "students", "scholarships", "competitions", "swipe", "beta", "gen z"],
    type: "website",
});

export default function BetaPage() {
    return <BetaFeedClient />;
}
