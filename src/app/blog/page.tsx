import Blog from "@/components/modules/Blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | MyArk",
    description: "Read the latest stories and updates.",
};

export default function BlogPage() {
    return <Blog />;
}
