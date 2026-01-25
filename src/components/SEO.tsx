
import { Helmet } from "react-helmet-async";

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
    const fullTitle = title.includes("Myark") ? title : `${title} | Myark`;
    const finalCanonical = canonical || url;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(", ")} />
            <link rel="canonical" href={finalCanonical} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}

            {/* AI Search Optimization (GEO/AEO) Specifics */}
            <meta name="author" content="Myark" />
            <meta name="application-name" content="Myark Discovery" />
            <meta property="article:publisher" content="https://myark.in" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="Myark" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@myark" />

            {/* Structured Data (JSON-LD) - Dynamic Implementation */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        ...schema
                    })}
                </script>
            )}

            {/* Default Organization Schema (AI Trust Anchor) */}
            {!schema?.["@type"]?.includes("Organization") && (
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Myark",
                        "url": "https://myark.in",
                        "logo": "https://myark.in/logo.png",
                        "description": "Empowering Gen Z students to find their potential through global opportunities.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "IN"
                        }
                    })}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
