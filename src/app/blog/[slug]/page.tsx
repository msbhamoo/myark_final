import BlogDetail from "@/components/modules/BlogDetail";
import type { Metadata } from "next";
import { blogsService } from "@/lib/firestore";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const blog = await blogsService.getBySlug(slug);

        if (!blog) {
            return constructMetadata({
                title: "Story Not Found",
                description: "This blog post has entered another dimension.",
                noIndex: true,
            });
        }

        return constructMetadata({
            title: blog.title,
            description: blog.title, // Standardizing to title if summary is missing
            image: blog.coverImage,
            url: `https://myark.in/blog/${slug}`,
            keywords: blog.tags || ["blog", "students", "Myark"],
            type: 'article',
            publishedTime: blog.publishedAt?.toISOString(),
            modifiedTime: blog.updatedAt?.toISOString(),
        });
    } catch (error) {
        return constructMetadata({
            title: "Myark Blog",
            description: "Read the latest stories and insights for students.",
        });
    }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await blogsService.getBySlug(slug);

    if (!blog) {
        notFound();
    }

    // Generate schema markup for SSR
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": blog.coverImage || "https://myark.in/og-image.png",
        "author": {
            "@type": "Person",
            "name": blog.author || "Myark Insider"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Myark",
            "logo": {
                "@type": "ImageObject",
                "url": "https://myark.in/logo.png"
            }
        },
        "datePublished": blog.publishedAt?.toISOString(),
        "dateModified": blog.updatedAt?.toISOString(),
        "description": blog.title
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogDetail />
        </>
    );
}
