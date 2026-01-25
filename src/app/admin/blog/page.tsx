import Blog from "@/components/modules/admin/Blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Admin | MyArk",
    description: "Manage blog posts.",
};

export default function AdminBlogPage() {
    return <Blog />;
}
