import BlogForm from "@/components/modules/admin/BlogForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Blog Post | Admin | MyArk",
    description: "Create a new blog post.",
};

export default function NewBlogPage() {
    return <BlogForm />;
}
