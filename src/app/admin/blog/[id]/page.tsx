import BlogForm from "@/components/modules/admin/BlogForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Blog Post | Admin | MyArk",
    description: "Edit blog post.",
};

export default function EditBlogPage() {
    return <BlogForm />;
}
