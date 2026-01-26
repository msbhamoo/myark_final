import BlogDetail from "@/components/modules/BlogDetail";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog Post | My Ark",
    description: "Read this blog post.",
};

export default function BlogDetailPage() {
    return <BlogDetail />;
}
