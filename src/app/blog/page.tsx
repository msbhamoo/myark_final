import Blog from "@/components/modules/Blog";

import type { Metadata } from "next";



export const metadata: Metadata = {
    title: "Myark | Student Stories – Learn, Grow & Level Up",
    description: "Read real student stories, guides, and tips to ace your next scholarship or competition. Your guide to leveling up.",
};



export default function BlogPage() {

    return <Blog />;

}

