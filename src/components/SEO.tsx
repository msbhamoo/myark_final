"use client";

import { useEffect } from "react";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    schema?: object;
    keywords?: string[];
    noIndex?: boolean;
    canonical?: string;
}

const SEO = ({
    title = "Myark | Discover Amazing Opportunities & Level Up",
    description = "The ultimate RPG for your real-life success. Discover scholarships, competitions, olympiads, and career opportunities tailored for Gen Z students.",
    image = "https://myark.in/og-image.png",
    url = "https://myark.in",
    type = "website",
    schema,
    keywords = ["scholarships", "competitions", "olympiads", "internships", "students", "Gen Z", "career guide", "education"],
    noIndex = false,
    canonical,
}: SEOProps) => {
    useEffect(() => {
        const fullTitle = title.includes("Myark") ? title : `${title} | Myark`;
        document.title = fullTitle;

        const updateMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        updateMeta("description", description);
        updateMeta("keywords", keywords.join(", "));
        updateMeta("og:title", fullTitle, "property");
        updateMeta("og:description", description, "property");
        updateMeta("og:image", image, "property");
        updateMeta("og:url", url, "property");
        updateMeta("og:type", type, "property");
        updateMeta("twitter:card", "summary_large_image");
        updateMeta("twitter:title", fullTitle);
        updateMeta("twitter:description", description);
        updateMeta("twitter:image", image);

        if (noIndex) {
            updateMeta("robots", "noindex, nofollow");
        } else {
            updateMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
        }
    }, [title, description, image, url, type, keywords, noIndex]);

    return null;
};

export default SEO;
