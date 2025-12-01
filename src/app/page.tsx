import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myark.in";
const metadataBase = (() => {
  try {
    return new URL(RAW_SITE_URL);
  } catch {
    return new URL("https://myark.in");
  }
})();

const DEFAULT_OG_IMAGE_PATH = "/images/scholarship-girl.png";
const defaultOgImage = `${metadataBase.origin}${DEFAULT_OG_IMAGE_PATH}`;

export const metadata: Metadata = {
  metadataBase,
  title: "Myark | Scholarships, Olympiads & Exams for Indian Students",
  description:
    "Myark curates verified opportunities for students, including scholarships, olympiads, entrance exams, and workshops with detailed timelines and preparation resources.",
  keywords: [
    "student scholarships",
    "olympiads in india",
    "entrance exams",
    "student workshops",
    "myark opportunities",
    "indian students",
    "education programs"
  ],
  alternates: {
    canonical: metadataBase.href,
  },
  openGraph: {
    type: "website",
    url: metadataBase.href,
    title: "Scholarships, Olympiads, AI, Robotics & Workshops for Indian Students",
    description:
      "Explore Myark to find scholarships, olympiads, entrance exams, and workshops curated for ambitious students across India.",
    siteName: "Myark",
    locale: "en_IN",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Myark - Education opportunities for Indian students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Myark | Scholarships, Olympiads & Exams for Indian Students",
    description:
      "Use Myark to stay ahead of scholarships, olympiads, and entrance exams tailored to Indian students.",
    images: [defaultOgImage],
    site: "@myark_in",
    creator: "@myark_in",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
